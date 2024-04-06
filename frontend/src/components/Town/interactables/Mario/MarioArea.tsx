import { Button, List, ListItem, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameStatus, InteractableID } from '../../../../types/CoveyTownSocket';
import App from './MarioDisplay';

export default function MarioArea({
  interactableID,
}: {
  interactableID: InteractableID;
}): JSX.Element {
  const gameAreaController = useInteractableAreaController<MarioAreaController>(interactableID);
  const townController = useTownController();
  const [player, setPlayer] = useState<PlayerController | undefined>(gameAreaController.player);
  const [joiningGame, setJoiningGame] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(gameAreaController.status);
  const [moveCount, setMoveCount] = useState<number>(gameAreaController.moveCount);
  const toast = useToast();

  useEffect(() => {
    const gameUpdated = () => {
      setGameStatus(gameAreaController.status);
      setPlayer(gameAreaController.player);
      setMoveCount(gameAreaController.moveCount);
    };
    const gameEnd = () => {
      const winner = gameAreaController.winner;
      if (!winner && !player) {
        toast({
          title: 'Game over',
          description: 'Player left game',
          status: 'info',
        });
      } else if (winner === townController.ourPlayer) {
        toast({
          title: 'Game over',
          description: 'You won!',
          status: 'success',
        });
      } else {
        toast({
          title: 'Game over',
          description: `You lost :(`,
          status: 'error',
        });
      }
    };
    gameAreaController.addListener('gameUpdated', gameUpdated);
    gameAreaController.addListener('gameEnd', gameEnd);
    return () => {
      gameAreaController.removeListener('gameUpdated', gameUpdated);
      gameAreaController.removeListener('gameEnd', gameEnd);
    };
  }, [townController, gameAreaController, toast]);

  let gameStatusText = <></>;
  if (gameStatus === 'IN_PROGRESS') {
    gameStatusText = <>Game in progress, {gameAreaController.level.toString()} moves in, go save Peach! </>;
  } else {
    const joinGameButton = (
      <Button
        onClick={async () => {
          setJoiningGame(true);
          try {
            await gameAreaController.joinGame();
          } catch (err) {
            toast({
              title: 'Error joining game',
              description: (err as Error).toString(),
              status: 'error',
            });
          }
          setJoiningGame(false);
        }}
        isLoading={joiningGame}
        disabled={joiningGame}>
        Join New Game
      </Button>
    );

    let gameStatusStr;
    if (gameStatus === 'OVER') gameStatusStr = 'over';
    else if (gameStatus === 'WAITING_FOR_PLAYERS') gameStatusStr = 'waiting for players to join';
    gameStatusText = (
      <b>
        Game {gameStatusStr}. {joinGameButton}
      </b>
    );
  }

  return (
    <>
      {gameStatusText}
      <List aria-label='list of players in the game'>
        <ListItem>Mario: {player?.userName || '(No player yet!)'}</ListItem>
        <ListItem>Status of Controller: {gameAreaController.status}</ListItem>
      </List>
      <App gameAreaController={gameAreaController} />
    </>
  );
}

//<ConnectFourBoard gameAreaController={gameAreaController} />
//<div id='game-container' />
//<script src='https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js'></script>
//<script src='./index.ts' type='module'></script>
