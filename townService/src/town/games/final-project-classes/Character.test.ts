import { MainCharacter, Goomba } from './Character';

describe('Goomba', () => {
  let goomba: Goomba;
  beforeEach(() => {
    goomba = new Goomba(2, 3);
  });
  describe('Goomba health', () => {
    test('Goomba health is 1', () => {
      expect(goomba.health).toBe(1);
    });
    test('When goomba is collided with from above, goomba health is 0', () => {
      goomba.collision('down');
      expect(goomba.health).toBe(0);
    });
    test('When goomba is collided with from the side, goomba health is 1', () => {
      goomba.collision('left');
      expect(goomba.health).toBe(1);
    });
  });
  describe('Goomba isAlive', () => {
    test('When goomba is created, goomba is alive', () => {
      expect(goomba.isAlive).toBe(true);
    });
    test('When goomba is collided with from above, goomba is dead', () => {
      goomba.collision('down');
      expect(goomba.isAlive).toBe(false);
    });
    test('When goomba is collided with from the side, goomba is alive', () => {
      goomba.collision('left');
      expect(goomba.isAlive).toBe(true);
    });
  });
  describe('Collision', () => {
    test('When goomba is collided from above, return enemyDead', () => {
      expect(goomba.collision('down')).toBe('enemyDead');
    });
    test('When goomba is collided from the left, return marioTakeDamage', () => {
      expect(goomba.collision('left')).toBe('marioTakeDamage');
    });
    test('When goomba is collided from the right, return marioTakeDamage', () => {
      expect(goomba.collision('right')).toBe('marioTakeDamage');
    });
    test('When goomba is collided from below, return marioTakeDamage', () => {
      expect(goomba.collision('up')).toBe('marioTakeDamage');
    });
    test('When goomba is collided from an invalid direction, throw an error', () => {
      expect(() => goomba.collision('bruh')).toThrowError('Invalid collision direction value');
    });
  });
});
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
    test('when moveLeft is called, followed by moveRight, x is decremented then incremented', () => {
      mario.moveLeft();
      mario.moveRight();
      expect(mario.x).toBe(1);
    });
    test('when moveUp is called, followed by moveDown, y is decremented then incremented', () => {
      mario.moveUp();
      mario.moveDown();
      expect(mario.y).toBe(3);
    });
  });
  describe('Jump command', () => {
    test('when jump is called, y is decremented by 1, rising is true and rise duration is increased', () => {
      mario.jump();
      expect(mario.y).toBe(2);
      expect(mario.rising).toBe(true);
      expect(mario.currentRiseDuration).toBe(1);
    });
    test('when jump is called twice, y is decremented by 2, rising is true and rise duration set to zero because peak is reached', () => {
      mario.jump();
      mario.jump();
      expect(mario.y).toBe(1);
      expect(mario.rising).toBe(true);
      expect(mario.currentRiseDuration).toBe(0);
    });
  });
  describe('StopRising', () => {
    test('when stopRising is called, rising is false and currentRiseDuration is 0', () => {
      mario.jump();
      expect(mario.rising).toBe(true);
      expect(mario.currentRiseDuration).toBe(1);
      mario.stopRising();
      expect(mario.rising).toBe(false);
      expect(mario.currentRiseDuration).toBe(0);
    });
    test('when stopRising is called twice, rising is false and currentRiseDuration is 0', () => {
      mario.jump();
      mario.jump();
      expect(mario.rising).toBe(true);
      expect(mario.currentRiseDuration).toBe(0);
      mario.stopRising();
      expect(mario.rising).toBe(false);
      expect(mario.currentRiseDuration).toBe(0);
      mario.stopRising();
      expect(mario.rising).toBe(false);
      expect(mario.currentRiseDuration).toBe(0);
    });
  });
  describe('SetPosition', () => {
    test('when setPosition is called, x and y are set to the new values', () => {
      expect(mario.x).toBe(1);
      expect(mario.y).toBe(3);
      mario.setPosition(3, 4);
      expect(mario.x).toBe(3);
      expect(mario.y).toBe(4);
    });
    test('when setPosition is called twice, x and y are set to the new values', () => {
      expect(mario.x).toBe(1);
      expect(mario.y).toBe(3);
      mario.setPosition(3, 4);
      expect(mario.x).toBe(3);
      expect(mario.y).toBe(4);
      mario.setPosition(5, 6);
      expect(mario.x).toBe(5);
      expect(mario.y).toBe(6);
    });
  });
  describe('Rising', () => {
    test('when rising is set to true, rising is true', () => {
      mario.rising = true;
      expect(mario.rising).toBe(true);
    });
    test('when rising is set to false, rising is false', () => {
      mario.rising = false;
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
    test('when mario rising is set to true and currentRiseDuration is 1, currentRiseDuration is set to 0', () => {
      mario.rising = false;
      expect(mario.currentRiseDuration).toBe(0);
      mario.rising = true;
      mario.incrementRiseDuration();
      expect(mario.currentRiseDuration).toBe(1);
      mario.incrementRiseDuration();
      expect(mario.currentRiseDuration).toBe(0);
    });
    test('when mario rising is set to true and currentRiseDuration is 0, currentRiseDuration is set to 0', () => {
      mario.rising = false;
      expect(mario.currentRiseDuration).toBe(0);
      mario.rising = true;
      mario.incrementRiseDuration();
      mario.incrementRiseDuration();
      expect(mario.currentRiseDuration).toBe(0);
      mario.incrementRiseDuration();
      expect(mario.currentRiseDuration).toBe(1);
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
    beforeEach(() => {
      mario = new MainCharacter(2, 3);
    });
    test('When an Enemy or DeathBlock collides down into mario', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('down')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
    });
    test('When an Enemy or DeathBlock collides down into mario 3 times and dies', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('down')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('down')).toBe('resetStartPos');
      expect(mario.health).toBe(1);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('down')).toBe('isDead');
      expect(mario.health).toBe(0);
      expect(mario.isAlive).toBe(false);
    });
    test('When an Enemy or DeathBlock collides up into mario', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('up')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
    });
    test('When an Enemy or DeathBlock collides up into mario 3 times and dies', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('up')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('up')).toBe('resetStartPos');
      expect(mario.health).toBe(1);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('up')).toBe('isDead');
      expect(mario.health).toBe(0);
      expect(mario.isAlive).toBe(false);
    });
    test('When an Enemy or DeathBlock collides right into mario', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('right')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
    });
    test('When an Enemy or DeathBlock collides right into mario 3 times and dies', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('right')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('right')).toBe('resetStartPos');
      expect(mario.health).toBe(1);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('right')).toBe('isDead');
      expect(mario.health).toBe(0);
      expect(mario.isAlive).toBe(false);
    });
    test('When an Enemy or DeathBlock collides left into mario', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('left')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
    });
    test('When an Enemy or DeathBlock collides left into mario 3 times and dies', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('left')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('left')).toBe('resetStartPos');
      expect(mario.health).toBe(1);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('left')).toBe('isDead');
      expect(mario.health).toBe(0);
      expect(mario.isAlive).toBe(false);
    });
    test('When the Mario is collided from an invalid direction, throw an error', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(() => mario.collision('bruh')).toThrowError('Invalid collision direction value');
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
    });
    test('When an Enemy or DeathBlock is collided with from various directions and mario dies', () => {
      expect(mario.health).toBe(3);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('down')).toBe('resetStartPos');
      expect(mario.health).toBe(2);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('up')).toBe('resetStartPos');
      expect(mario.health).toBe(1);
      expect(mario.isAlive).toBe(true);
      expect(mario.collision('right')).toBe('isDead');
      expect(mario.health).toBe(0);
      expect(mario.isAlive).toBe(false);
    });
  });
});
