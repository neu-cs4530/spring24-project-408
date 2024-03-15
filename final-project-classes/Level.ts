import { GameObject, GameUnit, CollisionState } from "./GameObject";
import { Block, DeathBlock, PlatformBlock, CompletionBlock, PipeBlock } from "./Block";
import { Character, MainCharacter } from "./Character";

export const SCORE_MULTIPLIER = 100;
export type GameCell = GameObject | undefined;

/**
 * A Level is one level in the broader world of the Mario game.
 * 
 * @param _blocks represents all of the blocks in the level.
 * @param _mario represents the main character object that we will be moving / updating. 
 * @param _startingMarioPos is a list of the main character's starting x and y posiitoins.
 * @param _enemies is the list of all enemies in the level.
 * @param _score is the current max score that the player has achieved.
 * @param _collidableBlocks is the four blocks (up right left and down) which is possible for the main character to interact with.
 * @param _gameState is what game the level is currently in (isDead, isPlaying, isWinner)
 * @param _map is an internal representation of the layout of the level via a 2D array of GameObject | undefined
 */
export abstract class Level {
    _blocks: Block[];
    _mario: MainCharacter;
    _startingMarioPos: GameUnit[];
    _enemies: Character[];
    _score: number;
    _collidableObjects: {[direction: string] : GameObject | undefined} = {};
    _gameState: CollisionState;
    _map: GameCell[][];

    constructor(mario: MainCharacter, map: GameCell[][]) {
        this._enemies = [];
        this._map = map;
        this._blocks = this.fillBlocks();
        this._mario = mario;
        this._startingMarioPos = [this._mario.x, this._mario.y];
        this._score = 0;
        this.fillCollidableObjects();
        this._gameState = "isPlaying";
    }

    /**
     * fillBlocks is a method that gets all of the 'Blocks' in a level and returns it as a list
     * 
     * @returns the list of Blocks in this level
     */
    public fillBlocks(): Block[] {
        let ret: Block[] = [];
        for (const row of this._map) {
            const gameCellList: GameCell[] = row.filter(cell => cell instanceof Block);
            const blockList: Block[] = gameCellList.map(cell => cell as Block);

            ret.push(...blockList);   
        }

        return ret;
    }

    /**
     * Determines which blocks (if any) are in every direction of mario that he can collide with (up right left down)
     * and fill up the this._collidableBlocks with them
     */
    public fillCollidableObjects(): void {
        const left: GameUnit = this._mario.x - 1;
        const right: GameUnit = this._mario.x + 1;
        const up: GameUnit = this._mario.y - 1;
        const down: GameUnit = this._mario.x + 1;

        this._collidableObjects["left"] = (left >= 0) ? this._map[this._mario.y][left] : undefined;
        this._collidableObjects["right"] = (right < this._map[0].length) ? this._map[this._mario.y][right] : undefined;
        this._collidableObjects["up"] = (up >= 0) ? this._map[up][this._mario.x] : undefined;
        this._collidableObjects["down"] = (down < this._map.length) ? this._map[down][this._mario.x] : undefined;
    }

    /**
     * Determines the score that the player has achieved so far by multiplying the main character's
     * distance traveled by SCORE_MULITPLIER
     * 
     * @throws Error - Cannot update score unless playing the game if the game state is not 'isPlaying'
     */
    public updateScore(): void {
        if (this._gameState !== 'isPlaying') {
            throw new Error('Cannot update score unless playing the game');
        }

        if(this._mario.x * SCORE_MULTIPLIER > this._score) {
            this._score = this._mario.x * SCORE_MULTIPLIER
        }
    }

    /**
     * Converts the entire level layout into string format
     * 
     * @returns a string representing every GameObject in the level map
     */
    public toString(): string {
        let ret: string = "";

        for(const row of this._map) {
            for (const cell of row) {
                if(!cell) {
                    ret = ret.concat(" ");
                }
                else {
                    ret = ret.concat(cell.toString());
                }
            }

            ret = ret.concat('\n');
        }

        return ret;
    }

    /**
     * Updates the map object with Mario's new position and makes his old position undefined
     */
    public updateMap(curX: GameUnit, curY: GameUnit): void {
        this._map[curX][curY] = undefined;
        this._map[this._mario.x][this._mario.y] = this._mario
    }

    /**
     * Change gamestate to has won
     * print out "YOU WON WOOOOO"
     * print out final score - console.log for now
     */
    public winLevel(): void {
        switch(this._gameState) {
            case 'isDead':
                throw new Error("Cannot win game when dead");
            case "isWinner":
                return;
            default:
                this._gameState = 'isWinner';
                console.log('WINNER WOOOO LEVEL COMPLETE!! its a me mario')
                console.log("Final score is: " + this._score.toString());
        }
        return;
    }

    /**
     * If the main character dies, calls this method to close out the level, printing 'YOU DIED' and the 
     * player's score
     */
    public death(): void {
        switch(this._gameState) {
            case 'isWinner':
                throw new Error("Cannot die when you've won");
            case "isDead":
                return;
            default:
                this._gameState = 'isDead';
                console.log('YOU DIED');
                console.log("Final score is: " + this._score.toString());
        }
    }

    /**
     * Convenience method for moving the character up.
     * 
     * Checks if moving up is a valid move
     * (Future) checks upward collision
     * Moves the character up
     * updates the internal map representation to show mario's movement
     */
    private characterUp() {
        const mario_x: GameUnit = this._mario.x;
        const mario_y: GameUnit = this._mario.y;

        if (mario_y - 1 > 0) {
            this._mario.moveUp();
            this.updateMap(mario_x, mario_y);
        }
        else {
            throw new Error('Mario Moved Out of Bounds - UP');
        }
    }

