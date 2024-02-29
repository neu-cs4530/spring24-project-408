import { GameUnit } from "./GameObject"

type CollisionState = "isDead" | "revert" | "isWinner";

abstract class Block {
    collisionState: CollisionState;
    x: GameUnit;
    y: GameUnit;
    constructor(collisionState: CollisionState, x: GameUnit, y: GameUnit) {
       this.collisionState = collisionState;
       this.x = x;
       this.y = y;
    }

    collision(x: GameUnit, y: GameUnit) : CollisionState | undefined {
      if (this.x === x && this.y === y) {
        return this.collisionState;
      }
      else return undefined;
    }
  }
  
  export class DeathBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("isDead", x, y);
    }
  }

  export class PlatformBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("revert", x, y);
    }
  }

  export class CompletionBlock extends Block {
    constructor(x: GameUnit, y: GameUnit){
       super("isWinner", x, y);
    }
  }
  