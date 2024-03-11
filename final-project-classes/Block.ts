import { GameObject, GameUnit } from "./GameObject"

export type CurrentState = "isDead" | "revert" | "isWinner" | "isPlaying";

export abstract class Block extends GameObject {
    _collisionState: CurrentState;
    _x: GameUnit;
    _y: GameUnit;
    constructor(collisionState: CurrentState, x: GameUnit, y: GameUnit, newGameLetter: string) {
      super(x, y, newGameLetter) 
      this._collisionState = collisionState;  
    }

    // this is emitting the collision state
    collision(x: GameUnit, y: GameUnit) : CurrentState | undefined {
      if (this._x === x && this._y === y) {
        return this._collisionState;
      }
      else return undefined;
    }
  }
  
  export class DeathBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("isDead", x, y, 'D');
    }
  }

  export class PlatformBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("revert", x, y, 'X');
    }
  }

  export class CompletionBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("isWinner", x, y, 'C');
    }
  }
  export class PipeBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("revert", x, y, 'P');
    }
  }
  