import { GameObject, GameUnit } from "./GameObject";

/**
* Character represents a character in the Mario game.
* @param newX represents the x position of the character. 
* @param newY represents the y position of the character. 
* @param newGameLetter represents the letter used to display the character.
*/
export abstract class Character extends GameObject {
  constructor(newX: GameUnit, newY: GameUnit, newGameLetter: string) {
    super(newX, newY, newGameLetter);
  }
}

/**
* MainCharacter represents the main Character of the game. This is Mario.
* @param _x is the x value of the main charachter.
* @param _y is the y value of the main character.
* @param jumpSize represents how many blocks the main charachter rizes before reaching the peak of the jump.
* @param movementSpeed represents how many 'BlockSizes' the main character may move per tick. 
* @param _rising reprsents whether or not the main character is rising. 
* @param _falling represents whether or not the main character is falling. 
* @param _isAlive represents whether or not the main character is alive in the game.
* @param _currentRiseDuration represents how far the character is from the peak of a jump when jumping. 
*/
export class MainCharacter extends Character {
  _x: GameUnit;

  _y: GameUnit;

  jumpSize: GameUnit; // How many blocks he jumps before he reaches peak

  movementSpeed: GameUnit; // Moves this many 'BlockSizes' per tick, includes horizontal and vertical speeds

  _rising: boolean;

  _falling: boolean;

  _isAlive: boolean;

  _currentRiseDuration: number;

  public constructor(newX: GameUnit, newY: GameUnit) {
    super(newX, newY, 'M');
    this.jumpSize = 2;
    this.movementSpeed = 1;
    this._rising = false;
    this._falling = false;
    this._isAlive = true;
    this._currentRiseDuration = 0;
  }

  /**
  * moveLeft is a method that moves the charachter left by 1 (x) value
  */
  public moveLeft(): void {
    this._x = this._x - 1;
  }

  /**
  * moveRight is a method that moves the charachter right by 1 (x) value
  */
  public moveRight(): void {
    this._x = this._x + 1;
  }

  /**
  * moveDown is a method that moves the charachter down by 1 (y) value
  */
  public moveDown(): void {
    this._y = this._y + 1;
  }

  /**
  * moveUp is a method that moves the charachter up by 1 (y) value
  */
  public moveUp(): void {
    this._y = this._y - 1;
  }
 /**
 * Sets the rising value for the main charcter.
 */
  public set rising(newRising: boolean) {
    this._rising = newRising;
  }

  /**
  * Gets the rising value from the main character.
  */
  public get rising() {
    return this._rising;
  }

  /**
  * Sets the falling value for the main character.
  */
  public set falling(newFalling: boolean) {
    this._falling = newFalling;
  }

  /**
  * Gets the falling value for the main charachter.
  */
  public get falling() {
    return this._falling;
  }

  /**
  * Sets the isAlive value for the main charachter.
  */
  public set isAlive(newAlive: boolean) {
    this._isAlive = newAlive;
  }

  /**
  * Gets the isAlive value of the main charachter.
  */
  public get isAlive() {
    return this._isAlive;
  }

  /**
  * Gets the current rise duration of the main charachter.
  */
  public get currentRiseDuration() {
    return this._currentRiseDuration;
  }

  /**
  * incrementRiseDuration changes the value of currentRiseDuaration according to the jump being perfromed by
  * the main charachter. 
  */
  public incrementRiseDuration() {
    if (this._rising && this._currentRiseDuration < this.jumpSize) {
      this._currentRiseDuration = this._currentRiseDuration + 1;
    } else this._currentRiseDuration = 0;
  };
}
