import { is } from "ramda";
import { GameObject, GameUnit } from "./GameObject";

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
}

export class MainCharacter extends Character {
  _x: GameUnit;

  _y: GameUnit;

  jumpSize: GameUnit; // How many blocks he jumps before he reaches peak

  movementSpeed: GameUnit; // Moves this many 'BlockSizes' per tick, includes horizontal and vertical speeds

  _rising: boolean;

  _falling: boolean;

  _currentRiseDuration: number;

  public constructor(newX: GameUnit, newY: GameUnit) {
    super(newX, newY, 'M');
    this.jumpSize = 2;
    this.movementSpeed = 1;
    this._rising = false;
    this._falling = false;
    this._currentRiseDuration = 0;
  }

  public moveLeft(): void {
    this._x = this._x - 1;
  }

  public moveRight(): void {
    this._x = this._x + 1;
  }

  public moveDown(): void {
    this._y = this._y + 1;
  }

  public moveUp(): void {
    this._y = this._y - 1;
  }

  public set rising(newRising: boolean) {
    this._rising = newRising;
  }

  public get rising() {
    return this._rising;
  }

  public set falling(newFalling: boolean) {
    this._falling = newFalling;
  }

  public get falling() {
    return this._falling;
  }

  public get currentRiseDuration() {
    return this._currentRiseDuration;
  }

  public incrementRiseDuration() {
    if (this._rising && this._currentRiseDuration < this.jumpSize) {
      this._currentRiseDuration = this._currentRiseDuration + 1;
    } else this._currentRiseDuration = 0;
  };
}