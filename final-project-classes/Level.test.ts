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
                new PlatformBlock(1,2), new PlatformBlock(1,2), new PlatformBlock(2,2)
            ];

            expect(testingGame1._blocks).toContain(expectBlocks);

        })
    })
})