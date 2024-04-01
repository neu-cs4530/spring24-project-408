import Phaser from 'phaser';
import { Level } from '../../../../../../townService/src/town/games/final-project-classes/Level';
import { MainCharacter } from '../../../../../../townService/src/town/games/final-project-classes/Character';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import SpriteLevel from './Sprite';
import { GameUnit } from '../../../../../../townService/src/town/games/final-project-classes/GameObject';
import { throws } from 'assert';

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
        .sprite(x, y, "player", 0)
        .setDrag(1000,0)
        .setMaxVelocity(300,400)
        .setSize(18, 24)
        .setOffset(7, 9);
    }

    create() {
        
    }

    update() {
        if(!this._scene.model.mario.isAlive) {
            this._scene.player.freeze();
            this.delete();
        } else {
            if(this._scene.keys?.right.isDown) {
                //change velocity
            } else if (this._scene.keys?.left.isDown) {
                //change velocity
            } else if (this._scene.keys?.up.isDown) {
                //change velocity
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