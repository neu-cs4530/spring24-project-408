import SpriteLevel from './Sprite';
import { GameUnit } from '../../../../../../townService/src/town/games/final-project-classes/GameObject';

export default class SpritePlayer {
  _scene: SpriteLevel;

  _x: GameUnit;

  _y: GameUnit;

  _sprite;

  constructor(scene: SpriteLevel, x: GameUnit, y: GameUnit) {
    this._scene = scene;
    this._x = x;
    this._y = y;
    this._sprite = this._scene.physics.add
      .sprite(x, y, 'player', 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400)
      .setSize(18, 24)
      .setOffset(7, 9);
  }

  get sprite() {
    return this._sprite;
  }

  update() {
    if (!this._scene.model.mario.isAlive) {
      this._scene.player.freeze();
      this.delete();
    } else {
      if (this._scene.keys?.right.isDown) {
        this.sprite.setVelocityX(160);
        this.sprite.setFlipX(false);
        //change velocity
      } else if (this._scene.keys?.left.isDown) {
        this.sprite.setVelocityX(-160);
        this.sprite.setFlipX(true);
        //change velocity
      } else if (this._scene.keys?.up.isDown) {
        this.sprite.setVelocityY(-160);
        //change velocity
      } else {
        this.sprite.setAccelerationX(0);
      }
    }
  }

  freeze() {
    this._sprite.body.moves = false;
  }

  delete() {
    this._sprite.destroy();
  }
}
