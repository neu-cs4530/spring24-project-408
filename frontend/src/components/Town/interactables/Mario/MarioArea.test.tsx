import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { mock, mockReset } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { act } from 'react-dom/test-utils';
import React from 'react';
import MarioAreaController from '../../../../classes/interactable/MarioAreaController';
import PlayerController from '../../../../classes/PlayerController';
import TownController, * as TownControllerHooks from '../../../../classes/TownController';
import TownControllerContext from '../../../../contexts/TownControllerContext';
import { randomLocation } from '../../../../TestUtils';
import { MarioGameState, GameArea, GameStatus } from '../../../../types/CoveyTownSocket';
import PhaserGameArea from '../GameArea';
import MarioArea from './MarioArea';
import * as MarioDisplay from './MarioDisplay';
import { GameCell, Level, LevelOne } from './final-project-classes/Level';
import { MainCharacter } from './final-project-classes/Character';

const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const ui = jest.requireActual('@chakra-ui/react');
  const mockUseToast = () => mockToast;
  return {
    ...ui,
    useToast: mockUseToast,
  };
});
const mockGameArea = mock<PhaserGameArea>();
mockGameArea.getData.mockReturnValue('ConnectFour');
jest.spyOn(TownControllerHooks, 'useInteractable').mockReturnValue(mockGameArea);
const useInteractableAreaControllerSpy = jest.spyOn(
  TownControllerHooks,
  'useInteractableAreaController',
);

const levelComponentSpy = jest.spyOn(MarioDisplay, 'default');
levelComponentSpy.mockReturnValue(<div data-testid='board' />);
class MockMarioController extends MarioAreaController {
  makeMove = jest.fn();

  joinGame = jest.fn();

  startGame = jest.fn();

  mockIsPlayer = false;

  mockIsOurTurn = false;

  mockMoveCount = 0;

  mockLevel: Level = new LevelOne(new MainCharacter(0, 3));

  mockWinner: PlayerController | undefined = undefined;

  mockStatus: GameStatus = 'WAITING_TO_START';

  mockPlayer: PlayerController | undefined = undefined;

  mockCurrentGame: GameArea<MarioGameState> | undefined = undefined;

  mockGamePiece: 'Mario' | undefined = undefined;

  mockIsActive = false;

  public constructor() {
    super(nanoid(), mock<GameArea<MarioGameState>>(), mock<TownController>());
    this.mockClear();
  }

  /*
      For ease of testing, we will mock the board property
      to return a copy of the mockLevel property, so that
      we can change the mockLevel property and then check
      that the board property is updated correctly.
      */
  get level(): Level {
    return this.mockLevel;
  }

  get isPlayer() {
    return this.mockIsPlayer;
  }

  get player(): PlayerController | undefined {
    return this.mockPlayer;
  }

  get winner(): PlayerController | undefined {
    return this.mockWinner;
  }

  get gamePiece(): string {
    return this.mockGamePiece || '';
  }

  get status(): GameStatus {
    return this.mockStatus;
  }

  isEmpty(): boolean {
    return this.mockPlayer === undefined;
  }

  public isActive(): boolean {
    return this.mockIsActive;
  }

  public mockClear() {
    this.mockLevel._mario._health = 3;
    this.mockLevel.restartLevel();
  }
}

