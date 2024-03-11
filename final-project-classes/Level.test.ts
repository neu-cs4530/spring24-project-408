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

    
})