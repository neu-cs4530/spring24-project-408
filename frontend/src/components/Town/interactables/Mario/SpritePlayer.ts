import SpriteLevel from './Sprite';
import { GameUnit } from './final-project-classes/GameObject';
import { TILE_MULT } from './Sprite';
/**
 * A class that represents the player sprite in the Mario game
 *
 * @param scene the scene for the Mario game
 * @param x the x position of the player
 * @param y the y position of the player
 */
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

  /**
   * Get the sprite of the player
   */
  get sprite() {
    return this._sprite;
  }

  /**
   * Update the player sprite
   *
   * If the player is not alive, then the sprite is deleted
   * Else, the sprite is updated to the current position of the player
   */
  update() {
    if (!this._scene.model.mario.isAlive) {
      this.delete();
    } else {
      this.sprite.setX(this._scene.model.mario.x * TILE_MULT + 16);
      this.sprite.setY(this._scene.model.mario.y * TILE_MULT + 16);
    }
  }

  /**
   * Delete the player sprite
   */
  delete() {
    this._sprite.destroy();
  }
}
