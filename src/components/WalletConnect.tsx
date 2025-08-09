import React, { useState } from 'react';
import { Wallet, Zap, Shield, Users, Search } from 'lucide-react';
import { validateMonadAddress, connectWallet, checkAndSwitchToMonad } from '../utils/monadApi';
import type { Context } from '@farcaster/frame-core';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  isInFarcaster: boolean;
  farcasterUser?: Context.User;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  isInFarcaster,
  farcasterUser
}) => {
  const [manualAddress, setManualAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);

  const handleAutoConnect = async () => {
    setIsValidating(true);
    setError(null);
    
    try {
      console.log('🔌 Attempting auto wallet connection...');
      
      // First check and switch to Monad network
      const networkSwitched = await checkAndSwitchToMonad();
      if (!networkSwitched) {
        setError('Please switch to Monad Testnet to continue');
        return;
      }
      
      // Try to connect to wallet
      const address = await connectWallet();
      
      if (address) {
        console.log('✅ Wallet connected:', address);
        onConnect(address);
      } else {
        // If no wallet available, generate a demo address for testing
        const demoAddress = farcasterUser 
          ? `0x${farcasterUser.fid.toString().padStart(40, '0')}`
          : `0x${'1234567890abcdef'.repeat(2).padStart(40, '0')}`;
        
        console.log('🎭 Using demo address:', demoAddress);
        onConnect(demoAddress);
      }
    } catch (err) {
      console.error('❌ Auto-connect failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsValidating(false);
    }
  };

  const handleManualConnect = async () => {
    setError(null);
    
    if (!manualAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateMonadAddress(manualAddress)) {
      setError('Please enter a valid Monad wallet address');
      return;
    }

    console.log('📝 Manual address entered:', manualAddress);
    onConnect(manualAddress.trim());
  };

  const handleSearchAddress = () => {
    setSearchMode(true);
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Monad Wallet</h2>
          <p className="text-purple-100">
            {isInFarcaster 
              ? "Your Farcaster profile is ready! Connect your wallet to see your portfolio."
              : "Search any Monad address or connect your wallet to explore portfolios."
            }
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Farcaster User Info */}
        {isInFarcaster && farcasterUser && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              {farcasterUser.pfpUrl ? (
                <img
                  src={farcasterUser.pfpUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-800">
                  {farcasterUser.displayName || farcasterUser.username || `User ${farcasterUser.fid}`}
                </div>
                {farcasterUser.username && (
                  <div className="text-sm text-gray-600">@{farcasterUser.username}</div>
                )}
              </div>
            </div>
            <p className="text-sm text-purple-600 mt-2">✨ Your Farcaster profile will enhance your portfolio experience!</p>
          </div>
        )}

        {/* Auto Connect Option */}
        {isInFarcaster ? (
          <div className="space-y-4">
          <button
            onClick={handleAutoConnect}
            disabled={isValidating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Auto-Connect Wallet</span>
              </>
            )}
          </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleSearchAddress}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Monad Address</span>
            </button>
            
            <button
              onClick={handleAutoConnect}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Connect My Wallet</span>
            </button>
          </div>
        )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Manual Address Entry */}
          {(searchMode || isInFarcaster) && (
            <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {searchMode ? 'Search Monad Address' : 'Enter Monad Wallet Address'}
            </label>
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="0x1234567890abcdef1234567890abcdef12345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={handleManualConnect}
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>{searchMode ? 'View Portfolio' : 'Connect Manually'}</span>
            </button>
            
            {/* Demo Button for Testing */}
            <button
              onClick={() => {
                const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c4C87';
                setManualAddress(demoAddress);
                onConnect(demoAddress);
              }}
              className="w-full bg-purple-100 text-purple-700 py-2 rounded-xl font-medium hover:bg-purple-200 transition-colors duration-200 text-sm"
            >
              🎭 Use Demo Address (for testing)
            </button>
            </div>
          )}
        

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Features Preview */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isInFarcaster ? "What you'll get:" : "Explore any Monad portfolio:"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="text-purple-600">📊</div>
              </div>
              <div>
                <div className="font-medium text-gray-800">Visual Portfolio</div>
                <div className="text-sm text-gray-600">
                  {isInFarcaster ? "Beautiful block chart of your assets" : "View any address's asset allocation"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-blue-600">🏆</div>
              </div>
              <div>
                <div className="font-medium text-gray-800">Achievement Badges</div>
                <div className="text-sm text-gray-600">
                  {isInFarcaster ? "Earn badges for your on-chain activity" : "See earned badges and achievements"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="text-green-600">📰</div>
              </div>
              <div>
                <div className="font-medium text-gray-800">Monad News</div>
                <div className="text-sm text-gray-600">Latest ecosystem updates and news</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Privacy Controls</div>
                <div className="text-sm text-gray-600">
                  {isInFarcaster ? "Hide assets and control what you share" : "Customizable portfolio views"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🌐 Will connect to Monad Testnet (Chain ID: 10143)
        </p>
      </div>
    </div>
  );
};