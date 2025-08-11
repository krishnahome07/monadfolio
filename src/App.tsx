import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletConnect } from './components/WalletConnect';
import { PortfolioSnapshot } from './components/PortfolioSnapshot';
import { BadgeCollection } from './components/BadgeCollection';
import { MonadNews } from './components/MonadNews';
import { MaintenanceMode } from './components/MaintenanceMode';
import { useFarcasterSDK } from './hooks/useFarcasterSDK';
import { usePortfolio } from './hooks/usePortfolio';
import { useMonadNews } from './hooks/useMonadNews';
import { Wallet, Award, Newspaper } from 'lucide-react';

const queryClient = new QueryClient();

function MonadfolioApp() {
  try {
    const { context, isReady, isInFarcaster } = useFarcasterSDK();
    
    const [activeTab, setActiveTab] = useState<'portfolio' | 'badges' | 'news'>('portfolio');
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

    // Auto-connect when in Farcaster
    useEffect(() => {
      if (isReady && isInFarcaster && context?.user && !connectedAddress) {
        // Try to get wallet address from Farcaster context
        if (context.user.verifications && context.user.verifications.length > 0) {
          // Use the first verified address
          const address = context.user.verifications[0];
          console.log('🔗 Auto-connecting Farcaster user wallet:', address);
          setConnectedAddress(address);
        } else if (context.user.custodyAddress) {
          // Use custody address as fallback
          console.log('🔗 Auto-connecting Farcaster custody address:', context.user.custodyAddress);
          setConnectedAddress(context.user.custodyAddress);
        } else {
          console.log('⚠️ No wallet address found for Farcaster user');
        }
      }
    }, [isReady, isInFarcaster, context?.user, connectedAddress]);
    const { 
      portfolio, 
      badges, 
      loading: portfolioLoading, 
      error: portfolioError,
      settings,
      updateSettings,
      toggleAssetVisibility,
      refreshPortfolio
    } = usePortfolio(connectedAddress, context?.user);

    const { news, loading: newsLoading, error: newsError, refreshNews } = useMonadNews();

    const handleConnect = (address: string) => {
      console.log('🔍 Connecting to address:', address);
      setConnectedAddress(address);
    };

    const appEnabledEnv = import.meta.env.VITE_APP_ENABLED;
    const isAppEnabled = appEnabledEnv !== 'false';

    if (!isReady) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Monadfolio</h2>
            <p className="text-gray-600">Loading Monadfolio...</p>
          </div>
        </div>
      );
    }

    if (!isAppEnabled) {
      return <MaintenanceMode />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Monadfolio</h1>
            </div>
            <p className="text-purple-200 text-lg">
              Your Monad portfolio & on-chain identity
            </p>
            {isInFarcaster && (
              <div className="mt-2 inline-flex items-center space-x-2 bg-purple-800 bg-opacity-50 text-purple-200 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Connected via Farcaster</span>
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          {!connectedAddress ? (
            <div className="max-w-md mx-auto">
              <WalletConnect 
                onConnect={handleConnect}
                isInFarcaster={isInFarcaster}
                farcasterUser={context?.user}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex justify-center">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-1 w-full max-w-md">
                  <div className="flex space-x-1">
                    {[
                      { id: 'portfolio', label: 'Portfolio', icon: Wallet },
                      { id: 'badges', label: 'Badges', icon: Award },
                      { id: 'news', label: 'News', icon: Newspaper }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id as any)}
                        className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex-1 ${
                          activeTab === id
                            ? 'bg-white text-purple-700 shadow-lg'
                            : 'text-white hover:bg-white hover:bg-opacity-20'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="max-w-4xl mx-auto">
                {activeTab === 'portfolio' && portfolio && (
                  <PortfolioSnapshot
                    portfolio={portfolio}
                    settings={settings}
                    onSettingsChange={updateSettings}
                    onToggleAsset={toggleAssetVisibility}
                    onRefresh={refreshPortfolio}
                    loading={portfolioLoading}
                    userAddress={connectedAddress}
                  />
                )}

                {activeTab === 'badges' && (
                  <BadgeCollection badges={badges} />
                )}

                {activeTab === 'news' && (
                  <MonadNews
                    news={news}
                    loading={newsLoading}
                    onRefresh={refreshNews}
                  />
                )}
              </div>

              {/* Loading States */}
              {portfolioLoading && activeTab === 'portfolio' && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your Monad portfolio...</p>
                  </div>
                </div>
              )}

              {/* Error States */}
              {portfolioError && activeTab === 'portfolio' && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <div className="text-red-600 mb-2">⚠️ Error Loading Portfolio</div>
                    <p className="text-red-700 mb-4">{portfolioError}</p>
                    <button
                      onClick={refreshPortfolio}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Connected Address Info */}
              <div className="text-center">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        Portfolio Viewer
                      </div>
                      <div className="text-purple-200 text-xs font-mono">
                        {connectedAddress}
                      </div>
                    </div>
                  </div>
                  
                  {/* Farcaster User Info */}
                  {isInFarcaster && context?.user && (
                    <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                      <div className="flex items-center justify-center space-x-2">
                        {context.user.pfpUrl ? (
                          <img
                            src={context.user.pfpUrl}
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">👤</span>
                          </div>
                        )}
                        <div className="text-white text-sm">
                          {context.user.displayName || context.user.username || `User ${context.user.fid}`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
          <div className="text-red-600 mb-4">⚠️ Error</div>
          <p className="text-gray-600">Something went wrong loading the app.</p>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MonadfolioApp />
    </QueryClientProvider>
  );
}

export default App;