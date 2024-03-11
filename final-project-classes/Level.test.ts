import { Console } from 'console';
import {GameCell, Level, LevelOne, TestingLevel} from './Level';
import { Block, DeathBlock, PlatformBlock, CompletionBlock, CurrentState, PipeBlock } from "./Block";
import { Character, MainCharacter } from "./Character";

const logger = new Console(process.stdout, process.stderr);

describe('Level Testing', () => { 
    

    describe("fillBlocks testing", () => {
        let testingMario = new MainCharacter(0,1);
        
        test("only platform blocks", () => {
            let testingMap1: GameCell[][] = [
                [new PlatformBlock(0,0), new PlatformBlock(1,0), new PlatformBlock(2,0)],
                [testingMario, new PlatformBlock(1,1), new PlatformBlock(2,1)],
                [new PlatformBlock(0,2), new PlatformBlock(1,2), new PlatformBlock(2,2)],
            ]

            let testingGame1 = new TestingLevel(testingMario, testingMap1);
            let expectBlocks: Block[] = [
                new PlatformBlock(0,0), new PlatformBlock(1,0), new PlatformBlock(2,0),
                new PlatformBlock(1,1), new PlatformBlock(2,1), new PlatformBlock(0,2), 
                new PlatformBlock(1,2), new PlatformBlock(2,2)
            ];

            expect(testingGame1._blocks).toEqual(expectBlocks);
        })
        test("no blocks, just mario - mario should not be added to the list of blocks", () => {
            let testingMap: GameCell[][] = [
                [undefined, undefined, undefined],
                [testingMario, undefined, undefined],
                [undefined, undefined, undefined],
            ];
            let testingGame = new TestingLevel(testingMario, testingMap);
            let expectBlocks: Block[] = [];
            expect(testingGame._blocks).toEqual(expectBlocks);
        })
        test("empty map - nothing in it, the blocks list should be empty", () => {
            let testingMap: GameCell[][] = [
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
            ];
            let testingGame = new TestingLevel(testingMario, testingMap);
            let expectBlocks: Block[] = [];
            expect(testingGame._blocks).toEqual(expectBlocks);
        })
        test("does level one work?", () => {
            let testingLevelOneMario = new MainCharacter(0,3);
            let levelOne = new LevelOne(testingLevelOneMario);
            let expectBlocks = [
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
                new DeathBlock(4,6),    
                new DeathBlock(5,6),    
                new PlatformBlock(6, 6),   
                new PlatformBlock(7, 6),    
                new PlatformBlock(8, 6),    
                new PlatformBlock(9, 6),    
                new PlatformBlock(10, 6),   
                new PlatformBlock(11, 6),   
                new PlatformBlock(12, 6),   
                new PlatformBlock(13, 6)
            ]
        })
    })

    describe("fillCollidable testing", () => {
        let testMario = new MainCharacter(1, 1);
        test("No blocks around Mario", () => {
            let testingMap1: GameCell[][] = [
                [undefined, undefined, undefined],
                [undefined, testMario, undefined],
                [undefined, undefined, undefined],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": undefined, "right": undefined, "up": undefined, "down": undefined};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Only platform blocks around Mario", () => {
            let testingMap1: GameCell[][] = [
                [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
                [new PlatformBlock(0, 1), testMario, new PlatformBlock(2, 1)],
                [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new PlatformBlock(0,1), "right": new PlatformBlock(2, 1), "up": new PlatformBlock(1, 0), "down": new PlatformBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Only corners around Mario", () => {
            let testingMap1: GameCell[][] = [
                [new PlatformBlock(0, 0), undefined, new PlatformBlock(2, 0)],
                [undefined, testMario, undefined],
                [new PlatformBlock(0, 2), undefined, new PlatformBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": undefined, "right": undefined, "up": undefined, "down": undefined};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Only pipe blocks around Mario", () => {
            let testingMap1: GameCell[][] = [
                [new PipeBlock(0, 0), new PipeBlock(1, 0), new PipeBlock(2, 0)],
                [new PipeBlock(0, 1), testMario, new PipeBlock(2, 1)],
                [new PipeBlock(0, 2), new PipeBlock(1, 2), new PipeBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new PipeBlock(0,1), "right": new PipeBlock(2, 1), "up": new PipeBlock(1, 0), "down": new PipeBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Only death blocks around Mario", () => {
            let testingMap1: GameCell[][] = [
                [new DeathBlock(0, 0), new DeathBlock(1, 0), new DeathBlock(2, 0)],
                [new DeathBlock(0, 1), testMario, new DeathBlock(2, 1)],
                [new DeathBlock(0, 2), new DeathBlock(1, 2), new DeathBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new DeathBlock(0,1), "right": new DeathBlock(2, 1), "up": new DeathBlock(1, 0), "down": new DeathBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Only completion blocks around Mario", () => {
            let testingMap1: GameCell[][] = [
                [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
                [new CompletionBlock(0, 1), testMario, new CompletionBlock(2, 1)],
                [new CompletionBlock(0, 2), new CompletionBlock(1, 2), new CompletionBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new CompletionBlock(0,1), "right": new CompletionBlock(2, 1), "up": new CompletionBlock(1, 0), "down": new CompletionBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Only completion blocks around Mario", () => {
            let testingMap1: GameCell[][] = [
                [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
                [new CompletionBlock(0, 1), testMario, new CompletionBlock(2, 1)],
                [new CompletionBlock(0, 2), new CompletionBlock(1, 2), new CompletionBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new CompletionBlock(0,1), "right": new CompletionBlock(2, 1), "up": new CompletionBlock(1, 0), "down": new CompletionBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Combination of blocks around Mario", () => {
            let testingMap1: GameCell[][] = [
                [new CompletionBlock(0, 0), new CompletionBlock(1, 0), new CompletionBlock(2, 0)],
                [new PipeBlock(0, 1), testMario, new DeathBlock(2, 1)],
                [new CompletionBlock(0, 2), new PlatformBlock(1, 2), new CompletionBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new PipeBlock(0,1), "right": new DeathBlock(2, 1), "up": new CompletionBlock(1, 0), "down": new PlatformBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Map is only Mario", () => {
            let testMario = new MainCharacter(0, 0);
            let testingMap1: GameCell[][] = [[testMario]]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": undefined, "right": undefined, "up": undefined, "down": undefined};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("Left is open", () => {
            let testingMap1: GameCell[][] = [
                [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
                [undefined, testMario, new PlatformBlock(2, 1)],
                [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": undefined, "right": new PlatformBlock(2,1), "up": new PlatformBlock(1, 0), "down": new PlatformBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("right is open", () => {
            let testingMap1: GameCell[][] = [
                [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
                [new PlatformBlock(0, 1), testMario, undefined],
                [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new PlatformBlock(0,1), "right": undefined, "up": new PlatformBlock(1, 0), "down": new PlatformBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("up is open", () => {
            let testingMap1: GameCell[][] = [
                [new PlatformBlock(0, 0), undefined, new PlatformBlock(2, 0)],
                [new PlatformBlock(0, 1), testMario, new PlatformBlock(2, 1)],
                [new PlatformBlock(0, 2), new PlatformBlock(1, 2), new PlatformBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new PlatformBlock(0,1), "right": new PlatformBlock(2, 1), "up": undefined, "down": new PlatformBlock(1, 2)};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        test("down is open", () => {
            let testingMap1: GameCell[][] = [
                [new PlatformBlock(0, 0), new PlatformBlock(1, 0), new PlatformBlock(2, 0)],
                [new PlatformBlock(0, 1), testMario, new PlatformBlock(2, 1)],
                [new PlatformBlock(0, 2), undefined, new PlatformBlock(2, 2)],
            ]

            let testLevel = new TestingLevel(testMario, testingMap1);
            let expectBlocks = {"left": new PlatformBlock(0,1), "right": new PlatformBlock(2, 1), "up": new PlatformBlock(1, 0), "down": undefined};

            expect(testLevel._collidableBlocks).toEqual(expectBlocks);
        });

        
    })

    describe("updateScore", () => {
        let testingMario: MainCharacter;
            let testingGame: TestingLevel;
            let testingMap: GameCell[][]; 
            beforeEach(() => {
                testingMario = new MainCharacter(0,1);
                testingMap = [
                    [undefined, undefined, undefined],
                    [testingMario, undefined, undefined],
                    [undefined, undefined, undefined],
                ];
                testingGame = new TestingLevel(testingMario, testingMap);
        
            });
            test("if distance is 0, score should not change", () => {
                testingGame.updateScore();
                expect(testingGame._score).toBe(0);
            });
            test("if distance is 1, score should increase by 100", () => {
                testingMario.moveRight();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
            });
            test("if distance is less than current max, score should not change", () => {
                testingMario.moveRight();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
                testingMario.moveLeft();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
            });
            test("if distance is greater than current max, score should increase by 100", () => {
                testingMario.moveRight();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
                testingMario.moveRight();
                testingGame.updateScore();
                expect(testingGame._score).toBe(200);
            });
            test("if distance is the same as current max, score should not change", () => {
                testingMario.moveRight();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
                testingMario.moveUp();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
            });
            test("if gameState is isDead, score should not change", () => {
                testingMario.moveRight();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
                testingGame._gameState = "isDead";
                testingMario.moveRight();
                expect(() => testingGame.updateScore()).toThrowError();
            });
            test("if gameState is isWinner, score should not change", () => {
                testingMario.moveRight();
                testingGame.updateScore();
                expect(testingGame._score).toBe(100);
                testingGame._gameState = "isWinner";
                testingMario.moveRight();
                expect(() => testingGame.updateScore()).toThrowError();
            });
        });
    describe("level toString testing", () => {
        let testingMario = new MainCharacter(0, 1);
        test("empty map", () => {
            let testingMap = [
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
            ];

            let testingGame = new TestingLevel(testingMario, testingMap);
            expect(testingGame.toString()).toBe("   \n   \n   \n");
        })

        test("only block map", () => {
            let testingMap = [
                [new PlatformBlock(0,0), new PlatformBlock(1,0), new PlatformBlock(2,0)],
                [new PlatformBlock(0,1), new PlatformBlock(1,1), new PlatformBlock(2,1)],
                [new PlatformBlock(0,2), new PlatformBlock(1,2), new PlatformBlock(2,2)],
            ];

            let testingGame = new TestingLevel(testingMario, testingMap);
            expect(testingGame.toString()).toBe("XXX\nXXX\nXXX\n");
        })

        test("only mario map", () => {
            let testingMap = [
                [undefined, undefined, undefined],
                [testingMario, undefined, undefined],
                [undefined, undefined, undefined],
            ];

            let testingGame = new TestingLevel(testingMario, testingMap);
            expect(testingGame.toString()).toBe("   \nM  \n   \n");
        })

        test("only mario map", () => {
            let testingMap = [
                [undefined, undefined, undefined],
                [testingMario, undefined, undefined],
                [undefined, undefined, undefined],
            ];

            let testingGame = new TestingLevel(testingMario, testingMap);
            expect(testingGame.toString()).toBe("   \nM  \n   \n");
        })

        test("level one map testing", () => {
            let levelOneTest = new LevelOne(new MainCharacter(0,3));
            let resultString = "             C\n             C\n   P    XX   C\nM XX         C\nXXXX  XXXXXXXC\nXXXX  XXXXXXXX\nXXXXDDXXXXXXXX\n"
            
            expect(levelOneTest.toString()).toBe(resultString)
        })

    })

    describe("OnKey method Tests", () => {
        let testingMario = new MainCharacter(0, 1);
        let testingMapPreMove = [
            [undefined, undefined, undefined],
            [testingMario, undefined, undefined],
            [undefined, undefined, undefined],
        ];
        let testLevel = new TestingLevel(testingMario, testingMapPreMove)

    })
})