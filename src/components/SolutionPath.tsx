import React from 'react';
import { Route } from 'lucide-react';
import { SolutionStep } from '../types/game';

interface SolutionPathProps {
  solutionPath: SolutionStep[];
}

export const SolutionPath: React.FC<SolutionPathProps> = ({ 
  solutionPath
}) => {
  if (solutionPath.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Route className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Solution Path</h2>
        </div>

        <div className="space-y-3">
          {solutionPath.map((step, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800">
                  {step.operation}
                </div>
                <div className="text-sm text-gray-600">
                  Remaining: {step.remainingNumbers.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};