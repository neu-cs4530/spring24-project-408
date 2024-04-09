import { Button, List, ListItem, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameStatus, InteractableID } from '../../../../types/CoveyTownSocket';
import App from './MarioDisplay';

/**
 * The MarioArea component renders the Mario game area.
 * It renders the current state of the area, optionally allowing the player to join the game.
 *
 * It uses Chakra-UI components (does not use other GUI widgets)
 *
 * It uses the MarioAreaController to get the current state of the game.
 * It listens for the 'gameUpdated' and 'gameEnd' events on the controller, and re-renders accordingly.
 * It subscribes to these events when the component mounts, and unsubscribes when the component unmounts. It also unsubscribes when the gameAreaController changes.
 *
 * It renders the following:
 * - A list of players' usernames (in a list with the aria-label 'list of players in the game')
 *    - If there is no player in the game, the username is '(No player yet!)'
 *    - List the players as (exactly) `Mario: ${username}`
 * - A message indicating the current game status:
 *    - If the game is in progress, the message is 'Game in progress, {moveCount} moves in'.
 *    - If the game is in status WAITING_FOR_PLAYERS, the message is 'Waiting for players to join'
 *    - If the game is in status OVER, the message is 'Game over'
 * - If the game is in status WAITING_FOR_PLAYERS, a button to join the game is displayed, with the text 'Join New Game'
 *    - Clicking the button calls the joinGame method on the gameAreaController
 *    - Before calling joinGame method, the button is disabled and has the property isLoading set to true, and is re-enabled when the method call completes
 *    - If the method call fails, a toast is displayed with the error message as the description of the toast (and status 'error')
 *    - Once the player joins the game, the button dissapears
 * - The App component, which is passed the current gameAreaController as a prop (@see MarioDisplay.tsx)
 *
 * - When the game ends, a toast is displayed with the result of the game:
 *    - Our player won: description 'You won!'
 *    - Our player lost: description 'You lost :('
 *
 */
export default function MarioArea({
  interactableID,
}: {
  interactableID: InteractableID;
}): JSX.Element {
  const gameAreaController = useInteractableAreaController<MarioAreaController>(interactableID);
  const townController = useTownController();
  const [player, setPlayer] = useState<PlayerController | undefined>(gameAreaController.player);
  const [joiningGame, setJoiningGame] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING_FOR_PLAYERS');
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
      if (winner === townController.ourPlayer) {
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
    gameStatusText = (
      <>
        Game in progress, {gameAreaController.level._mario.x}, {gameAreaController.level._mario._y}{' '}
        moves in!{' '}
      </>
    );
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

    if (gameStatus === 'OVER') {
      gameStatusText = <b>Game over! Come back if youd like! Bye bye!</b>;
    } else {
      gameStatusText = <b>Its a me Mario! Reach the end if you can! {joinGameButton}</b>;
    }
  }

  return (
    <>
      {gameStatusText}
      <List aria-label='list of players in the game'>
        <ListItem>Mario: {player?.userName || '(No player yet!)'}</ListItem>
      </List>
      <App gameAreaController={gameAreaController} />
    </>
  );
}
