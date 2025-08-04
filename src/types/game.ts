export interface GameState {
  numbers: number[];
  target: number;
  moves: number;
  time: number;
  isComplete: boolean;
  isPlaying: boolean;
  selectedNumbers: number[];
  selectedNumberIndices: number[];
  selectedOperation: string | null;
  solutionPath: SolutionStep[];
  difficulty: DifficultyLevel;
}

export interface SolutionStep {
  step: number;
  operation: string;
  numbers: [number, number];
  result: number;
  remainingNumbers: number[];
}

export interface UserStats {
  id: string;
  username: string;
  total_puzzles_solved: number;
  best_time: number;
  average_moves: number;
  created_at: string;
  updated_at: string;
}

export interface GameResult {
  completed: boolean;
  time: number;
  moves: number;
  solutionPath: SolutionStep[];
}

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  numberCount: number;
  numberRange: [number, number];
  targetRange: [number, number];
  operations: string[];
  name: string;
  description: string;
}