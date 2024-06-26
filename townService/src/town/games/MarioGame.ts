import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { GameMove, MarioGameState, MarioMove } from '../../types/CoveyTownSocket';
import Game from './Game';
import { MainCharacter } from './final-project-classes/Character';
import { LevelOne } from './final-project-classes/Level';

export default class MarioGame extends Game<MarioGameState, MarioMove> {
  public _level: LevelOne;

  public constructor(priorGame?: MarioGame) {
    super({
      moves: [],
      status: 'WAITING_FOR_PLAYERS',
      player: priorGame?.state.player,
      score: 0,
    });
    this._level = new LevelOne(new MainCharacter(0, 3));
  }

  public applyMove(move: GameMove<MarioMove>): void {
    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    }
    if (this.state.player !== move.playerID) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    const newMove: MarioMove = {
      gamePiece: move.move.gamePiece,
      row: move.move.row,
      col: move.move.col,
    };
    // console.log(newMove);
    this.state = {
      ...this.state,
      moves: [...this.state.moves, newMove],
    };

    const direction: string = this._convertToDirection(newMove);
    // console.log(direction);
    this._level.keyPressed(direction);
    this.state.score = this._level._score;
    // console.log(this._level._gameState);
    // console.log(this._level._mario.x);
    // console.log(this._level._mario.y);
    if (this._level._gameState === 'isWinner') {
      this.state.status = 'OVER';
      this.state.winner = this.state.player;
    } else if (this._level._gameState === 'isDead') {
      this.state.status = 'OVER';
      this.state.winner = undefined;
      this.state.score = 0;
    }
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
   * If the game is not full, add the player to the game and change the game status to 'IN_PROGRESS'.
   * @param player playerID of the player to join the game
   * @throws InvalidParametersError if the game is full
   * @throws InvalidParametersError if the player is already in the game
   */
  protected _join(player: Player): void {
    if (this.state.player === player.id) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
    if (this.state.player) {
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    } else {
      this.state = {
        ...this.state,
        player: player.id,
        status: 'IN_PROGRESS',
      };
    }
  }

  /**
   * Removes the player from the game
   * updates the games state to reflect the player leaving
   *
   * if the game is in progress, the game status is set to 'OVER' and the score is kept
   * if the game is over, the game status is not changed
   *
   * @throws InvalidParametersError if the player is not in the game
   * @throws error if the game status is not 'IN_PROGRESS' or 'OVER'
   * @param player player id of the player to leave the game
   * @returns void
   */
  protected _leave(player: Player): void {
    if (this.state.player !== player.id) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    this.state = {
      ...this.state,
      player: undefined,
    };
    switch (this.state.status) {
      case 'IN_PROGRESS':
        this.state = {
          ...this.state,
          status: 'OVER',
          winner: undefined,
          score: 0,
        };
        break;
      case 'OVER':
        return;
      default:
        throw new Error(`Unexpected game status: ${this.state.status}`);
    }
  }
}
