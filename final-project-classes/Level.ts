import { GameObject, GameUnit } from "./GameObject";
import { Block, DeathBlock, PlatformBlock, CompletionBlock, CurrentState, PipeBlock } from "./Block";
import { Character, MainCharacter } from "./Character";

export const SCORE_MULTIPLIER = 100;
export type GameCell = GameObject | undefined;

// export type GameState = 'isPlaying' | 'hasWon' | 'isDead'
export abstract class Level {
    _blocks: Block[];
    _mario: MainCharacter;
    _startingMario: MainCharacter;
    _enemies: Character[];
    _score: number;
    _collidableBlocks: {[direction: string] : Block | undefined} = {};
    _gameState: CurrentState;
    _map: GameCell[][];

    constructor(mario: MainCharacter, map: GameCell[][]) {
        this._enemies = [];
        this._map = map;
        this._blocks = this.fillBlocks();
        this._mario = mario;
        this._startingMario = new MainCharacter(this._mario.x, this._mario.y);
        this._score = 0;
        this.fillCollidableBlocks();
        this._gameState = "isPlaying";
    }

    // method for populating blocks with all blocks in the map
    public fillBlocks(): Block[] {
        let ret: Block[] = [];
        for (const row of this._map) {
            const gameCellList: GameCell[] = row.filter(cell => cell instanceof Block);
            const blockList: Block[] = gameCellList.map(cell => cell as Block);

            ret.push(...blockList);   
        }

        return ret;
    }

    //method for populating collidable blocks - check four blocks around mario (Sprint 1)
    public fillCollidableBlocks(): void {
        const left: GameUnit = this._mario.x - 1;
        const right: GameUnit = this._mario.x + 1;
        const up: GameUnit = this._mario.y - 1;
        const down: GameUnit = this._mario.x + 1;

        this._collidableBlocks["left"] = this._blocks.find(block => block.x === left && block.y === this._mario.y);
        this._collidableBlocks["right"] = this._blocks.find(block => block.x === right && block.y === this._mario.y);
        this._collidableBlocks["up"] = this._blocks.find(block => block.x === this._mario.x && block.y === up);
        this._collidableBlocks["down"] = this._blocks.find(block => block.x === this._mario.x && block.y === down);
    }

    //update score method (Sprint 1)
    /**
     * Use mario's distance from the 0 x position times 100
     * If mario's current distance is greater than the current position, THEN we update the score
     * This is to account for is mario moves backward
     */
    public updateScore(): void {
        if (this._gameState !== 'isPlaying') {
            throw new Error('Cannot update score unless playing the game');
        }

        if(this._mario.x * SCORE_MULTIPLIER > this._score) {
            this._score = this._mario.x * SCORE_MULTIPLIER
        }
    }

    //toString - "prints" the game objects from the map double array ()
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

    //update map method
    /**
     * Updates the map object with Mario's new position and makes his old position undefined
     */
    public updateMap(curX: GameUnit, curY: GameUnit): void {
        this._map[curX][curY] = undefined;
        this._map[this._mario.x][this._mario.y] = this._mario
    }

    //level completion method
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

    // this will be used when colliision is implemented
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

    //on key method?? leave last for sprint 1(Sprint 1)
    /**
     * arrow keys for movement
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

    public abstract restartLevel(): Level;
    

    //restart level method (Sprint 1)
    /**
     * Simply returns a new level object with everything restarted
     */

    //on tick method (SPRINT 2)
    /**
     * 
     * call fillCollidableBlocks
     * call update score
     * implement death - checking if mario has collided with a death block - call restart level
     * implement level completion - checking if mario has collided with a completition block - call level completion method
     * handle jumping / collision with blocks when jumping
     */


    //TODO for Monday (March 11):
    /**
     * explain everything to Mihir / get his opinions
     * figure out "emit" logistics
     * do we need to implement onTick for sprint 1? (we don't think so)
     * implement death and level completition are kinda iffy (should we have basic collision implemented for sprint 1?)
     * write tests
     */


}

//implement Level One - blocks and their positions, Mario, and completion blocks
/**
 * Implement restartLevel method
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

    public restartLevel(): Level {
        if (this._gameState !== 'isPlaying') {
            return new LevelOne(this._startingMario);
        }
        throw new Error('Cannot restart level unless done playing the game');
    }
}  

export class TestingLevel extends Level {

    constructor(mario: MainCharacter, map: GameCell[][]) {
        super(mario, map);
    }

    public restartLevel(): Level {
        if (this._gameState !== 'isPlaying') {
            return new TestingLevel(this._startingMario, this._map);
        }
        throw new Error('Cannot restart level unless done playing the game');
    }
}