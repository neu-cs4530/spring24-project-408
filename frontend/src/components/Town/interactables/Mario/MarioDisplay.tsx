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

export default function App({ gameAreaController }: MarioGameProps): JSX.Element {
  const [level, setLevel] = useState(gameAreaController.level);
  const game = {
    type: Phaser.AUTO,
    width: 500,
    height: 400,
    parent: 'game-container',
    pixelArt: false,
    backgroundColor: '#079BB0',
    scene: new SpriteLevel(gameAreaController),
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1000 },
      },
    },
  };

  useEffect(() => {
    const levelUpdated = () => {
      setLevel(gameAreaController.level);
    };
    gameAreaController.addListener('levelUpdated', levelUpdated);
    return () => {
      gameAreaController.removeListener('levelUpdated', levelUpdated);
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
