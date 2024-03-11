import { Block, PlatformBlock, PipeBlock, DeathBlock, CompletionBlock} from './Block';

describe('Block', () => {
    describe('PlatformBlock', () => {
        test('PlatformBlock is an instance of Block', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock).toBeInstanceOf(Block);
        });
        test('PlatformBlock is an instance of PlatformBlock', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock).toBeInstanceOf(PlatformBlock);
        });
        test('PlatformBlock x is 1', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock.x).toBe(1);
        });
        test('PlatformBlock y is 1', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock.y).toBe(1);
        });
        test('PlatformBlock gameLetter is X', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock._gameLetter).toBe('X');
        });
        test('PlatformBlock collisionState is revert', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock._collisionState).toBe('revert');
        });
    });
    describe('DeathBlock', () => {
        test('DeathBlock is an instance of Block', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock).toBeInstanceOf(Block);
        });
        test('DeathBlock is an instance of DeathBlock', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock).toBeInstanceOf(DeathBlock);
        });
        test('DeathBlock x is 1', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock.x).toBe(1);
        });
        test('DeathBlockk y is 1', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock.y).toBe(1);
        });
        test('DeathBlock gameLetter is D', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock._gameLetter).toBe('D');
        });
        test('DeathBlock collisionState is isDead', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock._collisionState).toBe('isDead');
        });
    });
    describe('CompletionBlock', () => {
        test('CompletionBlock is an instance of Block', () => { 
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock).toBeInstanceOf(Block);
        });
        test('CompletionBlock is an instance of CompletionBlock', () => { 
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock).toBeInstanceOf(CompletionBlock);
        });
        test('CompletionBlock x is 1', () => {
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock.x).toBe(1);
        });
        test('CompletionBlock y is 1', () => {
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock.y).toBe(1);
        });
        test('CompletionBlock gameLetter is C', () => {
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock._gameLetter).toBe('C');
        });
        test('CompletionBlock collisionState is isWinner', () => {
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock._collisionState).toBe('isWinner');
        });
    });
    describe('PipeBlock', () => {
        test('PipeBlock is an instance of Block', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock).toBeInstanceOf(Block);
        });
        test('PipeBlock is an instance of PipeBlock', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock).toBeInstanceOf(PipeBlock);
        });
        test('PipeBlock x is 1', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock.x).toBe(1);
        });
        test('PipeBlock y is 1', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock.y).toBe(1);
        });
        test('PipeBlock gameLetter is P', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock._gameLetter).toBe('P');
        });
        test('PipeBlock collisionState is revert', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock._collisionState).toBe('revert');
        });
    });
    describe('Collision', () => {
        test('collision returns isWinner', () => {
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock.collision(1, 1)).toBe('isWinner');
        });
        test('collision returns isDead', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock.collision(1, 1)).toBe('isDead');
        });
        test('collision returns revert', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock.collision(1, 1)).toBe('revert');
        });
        test('collision returns revert', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock.collision(1, 1)).toBe('revert');
        });
        test('collision returns undefined, completion', () => {
            const completionBlock = new CompletionBlock(1, 1);
            expect(completionBlock.collision(1, 2)).toBe(undefined);
        });
        test('collision returns undefined, death', () => {
            const deathBlock = new DeathBlock(1, 1);
            expect(deathBlock.collision(1, 2)).toBe(undefined);
        });
        test('collision returns undefined, platform', () => {
            const platformBlock = new PlatformBlock(1, 1);
            expect(platformBlock.collision(1, 2)).toBe(undefined);
        });
        test('collision returns undefined, pipe', () => {
            const pipeBlock = new PipeBlock(1, 1);
            expect(pipeBlock.collision(1, 2)).toBe(undefined);
        });
    });
});