describe('MarioArea', () => {
  let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParms: any[]]>;
  beforeAll(() => {
    // Spy on console.error and intercept react key warnings to fail test
    consoleErrorSpy = jest.spyOn(global.console, 'error');
    consoleErrorSpy.mockImplementation((message?, ...optionalParams) => {
      const stringMessage = message as string;
      if (stringMessage.includes && stringMessage.includes('children with the same key,')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      } else if (stringMessage.includes && stringMessage.includes('warning-keys')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      }
      // eslint-disable-next-line no-console -- we are wrapping the console with a spy to find react warnings
      console.warn(message, ...optionalParams);
    });
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  let ourPlayer: PlayerController;
  const townController = mock<TownController>();
  Object.defineProperty(townController, 'ourPlayer', { get: () => ourPlayer });
  let gameAreaController = new MockMarioController();
  let joinGameResolve: () => void;
  let joinGameReject: (err: Error) => void;

  function renderMarioArea() {
    return render(
      <ChakraProvider>
        <TownControllerContext.Provider value={townController}>
          <MarioArea interactableID={nanoid()} />
        </TownControllerContext.Provider>
      </ChakraProvider>,
    );
  }
  beforeEach(() => {
    ourPlayer = new PlayerController('player x', 'player x', randomLocation());
    mockGameArea.name = nanoid();
    mockReset(townController);
    gameAreaController.mockClear();
    useInteractableAreaControllerSpy.mockReturnValue(gameAreaController);
    mockToast.mockClear();
    gameAreaController.joinGame.mockReset();
    gameAreaController.makeMove.mockReset();

    gameAreaController.joinGame.mockImplementation(
      () =>
        new Promise<void>((resolve, reject) => {
          joinGameResolve = resolve;
          joinGameReject = reject;
        }),
    );
    describe('[T3.1] Game Update Listeners', () => {
      it('Registers exactly one listener for gameUpdated and gameEnd events', () => {
        const addListenerSpy = jest.spyOn(gameAreaController, 'addListener');
        addListenerSpy.mockClear();

        renderMarioArea();
        expect(addListenerSpy).toBeCalledTimes(2);
        expect(addListenerSpy).toHaveBeenCalledWith('gameUpdated', expect.any(Function));
        expect(addListenerSpy).toHaveBeenCalledWith('gameEnd', expect.any(Function));
      });
      it('Does not register a listener on every render', () => {
        const removeListenerSpy = jest.spyOn(gameAreaController, 'removeListener');
        const addListenerSpy = jest.spyOn(gameAreaController, 'addListener');
        addListenerSpy.mockClear();
        removeListenerSpy.mockClear();
        const renderData = renderMarioArea();
        expect(addListenerSpy).toBeCalledTimes(2);
        addListenerSpy.mockClear();

        renderData.rerender(
          <ChakraProvider>
            <TownControllerContext.Provider value={townController}>
              <MarioArea interactableID={nanoid()} />
            </TownControllerContext.Provider>
          </ChakraProvider>,
        );

        expect(addListenerSpy).not.toBeCalled();
        expect(removeListenerSpy).not.toBeCalled();
      });
      it('Removes all listeners on unmount', () => {
        const removeListenerSpy = jest.spyOn(gameAreaController, 'removeListener');
        const addListenerSpy = jest.spyOn(gameAreaController, 'addListener');
        addListenerSpy.mockClear();
        removeListenerSpy.mockClear();
        const renderData = renderMarioArea();
        expect(addListenerSpy).toBeCalledTimes(2);
        const addedListeners = addListenerSpy.mock.calls;
        const addedGameUpdateListener = addedListeners.find(call => call[0] === 'gameUpdated');
        const addedGameEndedListener = addedListeners.find(call => call[0] === 'gameEnd');
        expect(addedGameEndedListener).toBeDefined();
        expect(addedGameUpdateListener).toBeDefined();
        renderData.unmount();
        expect(removeListenerSpy).toBeCalledTimes(2);
        const removedListeners = removeListenerSpy.mock.calls;
        const removedGameUpdateListener = removedListeners.find(call => call[0] === 'gameUpdated');
        const removedGameEndedListener = removedListeners.find(call => call[0] === 'gameEnd');
        expect(removedGameUpdateListener).toEqual(addedGameUpdateListener);
        expect(removedGameEndedListener).toEqual(addedGameEndedListener);
      });
      it('Creates new listeners if the gameAreaController changes', () => {
        const removeListenerSpy = jest.spyOn(gameAreaController, 'removeListener');
        const addListenerSpy = jest.spyOn(gameAreaController, 'addListener');
        addListenerSpy.mockClear();
        removeListenerSpy.mockClear();
        const renderData = renderMarioArea();
        expect(addListenerSpy).toBeCalledTimes(2);

        gameAreaController = new MockMarioController();
        const removeListenerSpy2 = jest.spyOn(gameAreaController, 'removeListener');
        const addListenerSpy2 = jest.spyOn(gameAreaController, 'addListener');

        useInteractableAreaControllerSpy.mockReturnValue(gameAreaController);
        renderData.rerender(
          <ChakraProvider>
            <TownControllerContext.Provider value={townController}>
              <MarioArea interactableID={nanoid()} />
            </TownControllerContext.Provider>
          </ChakraProvider>,
        );
        expect(removeListenerSpy).toBeCalledTimes(2);

        expect(addListenerSpy2).toBeCalledTimes(2);
        expect(removeListenerSpy2).not.toBeCalled();
      });
    });
  });
});
