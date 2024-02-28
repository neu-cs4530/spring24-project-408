export {};
const BLOCK_WIDTH = 255; // This value can be changed depending on what's easier for future use

type BlockSize = number;

interface Character {
  x: BlockSize; // X in terms of block_width
  y: BlockSize; // Y in terms of block_width
  // To Add In Future Sprints:
  //    Sprites
  //
}

export class MainCharacter implements Character {
  x: BlockSize;

  y: BlockSize;

  jumpSize: BlockSize; // How many blocks he jumps before he reaches peak

  movementSpeed: BlockSize; // Moves this many 'BlockSizes' per tick, includes horizontal and vertical speeds

  _rising: boolean;

  _falling: boolean;

  _isAlive: boolean;

  public constructor(newX: BlockSize, newY: BlockSize) {
    this.x = newX;
    this.y = newY;
    this.jumpSize = 2;
    this.movementSpeed = 1;
    this._rising = false;
    this._falling = false;
    this._isAlive = true;
  }

  public moveLeft(): void {
    this.x = this.x - 1;
  }

  public moveRight(): void {
    this.x = this.x + 1;
  }

  public moveDown(): void {
    this.y = this.y - 1;
  }

  public moveUp(): void {
    this.y = this.y + 1; 
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

  public set isAlive(newAlive: boolean) {
    this.isAlive = newAlive;
  }

  public get isAlive() {
    return this.isAlive;
  }
}