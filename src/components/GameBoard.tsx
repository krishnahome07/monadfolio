import React from 'react';
import { Calculator, Target, Clock, Zap, HelpCircle } from 'lucide-react';
import { GameState } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  onNumberSelect: (index: number) => void;
  onOperationSelect: (operation: string) => void;
  onNewGame: () => void;
  onShowHelp: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onNumberSelect,
  onOperationSelect,
  onNewGame,
  onShowHelp
}) => {
  // Operations for easy mode
  const operations = ['+', '-', '*'];
  const availableNumbers = gameState.numbers;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calculator className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Number Crunch</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onShowHelp}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How to Play</span>
            </button>
            <button
              onClick={onNewGame}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              New Game
            </button>
          </div>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">{gameState.target}</div>
            <div className="text-sm text-purple-600">Target</div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">
              {Math.floor(gameState.time / 60)}:{(gameState.time % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-blue-600">Time</div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-orange-100 rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{gameState.moves}</div>
            <div className="text-sm text-green-600">Moves</div>
          </div>
        </div>
      </div>

      {/* Numbers Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Available Numbers ({availableNumbers.length})
        </h2>
        <div className={`grid gap-4 ${availableNumbers.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {availableNumbers.map((number, index) => {
            const isSelected = gameState.selectedNumberIndices.includes(index);
            
            return (
              <button
                key={`${number}-${index}`}
                onClick={() => onNumberSelect(index)}
                disabled={!gameState.isPlaying}
                className={`
                  h-16 rounded-xl text-xl font-bold transition-all duration-200 transform hover:scale-105
                  ${isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
                  }
                  ${!gameState.isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {number}
              </button>
            );
          })}
        </div>
      </div>

      {/* Operations */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Operations</h2>
        <div className="grid grid-cols-3 gap-4">
          {operations.map((op) => (
            <button
              key={op}
              onClick={() => onOperationSelect(op)}
              disabled={gameState.selectedNumbers.length !== 2 || !gameState.isPlaying}
              className={`
                h-14 rounded-xl text-2xl font-bold transition-all duration-200 transform hover:scale-105
                ${gameState.selectedOperation === op
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                  : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200'
                }
                ${gameState.selectedNumbers.length !== 2 || !gameState.isPlaying
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
                }
              `}
            >
              {op}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};