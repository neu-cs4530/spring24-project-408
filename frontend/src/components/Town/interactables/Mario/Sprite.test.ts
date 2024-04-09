import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import SpriteLevel from './Sprite';
import TestingLevel from './final-project-classes/Level.test';
import { Level } from './final-project-classes/Level';
import { Enemy, MainCharacter } from './final-project-classes/Character';
import { mockTownController } from '../../../../TestUtils';

class mockMarioAreaController extends MarioAreaController {

    constructor(gameArea: GameArea<MarioGameState>)) {
        super(0, gameArea, new mockTownController());
    }

  /**
   * Returns the gamepiece of the current player
   * @throws an error with message PLAYER_NOT_IN_GAME_ERROR if the current player is not in the game
   */
  get gamePiece(): string {
    return 'Mario';
  }

  /**
   * Returns the player who won the game, if there is one, or undefined otherwise
   */
  get winner(): PlayerController | undefined {
    const winner = this._model.game?.state.winner;
  }

  /**
   * Returns the number of moves that have been made in the game
   */
  get moveCount(): number {
    return this._model.game?.state.moves.length || 0;
  }

  /**
   * Returns true if the current player is in the game, false otherwise
   */
  get isPlayer(): boolean {
    if (this._townController.ourPlayer?.id) {
      return this._model.game?.players.includes(this._townController.ourPlayer?.id) ?? false;
    } else return false;
  }

  /**
   * Returns the status of the game
   * If there is no game, returns 'WAITING_FOR_PLAYERS'
   */
  get status(): GameStatus {
    const status = this._model.game?.state.status;
    if (!status) {
      return 'WAITING_FOR_PLAYERS';
    }
    return status;
  }

  get game(): GameInstance<MarioGameState> | undefined {
    return this._model?.game;
  }

  /**
   * Returns true if the game is empty - no players AND no occupants in the area
   *
   */
  isEmpty(): boolean {
    return !this.player && this.occupants.length === 0;
  }

  /**
   * Returns true if the game is not empty and the game is not waiting for players
   */
  public isActive(): boolean {
    return !this.isEmpty() && this.status !== 'WAITING_FOR_PLAYERS';
  }

  private _convertToDirection(move: MarioMove): string {
    if (move.row === 1 && move.col === 0) {
      return 'up';
    }
    if (move.row === 0 && move.col === 1) {
      return 'right';
    }
    if (move.row === 0 && move.col === -1) {
      return 'left';
    }
    if (move.row === 0 && move.col === 0) {
      return 'tick';
    }
    throw new Error('INVALID MOVEMENT');
  }

  /**
   * Updates the internal state of this MarioAreaController based on the new model.
   *
   * Calls super._updateFrom, which updates the occupants of this game area and other
   * common properties (including this._model)
   *
   * If the level has changed, emits a levelChanged event with the new level.
   * If the level has not changed, does not emit a levelChanged event.
   */
  protected _updateFrom(newModel: GameArea<MarioGameState>): void {
    super._updateFrom(newModel);
    const newGame = newModel.game;
    if (newGame) {
      const newLevel = createNewLevelOne();
      newGame.state.moves.forEach(move => {
        newLevel.keyPressed(this._convertToDirection(move));
      });
      if (!_.isEqual(newLevel, this._level)) {
        this._level = newLevel;
        this.emit('levelChanged', this._level);
      }
    }
  }

  /**
   * Sends a request to the server to place the current player's game piece in the given direction.
   * Does not check if the move is valid.
   *
   * @throws an error with message NO_GAME_IN_PROGRESS_ERROR if there is no game in progress
   * @throws an error with message INVALID_MOVEMENT if the movement does not exist
   *
   * @param dir direction to move the gamepiece in
   */
  public async makeMove(dir: string): Promise<void> {
    if (dir === 'tick') {
      console.log('AAAHHH TICK WAS CALLED');
    }
    const instanceID = this._instanceID;
    if (!instanceID || this._model.game?.state.status !== 'IN_PROGRESS') {
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    }
    if (this._level._gameState === 'isWinner') {
      this._model.game.state.status = 'OVER';
      this._model.game.state.winner = this._model.game.state.player;
    } else if (this._level._gameState === 'isDead') {
      this._model.game.state.status = 'OVER';
      this._model.game.state.winner = undefined;
    }

    let col: MarioDirection;
    let row: MarioDirection;
    switch (dir) {
      case 'up':
        col = 0;
        row = 1;
        break;
      case 'right':
        col = 1;
        row = 0;
        break;
      case 'left':
        col = -1;
        row = 0;
        break;
      case 'tick':
        col = 0;
        row = 0;
        break;
      default:
        throw new Error('INVALID MOVEMENT');
    }
    const move: MarioMove = {
      gamePiece: 'Mario',
      col,
      row,
    };
    await this._townController.sendInteractableCommand(this.id, {
      type: 'GameMove',
      gameID: instanceID,
      move,
    });
  }
}

