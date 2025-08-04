import React from 'react';
import { X, Target, Lightbulb } from 'lucide-react';

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-xl relative">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <h2 className="text-xl font-bold">How to Play</h2>
            </div>
          </div>
          {/* Close button - More prominent */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
          >
            <X className="w-4 h-4 text-white font-bold" strokeWidth={3} />
          </button>
        </div>

        {/* Content - Compact */}
        <div className="p-4 space-y-4">
          {/* Simple Instructions */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <h3 className="text-base font-semibold text-gray-800">Simple Rules</h3>
            </div>
            
            <div className="space-y-1 text-sm text-gray-700">
              <p>1. <strong>Select 2 numbers</strong> from available set</p>
              <p>2. <strong>Choose operation</strong> (+, -, ×) to combine</p>
              <p>3. <strong>Result replaces</strong> the two selected numbers</p>
              <p>4. <strong>Repeat until</strong> you create target number</p>
              <p>5. <strong>Win!</strong> Complete in fewest moves & time</p>
            </div>
          </div>

          {/* Example - Compact */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Example</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Numbers:</strong> [3, 5, 2, 8] → <strong>Target:</strong> 10</p>
              <div className="bg-white rounded p-2 mt-2 space-y-1">
                <p>Step 1: Select 3 + 5 = 8</p>
                <p>Now: [8, 2, 8]</p>
                <p>Step 2: Select 8 + 2 = 10 ✅</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="bg-gray-50 p-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg text-base font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Got it! Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};