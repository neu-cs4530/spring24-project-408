import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import { chakra, Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import SpriteLevel from './Sprite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IonPhaser } from '@ion-phaser/react';

export type MarioGameProps = {
  gameAreaController: MarioAreaController;
};

let game:
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

export default function App({ gameAreaController }: MarioGameProps): JSX.Element {
  const [level, setLevel] = useState(gameAreaController.level);

  if (!game || gameAreaController.status !== 'IN_PROGRESS') {
    game = {
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
  }

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
      <chakra.div id='game-container' width='800px' height='600px'>
        <IonPhaser game={game} gameAreaController={gameAreaController} />
      </chakra.div>
    </Container>
  );
}
