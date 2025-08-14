import React, { useState } from 'react';
import { Wallet, Users, Search } from 'lucide-react';
import { validateMonadAddress } from '../utils/monadApi';
import type { Context } from '@farcaster/frame-core';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onWalletConnect: () => void;
  onWalletDisconnect: () => void;
  isInFarcaster: boolean;
  isWalletConnected: boolean;
  walletAddress?: string;
  isConnecting: boolean;
  hasWalletAvailable: boolean;
  farcasterUser?: Context.User;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onWalletConnect,
  onWalletDisconnect,
  isInFarcaster,
  isWalletConnected,
  walletAddress,
  isConnecting,
  hasWalletAvailable,
  farcasterUser
}) => {
  const [manualAddress, setManualAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleManualConnect = async () => {
    setError(null);
    setIsValidating(true);
    
    if (!manualAddress.trim()) {
      setError('Please enter a wallet address');
      setIsValidating(false);
      return;
    }

    if (!validateMonadAddress(manualAddress)) {
      setError('Please enter a valid Monad wallet address');
      setIsValidating(false);
      return;
    }

    try {
      onConnect(manualAddress.trim());
    } catch (err) {
      setError('Failed to connect to address');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDemoAddress = () => {
    const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c4C87';
    setManualAddress(demoAddress);
    onConnect(demoAddress);
  };

  // If wallet is already connected, show connected state
  if (isWalletConnected && walletAddress) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Wallet Connected!</h2>
            <p className="text-green-100">
              Your Farcaster wallet is connected and ready
            </p>
          </div>
        </div>
        
        <div className="p-6 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          </div>
          <button
            onClick={onWalletDisconnect}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

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
              ? "Connect your wallet or view any portfolio"
              : "Search any Monad address to view portfolio"
            }
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Farcaster Wallet Connection */}
        {isInFarcaster && hasWalletAvailable && (
          <div className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Farcaster Wallet Available</div>
                  <div className="text-sm text-gray-600">Connect your linked wallet automatically</div>
                </div>
              </div>
              
              <button
                onClick={onWalletConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect Farcaster Wallet</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">or</div>
            </div>
          </div>
        )}

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
            {!hasWalletAvailable ? (
              <p className="text-sm mt-2 text-orange-600">
                💡 No wallet address found in your Farcaster profile. You can still view any Monad portfolio by entering an address below.
              </p>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-purple-600">
                  ✨ Your Farcaster account is connected!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Manual Address Entry */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {isInFarcaster ? 'Or Enter Any Address Manually' : 'Enter Monad Address'}
          </label>
          {isInFarcaster && !hasWalletAvailable && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <div className="font-medium mb-1">💡 Pro Tip:</div>
              <p>You can view any Monad wallet's portfolio! Try entering your own wallet address or use the example below to explore the interface.</p>
            </div>
          )}
          {isInFarcaster && hasWalletAvailable && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              <div className="font-medium mb-1">🔍 View Any Portfolio:</div>
              <p>You can also manually enter any Monad address to view a different portfolio.</p>
            </div>
          )}
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualConnect()}
            placeholder={isInFarcaster && !hasWalletAvailable ? 
              "Enter any Monad address (0x...)" : 
              "0x1234567890abcdef1234567890abcdef12345678"
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
          <button
            disabled={isValidating}
            onClick={handleManualConnect}
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Validating...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>View Portfolio</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              setManualAddress('0x742d35Cc6634C0532925a3b8D4C9db96590c4C87');
            }}
            className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 py-2 rounded-xl font-medium hover:from-blue-100 hover:to-purple-100 transition-all duration-200 text-sm border border-blue-200"
          >
            {isInFarcaster && !hasWalletAvailable ? '🎯 Try Example Portfolio' : '📝 Fill Example Address'}
          </button>
          
          {isInFarcaster && !hasWalletAvailable && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600">
                <div className="font-medium text-gray-800 mb-1">Want to connect your own wallet?</div>
                <p>To auto-connect your wallet in Farcaster, you can verify your Ethereum address in your Farcaster profile settings. This will allow Monadfolio to automatically detect and connect to your wallet.</p>
              </div>
            </div>
          )}
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