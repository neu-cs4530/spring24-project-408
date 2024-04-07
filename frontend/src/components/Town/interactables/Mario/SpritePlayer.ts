import SpriteLevel from './Sprite';
import { GameUnit } from './final-project-classes/GameObject';
import { TILE_MULT } from './Sprite';
export default class SpritePlayer {
  _scene: SpriteLevel;

  _x: GameUnit;

  _y: GameUnit;

  _sprite;

  constructor(scene: SpriteLevel, x: GameUnit, y: GameUnit) {
    this._scene = scene;
    this._x = x + 16;
    this._y = y + 16;
    this._sprite = this._scene.physics.add.sprite(x, y, 'player').setSize(16, 16);
  }

  get sprite() {
    return this._sprite;
  }

  update() {
    if (!this._scene.model.mario.isAlive) {
      this._scene.player?.freeze();
      this.delete();
    } else {
      /**
      if (this._scene.keys?.right.isDown) {
        //this.sprite.setVelocityX(TILE_MULT);
        this.sprite.setFlipX(false);
        //change velocity
      } else if (this._scene.keys?.left.isDown) {
        //this.sprite.setVelocityX(-TILE_MULT);
        this.sprite.setFlipX(true);
        //change velocity
      } else if (this._scene.keys?.up.isDown) {
        //change velocity
      } else {
        this.sprite.setAccelerationX(0);
      }*/
      this.sprite.setX(this._scene.model.mario.x * TILE_MULT + 16);
      this.sprite.setY(this._scene.model.mario.y * TILE_MULT + 16);
    }
  }

  freeze() {
    this._sprite.body.moves = false;
  }

  delete() {
    this._sprite.destroy();
  }
}
