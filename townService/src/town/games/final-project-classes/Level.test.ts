import { Console } from 'console';
import { GameCell, Level, LevelOne } from './Level';
import { Block, DeathBlock, PlatformBlock, CompletionBlock, PipeBlock } from './Block';
import { Enemy, Goomba, MainCharacter } from './Character';

const logger = new Console(process.stdout, process.stderr);

/**
 * Class representing a fake level used for testing
 */
class TestingLevel extends Level {
  /**
   * Resets the level from the beginning, resetting the score to 0, the main character to his original position
   *
   * @throws Error - Cannot restart level unless done playing the game if game stat is not 'isPlaying'
   */
  public restartLevel(): Level {
    if (this._gameState !== 'isPlaying') {
      this._map[this._mario._y][this._mario._x] = undefined;
      const newMario = new MainCharacter(this._startingMarioPos[0], this._startingMarioPos[1]);
      this._map[this._startingMarioPos[1]][this._startingMarioPos[0]] = newMario;

      return new TestingLevel(newMario, this._map);
    }

    this._map[this._mario._y][this._mario._x] = undefined;
    this._map[this._startingMarioPos[1]][this._startingMarioPos[0]] = this._mario;
    this.resetMarioPosition();
    return new TestingLevel(this._mario, this._map);
  }
}

