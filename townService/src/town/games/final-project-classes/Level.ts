/* eslint-disable prettier/prettier */
// eslint-disable-next-line max-classes-per-file
import { GameObject, GameUnit } from "./GameObject";
import { Block, DeathBlock, PlatformBlock, CompletionBlock, PipeBlock } from "./Block";
import { Enemy, Goomba, MainCharacter } from "./Character";

export const SCORE_MULTIPLIER = 100;
export type GameCell = GameObject | undefined;
export type GameState = 'isPlaying' | 'isDead' | 'isWinner';

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

    _enemies: Enemy[];

    _score: number;

    _collidableObjects: {[direction: string] : GameObject | undefined} = {};

    _gameState: GameState;

    _map: GameCell[][];

    constructor(mario: MainCharacter, map: GameCell[][]) {
        this._enemies = this.fillEnemies();
        this._gameState = "isPlaying";
        this._map = map;
        this._blocks = this.fillBlocks();
        this._mario = mario;
        this._startingMarioPos = [this._mario.x, this._mario.y];
        this._score = 0;
        this.updateScore();
        this.fillCollidableObjects();
        
    }

    /**
     * This method is called every second or 'tick' the game is running
     * On every tick we want to:
     * - see what 4 objects are surrounding Mario - these are his collidable objects
     * - handle gravity - this means as long as Mario hasn't reached the peak of his jump, he will always be moving up and then down after (and collisions will be handled accordingly)
     */
    public onTick(): void {
        // populate the 4 surrounding collidable objects of mario
        if (this._gameState === 'isPlaying') {
            this.fillCollidableObjects();

            // Jump logic
            if(this._mario.rising) {
                // If Mario has reached the peak of his jump, stop rising
                if (this._mario.currentRiseDuration === this._mario.jumpSize) {
                    console.log('mario has reached the peak of his jump, he is now falling');
                    this._mario.stopRising();
                } else if (this._mario.currentRiseDuration < this._mario.jumpSize) {
                    // Otherwise, continue moving up
                    console.log('mario hasnt reached the peak of his jump, he is still rising');
                    this._characterUp();
                }
            } else {
                // Constant gravity
                this._characterDown(); 
                console.log('gravity applied - mario moved down');
            }
        }
        else {
            console.log("game is not currently playing");
        }
    }

    /**
     * fillBlocks is a method that gets all of the 'Blocks' in a level and returns it as a list
     * 
     * @returns the list of Blocks in this level
     */
    public fillBlocks(): Block[] {
        const ret: Block[] = [];
        for (const row of this._map) {
            const gameCellList: GameCell[] = row.filter(cell => cell instanceof Block);
            const blockList: Block[] = gameCellList.map(cell => cell as Block);

            ret.push(...blockList);   
        }

        return ret;
    }

     /**
     * fillEnemies is a method that gets all of the 'Enemies' in a level and returns it as a list
     * 
     * @returns the list of Enemy in this level
     */
    public fillEnemies(): Enemy[] {
        const ret: Enemy[] = [];
        for (const row of this._map) {
            const gameCellList: GameCell[] = row.filter(cell => cell instanceof Enemy);
            const enemyList: Enemy[] = gameCellList.map(cell => cell as Enemy);

            ret.push(...enemyList);   
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
        const down: GameUnit = this._mario.y + 1;

        this._collidableObjects.left = (left >= 0) ? this._map[this._mario.y][left] : undefined;
        this._collidableObjects.right = (right < this._map[0].length) ? this._map[this._mario.y][right] : undefined;
        this._collidableObjects.up = (up >= 0) ? this._map[up][this._mario.x] : undefined;
        this._collidableObjects.down = (down < this._map.length) ? this._map[down][this._mario.x] : undefined;
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
        let ret = "";

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
     * Resets Mario's position to its starting position in the game, ONLY called from restart level
     */
    public resetMarioPosition(): void {
        this._mario.setPosition(this._startingMarioPos[0], this._startingMarioPos[1]);
    }

    /**
     * Updates the map object with Mario's new position and makes his old position undefined
     */
    private _updateMap(curX: GameUnit, curY: GameUnit): void {
        this._map[curY][curX] = undefined;
        this._map[this._mario.y][this._mario.x] = this._mario
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
                console.log('WINNER WOOOO LEVEL COMPLETE!! its a me mario');
                console.log(`Final score is: ${  this._score.toString()}`);
                console.log("Press space to play again!");
        }
        
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
                console.log(`Final score is: ${  this._score.toString()}`);
                console.log("Press space to try again!");
        }
    }

    /**
     * Removes the enemy below Mario from the enemies list and from the map
     * We use collidableObject['down'] object here as this method is only called when 
     * Mario is above an enemy to kill it.
     */
    private _killEnemy(): void {
        if (this._collidableObjects.down) {
            const enemyX = this._collidableObjects.down.x;
            const enemyY = this._collidableObjects.down.y;
            const deadEnemy = this._enemies.find((enemy) => enemy.x === enemyX && enemy.y === enemyY);
            if (deadEnemy) {
                deadEnemy.isAlive = false;
            }
            this._map[enemyY][enemyX] = undefined;
        }
    }

    
    /**
     * Using the 4 collidable objects around Mario, here we handle all the possible types of collisions that can happen.
     * For 'revert', we largely keep Mario's position the same, except when Mario is moving up and collides with an object - then Mario stops rising
     * For 'enemyDead', we remove the collided enemy from the map and list of enemies
     * For 'marioTakeDamage', we let Mario decide whether he has enough hearts to continue. If Mario is out of hearts, we end the game for the player and otherwise, we restart Mario from the 
     * beginning of the game with one less heart.
     * For 'isWinner', we display the appropriate messages and the user's score
     * Lastly, if there is no block in Mario's direction we will update his location accordingly.
     * @param colliderDir Direction the collider is moving towards
     * @param mario_x Mario's current x position
     * @param mario_y Mario's current y position
     */
    private _handleEnemyandBlockCollisions(colliderDir: string, mario_x: GameUnit, mario_y: GameUnit) {
        const functionMap: {[direction: string] : ()=> void} = {
            'up' : () => this._mario.jump(),
            'down' : () => this._mario.moveDown(),
            'right' : () => this._mario.moveRight(),
            'left' :  () => this._mario.moveLeft(),
        };


        const collState = this._collidableObjects[colliderDir]?.collision(colliderDir);
            switch(collState) {
                case 'revert':
                    if (colliderDir === 'up') {
                        this._mario.stopRising();
                    }
                    break;
                case 'enemyDead':
                    if (colliderDir === 'down') {
                        this._killEnemy();
                    }
                    break;
                case 'marioTakeDamage':
                    // eslint-disable-next-line no-case-declarations
                    const marioCollisionState = this._mario.collision(colliderDir); 
                    if (marioCollisionState === 'isDead') {
                        this.death();
                    } else {
                        this.restartLevel();
                    }
                    break;
                case 'isWinner':
                    this.winLevel();
                    break;
                default:
                    functionMap[colliderDir]();
                    this._updateMap(mario_x, mario_y);
                    this.fillCollidableObjects();
                    break;
            }
    }

    /**
     * Abstracted method that moves Mario in the specified direction while ensuring the character doesn't move off the map
     * @param characterDir Direction Mario is moving in
     * @param borderCheck The boolean appropriate for Mario's direction to check if he is moving off the map.
     */
    private _characterMovement(characterDir: string, borderCheck: boolean) {
        const mariox: GameUnit = this._mario.x;
        const marioy: GameUnit = this._mario.y;
        if (borderCheck) {
            this._handleEnemyandBlockCollisions(characterDir, mariox, marioy);
        }
        else {
            throw new Error(`Mario Moved Out of Bounds - ${  characterDir}`);
        }
    }

    /**
     * Convenience method for moving the character up.
     * 
     * Checks if moving up is a valid move
     * Checks upward collision
     * Moves the character up
     * updates the internal map representation to show mario's movement
     */
    private _characterUp() {
        this._characterMovement('up', (this._mario.y - 1 >= 0));
    }

    /**
     * Convenience method for moving the character right.
     * 
     * Checks if moving right is a valid move
     * Checks right collision
     * Moves the character right
     * updates the internal map representation to show mario's movement
     */
    private _characterRight() {
        this._characterMovement('right', (this._mario.x + 1 < this._map[0].length));
    }

    /**
     * Convenience method for moving the character down.
     * 
     * Checks if moving down is a valid move
     * Checks downward collision
     * Moves the character down
     * updates the internal map representation to show mario's movement
     */
    private _characterDown() {
        this._characterMovement('down', (this._mario.y + 1 < this._map.length));
    }

    /**
     * Convenience method for moving the character left.
     * 
     * Checks if moving left is a valid move
     * Checks leftward collision
     * Moves the character left
     * updates the internal map representation to show mario's movement
     */
    private _characterLeft() {
        this._characterMovement('left', (this._mario.x - 1 >= 0));
    }

    /**
     * Basic method resembling onKey method to map to arrow keys in the future.
     * Moves the main character as well as restarts the level (arrow keys and space except down arrow)
     * if gameState is isDead - user can press 'space' to restart level
     */
    public keyPressed(key: string) {
        if (this._gameState === 'isPlaying') {
            switch(key) {
                case 'up': {
                    if (this._collidableObjects.down?.collision('down') === 'revert' && !this._mario.rising) {
                        this._characterUp();
                    }
                    break;
                }
                case 'left': {
                    this._characterLeft();
                    break;
                }
                case 'right': {
                    this._characterRight();
                    this.updateScore();
                    break;
                }
                default: {
                    break;
                }
            }
        } else if (key === 'space') {
            // const newLevel = this.restartLevel();
        }
    }



    /**
     * Resets the level from the beginning, resetting the score to 0, the main character to his original position
     * 
     * @throws Error - Cannot restart level unless done playing the game if game stat is not 'isPlaying'
     * maybe add a 'restarted' state? to keep track that this level is not playing but the one returned is
     */
    public abstract restartLevel(): Level;
}

