import SpriteLevel from './Sprite';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  pixelArt: false,
  backgroundColor: '#079BB0',
  scene: SpriteLevel,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
    },
  },
};

const game = new Phaser.Game(config);
