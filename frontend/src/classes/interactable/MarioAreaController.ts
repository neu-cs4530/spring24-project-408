import {
  Enemy,
  MainCharacter,
} from '../../components/Town/interactables/Mario/final-project-classes/Character';
import {
  GameArea,
  GameInstance,
  GameStatus,
  MarioDirection,
  MarioGameState,
  MarioMove,
} from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, {
  GameEventTypes,
  NO_GAME_IN_PROGRESS_ERROR,
  PLAYER_NOT_IN_GAME_ERROR,
} from './GameAreaController';
import {
  Level,
  LevelOne,
} from '../../components/Town/interactables/Mario/final-project-classes/Level';
import _ from 'lodash';

export type MarioEvents = GameEventTypes & {
  levelChanged: (level: Level) => void;
};

function createNewLevelOne(): Level {
  const level = new LevelOne(new MainCharacter(0, 3));
  return level;
}

export default class MarioAreaController extends GameAreaController<MarioGameState, MarioEvents> {
  protected _level: Level = createNewLevelOne();

  /**
   * Returns the current state of the level.
   */
  get level(): Level {
    return this._level;
  }

  /**
   * Returns the main character of the level.
   */
  get mario(): MainCharacter {
    return this._level._mario;
  }

  get enemies(): Enemy[] {
    return this._level._enemies;
  }

  /**
   * Returns the player, if there is one, or undefined otherwise
   */
  get player(): PlayerController | undefined {
    const player = this._model.game?.state.player;
    if (player) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player);
    }
    return undefined;
  }

  /**
   * Returns the gamepiece of the current player
   * @throws an error with message PLAYER_NOT_IN_GAME_ERROR if the current player is not in the game
   */
  get gamePiece(): string {
    if (this.player?.id === this._townController.ourPlayer?.id) {
      return 'Mario';
    } else throw new Error(PLAYER_NOT_IN_GAME_ERROR);
  }

  /**
   * Returns the player who won the game, if there is one, or undefined otherwise
   */
  get winner(): PlayerController | undefined {
    const winner = this._model.game?.state.winner;
    if (winner) {
      return this.occupants.find(eachOccupant => eachOccupant.id === winner);
    }
    return undefined;
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
        console.log(this._level._gameState);
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