describe('Level Testing', () => {
  describe('fillEnemies testing', () => {
    const testingGoomba = new Goomba(0, 1);
    const testingMario = new MainCharacter(0, 2);
    test('no enemies, just mario - mario should not be added to the list of enemies', () => {
      const testingMap: GameCell[][] = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [testingMario, undefined, undefined],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      const expectEnemies: Enemy[] = [];
      expect(testingGame._enemies).toEqual(expectEnemies);
    });
    test('empty map - nothing in it, the enemy list should be empty', () => {
      const testingMap: GameCell[][] = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      const expectEnemies: Enemy[] = [];
      expect(testingGame._enemies).toEqual(expectEnemies);
    });
    test('level with one Goomba', () => {
      const testingMap: GameCell[][] = [
        [undefined, undefined, undefined],
        [testingGoomba, undefined, undefined],
        [undefined, undefined, undefined],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      const expectEnemies: Enemy[] = [testingGoomba];
      expect(testingGame._enemies).toEqual(expectEnemies);
    });

    test('does level one work?', () => {
      const testingLevelOneMario = new MainCharacter(0, 3);
      const levelOne = new LevelOne(testingLevelOneMario);
      const expectGoombas = [new Goomba(7, 3)];

      expect(levelOne._enemies).toEqual(expectGoombas);
    });

    test('level with map of all Goombas', () => {
      const testingMap: GameCell[][] = [
        [new Goomba(0, 0), new Goomba(1, 0), new Goomba(2, 0)],
        [testingGoomba, new Goomba(1, 1), new Goomba(2, 1)],
        [new Goomba(0, 2), new Goomba(1, 2), new Goomba(2, 2)],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      const expectEnemies: Enemy[] = [
        new Goomba(0, 0),
        new Goomba(1, 0),
        new Goomba(2, 0),
        testingGoomba,
        new Goomba(1, 1),
        new Goomba(2, 1),
        new Goomba(0, 2),
        new Goomba(1, 2),
        new Goomba(2, 2),
      ];
      expect(testingGame._enemies).toEqual(expectEnemies);
    });
  });

  describe('fillBlocks testing', () => {
    const testingMario = new MainCharacter(0, 1);

    test('only platform blocks', () => {
      const testingMap1: GameCell[][] = [
        [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
        [testingMario, new PlatformBlock(1, 1), new PlatformBlock(2, 1)],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
      ];

      const testingGame1 = new TestingLevel(testingMario, testingMap1);
      const expectBlocks: Block[] = [
        new PlatformBlock(0, 0),
        new PlatformBlock(1, 0),
        new PlatformBlock(2, 0),
        new PlatformBlock(1, 1),
        new PlatformBlock(2, 1),
        new PlatformBlock(0, 2),
        new PlatformBlock(1, 2),
        new PlatformBlock(2, 2),
      ];

      expect(testingGame1._blocks).toEqual(expectBlocks);
    });
    test('no blocks, just mario - mario should not be added to the list of blocks', () => {
      const testingMap: GameCell[][] = [
        [undefined, undefined, undefined],
        [testingMario, undefined, undefined],
        [undefined, undefined, undefined],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      const expectBlocks: Block[] = [];
      expect(testingGame._blocks).toEqual(expectBlocks);
    });
    test('empty map - nothing in it, the blocks list should be empty', () => {
      const testingMap: GameCell[][] = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      const expectBlocks: Block[] = [];
      expect(testingGame._blocks).toEqual(expectBlocks);
    });
    test('does level one work?', () => {
      const testingLevelOneMario = new MainCharacter(0, 3);
      const levelOne = new LevelOne(testingLevelOneMario);
      const expectBlocks = [
        new CompletionBlock(13, 0),
        new CompletionBlock(13, 1),
        new PipeBlock(3, 2),
        new PlatformBlock(8, 2),
        new PlatformBlock(9, 2),
        new CompletionBlock(13, 2),
        new PlatformBlock(2, 3),
        new PlatformBlock(3, 3),
        new CompletionBlock(13, 3),
        new PlatformBlock(0, 4),
        new PlatformBlock(1, 4),
        new PlatformBlock(2, 4),
        new PlatformBlock(3, 4),
        new PlatformBlock(4, 4),
        new PlatformBlock(6, 4),
        new PlatformBlock(7, 4),
        new PlatformBlock(8, 4),
        new PlatformBlock(9, 4),
        new PlatformBlock(10, 4),
        new PlatformBlock(11, 4),
        new PlatformBlock(12, 4),
        new CompletionBlock(13, 4),
        new PlatformBlock(0, 5),
        new PlatformBlock(1, 5),
        new PlatformBlock(2, 5),
        new PlatformBlock(3, 5),
        new PlatformBlock(4, 5),
        new PlatformBlock(6, 5),
        new PlatformBlock(7, 5),
        new PlatformBlock(8, 5),
        new PlatformBlock(9, 5),
        new PlatformBlock(10, 5),
        new PlatformBlock(11, 5),
        new PlatformBlock(12, 5),
        new PlatformBlock(13, 5),
        new PlatformBlock(0, 6),
        new PlatformBlock(1, 6),
        new PlatformBlock(2, 6),
        new PlatformBlock(3, 6),
        new PlatformBlock(4, 6),
        new DeathBlock(5, 6),
        new PlatformBlock(6, 6),
        new PlatformBlock(7, 6),
        new PlatformBlock(8, 6),
        new PlatformBlock(9, 6),
        new PlatformBlock(10, 6),
        new PlatformBlock(11, 6),
        new PlatformBlock(12, 6),
        new PlatformBlock(13, 6),
      ];

      expect(levelOne._blocks).toEqual(expectBlocks);
    });
  });

  describe('fillCollidable testing', () => {
    const testMario = new MainCharacter(1, 1);
    test('No blocks around Mario', () => {
      const testingMap1: GameCell[][] = [
        [undefined, undefined, undefined],
        [undefined, testMario, undefined],
        [undefined, undefined, undefined],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Only platform blocks around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
        [new PlatformBlock(0, 1), testMario, new PlatformBlock(2, 1)],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new PlatformBlock(0, 1),
        right: new PlatformBlock(2, 1),
        up: new PlatformBlock(1, 0),
        down: new PlatformBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Only corners around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new PlatformBlock(0, 0), undefined, new PlatformBlock(2, 0)],
        [undefined, testMario, undefined],
        [new PlatformBlock(0, 2), undefined, new PlatformBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Only pipe blocks around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new PipeBlock(0, 0), new PipeBlock(1, 0), new PipeBlock(2, 0)],
        [new PipeBlock(0, 1), testMario, new PipeBlock(2, 1)],
        [new PipeBlock(0, 2), new PipeBlock(1, 2), new PipeBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new PipeBlock(0, 1),
        right: new PipeBlock(2, 1),
        up: new PipeBlock(1, 0),
        down: new PipeBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Only death blocks around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new DeathBlock(0, 0), new DeathBlock(1, 0), new DeathBlock(2, 0)],
        [new DeathBlock(0, 1), testMario, new DeathBlock(2, 1)],
        [new DeathBlock(0, 2), new DeathBlock(1, 2), new DeathBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new DeathBlock(0, 1),
        right: new DeathBlock(2, 1),
        up: new DeathBlock(1, 0),
        down: new DeathBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Only completion blocks around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testMario, new CompletionBlock(2, 1)],
        [new CompletionBlock(0, 2), new CompletionBlock(1, 2), new CompletionBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new CompletionBlock(0, 1),
        right: new CompletionBlock(2, 1),
        up: new CompletionBlock(1, 0),
        down: new CompletionBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Only completion blocks around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testMario, new CompletionBlock(2, 1)],
        [new CompletionBlock(0, 2), new CompletionBlock(1, 2), new CompletionBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new CompletionBlock(0, 1),
        right: new CompletionBlock(2, 1),
        up: new CompletionBlock(1, 0),
        down: new CompletionBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Combination of blocks around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new PipeBlock(0, 1), testMario, new DeathBlock(2, 1)],
        [new CompletionBlock(0, 2), new PlatformBlock(1, 2), new CompletionBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new PipeBlock(0, 1),
        right: new DeathBlock(2, 1),
        up: new CompletionBlock(1, 0),
        down: new PlatformBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Blocks and enemies around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new PipeBlock(0, 1), testMario, new Goomba(2, 1)],
        [new CompletionBlock(0, 2), new PlatformBlock(1, 2), new CompletionBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new PipeBlock(0, 1),
        right: new Goomba(2, 1),
        up: new CompletionBlock(1, 0),
        down: new PlatformBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Just enemies around Mario', () => {
      const testingMap1: GameCell[][] = [
        [new Goomba(0, 0), new Goomba(1, 0), new Goomba(2, 0)],
        [new Goomba(0, 1), testMario, new Goomba(2, 1)],
        [new Goomba(0, 2), new Goomba(1, 2), new Goomba(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new Goomba(0, 1),
        right: new Goomba(2, 1),
        up: new Goomba(1, 0),
        down: new Goomba(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Just one enemy around Mario', () => {
      const testingMap1: GameCell[][] = [
        [undefined, undefined, undefined],
        [undefined, testMario, new Goomba(2, 1)],
        [undefined, undefined, undefined],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: undefined,
        right: new Goomba(2, 1),
        up: undefined,
        down: undefined,
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Map is only Mario', () => {
      const testMario1 = new MainCharacter(0, 0);
      const testingMap1: GameCell[][] = [[testMario1]];

      const testLevel = new TestingLevel(testMario1, testingMap1);
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('Left is open', () => {
      const testingMap1: GameCell[][] = [
        [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
        [undefined, testMario, new PlatformBlock(2, 1)],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: undefined,
        right: new PlatformBlock(2, 1),
        up: new PlatformBlock(1, 0),
        down: new PlatformBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('right is open', () => {
      const testingMap1: GameCell[][] = [
        [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
        [new PlatformBlock(0, 1), testMario, undefined],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new PlatformBlock(0, 1),
        right: undefined,
        up: new PlatformBlock(1, 0),
        down: new PlatformBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('up is open', () => {
      const testingMap1: GameCell[][] = [
        [new PlatformBlock(0, 0), undefined, new PlatformBlock(2, 0)],
        [new PlatformBlock(0, 1), testMario, new PlatformBlock(2, 1)],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new PlatformBlock(0, 1),
        right: new PlatformBlock(2, 1),
        up: undefined,
        down: new PlatformBlock(1, 2),
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });

    test('down is open', () => {
      const testingMap1: GameCell[][] = [
        [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
        [new PlatformBlock(0, 1), testMario, new PlatformBlock(2, 1)],
        [new PlatformBlock(0, 2), undefined, new PlatformBlock(2, 2)],
      ];

      const testLevel = new TestingLevel(testMario, testingMap1);
      const expectBlocks = {
        left: new PlatformBlock(0, 1),
        right: new PlatformBlock(2, 1),
        up: new PlatformBlock(1, 0),
        down: undefined,
      };

      expect(testLevel._collidableObjects).toEqual(expectBlocks);
    });
  });

  describe('updateScore', () => {
    let testingMario: MainCharacter;
    let testingGame: TestingLevel;
    let testingMap: GameCell[][];
    beforeEach(() => {
      testingMario = new MainCharacter(0, 1);
      testingMap = [
        [undefined, undefined, undefined],
        [testingMario, undefined, undefined],
        [undefined, undefined, undefined],
      ];
      testingGame = new TestingLevel(testingMario, testingMap);
    });
    test('if distance is 0, score should not change', () => {
      testingGame.updateScore();
      expect(testingGame._score).toBe(0);
    });
    test('if distance is 1, score should increase by 100', () => {
      testingMario.moveRight();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
    });
    test('if distance is less than current max, score should not change', () => {
      testingMario.moveRight();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
      testingMario.moveLeft();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
    });
    test('if distance is greater than current max, score should increase by 100', () => {
      testingMario.moveRight();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
      testingMario.moveRight();
      testingGame.updateScore();
      expect(testingGame._score).toBe(200);
    });
    test('if distance is the same as current max, score should not change', () => {
      testingMario.moveRight();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
      testingMario.moveUp();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
    });
    test('if gameState is isDead, score should not change', () => {
      testingMario.moveRight();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
      testingGame._gameState = 'isDead';
      testingMario.moveRight();
      expect(() => testingGame.updateScore()).toThrowError();
    });
    test('if gameState is isWinner, score should not change', () => {
      testingMario.moveRight();
      testingGame.updateScore();
      expect(testingGame._score).toBe(100);
      testingGame._gameState = 'isWinner';
      testingMario.moveRight();
      expect(() => testingGame.updateScore()).toThrowError();
    });
  });
  describe('level toString testing', () => {
    const testingMario = new MainCharacter(0, 1);
    test('empty map', () => {
      const testingMap = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ];

      const testingGame = new TestingLevel(testingMario, testingMap);
      expect(testingGame.toString()).toBe('   \n   \n   \n');
    });

    test('only block map', () => {
      const testingMap = [
        [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
        [new PlatformBlock(0, 1), new PlatformBlock(1, 1), new PlatformBlock(2, 1)],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
      ];

      const testingGame = new TestingLevel(testingMario, testingMap);
      expect(testingGame.toString()).toBe('XXX\nXXX\nXXX\n');
    });

    test('only mario map', () => {
      const testingMap = [
        [undefined, undefined, undefined],
        [testingMario, undefined, undefined],
        [undefined, undefined, undefined],
      ];

      const testingGame = new TestingLevel(testingMario, testingMap);
      expect(testingGame.toString()).toBe('   \nM  \n   \n');
    });

    test('only mario map', () => {
      const testingMap = [
        [undefined, undefined, undefined],
        [testingMario, undefined, undefined],
        [undefined, undefined, undefined],
      ];

      const testingGame = new TestingLevel(testingMario, testingMap);
      expect(testingGame.toString()).toBe('   \nM  \n   \n');
    });

    test('level one map testing', () => {
      const levelOneTest = new LevelOne(new MainCharacter(0, 3));
      const resultString =
        '             C\n             C\n   P    XX   C\nM XX   G     C\nXXXXX XXXXXXXC\nXXXXX XXXXXXXX\nXXXXXDXXXXXXXX\n';

      expect(levelOneTest.toString()).toBe(resultString);
    });
  });

  describe('keyPressed testing', () => {
    let testMario = new MainCharacter(1, 1);
    let testingMap1: GameCell[][] = [
      [undefined, undefined, undefined],
      [undefined, testMario, undefined],
      [undefined, undefined, undefined],
    ];
    let testLevel = new TestingLevel(testMario, testingMap1);

    beforeEach(() => {
      testMario = new MainCharacter(1, 1);
      testingMap1 = [
        [undefined, undefined, undefined],
        [undefined, testMario, undefined],
        [undefined, undefined, undefined],
      ];
      testLevel = new TestingLevel(testMario, testingMap1);
    });

    test('Game State isDead and keyPressed is left', () => {
      testLevel._gameState = 'isDead';
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('left');

      expect(testLevel._mario.x).toEqual(oldMarioX);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isDead and keyPressed is right', () => {
      testLevel._gameState = 'isDead';
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('right');

      expect(testLevel._mario.x).toEqual(oldMarioX);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isDead and keyPressed is up', () => {
      testLevel._gameState = 'isDead';
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('up');

      expect(testLevel._mario.x).toEqual(oldMarioX);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isWinner and keyPressed is left', () => {
      testLevel._gameState = 'isWinner';
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('left');

      expect(testLevel._mario.x).toEqual(oldMarioX);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isWinner and keyPressed is right', () => {
      testLevel._gameState = 'isWinner';
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('right');

      expect(testLevel._mario.x).toEqual(oldMarioX);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isWinner and keyPressed is up', () => {
      testLevel._gameState = 'isWinner';
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('up');

      expect(testLevel._mario.x).toEqual(oldMarioX);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isPlaying and keyPressed is left', () => {
      expect(testLevel._gameState).toEqual('isPlaying');
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('left');

      expect(testLevel._mario.x).toEqual(oldMarioX - 1);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isPlaying and keyPressed is right', () => {
      expect(testLevel._gameState).toEqual('isPlaying');
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;
      const oldScore = testLevel._score;

      testLevel.keyPressed('right');

      expect(testLevel._mario.x).toEqual(oldMarioX + 1);
      expect(testLevel._mario.y).toEqual(oldMarioY);
      expect(testLevel._score).toEqual(oldScore + 100);
    });

    test('Game State isPlaying and keyPressed is up without block below mario', () => {
      expect(testLevel._gameState).toEqual('isPlaying');
      const oldMarioX = testLevel._mario.x;
      const oldMarioY = testLevel._mario.y;

      testLevel.keyPressed('up');

      expect(testLevel._mario.x).toEqual(oldMarioX);
      expect(testLevel._mario.y).toEqual(oldMarioY);
    });

    test('Game State isPlaying and keyPressed is up with block below mario', () => {
      const pBMap = [
        [undefined, undefined, undefined],
        [undefined, testMario, undefined],
        [undefined, new PlatformBlock(1, 2), undefined],
      ];
      const testLevel1 = new TestingLevel(testMario, pBMap);
      expect(testLevel1._gameState).toEqual('isPlaying');
      const oldMarioX = testLevel1._mario.x;
      const oldMarioY = testLevel1._mario.y;

      testLevel1.keyPressed('up');

      expect(testLevel1._mario.x).toEqual(oldMarioX);
      expect(testLevel1._mario.y).toEqual(oldMarioY - 1);
    });

    test('Game State isPlaying and keyPressed is left at the edge of the map', () => {
      const pBMap = [
        [undefined, undefined, undefined],
        [undefined, testMario, undefined],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), undefined],
      ];
      const testLevel1 = new TestingLevel(testMario, pBMap);
      expect(testLevel1._gameState).toEqual('isPlaying');
      const oldMarioX = testLevel1._mario.x;
      const oldMarioY = testLevel1._mario.y;

      testLevel1.keyPressed('left');

      expect(testLevel1._mario.x).toEqual(oldMarioX - 1);
      expect(testLevel1._mario.y).toEqual(oldMarioY);

      testLevel1.keyPressed('left');

      expect(testLevel1._mario.x).toEqual(oldMarioX - 1);
      expect(testLevel1._mario.y).toEqual(oldMarioY);
    });
    test('Game State isPlaying and keyPressed is up at the top of the map', () => {
      const testingMario = new MainCharacter(1, 0);
      const pBMap = [
        [undefined, testingMario, undefined],
        [undefined, new PlatformBlock(1, 1), new PlatformBlock(2, 2)],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), undefined],
      ];
      const testLevel1 = new TestingLevel(testingMario, pBMap);
      expect(testLevel1._gameState).toEqual('isPlaying');
      const oldMarioX = testLevel1._mario.x;
      const oldMarioY = testLevel1._mario.y;

      testLevel1.keyPressed('up');

      expect(testLevel1._mario.x).toEqual(oldMarioX);
      expect(testLevel1._mario.y).toEqual(oldMarioY);
    });
    test('Game State isPlaying and keyPressed is up with a block above', () => {
      const pBMap = [
        [undefined, new PlatformBlock(1, 0), undefined],
        [undefined, testMario, undefined],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), undefined],
      ];
      const testLevel1 = new TestingLevel(testMario, pBMap);
      expect(testLevel1._gameState).toEqual('isPlaying');
      const oldMarioX = testLevel1._mario.x;
      const oldMarioY = testLevel1._mario.y;

      testLevel1.keyPressed('up');

      expect(testLevel1._mario.x).toEqual(oldMarioX);
      expect(testLevel1._mario.y).toEqual(oldMarioY);
    });
    test('game state isPlaying and keyPressed is right into completion block', () => {
      const pBMap = [
        [undefined, undefined, undefined],
        [undefined, testMario, new CompletionBlock(2, 1)],
        [new PlatformBlock(0, 2), new PlatformBlock(1, 2), undefined],
      ];
      const testLevel1 = new TestingLevel(testMario, pBMap);
      expect(testLevel1._gameState).toEqual('isPlaying');
      testLevel1.keyPressed('right');
      testLevel1.keyPressed('tick');

      expect(testLevel1._gameState).toBe('isWinner');
      expect(testLevel1._score).toBe(100);
    });
  });

  describe('restartLevel', () => {
    // as restart level is ONLY called when mario is dead, has won, or has taken damage, these are the only test cases we need to test
    let testingMario: MainCharacter;
    let testingMapPreMove: GameCell[][];
    let testLevel: TestingLevel;
    beforeEach(() => {
      testingMario = new MainCharacter(1, 2);
      testingMapPreMove = [
        [undefined, undefined, new PlatformBlock(2, 0)],
        [undefined, undefined, undefined],
        [new Goomba(0, 2), testingMario, undefined],
      ];
      testLevel = new TestingLevel(testingMario, testingMapPreMove);
    });
    test("if mario is dead, should restart level and mario's health - the map should stay the same", () => {
      testingMario.moveRight();
      testLevel.updateScore();
      expect(testingMario._health).toBe(3);
      expect(testingMario.x).toBe(2);
      expect(testingMario.y).toBe(2);
      expect(testLevel._score).toBe(200);
      expect(testLevel._gameState).toBe('isPlaying');
      expect(testLevel._blocks).toEqual([new PlatformBlock(2, 0)]);
      testLevel._gameState = 'isDead';
      expect(testLevel._gameState).toBe('isDead');
      const testLevel2 = testLevel.restartLevel();
      expect(testLevel2._mario.x).toBe(1);
      expect(testLevel2._mario.y).toBe(2);
      expect(testLevel2._blocks).toEqual([new PlatformBlock(2, 0)]);
      expect(testLevel2._map).toBe(testingMapPreMove);
      expect(testLevel2._mario.health).toBe(3);
      expect(testLevel2._score).toBe(100);
      expect(testLevel2._gameState).toBe('isPlaying');
    });
    test("if mario is winner, should restart level and mario's health - map should stay the same", () => {
      expect(testLevel._blocks).toEqual([new PlatformBlock(2, 0)]);
      testingMario.moveRight();
      testLevel.updateScore();
      expect(testingMario._health).toBe(3);
      expect(testingMario.x).toBe(2);
      expect(testingMario.y).toBe(2);
      expect(testLevel._score).toBe(200);
      expect(testLevel._gameState).toBe('isPlaying');

      testLevel._gameState = 'isWinner';
      expect(testLevel._gameState).toBe('isWinner');
      const testLevel2 = testLevel.restartLevel();
      expect(testLevel2._mario.x).toBe(1);
      expect(testLevel2._mario.y).toBe(2);
      expect(testLevel2._blocks).toEqual([new PlatformBlock(2, 0)]);
      expect(testLevel2._map).toBe(testingMapPreMove);
      expect(testLevel2._mario.health).toBe(3);
      expect(testLevel2._score).toBe(100);
      expect(testLevel2._gameState).toBe('isPlaying');
    });
    test("if mario is playing and takes damage, the map and score should reset - the only difference is that mario's health has gone down by one", () => {
      testingMario.moveRight();
      testLevel.updateScore();
      expect(testingMario._health).toBe(3);
      expect(testingMario.x).toBe(2);
      expect(testingMario.y).toBe(2);
      expect(testLevel._score).toBe(200);
      expect(testLevel._blocks).toEqual([new PlatformBlock(2, 0)]);
      // simulate mario taking damage by reducing its health
      testLevel._mario.health = 2;
      expect(testingMario._health).toBe(2);
      expect(testLevel._gameState).toBe('isPlaying');
      const testLevel2 = testLevel.restartLevel();
      expect(testLevel2._mario.x).toBe(1);
      expect(testLevel2._mario.y).toBe(2);
      expect(testLevel2._blocks).toEqual([new PlatformBlock(2, 0)]);
      expect(testLevel2._map).toBe(testingMapPreMove);
      expect(testLevel2._mario.health).toBe(2);
      expect(testLevel2._score).toBe(100);
      expect(testLevel2._gameState).toBe('isPlaying');
    });
  });

  describe('winLevel', () => {
    const testingMario = new MainCharacter(1, 1);
    test('Mario wins', () => {
      const testingMap = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testingMario, new CompletionBlock(2, 1)],
        [new CompletionBlock(0, 2), new CompletionBlock(1, 2), new CompletionBlock(2, 2)],
      ];

      const testingGame = new TestingLevel(testingMario, testingMap);
      testingGame.winLevel();
      expect(testingGame._gameState).toBe('isWinner');
    });
    test('Mario cannot win when dead', () => {
      const testingMap = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testingMario, new DeathBlock(2, 1)],
        [new CompletionBlock(0, 2), new DeathBlock(1, 2), new CompletionBlock(2, 2)],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      testingGame._gameState = 'isDead';
      expect(() => testingGame.winLevel()).toThrowError('Cannot win game when dead');
    });
    test('If already won, game state stays isWinner', () => {
      const testingMap = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testingMario, new CompletionBlock(2, 1)],
        [new CompletionBlock(0, 2), new CompletionBlock(1, 2), new CompletionBlock(2, 2)],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      testingGame.winLevel();
      expect(testingGame._gameState).toBe('isWinner');
      testingGame.winLevel();
      expect(testingGame._gameState).toBe('isWinner');
    });
  });

  describe('death test', () => {
    const testingMario = new MainCharacter(1, 1);
    test('Mario is dead', () => {
      const testingMap = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testingMario, new DeathBlock(2, 1)],
        [new CompletionBlock(0, 2), new DeathBlock(1, 2), new CompletionBlock(2, 2)],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      testingGame.death();
      expect(testingGame._gameState).toBe('isDead');
    });
    test('Mario cannot die when won', () => {
      const testingMap = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testingMario, new CompletionBlock(2, 1)],
        [new CompletionBlock(0, 2), new CompletionBlock(1, 2), new CompletionBlock(2, 2)],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      testingGame._gameState = 'isWinner';
      expect(() => testingGame.death()).toThrowError("Cannot die when you've won");
    });
    test('If already dead, game state stays isDeadr', () => {
      const testingMap = [
        [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
        [new CompletionBlock(0, 1), testingMario, new DeathBlock(2, 1)],
        [new CompletionBlock(0, 2), new DeathBlock(1, 2), new CompletionBlock(2, 2)],
      ];
      const testingGame = new TestingLevel(testingMario, testingMap);
      testingGame.death();
      expect(testingGame._gameState).toBe('isDead');
      testingGame.death();
      expect(testingGame._gameState).toBe('isDead');
    });
  });

  describe('onTick tests', () => {
    let testingMario: MainCharacter;
    let testingGame: TestingLevel;
    let testingMap: GameCell[][];
    beforeEach(() => {
      testingMario = new MainCharacter(1, 3);
      testingMap = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, testingMario, undefined],
        [undefined, new PlatformBlock(1, 4), undefined],
      ];
      testingGame = new TestingLevel(testingMario, testingMap);
    });

    test('if state is dead, nothing happens, just a console log for now', () => {
      const logSpy = jest.spyOn(global.console, 'log');

      testingGame._gameState = 'isDead';
      testingGame.onTick();
      expect(logSpy).toHaveBeenCalledWith('game is not currently playing');
    });
    test('if state is winner, nothing happens, just a console log for now', () => {
      const logSpy = jest.spyOn(global.console, 'log');
      testingGame._gameState = 'isWinner';
      testingGame.onTick();
      expect(logSpy).toHaveBeenCalledWith('game is not currently playing');
    });

    test('if state is playing, and mario is not rising - gravity should be applied and mario rising should be false', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = {
        left: undefined,
        right: undefined,
        up: undefined,
        down: new PlatformBlock(1, 4),
      };
      const logSpy = jest.spyOn(global.console, 'log');

      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(3);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._gameState).toBe('isPlaying');

      testingGame.onTick();
      expect(logSpy).toHaveBeenCalledWith('gravity applied - mario moved down');
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(3);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._gameState).toBe('isPlaying');
    });

    test('if state is playing and mario is rising - mario has not reached his jump duration so his position will increase', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };
      const logSpy = jest.spyOn(global.console, 'log');

      // jumping mario
      testingGame.keyPressed('up');
      expect(testingGame._mario.rising).toBe(true);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(1);

      // after calling onTick his position should further increase
      testingGame.onTick();
      // expect(logSpy).toHaveBeenCalledWith(
      //  'mario hasnt reached the peak of his jump, he is still rising',
      // );
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
    });

    test('if state is playing and mario is rising - mario HAS reached his jump duration so he will stop rising', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };
      const logSpy = jest.spyOn(global.console, 'log');

      // jumping mario
      testingGame.keyPressed('up');
      expect(testingGame._mario.rising).toBe(true);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(1);

      // after calling onTick his position should further increase
      testingGame.onTick();

      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);

      testingGame.keyPressed('right');
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(2);
      expect(testingGame._mario.y).toBe(2);
      // expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);

      // last tick, mario rising should be set to false
      testingGame.onTick();
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(2);
      expect(testingGame._mario.y).toBe(3);
      // expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
    });

    test('if state is playing and mario moves while rising', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };
      const logSpy = jest.spyOn(global.console, 'log');

      // jumping mario
      console.log(testingGame.toString());
      testingGame.keyPressed('up');
      expect(testingGame._mario.rising).toBe(true);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(1);
      console.log(testingGame.toString());

      // after calling onTick his position should further increase
      testingGame.onTick();
      expect(logSpy).toHaveBeenCalledWith(
        'mario has reached the peak of his jump, he is now falling',
      );
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
      console.log(testingGame.toString());

      // last tick, mario rising should be set to false
      testingGame.onTick();
      expect(logSpy).toHaveBeenCalledWith('gravity applied - mario moved down');
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(3);
      const expectBlocks1 = {
        down: new PlatformBlock(1, 4),
        left: undefined,
        right: undefined,
        up: undefined,
      };
      expect(testingGame._collidableObjects).toEqual(expectBlocks1);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
      console.log(testingGame.toString());
    });
  });

  describe('keypresed + ontick', () => {
    let testingMario: MainCharacter;
    let testingGame: TestingLevel;
    let testingMap: GameCell[][];
    beforeEach(() => {
      testingMario = new MainCharacter(1, 3);
      testingMap = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, testingMario, undefined],
        [undefined, new PlatformBlock(1, 4), undefined],
      ];
      testingGame = new TestingLevel(testingMario, testingMap);
    });
    test('if state is playing, and mario is not rising - gravity should be applied and mario rising should be false', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = {
        left: undefined,
        right: undefined,
        up: undefined,
        down: new PlatformBlock(1, 4),
      };
      const logSpy = jest.spyOn(global.console, 'log');

      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(3);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._gameState).toBe('isPlaying');

      testingGame.keyPressed('tick');
      expect(logSpy).toHaveBeenCalledWith('gravity applied - mario moved down');
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(3);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._gameState).toBe('isPlaying');
    });
    test('if state is playing and mario is rising - mario has not reached his jump duration so his position will increase', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };
      const logSpy = jest.spyOn(global.console, 'log');

      // jumping mario
      testingGame.keyPressed('up');
      expect(testingGame._mario.rising).toBe(true);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(1);

      // after calling onTick his position should further increase
      testingGame.onTick();
      // expect(logSpy).toHaveBeenCalledWith(
      //  'mario hasnt reached the peak of his jump, he is still rising',
      // );
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
    });

    test('if state is playing and mario is rising - mario HAS reached his jump duration so he will stop rising', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };
      const logSpy = jest.spyOn(global.console, 'log');

      // jumping mario
      testingGame.keyPressed('up');
      expect(testingGame._mario.rising).toBe(true);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(1);

      // after calling keyPressed his position should further increase
      testingGame.keyPressed('tick');

      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);

      testingGame.keyPressed('right');
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(2);
      expect(testingGame._mario.y).toBe(2);
      // expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);

      // last tick, mario rising should be set to false
      testingGame.keyPressed('tick');
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(2);
      expect(testingGame._mario.y).toBe(3);
      // expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
    });

    test('if state is playing and mario moves while rising', () => {
      testingGame._gameState = 'isPlaying';
      const expectBlocks = { left: undefined, right: undefined, up: undefined, down: undefined };
      const logSpy = jest.spyOn(global.console, 'log');

      // jumping mario
      console.log(testingGame.toString());
      testingGame.keyPressed('up');
      expect(testingGame._mario.rising).toBe(true);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(1);
      console.log(testingGame.toString());

      // after calling keypressed his position should further increase
      testingGame.keyPressed('tick');
      expect(logSpy).toHaveBeenCalledWith(
        'mario has reached the peak of his jump, he is now falling',
      );
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(2);
      expect(testingGame._collidableObjects).toEqual(expectBlocks);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
      console.log(testingGame.toString());

      // last tick, mario rising should be set to false
      testingGame.keyPressed('tick');
      expect(logSpy).toHaveBeenCalledWith('gravity applied - mario moved down');
      expect(testingGame._mario.rising).toBe(false);
      expect(testingGame._mario.x).toBe(1);
      expect(testingGame._mario.y).toBe(3);
      const expectBlocks1 = {
        down: new PlatformBlock(1, 4),
        left: undefined,
        right: undefined,
        up: undefined,
      };
      expect(testingGame._collidableObjects).toEqual(expectBlocks1);
      expect(testingGame._mario.currentRiseDuration).toBe(0);
      console.log(testingGame.toString());
    });
  });
});
