import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types/game';
import { generatePuzzle, applyOperation } from '../utils/gameLogic';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    numbers: [],
    target: 0,
    moves: 0,
    time: 0,
    isComplete: false,
    isPlaying: false,
    selectedNumbers: [],
    selectedNumberIndices: [],
    selectedOperation: null,
    solutionPath: [],
    difficulty: 'easy' // Always use easy difficulty
  });

  const startNewGame = useCallback(() => {
    // Always generate easy puzzles
    const { numbers, target } = generatePuzzle('easy');
    setGameState(prev => ({
      ...prev,
      numbers,
      target,
      moves: 0,
      time: 0,
      isComplete: false,
      isPlaying: true,
      selectedNumbers: [],
      selectedNumberIndices: [],
      selectedOperation: null,
      solutionPath: [],
      difficulty: 'easy'
    }));
  }, []);

  const selectNumber = useCallback((index: number) => {
    if (!gameState.isPlaying) return;

    setGameState(prevState => {
      const { selectedNumberIndices, numbers } = prevState;
      
      if (selectedNumberIndices.includes(index)) {
        // Deselect number by removing its index
        const newIndices = selectedNumberIndices.filter(i => i !== index);
        const newNumbers = newIndices.map(i => numbers[i]);
        return {
          ...prevState,
          selectedNumberIndices: newIndices,
          selectedNumbers: newNumbers
        };
      } else if (selectedNumberIndices.length < 2) {
        // Select number by adding its index
        const newIndices = [...selectedNumberIndices, index];
        const newNumbers = newIndices.map(i => numbers[i]);
        return {
          ...prevState,
          selectedNumberIndices: newIndices,
          selectedNumbers: newNumbers
        };
      }
      
      return prevState;
    });
  }, [gameState.isPlaying]);

  const selectOperation = useCallback((operation: string) => {
    if (!gameState.isPlaying || gameState.selectedNumbers.length !== 2) return;

    setGameState(prevState => {
      const newState = applyOperation(prevState, operation);
      return newState;
    });
  }, [gameState.isPlaying, gameState.selectedNumbers.length]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying) {
      interval = setInterval(() => {
        setGameState(prevState => ({
          ...prevState,
          time: prevState.time + 1
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState.isPlaying]);

  // Initialize game on mount with easy difficulty
  useEffect(() => {
    startNewGame();
  }, []);

  return {
    gameState,
    startNewGame,
    selectNumber,
    selectOperation
  };
};