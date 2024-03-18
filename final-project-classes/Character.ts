import { is } from "ramda";
import { CollisionState, GameObject, GameUnit, MarioCollisionState, EnemyCollisionState } from "./GameObject";

/**
* Character represents a character in the Mario game.
* @param newX represents the x position of the character. 
* @param newY represents the y position of the character. 
* @param newGameLetter represents the letter used to display the character.
*/
export abstract class Character extends GameObject {
  _isAlive: boolean;
  _health: number;

  constructor(newX: GameUnit, newY: GameUnit, newGameLetter: string) {
    super(newX, newY, newGameLetter);
    this._isAlive = true;
    this._health = 1;
  }

  public set isAlive(newAlive: boolean) {
    this._isAlive = newAlive;
  }

  public get isAlive() {
    return this._isAlive;
  }

  public set health(newHealth: number) {
    this._health = newHealth;
  }

  public get health() {
    return this._health;
  }
}

export abstract class Enemy extends Character {
  _x: GameUnit;

  _y: GameUnit;

  public constructor(newX: GameUnit, newY: GameUnit, newGameLetter: string) {
    super(newX, newY, newGameLetter);
  }
}

export class Goomba extends Enemy {
  _x: GameUnit;

  _y: GameUnit;

  public constructor(newX: GameUnit, newY: GameUnit) {
    super(newX, newY, 'G');
  }

  public collision(colliderDir: string): EnemyCollisionState {
    if ((colliderDir !== "down") && (colliderDir !== "up") && (colliderDir !== "left") && (colliderDir !== "right")) {
      throw new Error("Invalid collision direction value");
    }
    else if (colliderDir === 'down') {
      return 'enemyDead';
    }
    else {
      return 'marioTakeDamage';
    }
  }
}

/**
* MainCharacter represents the main Character of the game. This is Mario.
* @param _x is the x value of the main charachter.
* @param _y is the y value of the main character.
* @param jumpSize represents how many blocks the main charachter rises before reaching the peak of the jump.
* @param movementSpeed represents how many 'BlockSizes' the main character may move per tick. 
* @param _rising represents whether or not the main character is rising. 
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

  _currentRiseDuration: number;



  public constructor(newX: GameUnit, newY: GameUnit) {
    super(newX, newY, 'M');
    this.jumpSize = 2;
    this.movementSpeed = 1;
    this._rising = false;
    this._currentRiseDuration = 0;
    this._health = 3;
  }

  /**
  * moveLeft is a method that moves the character left by 1 GameUnit
  */
  public moveLeft(): void {
    this._x = this._x - 1;
  }

  /**
  * moveRight is a method that moves the charachter right by 1 GameUnit
  */
  public moveRight(): void {
    this._x = this._x + 1;
  }

  /**
  * moveDown is a method that moves the charachter down by 1 GameUnit
  */
  public moveDown(): void {
    this._y = this._y + 1;
  }

  /**
  * moveUp is a method that moves the charachter up by 1 GameUnit
  */
  public moveUp(): void {
    this._y = this._y - 1;
  }

  public jump(): void {
    this.rising = true;
    this.moveUp();
    this.incrementRiseDuration();
  }

  public stopRising() {
    this.rising = false;
    this._currentRiseDuration = 0;
  }

  /**
   * Resets this character's x and y fields to those passed in
   * @param newX The desired x position
   * @param newY The desired y position
   */
  public setPosition(newX: GameUnit, newY: GameUnit) {
    this._x = newX;
    this._y = newY;
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
  * Gets the current rise duration of the main charachter.
  */
  public get currentRiseDuration() {
    return this._currentRiseDuration;
  }

  /**
  * incrementRiseDuration changes the value of currentRiseDuaration according to the jump being performed by
  * the main character. 
  */
  public incrementRiseDuration() {
    if (this._rising && this._currentRiseDuration < this.jumpSize) {
      this._currentRiseDuration = this._currentRiseDuration + 1;
    } else this._currentRiseDuration = 0;
  };

  public collision(colliderDir: string): MarioCollisionState {
    if ((colliderDir !== "down") && (colliderDir !== "up") && (colliderDir !== "left") && (colliderDir !== "right")) {
      throw new Error("Invalid collision direction value");
    }
    return this._takeDamage();
  }

  private _takeDamage(): MarioCollisionState {
    if (this._health > 0) {
      this._health = this._health - 1;
      return 'resetStartPos';
    }
    else return 'isDead';
  }
}
