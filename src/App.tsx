import React, { useState, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { WalletConnect } from './components/WalletConnect';
import { PortfolioSnapshot } from './components/PortfolioSnapshot';
import { BadgeCollection } from './components/BadgeCollection';
import { MonadNews } from './components/MonadNews';
import { MaintenanceMode } from './components/MaintenanceMode';
import { useFarcasterSDK } from './hooks/useFarcasterSDK';
import { useFarcasterWallet } from './hooks/useFarcasterWallet';
import { usePortfolio } from './hooks/usePortfolio';
import { useMonadNews } from './hooks/useMonadNews';
import { connectWallet, mintPortfolioNFT } from './utils/monadApi';
import { Wallet, Award, Newspaper, Settings, Share2, ExternalLink } from 'lucide-react';

const queryClient = new QueryClient();

function MonadfolioApp() {
  const { context, isReady, isInFarcaster } = useFarcasterSDK();
  const { isConnected, address, isConnecting, connectWallet, isOnMonad, switchToMonad } = useFarcasterWallet();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'badges' | 'news'>('portfolio');
  const [mintingStatus, setMintingStatus] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');
  const [mintResult, setMintResult] = useState<{ txHash?: string; tokenId?: string } | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'success' | 'error'>('idle');

  const { 
    portfolio, 
    badges, 
    loading: portfolioLoading, 
    error: portfolioError,
    settings,
    updateSettings,
    toggleAssetVisibility,
    getVisibleAssets,
    getEarnedBadges,
    refreshPortfolio
  } = usePortfolio(address || null, context?.user);

  const {
    news,
    loading: newsLoading,
    error: newsError,
    refreshNews
  } = useMonadNews();

  // Check if app is enabled (default to true if not set)
  const appEnabledEnv = import.meta.env.VITE_APP_ENABLED;
  const isAppEnabled = appEnabledEnv !== 'false';

  const [manualAddress, setManualAddress] = useState<string | null>(null);
  const connectedAddress = address || manualAddress;

  const handleMintPortfolioNFT = async () => {
    if (!portfolio) return;
    
    setMintingStatus('minting');
    
    try {
      const result = await mintPortfolioNFT(
        connectedAddress!,
        portfolio,
        settings.colorPalette,
        settings.showTotalValue
      );
      
      if (result.success) {
        setMintResult(result);
        setMintingStatus('success');
        
        // Auto-share to Farcaster after successful mint
        if (result.txHash && result.tokenId) {
          await handleShareMintedNFT(result.txHash, result.tokenId);
        }
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setMintingStatus('idle');
          setMintResult(null);
        }, 5000);
      } else {
        throw new Error(result.error || 'Minting failed');
      }
    } catch (error) {
      console.error('❌ NFT minting failed:', error);
      setMintingStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setMintingStatus('idle');
      }, 3000);
    }
  };

  const handleShareMintedNFT = async (txHash: string, tokenId: string) => {
    try {
      const earnedBadges = getEarnedBadges();
      const shareText = `🎨 Just minted my Monadfolio as an NFT! 

💼 Portfolio: ${getVisibleAssets().length} assets${settings.showTotalValue ? ` • $${portfolio?.totalValue.toLocaleString()}` : ''}
🏆 Badges: ${earnedBadges.length} earned
🎨 NFT: Token #${tokenId}
🔗 Tx: ${txHash.slice(0, 10)}...

Built on @monad testnet 🚀

#Monadfolio #MonadNFT #OnChainIdentity`;

      // Try Farcaster sharing first if in Farcaster
      if (isInFarcaster && window.parent) {
        try {
          const encodedText = encodeURIComponent(shareText);
          const encodedUrl = encodeURIComponent(`https://explorer.testnet1.monad.xyz/tx/${txHash}`);
          window.open(`https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedUrl}`, '_blank');
          return;
        } catch (error) {
          console.log('Farcaster share failed, trying alternatives');
        }
      }

      // Fallback to Web Share API or clipboard
      if (navigator.share) {
        await navigator.share({
          title: 'My Monadfolio NFT',
          text: shareText,
          url: `https://explorer.testnet1.monad.xyz/tx/${txHash}`
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert('NFT details copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share minted NFT:', error);
    }
  };

  const generatePortfolioImage = async (portfolio: any, colorPalette: string, showTotalValue: boolean) => {
    // Mock implementation - in real app this would generate an actual image
    return 'https://example.com/portfolio-image.png';
  };

  const handleSharePortfolio = async () => {
    if (!portfolio) return;
    
    setShareStatus('sharing');
    
    try {
      // Generate portfolio image
      const imageUrl = await generatePortfolioImage(
        portfolio,
        settings.colorPalette,
        settings.showTotalValue
      );

      const earnedBadges = getEarnedBadges();
      const shareText = `🚀 My Monadfolio Portfolio\n\n💼 ${getVisibleAssets().length} assets${settings.showTotalValue ? ` • $${portfolio.totalValue.toLocaleString()}` : ''}\n🏆 ${earnedBadges.length} badges earned\n🎨 ${portfolio.nfts.length} NFTs\n\nBuilding on @monad 🔥\n\n#Monadfolio #Monad`;

      // Try Farcaster sharing first if in Farcaster
      if (isInFarcaster && window.parent) {
        try {
          const encodedText = encodeURIComponent(shareText);
          const encodedUrl = encodeURIComponent(window.location.origin);
          window.open(`https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedUrl}`, '_blank');
          setShareStatus('success');
          setTimeout(() => setShareStatus('idle'), 3000);
          return;
        } catch (error) {
          console.log('Farcaster share failed, trying alternatives');
        }
      }

      // Try Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Monadfolio Portfolio',
            text: shareText,
            url: window.location.origin
          });
          setShareStatus('success');
          return;
        } catch (shareError: any) {
          if (shareError.name === 'AbortError') {
            setShareStatus('idle');
            return;
          }
        }
      }

      // Fallback to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert('Portfolio details copied to clipboard!');
        setShareStatus('success');
      } else {
        // Final fallback
        prompt('Copy this text to share your portfolio:', shareText);
        setShareStatus('success');
      }
    } catch (error) {
      console.error('Portfolio share failed:', error);
      setShareStatus('error');
    } finally {
      setTimeout(() => setShareStatus('idle'), 3000);
    }
  };

  const handleShareBadges = async () => {
    const earnedBadges = getEarnedBadges();
    const badgeText = earnedBadges.map(badge => `${badge.icon} ${badge.name}`).join('\n');
    const shareText = `🏆 My Monadfolio Badges\n\n${badgeText}\n\nEarned ${earnedBadges.length} badges on @monad!\n\n#Monadfolio #Monad #Badges`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Monadfolio Badges',
          text: shareText,
          url: window.location.origin
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        alert('Badge collection copied to clipboard!');
      } else {
        prompt('Copy this text to share your badges:', shareText);
      }
    } catch (error) {
      console.error('Badge share failed:', error);
    }
  };

  // Show loading screen until SDK is ready
  if (!isReady || (isInFarcaster && isConnecting)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Monadfolio</h2>
          <p className="text-gray-600">
            {isInFarcaster && isConnecting ? 'Connecting your Farcaster wallet...' : 'Loading Monadfolio...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {isInFarcaster && isConnecting ? 'Fetching your Monad wallet address...' : 'Initializing application...'}
          </p>
          {isInFarcaster && context?.user && (
            <div className="mt-4 flex items-center justify-center space-x-2">
              {context.user.pfpUrl && (
                <img src={context.user.pfpUrl} alt="Profile" className="w-8 h-8 rounded-full" />
              )}
              <span className="text-sm text-purple-600">
                {context.user.displayName || context.user.username || `User ${context.user.fid}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show maintenance mode if app is disabled
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
              onConnect={setManualAddress}
              onWalletConnect={connectWallet}
              isInFarcaster={isInFarcaster}
              farcasterUser={context?.user}
              isConnected={isConnected}
              isConnecting={isConnecting}
              walletAddress={address}
              isOnMonad={isOnMonad}
              onSwitchToMonad={switchToMonad}
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
                  onMintNFT={handleMintPortfolioNFT}
                  onRefresh={refreshPortfolio}
                  loading={portfolioLoading}
                  minting={mintingStatus === 'minting'}
                />
              )}

              {activeTab === 'badges' && (
                <BadgeCollection
                  badges={badges}
                  onShareBadges={handleShareBadges}
                />
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

            {newsError && activeTab === 'news' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <div className="text-red-600 mb-2">⚠️ Error Loading News</div>
                  <p className="text-red-700 mb-4">{newsError}</p>
                  <button
                    onClick={refreshNews}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Connected Wallet Info */}
            <div className="text-center">
              {/* Wallet Address Display with Copy */}
              <div className="mb-4">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {isInFarcaster ? 'Farcaster + ' : ''}{isOnMonad ? 'Monad Testnet' : 'Wrong Network'}
                        </div>
                        <div className="text-purple-200 text-xs font-mono">
                          {connectedAddress}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(connectedAddress);
                          // Show temporary success feedback
                          const button = document.activeElement as HTMLButtonElement;
                          const originalText = button.innerHTML;
                          button.innerHTML = '<svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
                          setTimeout(() => {
                            button.innerHTML = originalText;
                          }, 2000);
                        } catch (error) {
                          console.error('Failed to copy address:', error);
                          // Fallback for browsers that don't support clipboard API
                          prompt('Copy this address:', connectedAddress);
                        }
                      }}
                      className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200 group"
                      title="Copy address"
                    >
                      <svg className="w-4 h-4 text-white group-hover:text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Farcaster User Info */}
                  {context?.user && (
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
                        {context.user.username && (
                          <div className="text-xs bg-purple-600 px-2 py-1 rounded-full text-purple-100">
                            @{context.user.username}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* User Stats Display */}
              {portfolio?.userStats && (
                <div className="mt-3 flex justify-center space-x-4 text-sm">
                  {portfolio.userStats.monadBalance > 0 && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      💰 {portfolio.userStats.monadBalance.toFixed(4)} MON
                    </div>
                  )}
                  {portfolio.userStats.totalTransactions > 0 && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      📊 {portfolio.userStats.totalTransactions} transactions
                    </div>
                  )}
                  {(portfolio.userStats.monadBalance > 0 || portfolio.userStats.totalTransactions > 0) && (
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      portfolio.userStats.isActiveWallet 
                        ? 'bg-green-500 bg-opacity-20 text-green-200' 
                        : 'bg-yellow-500 bg-opacity-20 text-yellow-200'
                    }`}>
                      {portfolio.userStats.isActiveWallet ? '🟢 Active Wallet' : '🟡 New Wallet'}
                    </div>
                  )}
                  {portfolio.userStats.monadBalance === 0 && portfolio.userStats.totalTransactions === 0 && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      🔍 Enter a Monad testnet address to view real data
                    </div>
                  )}
                </div>
              )}
              
              {/* Minting Status */}
              {mintingStatus === 'success' && mintResult && (
                <div className="mt-4 max-w-md mx-auto bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-green-800 font-semibold mb-2">🎉 NFT Minted Successfully!</div>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>Network: Monad Testnet</div>
                    <div>Token ID: #{mintResult.tokenId}</div>
                    <div className="flex items-center justify-center space-x-2">
                      <span>Tx: {mintResult.txHash?.slice(0, 10)}...</span>
                      <button
                        onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${mintResult.txHash}`, '_blank')}
                        className="text-green-600 hover:text-green-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {mintingStatus === 'error' && (
                <div className="mt-4 max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-800 font-semibold">❌ NFT Minting Failed</div>
                  <div className="text-sm text-red-700 mt-1">Please try again later</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MonadfolioApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;