/**
 * Class representing the first level of the game, including map layout and character placement
 */
export class LevelOne extends Level {

    constructor(mario: MainCharacter) {
        super(mario, [
            [undefined,                 undefined,                  undefined,                  undefined,                  undefined,              undefined,               undefined,                 undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 0)],
            [undefined,                 undefined,                  undefined,                  undefined,                  undefined,              undefined,               undefined,                 undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 1)],
            [undefined,                 undefined,                  undefined,                  new PipeBlock(3, 2),        undefined,              undefined,               undefined,                 undefined,                  new PlatformBlock(8, 2),    new PlatformBlock(9, 2),    undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 2)],
            [mario,                     undefined,                  new PlatformBlock(2, 3),    new PlatformBlock(3, 3),    undefined,              undefined,               undefined,                 new Goomba(7,3),            undefined,                  undefined,                  undefined,                  undefined,                  undefined,                  new CompletionBlock(13, 3)],
            [new PlatformBlock(0, 4),   new PlatformBlock(1, 4),    new PlatformBlock(2, 4),    new PlatformBlock(3, 4),    undefined,              undefined,               new PlatformBlock(6, 4),   new PlatformBlock(7, 4),    new PlatformBlock(8, 4),    new PlatformBlock(9, 4),    new PlatformBlock(10, 4),   new PlatformBlock(11, 4),   new PlatformBlock(12, 4),   new CompletionBlock(13, 4)],
            [new PlatformBlock(0, 5),   new PlatformBlock(1, 5),    new PlatformBlock(2, 5),    new PlatformBlock(3, 5),    undefined,              undefined,               new PlatformBlock(6, 5),   new PlatformBlock(7, 5),    new PlatformBlock(8, 5),    new PlatformBlock(9, 5),    new PlatformBlock(10, 5),   new PlatformBlock(11, 5),   new PlatformBlock(12, 5),   new PlatformBlock(13, 5)],
            [new PlatformBlock(0, 6),   new PlatformBlock(1, 6),    new PlatformBlock(2, 6),    new PlatformBlock(3, 6),    new DeathBlock(4,6),    new DeathBlock(5,6),     new PlatformBlock(6, 6),   new PlatformBlock(7, 6),    new PlatformBlock(8, 6),    new PlatformBlock(9, 6),    new PlatformBlock(10, 6),   new PlatformBlock(11, 6),   new PlatformBlock(12, 6),   new PlatformBlock(13, 6)],
        ]);
    }

    /**
     * Resets the level from the beginning, resetting the score to 0, the main character to his original position
     * 3 cases this method considers
         * if isWin:
         * - EVERYTHING is reset, health, startingPos, risingDuration, enemies and everything (create and pass in new mario object)
         * if Die:
         * -  EVERYTHING is reset, health, startingPos, risingDuration, enemies and everything (create and pass in new mario object)
         * if Lose heart:
         * - Everything resets, except for health
     * 
     * @throws Error - Cannot restart level unless done playing the game if game stat is not 'isPlaying'
     */
    public restartLevel(): Level {

        if (this._gameState !== 'isPlaying') {
            const newMario = new MainCharacter(this._startingMarioPos[0], this._startingMarioPos[1]);
            return new LevelOne(newMario);
        } 
            this.resetMarioPosition();
            return new LevelOne(this._mario);
        
    }
}  