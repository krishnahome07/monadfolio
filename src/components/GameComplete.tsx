import React from 'react';
import { Trophy, Clock, Zap, Share2, RotateCcw, Star, Flame, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { formatTime, DIFFICULTY_CONFIGS } from '../utils/gameLogic';
import { DifficultyLevel } from '../types/game';

interface GameCompleteProps {
  time: number;
  moves: number;
  target: number;
  difficulty: DifficultyLevel;
  onNewGame: () => void;
  onShare: () => void;
  shareStatus?: 'idle' | 'sharing' | 'success' | 'error';
}

export const GameComplete: React.FC<GameCompleteProps> = ({
  time,
  moves,
  target,
  difficulty,
  onNewGame,
  onShare,
  shareStatus = 'idle'
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const difficultyIcon = difficulty === 'easy' ? <Star className="w-6 h-6" /> : 
                        difficulty === 'medium' ? <Zap className="w-6 h-6" /> : 
                        <Flame className="w-6 h-6" />;
  
  const difficultyColor = difficulty === 'easy' ? 'from-green-400 via-emerald-500 to-teal-600' :
                         difficulty === 'medium' ? 'from-yellow-400 via-orange-500 to-red-600' :
                         'from-red-400 via-pink-500 to-purple-600';

  const getShareButtonContent = () => {
    switch (shareStatus) {
      case 'sharing':
        return (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Sharing...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Shared!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Share2 className="w-5 h-5" />
            <span>Share Result</span>
          </>
        );
    }
  };

  const getShareButtonStyle = () => {
    switch (shareStatus) {
      case 'success':
        return 'bg-green-500 bg-opacity-30 hover:bg-opacity-40';
      case 'error':
        return 'bg-red-500 bg-opacity-30 hover:bg-opacity-40';
      default:
        return 'bg-white bg-opacity-20 hover:bg-opacity-30';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`bg-gradient-to-r ${difficultyColor} rounded-2xl shadow-xl p-8 text-white text-center`}>
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
        <h1 className="text-3xl font-bold mb-2">Puzzle Complete!</h1>
        <div className="flex items-center justify-center space-x-2 mb-4">
          {difficultyIcon}
          <p className="text-xl">{config.name} • Target: {target}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{formatTime(time)}</div>
            <div className="text-sm opacity-90">Time</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{moves}</div>
            <div className="text-sm opacity-90">Moves</div>
          </div>
        </div>

        <div className="flex space-x-4 justify-center">
          <button
            onClick={onShare}
            disabled={shareStatus === 'sharing'}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${getShareButtonStyle()} ${shareStatus === 'sharing' ? 'cursor-not-allowed' : ''}`}
          >
            {getShareButtonContent()}
          </button>
          <button
            onClick={onNewGame}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};