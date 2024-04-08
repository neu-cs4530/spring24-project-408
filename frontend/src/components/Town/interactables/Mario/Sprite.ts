import Phaser from 'phaser';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import SpritePlayer from './SpritePlayer';
import SpriteEnemy from './SpriteEnemy';

export const TILE_MULT = 32;
export default class SpriteLevel extends Phaser.Scene {
  public model: MarioAreaController;

  public groundLayer: Phaser.Tilemaps.TilemapLayer | null;

  public player: SpritePlayer | undefined;

  public enemy: SpriteEnemy | undefined;

  public hasMarioSpawned: boolean;

  public keys:
    | {
        up: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
      }
    | undefined;

  public disableKeys: boolean;

  public time_passed: number;

  constructor(newModel: MarioAreaController) {
    super();

    this.model = newModel;
    this.groundLayer = null;
    this.disableKeys = true;
    this.hasMarioSpawned = false;
    this.time_passed = 0;
  }

  preload() {
    this.load.spritesheet('player', '/assets/tilesets/Mario.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
    this.load.spritesheet('enemy', '/assets/tilesets/goomba.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });
    this.load.image('tiles', '/assets/tilesets/Level.png');

    this.load.tilemapTiledJSON('map', '/assets/tilemaps/platformer.json');
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

      const spawnPointEnemy = map.findObject('Objects', obj => obj.name === 'Spawn Point Enemy');
      const spawnPointXEnemy: number = spawnPointEnemy?.x || 7 * TILE_MULT;
      const spawnPointYEnemy: number = spawnPointEnemy?.y || 3 * TILE_MULT;
      this.enemy = new SpriteEnemy(this, spawnPointXEnemy, spawnPointYEnemy);

      const spawnPoint = map.findObject('Objects', obj => obj.name === 'Spawn Point Player');
      const spawnPointX: number =
        spawnPoint?.x || this.model.level._startingMarioPos[0] * TILE_MULT;
      const spawnPointY: number =
        spawnPoint?.y || this.model.level._startingMarioPos[1] * TILE_MULT;
      this.player = new SpritePlayer(this, spawnPointX, spawnPointY);

      if (this.groundLayer) {
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Needs to be finished, need to make the bounds == the whole maps look at Camera.useBounds()

        // change based on render
        this.add
          .text(4, 218, 'T(^) F(<) G(>)', {
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
    this.time_passed += 1;

    if (this.time_passed % 20 === 0) {
      const curHealth = this.model.mario.health;

      if (this.model.status === 'IN_PROGRESS') {
        this.disableKeys = false;
        this.model.makeMove('tick');
        if (this.input.keyboard) {
          this.input.keyboard.enabled = true;
        }
      } else {
        this.disableKeys = true;
        if (this.input.keyboard) {
          this.input.keyboard.enabled = false;
        }
      }

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
      this.enemy?.update();
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
      } //else if (this.model.status === 'IN_PROGRESS' && curHealth !== this.model.mario.health) {
      // this.scene.restart();
      //}
      /** 
      let healthString: string;
      const health = Math.round(this.model.mario.health);
      if (health === 3) {
        healthString = '♡ ♡ ♡';
      } else if (health === 2) {
        healthString = '♡ ♡';
      } else if (health === 1) {
        healthString = '♡';
      } else {
        healthString = '';
      }*/
      const healthString = 'Health: ';
      this.add
        .text(180, 216, healthString + this.model.mario.health.toString(), {
          font: '16px monospace',
          color: '#ff0000',
          padding: { x: 2, y: 2 },
          backgroundColor: '#ffffff',
        })
        .setScrollFactor(0);

      let scoreString = '';
      if (this.model.level._score < 100) {
        scoreString = 'Score: 0';
      } else {
        scoreString = 'Score: ';
      }

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
}
