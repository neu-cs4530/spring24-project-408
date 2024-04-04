import Phaser from 'phaser';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import SpritePlayer from './SpritePlayer';
import SpriteEnemy from './SpriteEnemy';
export default class SpriteLevel extends Phaser.Scene {
  public model: MarioAreaController;

  public playerSpriteSheet: string;

  public spikeSpriteSheet: string;

  public blockSpriteSheet: string;

  public mapJSON: string;

  public groundLayer: Phaser.Tilemaps.TilemapLayer | null;

  public player: SpritePlayer;

  public enemies: SpriteEnemy[];

  public keys:
    | {
        up: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
      }
    | undefined;

  public disableKeys: boolean;

  constructor(
    newModel: MarioAreaController,
    newPlayerSpriteSheet: string,
    newSpikeSpriteSheet: string,
    newBlockSpriteSheet: string,
    newMapJSON: string,
  ) {
    super();

    this.model = newModel;
    this.playerSpriteSheet = newPlayerSpriteSheet;
    this.spikeSpriteSheet = newSpikeSpriteSheet;
    this.blockSpriteSheet = newBlockSpriteSheet;
    this.mapJSON = newMapJSON;
    this.groundLayer = null;
    this.disableKeys = false;
    this.enemies = [];
    this.player = new SpritePlayer(this, this.model.mario._x, this.model.mario._y);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { LEFT, RIGHT, UP } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard?.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
    }) as {
      up: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };
  }

  preload() {
    this.load.spritesheet(
      'player',
      this.playerSpriteSheet, // Gonna need to change this file "../assets/spritesheets/0x72-industrial-player-32px-extruded.png"
      {
        frameWidth: 16,
        frameHeight: 16,
        margin: 1,
        spacing: 2,
      },
    );
    this.load.image('spike', this.spikeSpriteSheet); // And this "../assets/images/0x72-industrial-spike.png"
    this.load.image(
      'tiles',
      this.blockSpriteSheet, // And this "../assets/tilesets/0x72-industrial-tileset-32px-extruded.png"
    );
    this.load.tilemapTiledJSON('map', this.mapJSON); // And this "../assets/tilemaps/platformer.json"
  }

  create() {
    this.enemies = this.model.level._enemies.map(enemy => new SpriteEnemy(this, enemy.x, enemy.y));
    this.player = new SpritePlayer(this, this.model.mario._x, this.model.mario._y);
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage(
      this.blockSpriteSheet, // Again wrong file "0x72-industrial-tileset-32px-extruded"
      'tiles',
    );

    if (tiles) {
      map.createLayer('Background', tiles);
      this.groundLayer = map.createLayer('Ground', tiles);
      map.createLayer('Foreground', tiles);

      if (this.groundLayer) {
        this.groundLayer?.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Needs to be finished, need to make the bounds == the whole maps look at Camera.useBounds()

        // change based on render
        this.add
          .text(8, 8, 'Arrows to Move', {
            font: '18px monospace',
            color: '#ff0000',
            padding: { x: 4, y: 4 },
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
    this.player.update();
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
      .text(160, 160, healthString, {
        font: '18px monospace',
        color: '#ff0000',
        padding: { x: 8, y: 8 },
        backgroundColor: '#ffffff',
      })
      .setScrollFactor(0);
  }
}

/**
   *            Sprite.ts <-- onTick() [update()]
   *                ^
*                   |
*                MarioAreaController <-- onTick() [update()]
*                   ^ 
                    |
                   Level <-- onTick()
                    ^
                    |

        MC          Block       Enemy
        ^
        |
        SPRITE_MC.onTick()
   */

/**
   * import Phaser from "phaser";

 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
  
      // Create the animations we need from the player spritesheet
      const anims = scene.anims;
      anims.create({
        key: "player-idle",
        frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1
      });
      anims.create({
        key: "player-run",
        frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
        frameRate: 12,
        repeat: -1
      });
  
      // Create the physics-based sprite that we will move around and animate
      this.sprite = scene.physics.add
        .sprite(x, y, "player", 0)
        .setDrag(1000, 0)
        .setMaxVelocity(300, 400)
        .setSize(18, 24)
        .setOffset(7, 9);
  
      // Track the arrow keys & WASD
      const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
      this.keys = scene.input.keyboard.addKeys({
        left: LEFT,
        right: RIGHT,
        up: UP,
        w: W,
        a: A,
        d: D
      });
    }
  
    freeze() {
      this.sprite.body.moves = false;
    }
  
    update() {
      const { keys, sprite } = this;
      const onGround = sprite.body.blocked.down;
      const acceleration = onGround ? 600 : 200;
  
      // Apply horizontal acceleration when left/a or right/d are applied
      if (keys.left.isDown || keys.a.isDown) {
        sprite.setAccelerationX(-acceleration);
        // No need to have a separate set of graphics for running to the left & to the right. Instead
        // we can just mirror the sprite.
        sprite.setFlipX(true);
      } else if (keys.right.isDown || keys.d.isDown) {
        sprite.setAccelerationX(acceleration);
        sprite.setFlipX(false);
      } else {
        sprite.setAccelerationX(0);
      }
  
      // Only allow the player to jump if they are on the ground
      if (onGround && (keys.up.isDown || keys.w.isDown)) {
        sprite.setVelocityY(-500);
      }
  
      // Update the animation/texture based on the state of the player
      if (onGround) {
        if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
        else sprite.anims.play("player-idle", true);
      } else {
        sprite.anims.stop();
        sprite.setTexture("player", 10);
      }
    }
  
    destroy() {
      this.sprite.destroy();
    }
  }
  
   */
