import { GameObject, GameUnit } from "./GameObject"

/**
* A CurrentState is a type that represents a state of a Super Mario game.
*
* @value isDead indicates that Mario has died and the game has ended.
* @value isWinner indicates that Mario has completed the level. The player has won, and the game has ended.
* @value isPlaying indicates that Mario has not won or died, and the game is still in play. 
* @value revert indicates that the user has attempted to perfrom an impermissible action, and Mario
* thus reverts back to his state and position prior to the attepted impermissible move.
*/
export type CurrentState = "isDead" | "revert" | "isWinner" | "isPlaying";

/**
* A Block represents a Block in the game.
*
* @param _collisionState represents a CurrentState of the game.
* @param _x represents the x position of a Block in the game.
* @param _y represents the y position of a Block in the game.
*/
export abstract class Block extends GameObject {
    _collisionState: CurrentState;
    _x: GameUnit;
    _y: GameUnit;
    constructor(collisionState: CurrentState, x: GameUnit, y: GameUnit, newGameLetter: string) {
      super(x, y, newGameLetter) 
      this._collisionState = collisionState;  
    }

    /**
    * collision -> Checks the current collision state of the game. This is our emit method. 
    * 
    * @param x is the x position of a GameUnit.
    * @param y is the y poisiton of a GameUnit.
    * @return provides CurrentState of the game.
    * else, returns undefined.
    */
    collision(x: GameUnit, y: GameUnit) : CurrentState | undefined {
      if (this._x === x && this._y === y) {
        return this._collisionState;
      }
      else return undefined;
    }
  }

  /**
  * class DeathBlock represents a Block that would kill Mario if he collides with it.
  * 
  * @param x is the x position of the DeathBlock.
  * @param y is the y position of the DeathBlock.
  */
  export class DeathBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("isDead", x, y, 'D');
    }
  }

  /**
  * class PlatformBlock represents a block that is a standard traversable platform block in the game. 
  * 
  * @param x is the x position of the PlatformBlock. 
  * @param y is the y position of the PlatformBlock.
  */
  export class PlatformBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("revert", x, y, 'X');
    }
  }

  /**
  * class CompletionBlock represents a block completes the game if Mario collides with it.
  * 
  * @param x is the x position of the CompleitionBlock. 
  * @param y is the y position of the CompletionBlock.
  */
  export class CompletionBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("isWinner", x, y, 'C');
    }
  }

  /**
  * class PipeBlock represents a traversable pipe in the game.
  * 
  * @param x is the x position of the PipeBlock. 
  * @param y is the y position of the PipeBlock.
  */
  export class PipeBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("revert", x, y, 'P');
    }
  }
  
