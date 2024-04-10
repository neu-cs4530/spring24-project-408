import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import { chakra, Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import SpriteLevel from './Sprite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IonPhaser } from '@ion-phaser/react';
import { GameStatus } from '../../../../types/CoveyTownSocket';

export type MarioGameProps = {
  gameAreaController: MarioAreaController;
  gameStatus: GameStatus;
};

let currentGame:
  | {
      type: number;
      width: number;
      height: number;
      parent: string;
      pixelArt: boolean;
      backgroundColor: string;
      scene: SpriteLevel | undefined;
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
      scene: SpriteLevel | undefined;
      physics: { default: string; arcade: { gravity: { y: number } } };
    }
  | undefined = undefined;

/**
 * A component that renders the Mario game
 *
 * Renders the Mario game as an IonPhaser component, which is a Phaser game engine component
 *
 * The component is re-rendered whenever the level changes
 *
 * If the current player is in the game, then the player can use T (up), G (right), F (left) to move throught the game.
 * If there is an error making the move, then a toast will be
 * displayed with the error message as the description of the toast.
 *
 * @param gameAreaController the controller for the Mario game
 */
export default function App({ gameAreaController, gameStatus }: MarioGameProps): JSX.Element {
  const [level, setLevel] = useState(gameAreaController.level);

  if (gameStatus === 'WAITING_FOR_PLAYERS') {
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
  } else if (gameStatus === 'IN_PROGRESS') {
    currentGame = queuedGame;
  } else {
    if (currentGame) {
      currentGame.scene = undefined;
    }
    queuedGame = undefined;
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
        <IonPhaser game={currentGame} gameAreaController={gameAreaController} />
      </chakra.div>
    </Container>
  );
}
