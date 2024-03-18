import { GameObject, GameUnit, CollisionState, BlockCollisionState } from "./GameObject"

/**
* A Block represents a Block in the game.
*
* @param _collisionState represents a CurrentState of the game.
* @param _x represents the x position of a Block in the game.
* @param _y represents the y position of a Block in the game.
*/
export abstract class Block extends GameObject {
    _collisionState: BlockCollisionState;
    _x: GameUnit;
    _y: GameUnit;
    constructor(collisionState: BlockCollisionState, x: GameUnit, y: GameUnit, newGameLetter: string) {
      super(x, y, newGameLetter) 
      this._collisionState = collisionState;  
    }

    /**
    * collision -> Checks the current collision state of the game. This is our emit method. 
    * 
    * @param colliderDir is the direction the collider is moving in.
    * @throws an error if the collisionFrom is not a valid direction.
    * @returns the current collision state of the game.
    */
   public collision(colliderDir: string): BlockCollisionState | undefined {
    if ((colliderDir !== "down") && (colliderDir !== "up") && (colliderDir !== "left") && (colliderDir !== "right")) {
      throw new Error("Invalid collision direction value");
    }
    return this._collisionState;
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
       super("marioTakeDamage", x, y, 'D');
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
  
