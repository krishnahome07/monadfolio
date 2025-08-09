import React, { useState } from 'react';
import { Wallet, Users, Search } from 'lucide-react';
import { validateMonadAddress } from '../utils/monadApi';
import type { Context } from '@farcaster/frame-core';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onWalletConnect: () => void;
  isInFarcaster: boolean;
  farcasterUser?: Context.User;
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress?: string;
  isOnMonad: boolean;
  onSwitchToMonad: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onWalletConnect,
  isInFarcaster,
  farcasterUser,
  isConnected,
  isConnecting,
  walletAddress,
  isOnMonad,
  onSwitchToMonad
}) => {
  const [manualAddress, setManualAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

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

    onConnect(manualAddress.trim());
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
              ? "Connect your wallet to see your Monad portfolio"
              : "Search any Monad address or connect your wallet"
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

        {/* Network Status */}
        {isConnected && !isOnMonad && (
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

        {/* Connect Button */}
        {!isConnected && (
          <button
            onClick={onWalletConnect}
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
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        )}

        {/* Manual Address Entry */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

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
          
          <button
            onClick={() => {
              const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c4C87';
              setManualAddress(demoAddress);
            }}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
          >
            📝 Fill Demo Address
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};