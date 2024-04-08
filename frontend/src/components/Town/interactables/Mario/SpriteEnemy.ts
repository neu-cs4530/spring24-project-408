import SpriteLevel from './Sprite';
import { GameUnit } from './final-project-classes/GameObject';
import { TILE_MULT } from './Sprite';
export default class SpriteEnemy {
  _scene: SpriteLevel;

  _x: GameUnit;

  _y: GameUnit;

  _sprite;

  constructor(scene: SpriteLevel, x: GameUnit, y: GameUnit) {
    this._scene = scene;
    this._x = x + 16;
    this._y = y + 16;
    this._sprite = this._scene.physics.add.sprite(this._x, this._y, 'enemy').setSize(16, 16);
  }

  update() {
    const enemy = this._scene.model.level._enemies.filter(
      currentEnemy =>
        currentEnemy.x === (this._x - 16) / TILE_MULT &&
        currentEnemy.y === (this._y - 16) / TILE_MULT,
    );

    if (enemy[0]) {
      if (!enemy[0].isAlive) {
        this.delete();
      }
    }
  }

  delete() {
    this._sprite.destroy();
  }
}
