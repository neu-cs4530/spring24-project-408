/**
* BLOCK_WIDTH is the size of a 'Block' in the game.
* Space in the game is broken up into blocks.
*/
const BLOCK_WIDTH = 255; // This value can be changed depending on what's easier for future use

/**
* A Gameunit is a type that is a number in the game.
* It represents a unit of the game.
*/
export type GameUnit = number;

/**
* A GameObject is an object in the Mario game. 
* @param _x represents the x coordinate value of a GameObject.
* @param _y represents the y coordinate value of a GameObject. 
* @param _gameLetter is a letter used to represent a GameObject in the game.
*/
export abstract class GameObject {
    _x: GameUnit;
    _y: GameUnit;
    _gameLetter: string;

    constructor (newX, newY, newGameLetter) {
        this._x = newX;
        this._y = newY;
        this._gameLetter = newGameLetter;
    }
    /**
    * Converts the _gameLetter to a string.
    */
    public toString() {
        return this._gameLetter;
    }

  /**
  * Gets the x coordinate value of a GameObject.
  */
    public get x() {
        return this._x;
    }
/**
* Gets the y coordinate value of a GameObject.
*/
    public get y() {
        return this._y;
    }
}