    /**
     * Convenience method for moving the character right.
     * 
     * Checks if moving right is a valid move
     * (Future) checks right collision
     * Moves the character right
     * updates the internal map representation to show mario's movement
     */
    private characterRight() {
        const mario_x: GameUnit = this._mario.x;
        const mario_y: GameUnit = this._mario.y;

        if (mario_x + 1 < this._map[0].length) {
            this._mario.moveRight();
            this.updateMap(mario_x, mario_y);
            this.updateScore();
        }
        else {
            throw new Error('Mario Moved Out of Bounds - RIGHT');
        }
    }

    /**
     * Convenience method for moving the character down.
     * 
     * Checks if moving down is a valid move
     * (Future) checks downward collision
     * Moves the character down
     * updates the internal map representation to show mario's movement
     */
    private characterDown() {
        const mario_x: GameUnit = this._mario.x;
        const mario_y: GameUnit = this._mario.y;

        if (mario_y + 1 < this._map.length) {
            this._mario.moveDown();
            this.updateMap(mario_x, mario_y);
        }
        else {
            throw new Error('Mario Moved Out of Bounds - DOWN');
        }
    }

    /**
     * Convenience method for moving the character left.
     * 
     * Checks if moving left is a valid move
     * (Future) checks leftward collision
     * Moves the character left
     * updates the internal map representation to show mario's movement
     */
    private characterLeft() {
        const mario_x: GameUnit = this._mario.x;
        const mario_y: GameUnit = this._mario.y;

        if (mario_x - 1 > 0) {
            this._mario.moveLeft();
            this.updateMap(mario_x, mario_y);
        }
        else {
            throw new Error('Mario Moved Out of Bounds - LEFT');
        }
    }

    /**
     * Basic method resembling onKey method to map to arrow keys in the future.
     * Moves the main character as well as restarts the level (arrow keys and space except down arrow)
     * if gameState is isDead - user can press 'space' to restart level
     */
    public keyPressed(key: string) {
        if (this._gameState == 'isPlaying') {
            switch(key) {
                case 'up': {
                    this.characterUp();
                    break;
                }
                case 'left': {
                    this.characterLeft();
                    break;
                }
                case 'right': {
                    this.characterRight();
                    break;
                }
                default: {
                    break;
                }
            }
        } else if (key === 'space') {
            this.restartLevel();
        }
    }

    /**
     * Resets the level from the beginning, resetting the score to 0, the main character to his original position
     * 
     * @throws Error - Cannot restart level unless done playing the game if game stat is not 'isPlaying'
     */
    public abstract restartLevel(): Level;
}

/**
 * Class representing the first level of the game, including map layout and character placement
 */
export class LevelOne extends Level {

    constructor(mario: MainCharacter) {
        super(new MainCharacter(0, 3), [
            [undefined,                 undefined,                  undefined,                  undefined,                  undefined,              undefined,               undefined,                 undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 0)],
            [undefined,                 undefined,                  undefined,                  undefined,                  undefined,              undefined,               undefined,                 undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 1)],
            [undefined,                 undefined,                  undefined,                  new PipeBlock(3, 2),        undefined,              undefined,               undefined,                 undefined,                  new PlatformBlock(8, 2),    new PlatformBlock(9, 2),    undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 2)],
            [mario,                     undefined,                  new PlatformBlock(2, 3),    new PlatformBlock(3, 3),    undefined,              undefined,               undefined,                 undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 3)],
            [new PlatformBlock(0, 4),   new PlatformBlock(1, 4),    new PlatformBlock(2, 4),    new PlatformBlock(3, 4),    undefined,              undefined,               new PlatformBlock(6, 4),   new PlatformBlock(7, 4),    new PlatformBlock(8, 4),    new PlatformBlock(9, 4),    new PlatformBlock(10, 4),   new PlatformBlock(11, 4),   new PlatformBlock(12, 4),   new CompletionBlock(13, 4)],
            [new PlatformBlock(0, 5),   new PlatformBlock(1, 5),    new PlatformBlock(2, 5),    new PlatformBlock(3, 5),    undefined,              undefined,               new PlatformBlock(6, 5),   new PlatformBlock(7, 5),    new PlatformBlock(8, 5),    new PlatformBlock(9, 5),    new PlatformBlock(10, 5),   new PlatformBlock(11, 5),   new PlatformBlock(12, 5),   new PlatformBlock(13, 5)],
            [new PlatformBlock(0, 6),   new PlatformBlock(1, 6),    new PlatformBlock(2, 6),    new PlatformBlock(3, 6),    new DeathBlock(4,6),    new DeathBlock(5,6),     new PlatformBlock(6, 6),   new PlatformBlock(7, 6),    new PlatformBlock(8, 6),    new PlatformBlock(9, 6),    new PlatformBlock(10, 6),   new PlatformBlock(11, 6),   new PlatformBlock(12, 6),   new PlatformBlock(13, 6)],
        ]);
    }

    /**
     * Resets the level from the beginning, resetting the score to 0, the main character to his original position
     * 
     * @throws Error - Cannot restart level unless done playing the game if game stat is not 'isPlaying'
     */
    public restartLevel(): Level {
        if (this._gameState !== 'isPlaying') {
            this._mario._x = this._startingMarioPos[0];
            this._mario._y = this._startingMarioPos[1];
            return new LevelOne(this._mario);
        }
        throw new Error('Cannot restart level unless done playing the game');
    }
}  