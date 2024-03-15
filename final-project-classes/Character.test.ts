import { MainCharacter, Goomba } from "./Character";
//const mario = new MainCharacter(1, 3);
describe('MainCharacter', () => {
    let mario: MainCharacter;
    beforeEach(() => {
        mario = new MainCharacter(1, 3);
    });

    describe('Move command', () => {
        test('when moveLeft is called, x is decremented by 1', () => {
            mario.moveLeft();
            expect(mario.x).toBe(0);
        });
        test('when moveRight is called, x is incremented by 1', () => {
            mario.moveRight();
            expect(mario.x).toBe(2);
        });
        test('when moveUp is called, y is decremented by 1', () => {
            mario.moveUp();
            expect(mario.y).toBe(2);
        });
        test('when moveDown is called, y is incremented by 1', () => {
            mario.moveDown();
            expect(mario.y).toBe(4);
        });
    });

    describe('Rising and Falling', () => {
        test('when rising is set to true, rising is true', () => {
            mario.rising = true;
            expect(mario.rising).toBe(true);
        });
        test('when rising is set to false, rising is false', () => {
            mario.rising = false;
            expect(mario.rising).toBe(false);
        });
        test('when falling is set to true, falling is true', () => {
            mario.falling = true;
            expect(mario.falling).toBe(true);
        });
        test('when falling is set to false, falling is false', () => {
            mario.falling = false;
            expect(mario.falling).toBe(false);
        });
        test('when rising is set to true, falling is false', () => {
            mario.rising = true;
            expect(mario.falling).toBe(false);
        });
        test('when falling is set to true, rising is false', () => {
            mario.falling = true;
            expect(mario.rising).toBe(false);
        });
    });
    describe('isAlive', () => {
        test('when isAlive is set to true, isAlive is true', () => {
            mario.isAlive = true;
            expect(mario.isAlive).toBe(true);
        });
        test('when isAlive is set to false, isAlive is false', () => {
            mario.isAlive = false;
            expect(mario.isAlive).toBe(false);
        });
    });
    describe('RiseDuration', () => {
        test('currentRiseDuration is 0', () => {
            expect(mario.currentRiseDuration).toBe(0);
        });
        test('when mario rising is set to true, currentRiseDuration is set to 1', () => {
            mario.rising = false;
            expect(mario.currentRiseDuration).toBe(0);
            mario.rising = true;
            mario.incrementRiseDuration();
            expect(mario.currentRiseDuration).toBe(1);
        });
        test('when mario rising is set to true and currentRiseDuration is 1, currentRiseDuration is set to 2', () => {
            mario.rising = false;
            expect(mario.currentRiseDuration).toBe(0);
            mario.rising = true;
            mario.incrementRiseDuration();
            expect(mario.currentRiseDuration).toBe(1);
            mario.incrementRiseDuration();
            expect(mario.currentRiseDuration).toBe(2);
        });
        test('when mario rising is set to true and currentRiseDuration is 2, currentRiseDuration is set to 0', () => {
            mario.rising = false;
            expect(mario.currentRiseDuration).toBe(0);
            mario.rising = true;
            mario.incrementRiseDuration();
            mario.incrementRiseDuration();
            expect(mario.currentRiseDuration).toBe(2);
            mario.incrementRiseDuration();
            expect(mario.currentRiseDuration).toBe(0);
        });
        test('when mario rising is set to false, currentRiseDuration is set to 0', () => {
            mario.rising = true;
            mario.incrementRiseDuration();
            expect(mario.currentRiseDuration).toBe(1);
            mario.rising = false;
            mario.incrementRiseDuration();
            expect(mario.currentRiseDuration).toBe(0);
        });
    });

    describe('Collisions', () => { 
        let goomba: Goomba;
        let mario: MainCharacter;
        beforeEach(() => {
            mario = new MainCharacter(2,3);
            goomba = new Goomba(1, 2);
        });
        test('When the Goomba is collided from above (or down for mario) return enemy dead', () => {
            expect(goomba.collision('down')).toBe('enemyDead');
        });
        test('When the Goomba is collided from below (or up for mario) return mario take damage', () => {
            expect(goomba.collision('up')).toBe('marioTakeDamage');
        });
        test('When the Goomba is collided from the right (or left for mario) return mario take damage', () => {
            expect(goomba.collision('left')).toBe('marioTakeDamage');
        });
        test('When the Goomba is collided from the left (or right for mario) return mario take damage', () => {
            expect(goomba.collision('right')).toBe('marioTakeDamage');
        });
        test('When the Goomba is collided from an invalid direction, throw an error', () => {
            expect(() => goomba.collision('bruh')).toThrowError('Invalid collision direction value');
        });
        test('When the Mario is collided from above by another GameObject (or down for the GameObject), return mario dead', () => { 
            expect(mario.collision('down')).toBe('resetStartPos');
        });
        test('When the Mario is collided from below by another GameObject (or up for the GameObject), return enemy dead', () => { 
            expect(mario.collision('down')).toBe('resetStartPos');
        });
        test('When the Mario is collided from the left by another GameObject (or right for the GameObject), return mario dead', () => { 
            expect(mario.collision('right')).toBe('resetStartPos');
        });
        test('When the Mario is collided from the right by another GameObject (or left for the GameObject), return mario dead', () => { 
            expect(mario.collision('left')).toBe('resetStartPos');
        });
        test('When the Mario is collided from an invalid direction, throw an error', () => { 
            expect(() => mario.collision('bruh')).toThrowError('Invalid collision direction value');
        });
    })
});