describe('Block', () => {
  describe('PlatformBlock', () => {
    test('PlatformBlock is an instance of Block', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(platformBlock).toBeInstanceOf(Block);
    });
    test('PlatformBlock is an instance of PlatformBlock', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(platformBlock).toBeInstanceOf(PlatformBlock);
    });
    test('PlatformBlock x is 1', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(platformBlock.x).toBe(1);
    });
    test('PlatformBlock y is 1', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(platformBlock.y).toBe(1);
    });
    test('PlatformBlock gameLetter is X', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(platformBlock._gameLetter).toBe('X');
    });
    test('PlatformBlock collisionState is revert', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(platformBlock._collisionState).toBe('revert');
    });
  });
  describe('DeathBlock', () => {
    test('DeathBlock is an instance of Block', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(deathBlock).toBeInstanceOf(Block);
    });
    test('DeathBlock is an instance of DeathBlock', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(deathBlock).toBeInstanceOf(DeathBlock);
    });
    test('DeathBlock x is 1', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(deathBlock.x).toBe(1);
    });
    test('DeathBlockk y is 1', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(deathBlock.y).toBe(1);
    });
    test('DeathBlock gameLetter is D', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(deathBlock._gameLetter).toBe('D');
    });
    test('DeathBlock collisionState is isDead', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(deathBlock._collisionState).toBe('marioTakeDamage');
    });
  });
  describe('CompletionBlock', () => {
    test('CompletionBlock is an instance of Block', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(completionBlock).toBeInstanceOf(Block);
    });
    test('CompletionBlock is an instance of CompletionBlock', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(completionBlock).toBeInstanceOf(CompletionBlock);
    });
    test('CompletionBlock x is 1', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(completionBlock.x).toBe(1);
    });
    test('CompletionBlock y is 1', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(completionBlock.y).toBe(1);
    });
    test('CompletionBlock gameLetter is C', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(completionBlock._gameLetter).toBe('C');
    });
    test('CompletionBlock collisionState is isWinner', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(completionBlock._collisionState).toBe('isWinner');
    });
  });
  describe('PipeBlock', () => {
    test('PipeBlock is an instance of Block', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(pipeBlock).toBeInstanceOf(Block);
    });
    test('PipeBlock is an instance of PipeBlock', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(pipeBlock).toBeInstanceOf(PipeBlock);
    });
    test('PipeBlock x is 1', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(pipeBlock.x).toBe(1);
    });
    test('PipeBlock y is 1', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(pipeBlock.y).toBe(1);
    });
    test('PipeBlock gameLetter is P', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(pipeBlock._gameLetter).toBe('P');
    });
    test('PipeBlock collisionState is revert', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(pipeBlock._collisionState).toBe('revert');
    });
  });
  describe('Collision', () => {
    test('completion collision returns isWinner - all directions', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(completionBlock.collision('right')).toBe('isWinner');
      expect(completionBlock.collision('up')).toBe('isWinner');
      expect(completionBlock.collision('down')).toBe('isWinner');
      expect(completionBlock.collision('left')).toBe('isWinner');
    });
    test('death collision returns marioTakeDamage - all directions', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(deathBlock.collision('right')).toBe('marioTakeDamage');
      expect(deathBlock.collision('left')).toBe('marioTakeDamage');
      expect(deathBlock.collision('up')).toBe('marioTakeDamage');
      expect(deathBlock.collision('down')).toBe('marioTakeDamage');
    });
    test('platform collision returns revert - all directions', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(platformBlock.collision('right')).toBe('revert');
      expect(platformBlock.collision('left')).toBe('revert');
      expect(platformBlock.collision('up')).toBe('revert');
      expect(platformBlock.collision('down')).toBe('revert');
    });
    test('pipe collision returns revert - all directions', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(pipeBlock.collision('right')).toBe('revert');
      expect(pipeBlock.collision('left')).toBe('revert');
      expect(pipeBlock.collision('up')).toBe('revert');
      expect(pipeBlock.collision('down')).toBe('revert');
    });
    test('collision returns undefined, completion', () => {
      const completionBlock = new CompletionBlock(1, 1);
      expect(() => completionBlock.collision('bruh')).toThrowError(
        'Invalid collision direction value',
      );
    });
    test('collision from unknown direction throws error - death block', () => {
      const deathBlock = new DeathBlock(1, 1);
      expect(() => deathBlock.collision('bruh')).toThrowError('Invalid collision direction value');
    });
    test('collision from unknown direction throws error - platform block', () => {
      const platformBlock = new PlatformBlock(1, 1);
      expect(() => platformBlock.collision('bruh')).toThrowError(
        'Invalid collision direction value',
      );
    });
    test('collision from unknown direction throws error - pipe block', () => {
      const pipeBlock = new PipeBlock(1, 1);
      expect(() => pipeBlock.collision('bruh')).toThrowError('Invalid collision direction value');
    });
  });
});
