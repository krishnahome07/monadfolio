import React, { useState } from 'react';
import { Wallet, Zap, Shield, Users, Search } from 'lucide-react';
import { validateMonadAddress, connectWallet, checkAndSwitchToMonad } from '../utils/monadApi';
import type { Context } from '@farcaster/frame-core';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onWalletConnect?: () => void;
  isInFarcaster: boolean;
  farcasterUser?: Context.User;
  isConnected?: boolean;
  isConnecting?: boolean;
  walletAddress?: string;
  isOnMonad?: boolean;
  onSwitchToMonad?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onWalletConnect,
  isInFarcaster,
  farcasterUser,
  isConnected = false,
  isConnecting = false,
  walletAddress,
  isOnMonad = false,
  onSwitchToMonad
}) => {
  const [manualAddress, setManualAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);

  const handleWalletConnect = async () => {
    if (onWalletConnect) {
      onWalletConnect();
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
            <p className="text-sm mt-2 text-purple-600">
              {isConnected 
                ? `✅ Wallet connected: ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
                : isConnecting 
                  ? '🔄 Connecting to your wallet...'
                  : '✨ Your Farcaster account is connected!'}
            </p>
          </div>
        )}

        {/* Wallet Connection Status */}
        {isInFarcaster && isConnected && !isOnMonad && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="text-yellow-800 font-semibold mb-2">⚠️ Wrong Network</div>
            <p className="text-sm text-yellow-700 mb-3">
              Please switch to Monad Testnet to view your portfolio.
            </p>
            <button
              onClick={onSwitchToMonad}
              className="w-full bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200"
            >
              Switch to Monad Testnet
            </button>
          </div>
        )}

        {/* Connect Options */}
        {(!isInFarcaster || !isConnected) && (
          <div className="space-y-4">
            {!isInFarcaster && (
              <>
            <button
              onClick={handleSearchAddress}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Monad Address</span>
            </button>
              </>
            )}
            
            <button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Connect Farcaster Wallet</span>
                </>
              )}
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
          {searchMode && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Search Monad Address
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
                <span>View Portfolio</span>
              </button>
              
              {/* Demo Button for Testing */}
              <button
                onClick={() => {
                  // Use a real Monad testnet address for demo
                  const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c4C87';
                  setManualAddress(demoAddress);
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
              >
                📝 Fill Demo Address (for testing)
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