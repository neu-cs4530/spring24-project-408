import Phaser from 'phaser';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import SpritePlayer from './SpritePlayer';
import SpriteEnemy from './SpriteEnemy';

export const TILE_MULT = 32;

/**
 * A class that represents the Phaser.Scene for the Mario game
 *
 * @param newModel the controller for the Mario game
 */
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

  /**
   * Preload the assets for the game
   *
   * Loads the spritesheets for the player and enemy, as well as the tileset for the level
   */
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

  /**
   * Create the game
   *
   * Creates the tiles the player, and the enemy
   *
   * The tiles consist of the background and the ground
   *    The ground consists of collidable objects that the player and enemy can collide with
   *    The ground is set to collide with the player and enemy
   *    The player and enemy are created at their respective spawn points
   *
   * The camera follows the player and is bound within the map
   *
   * Displays text on the screen to show the controls for the player
   */
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

    const tiles = map.addTilesetImage('Level', 'tiles');

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
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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

  /**
   * Update the game
   *
   * Updates the game every 20 ticks
   *
   * If the game is in progress, the player can move, else keys are disabled
   * Updates the sprite of the player and enemy
   * Displays the health and score of the player on the screen
   */
  update() {
    this.time_passed += 1;

    if (this.time_passed % 20 === 0) {
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
