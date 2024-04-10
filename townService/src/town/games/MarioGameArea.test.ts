import { nanoid } from 'nanoid';
import { mock } from 'jest-mock-extended';
import {
  GAME_ID_MISSMATCH_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  INVALID_COMMAND_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import {
  GameInstanceID,
  GameMove,
  MarioGameState,
  MarioMove,
  TownEmitter,
} from '../../types/CoveyTownSocket';
import Game from './Game';
import MarioGame from './MarioGame';
import MarioGameArea from './MarioGameArea';
import * as MarioGameModule from './MarioGame';
import { createPlayerForTesting } from '../../TestUtils';

class MarioTestingGame extends Game<MarioGameState, MarioMove> {
  public constructor(priorGame?: MarioGame) {
    super({
      moves: [],
      status: 'WAITING_FOR_PLAYERS',
      player: priorGame?.state.player,
      score: 0,
    });
  }

  public endGame(winner?: string) {
    this.state = {
      ...this.state,
      status: 'OVER',
      winner,
      score: 10,
    };
  }

  public applyMove(move: GameMove<MarioMove>): void {}

  protected _join(player: Player): void {
    this.state = {
      ...this.state,
      player: player.id,
      status: 'IN_PROGRESS',
      score: 0,
    };
  }

  protected _leave(player: Player): void {}
}

describe('MarioGame', () => {
  let gameArea: MarioGameArea;
  let mario: Player;
  let interactableUpdateSpy: jest.SpyInstance;
  const gameConstructorSpy = jest.spyOn(MarioGameModule, 'default');
  let game: MarioTestingGame;

  beforeEach(() => {
    gameConstructorSpy.mockClear();
    game = new MarioTestingGame();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Testing without using the real game class)
    gameConstructorSpy.mockReturnValue(game);

    mario = createPlayerForTesting();
    gameArea = new MarioGameArea(
      nanoid(),
      { x: 0, y: 0, width: 100, height: 100 },
      mock<TownEmitter>(),
    );
    gameArea.add(mario);
    game.join(mario);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Test requires access to protected method)
    interactableUpdateSpy = jest.spyOn(gameArea, '_emitAreaChanged');
  });

  describe('[T3.1] JoinGame command', () => {
    test('when there is no existing game, it should create a new game and call _emitAreaChanged', () => {
      expect(gameArea.game).toBeUndefined();
      const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, mario);
      expect(gameArea.game).toBeDefined();
      expect(gameID).toEqual(game.id);
      expect(interactableUpdateSpy).toHaveBeenCalled();
    });

    test('when there is a game that just ended, it should create a new game and call _emitAreaChanged', () => {
      expect(gameArea.game).toBeUndefined();

      gameConstructorSpy.mockClear();
      const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, mario);
      expect(gameArea.game).toBeDefined();
      expect(gameID).toEqual(game.id);
      expect(interactableUpdateSpy).toHaveBeenCalled();
      expect(gameConstructorSpy).toHaveBeenCalledTimes(1);
      game.endGame();

      gameConstructorSpy.mockClear();
      const { gameID: newGameID } = gameArea.handleCommand({ type: 'JoinGame' }, mario);
      expect(gameArea.game).toBeDefined();
      expect(newGameID).toEqual(game.id);
      expect(interactableUpdateSpy).toHaveBeenCalled();
      expect(gameConstructorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when there is a game in progress', () => {
    it('should call join on the game and call _emitAreaChanged', () => {
      const newPlayer = createPlayerForTesting();
      const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, mario);
      if (!game) {
        throw new Error('Game was not created by the first call to join');
      }
      expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);

      const joinSpy = jest.spyOn(game, 'join');
      const gameID2 = gameArea.handleCommand({ type: 'JoinGame' }, newPlayer).gameID;
      expect(joinSpy).toHaveBeenCalledWith(newPlayer);
      expect(gameID).toEqual(gameID2);
      expect(interactableUpdateSpy).toHaveBeenCalledTimes(2);
    });

    it('should not call _emitAreaChanged if the game throws an error', () => {
      const newPlayer = createPlayerForTesting();
      gameArea.handleCommand({ type: 'JoinGame' }, mario);
      if (!game) {
        throw new Error('Game was not created by the first call to join');
      }
      interactableUpdateSpy.mockClear();

      const joinSpy = jest.spyOn(game, 'join').mockImplementationOnce(() => {
        throw new Error('Test Error');
      });
      expect(() => gameArea.handleCommand({ type: 'JoinGame' }, newPlayer)).toThrowError(
        'Test Error',
      );
      expect(joinSpy).toHaveBeenCalledWith(newPlayer);
      expect(interactableUpdateSpy).not.toHaveBeenCalled();
    });
  });

  describe('[T3.3] GameMove command', () => {
    it('should throw an error if there is no game in progress and not call _emitAreaChanged', () => {
      interactableUpdateSpy.mockClear();

      expect(() =>
        gameArea.handleCommand(
          { type: 'GameMove', move: { col: 0, row: 0, gamePiece: 'Mario' }, gameID: nanoid() },
          mario,
        ),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      expect(interactableUpdateSpy).not.toHaveBeenCalled();
    });

    describe('when there is a game in progress', () => {
      let gameID: GameInstanceID;
      beforeEach(() => {
        gameID = gameArea.handleCommand({ type: 'JoinGame' }, mario).gameID;
        interactableUpdateSpy.mockClear();
      });
      it('should throw an error if the gameID does not match the game and not call _emitAreaChanged', () => {
        expect(() =>
          gameArea.handleCommand(
            { type: 'GameMove', move: { col: 0, row: 0, gamePiece: 'Mario' }, gameID: nanoid() },
            mario,
          ),
        ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
      });

      it('should call applyMove on the game and call _emitAreaChanged', () => {
        const move: MarioMove = { col: 0, row: 0, gamePiece: 'Mario' };
        const applyMoveSpy = jest.spyOn(game, 'applyMove');
        gameArea.handleCommand({ type: 'GameMove', move, gameID }, mario);
        expect(applyMoveSpy).toHaveBeenCalledWith({
          gameID: game.id,
          playerID: mario.id,
          move: {
            ...move,
            gamePiece: 'Mario',
          },
        });
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
      });
      it('should not call _emitAreaChanged if the game throws an error', () => {
        const move: MarioMove = { col: 0, row: 0, gamePiece: 'Mario' };
        const applyMoveSpy = jest.spyOn(game, 'applyMove');
        applyMoveSpy.mockImplementationOnce(() => {
          throw new Error('Test Error');
        });
        expect(() =>
          gameArea.handleCommand({ type: 'GameMove', move, gameID }, mario),
        ).toThrowError('Test Error');
        expect(applyMoveSpy).toHaveBeenCalledWith({
          gameID: game.id,
          playerID: mario.id,
          move: {
            ...move,
            gamePiece: 'Mario',
          },
        });
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });

      describe('when the game ends', () => {
        it('when the game is won by mario', () => {
          const finalMove: MarioMove = { col: 0, row: 0, gamePiece: 'Mario' };
          jest.spyOn(game, 'applyMove').mockImplementationOnce(() => {
            game.endGame(mario.id);
          });
          gameArea.handleCommand({ type: 'GameMove', move: finalMove, gameID }, mario);
          expect(game.state.status).toEqual('OVER');
          expect(gameArea.history.length).toEqual(1);
          const winningUsername = mario.userName;
          expect(gameArea.history[0]).toEqual({
            gameID: game.id,
            scores: {
              [winningUsername]: 10,
            },
          });
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
  describe('[T3.4] LeaveGame command', () => {
    it('should throw an error if there is no game in progress and not call _emitAreaChanged', () => {
      expect(() =>
        gameArea.handleCommand({ type: 'LeaveGame', gameID: nanoid() }, mario),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      expect(interactableUpdateSpy).not.toHaveBeenCalled();
    });
    describe('when there is a game in progress', () => {
      it('should throw an error if the gameID does not match the game and not call _emitAreaChanged', () => {
        gameArea.handleCommand({ type: 'JoinGame' }, mario);
        interactableUpdateSpy.mockClear();
        expect(() =>
          gameArea.handleCommand({ type: 'LeaveGame', gameID: nanoid() }, mario),
        ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
      it('should call leave on the game and call _emitAreaChanged', () => {
        const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, mario);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        const leaveSpy = jest.spyOn(game, 'leave');
        gameArea.handleCommand({ type: 'LeaveGame', gameID }, mario);
        expect(leaveSpy).toHaveBeenCalledWith(mario);
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(2);
      });
      it('should not call _emitAreaChanged if the game throws an error', () => {
        gameArea.handleCommand({ type: 'JoinGame' }, mario);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        interactableUpdateSpy.mockClear();
        const leaveSpy = jest.spyOn(game, 'leave').mockImplementationOnce(() => {
          throw new Error('Test Error');
        });
        expect(() =>
          gameArea.handleCommand({ type: 'LeaveGame', gameID: game.id }, mario),
        ).toThrowError('Test Error');
        expect(leaveSpy).toHaveBeenCalledWith(mario);
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
      it('does not update the history when mario leaves', () => {
        const leavingPlayer = mario;

        const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, mario);

        interactableUpdateSpy.mockClear();

        jest.spyOn(game, 'leave').mockImplementationOnce(() => {
          game.endGame();
        });
        expect(game.state.status).toEqual('IN_PROGRESS');
        gameArea.handleCommand({ type: 'LeaveGame', gameID }, leavingPlayer);
        expect(game.state.status).toEqual('OVER');
        expect(gameArea.history.length).toEqual(0);
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
      });
    });

    test('[T3.5] When given an invalid command it should throw an error', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore (Testing an invalid command, only possible at the boundary of the type system)
      expect(() => gameArea.handleCommand({ type: 'InvalidCommand' }, mario)).toThrowError(
        INVALID_COMMAND_MESSAGE,
      );
      expect(interactableUpdateSpy).not.toHaveBeenCalled();
    });
  });
});
