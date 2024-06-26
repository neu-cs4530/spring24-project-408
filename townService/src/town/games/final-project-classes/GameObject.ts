/**
 * A CollisionState is a type that represents a state of a Super Mario game.
 *
 * @value enemyDead indicates that an enemy has been killed.
 * @value isDead indicates that Mario has died and the game has ended.
 * @value isWinner indicates that Mario has completed the level. The player has won, and the game has ended.
 * @value isPlaying indicates that Mario has not won or died, and the game is still in play.
 * @value revert indicates that the user has attempted to perfrom an impermissible action, and Mario
 * thus reverts back to his state and position prior to the attepted impermissible move.
 */
export type CollisionState =
  | 'isDead'
  | 'revert'
  | 'isWinner'
  | 'enemyDead'
  | 'marioTakeDamage'
  | 'resetStartPos'; // all possible collision states of a game object
export type MarioCollisionState = 'resetStartPos' | 'isDead'; // states that mario.collision() produces
export type EnemyCollisionState = 'enemyDead' | 'marioTakeDamage'; // states that goomba.collision() produces
export type BlockCollisionState = 'revert' | 'isWinner' | 'marioTakeDamage'; // states that Block.collision() produces

/**
 * A GameUnit is a type that is a number in the game.
 * It represents a unit of the game.
 */
export type GameUnit = number;

/**
 * A GameObject is an object in the Mario game.
 * @param _x represents the x coordinate value of a GameObject.
 * @param _y represents the y coordinate value of a GameObject.
 * @param _gameLetter is a letter used to represent a GameObject in the game.
 */
export abstract class GameObject {
  _x: GameUnit;

  _y: GameUnit;

  _gameLetter: string;

  constructor(newX: GameUnit, newY: GameUnit, newGameLetter: string) {
    this._x = newX;
    this._y = newY;
    this._gameLetter = newGameLetter;
  }

  /**
   * Converts the _gameLetter to a string.
   */
  public toString() {
    return this._gameLetter;
  }

  /**
   * Gets the x coordinate value of a GameObject.
   */
  public get x() {
    return this._x;
  }

  /**
   * Gets the y coordinate value of a GameObject.
   */
  public get y() {
    return this._y;
  }

  /**
   * Checks the current collision state of the game. This is our emit method.
   */
  public abstract collision(colliderDir: string): CollisionState | undefined;
}
