import { PlatformBlock } from './Block';
import { MainCharacter, Goomba } from './Character';
import { GameObject } from './GameObject';

describe('GameObject', () => {
    let testBlock: GameObject;
    let testMainCharacter: GameObject;
    let testGoomba: GameObject;

    beforeEach(() => {
        testBlock = new PlatformBlock(1, 3);
        testMainCharacter = new MainCharacter(1, 2);
        testGoomba = new Goomba(2, 4);
    });

    describe('Block', () => {
        test('Block is an instance of GameObject', () => {
            expect(testBlock).toBeInstanceOf(GameObject);
        });
        test('get x', () => {
            expect(testBlock.x).toBe(1);
        })
        test('get y', () => {
            expect(testBlock.y).toBe(3);
        });
        test('get gameLetter', () => {
            expect(testBlock.toString()).toBe('X');
        });
    });
    describe('MainCharacter', () => {
        test('MainCharacter is an instance of GameObject', () => {
            expect(testMainCharacter).toBeInstanceOf(GameObject);
        });
        test('get x', () => {
            expect(testMainCharacter.x).toBe(1);
        })
        test('get y', () => {
            expect(testMainCharacter.y).toBe(2);
        });
        test('get gameLetter', () => {
            expect(testMainCharacter.toString()).toBe('M');
        });
    });
    describe('Goomba', () => {
        test('Goomba is an instance of GameObject', () => {
            expect(testGoomba).toBeInstanceOf(GameObject);
        });
        test('get x', () => {
            expect(testGoomba.x).toBe(2);
        })
        test('get y', () => {
            expect(testGoomba.y).toBe(4);
        });
        test('get gameLetter', () => {
            expect(testGoomba.toString()).toBe('G');
        });
    });
});