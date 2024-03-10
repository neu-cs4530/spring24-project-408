import { GameObject, GameUnit } from "./GameObject"

export type CurrentState = "isDead" | "revert" | "isWinner" | "isPlaying";

export abstract class Block extends GameObject {
    collisionState: CurrentState;
    x: GameUnit;
    y: GameUnit;
    constructor(collisionState: CurrentState, x: GameUnit, y: GameUnit, newGameLetter: string) {
      super(x, y, newGameLetter) 
      this.collisionState = collisionState;  
    }

    collision(x: GameUnit, y: GameUnit) : CurrentState | undefined {
      if (this.x === x && this.y === y) {
        return this.collisionState;
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
  