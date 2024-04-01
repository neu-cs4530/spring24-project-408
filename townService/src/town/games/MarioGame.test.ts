import MarioGame from './MarioGame';
import {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import { createPlayerForTesting } from '../../TestUtils';
import { MarioMove } from '../../types/CoveyTownSocket';

describe('MarioGame', () => {
  let game: MarioGame;
  beforeEach(() => {
    game = new MarioGame();
  });
  describe('_join', () => {
    it('should throw an error if the player is already in the game', () => {
      const player = createPlayerForTesting();
      game.join(player);
      expect(() => game.join(player)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    });
    it('should throw an error if the player is not in the game and the game is full', () => {
      const player1 = createPlayerForTesting();
      const player2 = createPlayerForTesting();
      game.join(player1);

      expect(() => game.join(player2)).toThrowError(GAME_FULL_MESSAGE);
    });
    it('should set the status to IN_PROGRESS if player is present', () => {
      const player = createPlayerForTesting();
      expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
      game.join(player);
      expect(game.state.status).toBe('IN_PROGRESS');
      expect(game.state.player).toBe(player.id);
    });
  });
  describe('_leave', () => {
    it('should throw an error if the player is not in the game', () => {
      const player = createPlayerForTesting();
      expect(() => game.leave(player)).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      game.join(player);
      expect(() => game.leave(createPlayerForTesting())).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    test('when the player leaves, the game state changes in OVER', () => {
      const player = createPlayerForTesting();
      game.join(player);
      expect(game.state.status).toBe('IN_PROGRESS');
      expect(game.state.player).toBe(player.id);
      game.leave(player);
      expect(game.state.status).toBe('OVER');
      expect(game.state.player).toBeUndefined();
      expect(game.state.winner).toBeUndefined();
      expect(game.state.score).toBe(0);
    });
  });
  describe('applyMove', () => {
    let rightMove: MarioMove;
    let upMove: MarioMove;
    let tickMove: MarioMove;
    const player1 = createPlayerForTesting();
    beforeEach(() => {
      game.join(player1);
      rightMove = { gamePiece: 'Mario', row: 0, col: 1 };
      upMove = { gamePiece: 'Mario', row: 1, col: 0 };
      tickMove = { gamePiece: 'Mario', row: 0, col: 0 };
    });
    it('should throw an error if the game is not in progress', () => {
      game.leave(player1);
      expect(() =>
        game.applyMove({ gameID: game.id, playerID: createPlayerForTesting().id, move: rightMove }),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
    });
    it('should throw an error if the player is not in the game', () => {
      expect(() =>
        game.applyMove({ gameID: game.id, playerID: createPlayerForTesting().id, move: rightMove }),
      ).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    it('should add the move to the game state', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        expect(game.state.moves).toEqual([rightMove]);
      }
    });
    it('should update the score', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        expect(game.state.score).toBe(100);
      }
    });
    it('should change game state to OVER if the player wins and set winner - here we are doing a FULL runthrough of level one', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        // GOOMBA SHOULD BE DEAD HERE
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        expect(game.state.status).toBe('OVER');
        expect(game.state.winner).toBe(game.state.player);
      }
    });
    it('should change game state to IN_PROGRESS if the player loses health from a Goomba and should reset marios position', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        expect(game.state.status).toBe('IN_PROGRESS');
        expect(game._level._mario._health).toBe(2);
        expect(game.state.score).toBe(0);
        expect(game._level._mario._x).toBe(game._level._startingMarioPos[0]);
        expect(game._level._mario._y).toBe(game._level._startingMarioPos[1]);
      }
    });
    it('should keep game state to IN_PROGRESS if the player loses health from a Death Block and should reset marios position', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game._level.onTick();
        game._level.onTick();
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        expect(game.state.status).toBe('IN_PROGRESS');
        expect(game._level._mario._health).toBe(2);
        expect(game.state.score).toBe(0);
        expect(game._level._mario._x).toBe(game._level._startingMarioPos[0]);
        expect(game._level._mario._y).toBe(game._level._startingMarioPos[1]);
      }
    });
    it('should change game state to OVER if the player loses health 3 times from a Goomba', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        expect(game.state.status).toBe('IN_PROGRESS');
        expect(game._level._mario._health).toBe(2);
        expect(game._level._mario._x).toBe(game._level._startingMarioPos[0]);
        expect(game._level._mario._y).toBe(game._level._startingMarioPos[1]);
        game._level.onTick();
        // DEATH

        // SECOND HEART
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        expect(game.state.status).toBe('IN_PROGRESS');
        expect(game._level._mario._health).toBe(1);
        expect(game._level._mario._x).toBe(game._level._startingMarioPos[0]);
        expect(game._level._mario._y).toBe(game._level._startingMarioPos[1]);
        game._level.onTick();
        // DEATH

        // LAST HEART
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game._level.onTick();
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        expect(game._level._mario._health).toBe(0);
        expect(game.state.status).toBe('OVER');
        expect(game.state.score).toBe(0);
      }
    });
    it('should change game state to OVER if the player loses health 3 times from a Death Block', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        expect(game.state.status).toBe('IN_PROGRESS');
        expect(game._level._mario._health).toBe(2);
        expect(game.state.score).toBe(0);
        expect(game._level._mario._x).toBe(game._level._startingMarioPos[0]);
        expect(game._level._mario._y).toBe(game._level._startingMarioPos[1]);
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        // LOSE HEART

        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        expect(game.state.status).toBe('IN_PROGRESS');
        expect(game._level._mario._health).toBe(1);
        expect(game.state.score).toBe(0);
        expect(game._level._mario._x).toBe(game._level._startingMarioPos[0]);
        expect(game._level._mario._y).toBe(game._level._startingMarioPos[1]);
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        // LOSE HEART

        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: upMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: rightMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: tickMove });
        expect(game._level._mario._health).toBe(0);
        expect(game.state.status).toBe('OVER');
        expect(game.state.score).toBe(0);
        // DEAD
      }
    });
  });
});
