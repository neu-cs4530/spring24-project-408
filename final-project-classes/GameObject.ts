const BLOCK_WIDTH = 255; // This value can be changed depending on what's easier for future use

export type GameUnit = number;

export abstract class GameObject {
    _x: GameUnit;
    _y: GameUnit;
    _gameLetter: string;

    constructor (newX, newY, newGameLetter) {
        this._x = newX;
        this._y = newY;
        this._gameLetter = newGameLetter;
    }

    public toString() {
        return this._gameLetter;
    }
}