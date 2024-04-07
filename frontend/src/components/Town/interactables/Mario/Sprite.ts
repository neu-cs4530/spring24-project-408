import Phaser from 'phaser';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import SpritePlayer from './SpritePlayer';
import SpriteEnemy from './SpriteEnemy';

export const TILE_MULT = 32;
export default class SpriteLevel extends Phaser.Scene {
  public model: MarioAreaController;

  public groundLayer: Phaser.Tilemaps.TilemapLayer | null;

  public player: SpritePlayer | undefined;

  public enemies: SpriteEnemy[];

  public keys:
    | {
        up: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
      }
    | undefined;

  public disableKeys: boolean;

  constructor(newModel: MarioAreaController) {
    super();

    this.model = newModel;
    this.groundLayer = null;
    this.disableKeys = true;
    this.enemies = [];
  }

  preload() {
    this.load.spritesheet(
      'player',
      '/assets/tilesets/Mario.png', // Gonna need to change this file "../assets/spritesheets/0x72-industrial-player-32px-extruded.png"
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 0,
        spacing: 0,
      },
    );
    this.load.image('tiles', '/assets/tilesets/Level.png');
    /*
    this.load.image(
      'tiles',
      '/Users/devanshishah/Downloads/cs4530/final project/spring24-project-408/frontend/src/components/Town/interactables/Mario/MarioAssets/Level.png', // And this "../assets/tilesets/0x72-industrial-tileset-32px-extruded.png"
    );*/
    this.load.tilemapTiledJSON('map', '/assets/tilemaps/platformer.json'); // And this "../assets/tilemaps/platformer.json"
  }

  create() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { T, F, G } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard?.addKeys({
      left: F,
      right: G,
      up: T,
    }) as {
      up: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };

    const map = this.make.tilemap({ key: 'map' });

    const tiles = map.addTilesetImage(
      'Level', // Again wrong file "0x72-industrial-tileset-32px-extruded"
      'tiles',
    );

    if (tiles) {
      map.createLayer('background', tiles);
      this.groundLayer = map.createLayer('ground', tiles);

      this.enemies = this.model.level._enemies.map(
        enemy => new SpriteEnemy(this, enemy.x * TILE_MULT, enemy.y * TILE_MULT),
      );
      this.player = new SpritePlayer(
        this,
        this.model.mario._x * TILE_MULT,
        this.model.mario._y * TILE_MULT,
      );

      if (this.groundLayer) {
        this.groundLayer.setCollisionByProperty({ collides: true });

        this.groundLayer.forEachTile(tile => {
          if (
            tile.index === 190 ||
            tile.index === 171 ||
            tile.index === 192 ||
            tile.index === 132
          ) {
            // A sprite has its origin at the center, so place the sprite at the center of the tile
            tile.setCollision(true, true, true, true);

            // The map has spike tiles that have been rotated in Tiled ("z" key), so parse out that angle
            // to the correct body placement
          }
        });

        //this.player.sprite.setCollideWorldBounds(true);
        this.physics.add.collider(this.player.sprite, this.groundLayer);

        for (const enemy of this.enemies) {
          this.physics.add.collider(enemy._sprite, this.groundLayer);
        }

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Needs to be finished, need to make the bounds == the whole maps look at Camera.useBounds()

        // change based on render
        this.add
          .text(4, 216, this.groundLayer.getTileAt(0, 5).canCollide.toString(), {
            font: '16px monospace',
            color: '#ff0000',
            padding: { x: 2, y: 2 },
            backgroundColor: '#ffffff',
          })
          .setScrollFactor(0);
      } else {
        throw new Error('Ground Layer is Null');
      }
    } else {
      throw new Error('Invalid tileset');
    }
  }

  update() {
    const curHealth = this.model.mario.health;

    if (this.model.status === 'IN_PROGRESS') {
      this.disableKeys = false;
      if (this.input.keyboard) {
        this.input.keyboard.enabled = true;
      }
    } else {
      this.disableKeys = true;
      if (this.input.keyboard) {
        this.input.keyboard.enabled = false;
      }
    }

    this.model.level.keyPressed('tick');

    if (!this.disableKeys) {
      if (this.keys?.right.isDown) {
        this.model.makeMove('right');
      } else if (this.keys?.left.isDown) {
        this.model.makeMove('left');
      } else if (this.keys?.up.isDown) {
        this.model.makeMove('up');
      }
    }
    this.player?.update();
    for (const enemy of this.enemies) {
      enemy.update();
    }
    if (this.model.status === 'OVER') {
      if (this.model.level._gameState === 'isWinner') {
        this.add.text(400, 300, `You Win! Score: ${this.model.level._score}`, {
          fontSize: '32px monospace',
          color: '#000000',
          padding: { x: 8, y: 8 },
          backgroundColor: '#ffffff',
        });
      } else if (this.model.level._gameState === 'isDead') {
        this.add
          .text(400, 300, 'You Lose :(', {
            fontSize: '32px monospace',
            color: '#000000',
            padding: { x: 8, y: 8 },
            backgroundColor: '#ffffff',
          })
          .setScrollFactor(0);
      }
    } else if (this.model.status === 'IN_PROGRESS' && curHealth !== this.model.mario.health) {
      this.scene.restart();
    }
    let healthString: string;
    switch (this.model.mario._health) {
      case 3:
        healthString = '♡ ♡ ♡';
        break;
      case 2:
        healthString = '♡ ♡';
        break;
      case 1:
        healthString = '♡';
        break;
      default:
        healthString = '';
    }

    this.add
      .text(216, 216, healthString, {
        font: '18px monospace',
        color: '#ff0000',
        padding: { x: 2, y: 2 },
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0);

    const scoreString = 'Score: ';

    this.add
      .text(300, 216, scoreString + this.model.level._score.toString(), {
        font: '16px monospace',
        color: '#ff0000',
        padding: { x: 2, y: 2 },
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0);
  }
}
