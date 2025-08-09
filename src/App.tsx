import React, { useState, useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletConnect } from './components/WalletConnect';
import { PortfolioSnapshot } from './components/PortfolioSnapshot';
import { BadgeCollection } from './components/BadgeCollection';
import { MonadNews } from './components/MonadNews';
import { MaintenanceMode } from './components/MaintenanceMode';
import { useFarcasterSDK } from './hooks/useFarcasterSDK';
import { usePortfolio } from './hooks/usePortfolio';
import { useMonadNews } from './hooks/useMonadNews';
import { connectWallet, mintPortfolioNFT } from './utils/monadApi';
import { Wallet, Award, Newspaper, Settings, Share2, ExternalLink } from 'lucide-react';

const queryClient = new QueryClient();

function MonadfolioApp() {
  const { context, isReady, isInFarcaster } = useFarcasterSDK();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
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
  } = usePortfolio(connectedAddress);

  const {
    news,
    loading: newsLoading,
    error: newsError,
    refreshNews
  } = useMonadNews();

  // Check if app is enabled (default to true if not set)
  const appEnabledEnv = import.meta.env.VITE_APP_ENABLED;
  const isAppEnabled = appEnabledEnv !== 'false';

  // Auto-connect wallet if user has Farcaster context
  useEffect(() => {
    if (context?.user && !connectedAddress && isReady) {
      console.log('🎯 Auto-connecting for Farcaster user:', context.user.fid);
      handleAutoConnect();
    }
  }, [context, connectedAddress, isReady]);

  const handleAutoConnect = async () => {
    try {
      // Try wallet connection first
      let address = await connectWallet();
      
      // If no wallet, create demo address
      if (address) {
        console.log('✅ Wallet connected:', address);
        setConnectedAddress(address);
      } else if (context?.user) {
        // Generate demo address from Farcaster user ID
        const demoAddress = `0x${context.user.fid.toString().padStart(40, '0')}`;
        console.log('🎭 Using demo address for Farcaster user:', demoAddress);
        setConnectedAddress(demoAddress);
      } else {
        // Generate random demo address for non-Farcaster users
        const demoAddress = `0x${'1234567890abcdef'.repeat(2).padStart(40, '0')}`;
        console.log('🎭 Using demo address for guest:', demoAddress);
        setConnectedAddress(demoAddress);
      }
    } catch (error) {
      console.error('❌ Auto-connect failed:', error);
      // Still set a demo address so user can explore the app
      const demoAddress = `0x${'demo123456789'.repeat(3).substring(0, 40)}`;
      setConnectedAddress(demoAddress);
    }
  };

  const handleManualConnect = (address: string) => {
    console.log('📝 Manual wallet connection:', address);
    setConnectedAddress(address);
  };

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
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Monadfolio</h2>
          <p className="text-gray-600">Loading your Monad portfolio...</p>
          <p className="text-sm text-gray-500 mt-2">Initializing Farcaster SDK...</p>
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
              onConnect={handleManualConnect}
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
              <div className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}</span>
              </div>
              
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
    <QueryClientProvider client={queryClient}>
      <MonadfolioApp />
    </QueryClientProvider>
  );
}

export default App;