import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import { chakra, Container, List, ListItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import SpriteLevel from './Sprite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IonPhaser } from '@ion-phaser/react';

export type MarioGameProps = {
  gameAreaController: MarioAreaController;
};

let currentGame:
  | {
      type: number;
      width: number;
      height: number;
      parent: string;
      pixelArt: boolean;
      backgroundColor: string;
      scene: SpriteLevel;
      physics: { default: string; arcade: { gravity: { y: number } } };
    }
  | undefined = undefined;

let queuedGame:
  | {
      type: number;
      width: number;
      height: number;
      parent: string;
      pixelArt: boolean;
      backgroundColor: string;
      scene: SpriteLevel;
      physics: { default: string; arcade: { gravity: { y: number } } };
    }
  | undefined = undefined;

/*let scene: SpriteLevel | undefined = undefined;*/
export default function App({ gameAreaController }: MarioGameProps): JSX.Element {
  const [level, setLevel] = useState(gameAreaController.level);

  if (gameAreaController.status !== 'IN_PROGRESS') {
    currentGame = undefined;
    queuedGame = {
      type: Phaser.AUTO,
      width: 416,
      height: 248,
      parent: 'game-container',
      pixelArt: false,
      backgroundColor: '#ffffff',
      scene: new SpriteLevel(gameAreaController),
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
    };
  } else {
    currentGame = queuedGame;
  }
  /*
  if (!game) {
    scene = new SpriteLevel(gameAreaController);
    game = {
      type: Phaser.AUTO,
      width: 416,
      height: 248,
      parent: 'game-container',
      pixelArt: false,
      backgroundColor: '#ffffff',
      scene: scene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
    };
  } else {
    scene = undefined;
  }*/

  /*
  if (!scene) {
    scene = new SpriteLevel(gameAreaController);
  }

  const game = {
    type: Phaser.AUTO,
    width: 416,
    height: 248,
    parent: 'game-container',
    pixelArt: false,
    backgroundColor: '#ffffff',
    scene: scene,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
      },
    },
  };*/

  useEffect(() => {
    const levelChanged = () => {
      setLevel(gameAreaController.level);
    };
    gameAreaController.addListener('levelChanged', levelChanged);
    return () => {
      gameAreaController.removeListener('levelChanged', levelChanged);
    };
  }, [gameAreaController]);

  return (
    <Container>
      <List aria-label='debug statements'>
        <ListItem>PLEASE PLEASE PLEASE</ListItem>
      </List>
      <chakra.div id='game-container' width='800px' height='600px'>
        <IonPhaser game={currentGame} gameAreaController={gameAreaController} />
      </chakra.div>
    </Container>
  );
}
