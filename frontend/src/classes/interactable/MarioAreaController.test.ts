import assert from 'assert';
import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { MarioDirection, MarioMove, GameResult, GameStatus } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import MarioAreaController from './MarioAreaController';
import GameAreaController, { NO_GAME_IN_PROGRESS_ERROR } from './GameAreaController';
import { update } from 'lodash';
import exp from 'constants';
import { log } from 'console';

describe('MarioAreaController', () => {
  const ourPlayer = new PlayerController(nanoid(), nanoid(), {
    x: 0,
    y: 0,
    moving: false,
    rotation: 'front',
  });
  const otherPlayers = [
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
  ];

  const mockTownController = mock<TownController>();
  Object.defineProperty(mockTownController, 'ourPlayer', {
    get: () => ourPlayer,
  });
  Object.defineProperty(mockTownController, 'players', {
    get: () => [ourPlayer, ...otherPlayers],
  });
  mockTownController.getPlayer.mockImplementation((playerID: any) => {
    const p = mockTownController.players.find((player: { id: any }) => player.id === playerID);
    assert(p);
    return p;
  });

  function updateGameWithMove(controller: MarioAreaController, nextMove: MarioMove): void {
    const nextState = Object.assign({}, controller.toInteractableAreaModel());
    const nextGame = Object.assign({}, nextState.game);
    nextState.game = nextGame;
    const newState = Object.assign({}, nextGame.state);
    nextGame.state = newState;
    newState.moves = newState.moves.concat([nextMove]);
    controller.updateFrom(nextState, controller.occupants);
  }

  function marioAreaControllerWithProps({
    _id,
    history,
    player,
    undefinedGame,
    status,
    moves,
    gameInstanceID,
    score,
    winner,
    observers,
  }: {
    _id?: string;
    history?: GameResult[];
    player?: string;
    undefinedGame?: boolean;
    status?: GameStatus;
    gameInstanceID?: string;
    moves?: MarioMove[];
    score?: number;
    winner?: string;
    observers?: string[];
  }) {
    const id = _id || `INTERACTABLE-ID-${nanoid()}`;
    const instanceID = gameInstanceID || `GAME-INSTANCE-ID-${nanoid()}`;
    const players = [];
    if (player) players.push(player);
    if (observers) players.push(...observers);
    const ret = new MarioAreaController(
      id,
      {
        id,
        occupants: players,
        history: history || [],
        type: 'MarioArea',
        game: undefinedGame
          ? undefined
          : {
              id: instanceID,
              players: players,
              state: {
                status: status || 'IN_PROGRESS',
                player: player,
                moves: moves || [],
                winner: winner,
                score: score || 0,
              },
            },
      },
      mockTownController,
    );
    if (players) {
      ret.occupants = players
        .map(eachID =>
          mockTownController.players.find((eachPlayer: { id: string }) => eachPlayer.id === eachID),
        )
        .filter(eachPlayer => eachPlayer) as PlayerController[];
    }
    return ret;
  }

  describe('[T1.1] Properties at the start of the game', () => {
    describe('level', () => {
      it('expects mario to be at starting position if there are no moves yet and all enemies to be alive', () => {
        const controller = marioAreaControllerWithProps({ status: 'IN_PROGRESS', moves: [] });

        expect(controller.level._mario.x).toBe(0);
        expect(controller.level._mario.y).toBe(3);

        for (const enemy of controller.level._enemies) {
          expect(enemy.isAlive).toBe(true);
        }
      });
    });

    describe('player', () => {
      it('returns the player if there is a player', () => {
        const controller = marioAreaControllerWithProps({ player: ourPlayer.id });
        expect(controller.player).toBe(ourPlayer);
      });
      it('returns undefined if there is no player', () => {
        const controller = marioAreaControllerWithProps({ player: undefined });
        expect(controller.player).toBeUndefined();
      });
    });

    describe('winner', () => {
      it('returns the winner if there is a winner', () => {
        const controller = marioAreaControllerWithProps({
          player: ourPlayer.id,
          winner: ourPlayer.id,
        });
        expect(controller.winner).toBe(ourPlayer);
      });
      it('returns undefined if there is no winner', () => {
        const controller = marioAreaControllerWithProps({ winner: undefined });
        expect(controller.winner).toBeUndefined();
      });
    });

    describe('moveCount', () => {
      it('returns the number of moves from the game state', () => {
        const controller = marioAreaControllerWithProps({
          moves: [
            { col: 0, gamePiece: 'Mario', row: 1 },
            { col: 1, gamePiece: 'Mario', row: 0 },
          ],
        });
        expect(controller.moveCount).toBe(2);
      });
    });

    describe('isPlayer', () => {
      it('returns true if we are a player', () => {
        const controller = marioAreaControllerWithProps({ player: ourPlayer.id });
        expect(controller.isPlayer).toBe(true);
      });
      it('returns false if we are not a player', () => {
        const controller = marioAreaControllerWithProps({ player: undefined });
        expect(controller.isPlayer).toBe(false);
      });
    });

    describe('gamePiece', () => {
      it('returns Mario if we are in the game', () => {
        const controller = marioAreaControllerWithProps({ player: ourPlayer.id });
        expect(controller.gamePiece).toBe('Mario');
      });
      it('throws an error if we are not a player', () => {
        const controller = marioAreaControllerWithProps({ player: undefined });
        expect(() => controller.gamePiece).toThrowError();
      });
    });

    describe('isEmpty', () => {
      it('returns true if there are no players', () => {
        const controller = marioAreaControllerWithProps({ player: undefined });
        expect(controller.isEmpty()).toBe(true);
      });
      it('returns false if there is a player', () => {
        const controller = marioAreaControllerWithProps({ player: ourPlayer.id });
        expect(controller.isEmpty()).toBe(false);
      });
      it('returns false if there are no players but there are observers', () => {
        const controller = marioAreaControllerWithProps({ observers: [ourPlayer.id] });
        expect(controller.isEmpty()).toBe(false);
      });
    });
    describe('isActive', () => {
      it('returns true if the game is not empty and it is not waiting for players', () => {
        const controller = marioAreaControllerWithProps({
          player: ourPlayer.id,
          status: 'IN_PROGRESS',
        });
        expect(controller.isActive()).toBe(true);
      });
      it('returns false if the game is waiting for players', () => {
        const controller = marioAreaControllerWithProps({
          player: undefined,
          status: 'WAITING_FOR_PLAYERS',
        });
        expect(controller.isActive()).toBe(false);
      });
    });
  });

  describe('[T1.2] Properties during the game, modified by _updateFrom', () => {
    let controller: MarioAreaController;
    beforeEach(() => {
      controller = marioAreaControllerWithProps({
        player: ourPlayer.id,
        status: 'IN_PROGRESS',
      });
    });

    it('return the correct map after a move', () => {
      updateGameWithMove(controller, { col: 1, gamePiece: 'Mario', row: 0 });
      expect(controller.level._mario.x).toBe(1);
      expect(controller.level._mario.y).toBe(3);
      expect(controller.level._map[3][1]).toBe(controller.level._mario);
      expect(controller.level._map[3][0]).toBeUndefined();
    });
    it('emits a levelChanged event if the board has changed', () => {
      const spy = jest.fn();
      controller.addListener('levelChanged', spy);
      updateGameWithMove(controller, { col: 1, gamePiece: 'Mario', row: 0 });
      expect(spy).toHaveBeenCalledWith(controller.level);
    });
    it('does not emit a levelChanged event if the board has not changed', () => {
      const spy = jest.fn();
      controller.addListener('levelChanged', spy);
      controller.updateFrom(
        { ...controller.toInteractableAreaModel() },
        otherPlayers.concat(ourPlayer),
      );
      expect(spy).not.toHaveBeenCalled();
    });
    it('Calls super.updateFrom with the correct parameters', () => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore - we are testing spying on a private method
      const spy = jest.spyOn(GameAreaController.prototype, '_updateFrom');
      const model = controller.toInteractableAreaModel();
      controller.updateFrom(model, otherPlayers.concat(ourPlayer));
      expect(spy).toHaveBeenCalledWith(model);
    });
  });

  describe('[T1.3] makeMove', () => {
    describe('With no game in progress', () => {
      it('Throws an error if there is no game', async () => {
        const controller = marioAreaControllerWithProps({
          player: ourPlayer.id,
          undefinedGame: true,
        });
        await expect(() => controller.makeMove('right')).rejects.toThrowError(
          NO_GAME_IN_PROGRESS_ERROR,
        );
      });
      it('Throws an error if game status is not IN_PROGRESS', async () => {
        const controller = marioAreaControllerWithProps({
          player: undefined,
          status: 'WAITING_FOR_PLAYERS',
        });
        await expect(() => controller.makeMove('right')).rejects.toThrowError(
          NO_GAME_IN_PROGRESS_ERROR,
        );
      });
    });

    describe('With a game in progress', () => {
      let controller: MarioAreaController;
      let instanceID: string;
      beforeEach(async () => {
        instanceID = `GameInstanceID.makeMove.${nanoid()}`;
        controller = marioAreaControllerWithProps({
          player: ourPlayer.id,
          status: 'IN_PROGRESS',
          gameInstanceID: instanceID,
        });
        mockTownController.sendInteractableCommand.mockImplementationOnce(async () => {
          return { gameID: instanceID };
        });
        await controller.joinGame();
      });
      describe('column move commands with town controller', () => {
        async function makeMoveandExpectMarioPos(
          dir: string,
          expectedCol: MarioDirection,
          expectedRow: MarioDirection,
        ) {
          mockTownController.sendInteractableCommand.mockClear();
          await controller.makeMove(dir);
          expect(mockTownController.sendInteractableCommand).toHaveBeenCalledWith(controller.id, {
            type: 'GameMove',
            gameID: instanceID,
            move: {
              gamePiece: 'Mario',
              col: expectedCol,
              row: expectedRow,
            },
          });
          updateGameWithMove(controller, {
            col: expectedCol,
            gamePiece: 'Mario',
            row: expectedRow,
          });
        }
        it('moves mario to the right when there is no collidable object to the right', async () => {
          await makeMoveandExpectMarioPos('right', 1, 0);
          expect(controller.level._mario.x).toBe(1);
          expect(controller.level._mario.y).toBe(3);
        });
        it('moves mario to the left when there is no collidable object to the left', async () => {
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('left', -1, 0);
          expect(controller.level._mario.x).toBe(0);
          expect(controller.level._mario.y).toBe(3);
        });
        it('moves mario up when there is no collidable object above', async () => {
          await makeMoveandExpectMarioPos('up', 0, 1);
          expect(controller.level._mario.x).toBe(0);
          expect(controller.level._mario.y).toBe(2);
        });
        it('does not move mario when there is a collidable object to the right', async () => {
          await makeMoveandExpectMarioPos('right', 1, 0);
          expect(controller.level._mario.x).toBe(1);
          expect(controller.level._mario.y).toBe(3);
          await makeMoveandExpectMarioPos('right', 1, 0);
          expect(controller.level._mario.x).toBe(1);
          expect(controller.level._mario.y).toBe(3);
        });
        it('does not move mario when there is a collidable object to the left', async () => {
          await makeMoveandExpectMarioPos('left', -1, 0);
          expect(controller.level._mario.x).toBe(0);
          expect(controller.level._mario.y).toBe(3);
        });
        it('mario loses health when falling into a pit', async () => {
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          expect(controller.level._mario.x).toBe(0);
          expect(controller.level._mario.y).toBe(3);
          expect(controller.level._mario.health).toBe(2);
        });
        it('mario dies when falling into a pit', async () => {
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          //await makeMoveandExpectMarioPos('tick', 0, 0);
          expect(controller.level._mario.x).toBe(0);
          expect(controller.level._mario.y).toBe(3);
          expect(controller.level._mario.health).toBe(2);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          // LOSES HEART

          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          //await makeMoveandExpectMarioPos('tick', 0, 0);
          expect(controller.level._mario.x).toBe(0);
          expect(controller.level._mario.y).toBe(3);
          expect(controller.level._mario.health).toBe(1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          // LOSES HEART

          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          //expect(controller.level._gameState).toBe('isDead');
          expect(controller.level._mario.health).toBe(0);
          expect(controller.status).toBe('OVER');
          expect(controller.winner).toBeUndefined();
          expect(controller.level._mario.isAlive).toBe(false);
        });
        it('mario wins', async () => {
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('up', 0, 1);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          await makeMoveandExpectMarioPos('right', 1, 0);
          await makeMoveandExpectMarioPos('tick', 0, 0);
          console.log(controller.level.toString());
          expect(controller.level._gameState).toBe('isWinner');
          expect(controller.status).toBe('OVER');
          expect(controller.winner).toBe(ourPlayer);
          expect(controller.level._score).toBe(1200);
        });
      });
    });
  });
});
