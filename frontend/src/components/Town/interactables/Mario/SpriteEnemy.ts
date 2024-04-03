import SpriteLevel from './Sprite';
import { GameUnit } from '../../../../../../townService/src/town/games/final-project-classes/GameObject';

export default class SpriteEnemy {
  _scene: SpriteLevel;

  _x: GameUnit;

  _y: GameUnit;

  _sprite;

  constructor(scene: SpriteLevel, x: GameUnit, y: GameUnit) {
    this._scene = scene;
    this._x = x;
    this._y = y;
    this._sprite = this._scene.physics.add.sprite(x, y, 'enemy', 0).setSize(18, 24).setOffset(7, 9);
  }

  update() {
    const enemy = this._scene.model.level._enemies.filter(
      currentEnemy => currentEnemy.x === this._x && currentEnemy.y === this._y,
    );
    if (!enemy[0].isAlive) {
      this.delete();
    }
  }

  delete() {
    this._sprite.destroy();
  }
}
