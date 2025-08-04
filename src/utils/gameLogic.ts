import { GameState, SolutionStep, DifficultyLevel, DifficultyConfig } from '../types/game';

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    numberCount: 4,
    numberRange: [1, 10],
    targetRange: [10, 50],
    operations: ['+', '-', '*'],
    name: 'Easy',
    description: 'Small numbers, basic operations'
  },
  medium: {
    numberCount: 5,
    numberRange: [1, 15],
    targetRange: [20, 100],
    operations: ['+', '-', '*'],
    name: 'Medium',
    description: 'Medium numbers, basic operations'
  },
  hard: {
    numberCount: 6,
    numberRange: [1, 25],
    targetRange: [50, 500],
    operations: ['+', '-', '*', '/'],
    name: 'Hard',
    description: 'Large numbers, all operations'
  }
};

// Get all possible results from a set of numbers
const getAllPossibleResults = (numbers: number[], operations: string[]): Set<number> => {
  const results = new Set<number>();
  
  numbers.forEach(num => results.add(num));
  
  const findCombinations = (nums: number[], depth: number = 0): void => {
    if (depth > 8 || nums.length <= 1) return;
    
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const num1 = nums[i];
        const num2 = nums[j];
        
        for (const op of operations) {
          const result = performOperation(num1, num2, op);
          if (result > 0 && result <= 1000 && Number.isInteger(result) && Number.isFinite(result)) {
            results.add(result);
            
            const newNums = nums.filter((_, idx) => idx !== i && idx !== j);
            newNums.push(result);
            
            findCombinations(newNums, depth + 1);
          }
        }
      }
    }
  };
  
  findCombinations(numbers);
  return results;
};

// Generate a solvable puzzle
const generateSolvablePuzzle = (difficulty: DifficultyLevel): { numbers: number[], target: number } => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const maxAttempts = 50;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const numbers: number[] = [];
    for (let i = 0; i < config.numberCount; i++) {
      const num = Math.floor(Math.random() * (config.numberRange[1] - config.numberRange[0] + 1)) + config.numberRange[0];
      if (Number.isInteger(num) && num > 0 && num <= 100) {
        numbers.push(num);
      }
    }
    
    if (numbers.length !== config.numberCount) continue;
    
    const possibleResults = getAllPossibleResults(numbers, config.operations);
    
    const validTargets = Array.from(possibleResults).filter(
      result => result >= config.targetRange[0] && result <= config.targetRange[1] && !numbers.includes(result)
    );
    
    if (validTargets.length > 0) {
      const target = validTargets[Math.floor(Math.random() * validTargets.length)];
      return { numbers, target };
    }
  }
  
  // Fallback puzzle
  const num1 = Math.floor(Math.random() * 8) + 2;
  const num2 = Math.floor(Math.random() * 8) + 2;
  const num3 = Math.floor(Math.random() * 5) + 1;
  const num4 = Math.floor(Math.random() * 5) + 1;
  
  const numbers = [num1, num2, num3, num4];
  const target = num1 + num2;
  
  return { numbers, target };
};

export const generatePuzzle = (difficulty: DifficultyLevel = 'easy'): { numbers: number[], target: number } => {
  return generateSolvablePuzzle(difficulty);
};

export const performOperation = (
  num1: number, 
  num2: number, 
  operation: string
): number => {
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    return 0;
  }
  
  if (num1 < 0 || num2 < 0 || num1 > 10000 || num2 > 10000) {
    return 0;
  }

  switch (operation) {
    case '+':
      const sum = num1 + num2;
      return Number.isFinite(sum) && sum <= 10000 ? sum : 0;
    case '-':
      const diff = Math.abs(num1 - num2);
      return Number.isFinite(diff) ? diff : 0;
    case '*':
      const product = num1 * num2;
      return Number.isFinite(product) && product <= 10000 ? product : 0;
    case '/':
      if (num2 === 0) return 0;
      const quotient = num1 > num2 ? Math.floor(num1 / num2) : Math.floor(num2 / num1);
      return Number.isFinite(quotient) && quotient > 0 ? quotient : 0;
    default:
      return 0;
  }
};

export const applyOperation = (
  gameState: GameState,
  operation: string
): GameState => {
  if (gameState.selectedNumbers.length !== 2 || gameState.selectedNumberIndices.length !== 2) {
    return gameState;
  }

  const [num1, num2] = gameState.selectedNumbers;
  const [index1, index2] = gameState.selectedNumberIndices;
  
  if (!DIFFICULTY_CONFIGS[gameState.difficulty].operations.includes(operation)) {
    return gameState;
  }
  
  const result = performOperation(num1, num2, operation);
  
  if (result === 0 && operation !== '-') {
    return gameState;
  }
  
  const newNumbers = [...gameState.numbers];
  
  const sortedIndices = [index1, index2].sort((a, b) => b - a);
  sortedIndices.forEach(index => {
    newNumbers.splice(index, 1);
  });
  
  newNumbers.push(result);

  const solutionStep: SolutionStep = {
    step: gameState.moves + 1,
    operation: `${num1} ${operation} ${num2} = ${result}`,
    numbers: [num1, num2],
    result,
    remainingNumbers: [...newNumbers]
  };

  const isComplete = newNumbers.includes(gameState.target);

  return {
    ...gameState,
    numbers: newNumbers,
    moves: gameState.moves + 1,
    selectedNumbers: [],
    selectedNumberIndices: [],
    selectedOperation: null,
    isComplete,
    isPlaying: !isComplete,
    solutionPath: [...gameState.solutionPath, solutionStep]
  };
};

export const formatTime = (seconds: number): string => {
  if (!Number.isInteger(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const generateShareText = (
  target: number,
  moves: number,
  time: number,
  solutionPath: SolutionStep[],
  difficulty: DifficultyLevel,
  totalPuzzlesSolved?: number
): string => {
  if (!Number.isInteger(target) || !Number.isInteger(moves) || !Number.isInteger(time)) {
    return 'Invalid game data';
  }
  
  if (!DIFFICULTY_CONFIGS[difficulty]) {
    difficulty = 'easy';
  }
  
  const timeStr = formatTime(time);
  
  let shareText = `🔢 Number Crunch Puzzle 🔢\n\n`;
  
  if (totalPuzzlesSolved && totalPuzzlesSolved > 0) {
    shareText += `✅ Successfully completed!\n`;
    shareText += `🏆 Total puzzles solved: ${totalPuzzlesSolved}\n\n`;
  }
  
  shareText += `🎯 Target: ${target}\n`;
  shareText += `⏱️ Time: ${timeStr}\n`;
  shareText += `🎮 Moves: ${moves}\n\n`;
  shareText += `📝 Solution Path:\n`;
  
  const limitedPath = solutionPath.slice(0, 10);
  limitedPath.forEach(step => {
    const sanitizedOperation = step.operation.replace(/[<>\"'&]/g, '');
    shareText += `${step.step}. ${sanitizedOperation}\n`;
  });
  
  if (solutionPath.length > 10) {
    shareText += `... and ${solutionPath.length - 10} more steps\n`;
  }
  
  shareText += `#NumberCrunch #MathPuzzle #Farcaster`;
  
  return shareText;
};