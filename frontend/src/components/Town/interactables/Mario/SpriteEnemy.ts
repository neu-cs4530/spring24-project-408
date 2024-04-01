import Phaser from 'phaser';
import { Level } from '../../../../../../townService/src/town/games/final-project-classes/Level';
import { MainCharacter, Enemy, Goomba } from '../../../../../../townService/src/town/games/final-project-classes/Character';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import SpriteLevel from './Sprite';
import { GameUnit } from '../../../../../../townService/src/town/games/final-project-classes/GameObject';
import { throws } from 'assert';

export default class SpriteEnemy {
    _scene: SpriteLevel;

    _x: GameUnit;

    _y: GameUnit;

    _sprite;

    constructor(scene: SpriteLevel, x: GameUnit, y: GameUnit) {
        this._scene = scene;
        this._x = x;
        this._y = y;
        this._sprite = this._scene.physics.add
        .sprite(x, y, "enemy", 0)
        .setDrag(1000,0)
        .setMaxVelocity(300,400)
        .setSize(18, 24)
        .setOffset(7, 9);
    }

    create() {
        
    }

    update() {
        const enemy = this._scene.model.level._enemies.filter(currentEnemy => currentEnemy.x === this._x && currentEnemy.y === this._y);
        if(!enemy.isAlive) {
            this.delete();
        }
    }

    delete() {
        this._sprite.destroy();
    }




}