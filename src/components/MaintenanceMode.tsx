import React from 'react';
import { Clock, AlertTriangle, Wallet, RefreshCw } from 'lucide-react';

export const MaintenanceMode: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Monadfolio Maintenance
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          We're enhancing your Monad portfolio experience! 
          Monadfolio is currently undergoing maintenance to bring you better features and improved performance.
        </p>

        {/* Features Being Enhanced */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">What's Being Enhanced:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Portfolio visualization improvements</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Enhanced badge system</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time Monad news feed</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span>Improved wallet connectivity</span>
            </li>
          </ul>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
          <Clock className="w-4 h-4" />
          <span>Expected to be back online soon</span>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <RefreshCw className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-purple-600 font-medium">Updating systems...</span>
        </div>
        
        <div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};