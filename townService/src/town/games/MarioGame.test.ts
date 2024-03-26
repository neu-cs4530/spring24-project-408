import { Console } from 'console';
import e from 'cors';
import MarioGame from './MarioGame';
import {
  BOARD_POSITION_NOT_VALID_MESSAGE,
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  GAME_NOT_STARTABLE_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import { createPlayerForTesting } from '../../TestUtils';

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
      expect(game.state.health).toBe(3);
      expect(game.state.winner).toBeUndefined();
      expect(game.state.score).toBe(0);
    });
  });
  describe('applyMove', () => {
    beforeEach(() => {
      const player1 = createPlayerForTesting();
      game.join(player1);
    });
    it('should throw an error if the game is not in progress', () => {
      game.leave(createPlayerForTesting());
      expect(() =>
        game.applyMove({ gameID: game.id, playerID: createPlayerForTesting().id, move: 'right' }),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
    });
    it('should throw an error if the player is not in the game', () => {
      expect(() =>
        game.applyMove({ gameID: game.id, playerID: createPlayerForTesting().id, move: 'right' }),
      ).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    it('should add the move to the game state', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: 'right' });
        expect(game.state.moves).toEqual(['right']);
      }
    });
    it('should update the score', () => {
      if (game.state.player) {
        game.applyMove({ gameID: game.id, playerID: game.state.player, move: 'right' });
        expect(game.state.score).toBe(1);
      }
    });
    it('should change game state to OVER if the player wins and set winner');
    it('should change game state to OVER if the player dies');
  });
});