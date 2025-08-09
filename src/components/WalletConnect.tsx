import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { validateMonadAddress } from '../utils/monadApi';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  connectionError?: string | null;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  connectionError
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
      setError('Please enter a valid wallet address');
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


  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🔍
          </div>
          <h2 className="text-2xl font-bold mb-2">Portfolio Viewer</h2>
          <p className="text-blue-100">
            Enter any wallet address to view its portfolio
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Wallet Address
          </label>
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualConnect()}
            placeholder="0x1234567890abcdef1234567890abcdef12345678"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            disabled={isValidating}
            onClick={handleManualConnect}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
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
              const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c4C87';
              setManualAddress(demoAddress);
            }}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
          >
            📝 Fill Demo Address
          </button>
        </div>

        {/* Error Display */}
        {(error || connectionError) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-red-800 text-sm">{error || connectionError}</div>
          </div>
        )}
      </div>
    </div>
  );
};