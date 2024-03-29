import { GameStatus, MarioGameState, Player } from "../../types/CoveyTownSocket";
import PlayerController from "../PlayerController";
import GameAreaController, { GameEventTypes } from "./GameAreaController";
import Level from "/Users/devanshishah/Downloads/cs4530/final project/spring24-project-408/townService/src/town/games/final-project-classes/Level";

export type MarioEvents = GameEventTypes & {
  levelChanged: (level: Level) => void;
};

export default class MarioAreaController extends GameAreaController<
  MarioGameState,
  MarioEvents> {
    protected _level: Level;

    get level(): Level {
        return this._level;
    }

    get player(): PlayerController | undefined {
        const player = this._model.game?.state.player;
        if(player) {
            return this.occupants.find(eachOccupant => eachOccupant.id === player);
        }
        return undefined;
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
    
  }