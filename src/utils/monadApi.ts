import { ethers } from 'ethers';
import { Portfolio, Asset, NFT, Badge, NewsItem, UserStats } from '../types/portfolio';
import type { Context } from '@farcaster/frame-core';

// Monad Testnet configuration
const MONAD_TESTNET = {
  id: 10143,
  name: 'Monad Testnet',
  rpcUrl: 'https://testnet1.monad.xyz'
};

const getMonadProvider = () => {
  try {
    return new ethers.JsonRpcProvider(MONAD_TESTNET.rpcUrl);
  } catch (error) {
    console.error('Failed to create Monad provider:', error);
    return null;
  }
};

export const fetchUserStats = async (address: string): Promise<UserStats> => {
  console.log('📊 Fetching user stats for address:', address);
  
  try {
    if (!validateMonadAddress(address)) {
      throw new Error('Invalid address format');
    }

    let monadBalance = 0;
    let transactionCount = 0;

    const provider = getMonadProvider();
    if (provider) {
      console.log('🔗 Fetching data from Monad RPC...');
      
      const balanceWei = await provider.getBalance(address);
      monadBalance = parseFloat(ethers.formatEther(balanceWei));
      
      transactionCount = await provider.getTransactionCount(address);
      
      console.log('✅ Real blockchain data:', { monadBalance, transactionCount });
    }

    return {
      monadBalance: Math.round(monadBalance * 10000) / 10000,
      totalTransactions: transactionCount,
      isActiveWallet: transactionCount > 0 || monadBalance > 0,
      firstTransactionDate: transactionCount > 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      stakingAmount: Math.round(monadBalance * 0.1 * 10000) / 10000,
      activeProtocols: transactionCount > 5 ? ['MonadSwap', 'MonadLend'] : transactionCount > 0 ? ['MonadSwap'] : []
    };
    
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    return {
      monadBalance: 0,
      totalTransactions: 0,
      isActiveWallet: false,
      stakingAmount: 0,
      activeProtocols: []
    };
  }
};

export const fetchPortfolio = async (address: string, farcasterUser?: Context.User): Promise<Portfolio> => {
  console.log('📊 Fetching portfolio for address:', address);
  
  try {
    if (!validateMonadAddress(address)) {
      throw new Error('Invalid Monad address format');
    }
    
    const userStats = await fetchUserStats(address);
    const mockAssets: Asset[] = [];
    
    if (userStats.monadBalance > 0) {
      mockAssets.push({
        symbol: 'MON',
        name: 'Monad',
        balance: userStats.monadBalance,
        value: userStats.monadBalance * 1.0,
        price: 1.0,
        change24h: (Math.random() - 0.5) * 10,
        transactionCount: userStats.totalTransactions
      });
    }
    
    if (userStats.isActiveWallet) {
      const usdcBalance = 100 + Math.random() * 900;
      mockAssets.push({
        symbol: 'USDC',
        name: 'USD Coin',
        balance: Math.round(usdcBalance * 100) / 100,
        value: Math.round(usdcBalance * 100) / 100,
        price: 1.0,
        change24h: (Math.random() - 0.5) * 2,
        transactionCount: Math.floor(userStats.totalTransactions * 0.3)
      });
      
      if (userStats.totalTransactions > 10) {
        const wethBalance = 0.1 + Math.random() * 0.9;
        mockAssets.push({
          symbol: 'WETH',
          name: 'Wrapped Ethereum',
          balance: Math.round(wethBalance * 10000) / 10000,
          value: Math.round(wethBalance * 3000 * 100) / 100,
          price: 3000,
          change24h: (Math.random() - 0.5) * 15,
          transactionCount: Math.floor(userStats.totalTransactions * 0.2)
        });
      }
    }
    
    const nftCount = userStats.isActiveWallet ? Math.min(Math.floor(userStats.totalTransactions / 10), 5) : 0;
    const mockNFTs: NFT[] = Array.from({ length: nftCount }, (_, index) => {
      const collections = ['Monad Genesis', 'Monad Builders', 'Monad Validators', 'Monad Community'];
      const collection = collections[index % collections.length];
      const tokenId = Math.floor(Math.random() * 9999) + 1;
      
      return {
        id: `${collection.toLowerCase().replace(' ', '-')}-${tokenId}`,
        name: `${collection} #${tokenId}`,
        collection,
        imageUrl: `https://images.unsplash.com/photo-${1634973357973 + index}?w=400`,
        floorPrice: Math.round(Math.random() * 2 * 100) / 100
      };
    });

    const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);

    return {
      totalValue,
      assets: mockAssets,
      nfts: mockNFTs,
      lastUpdated: new Date(),
      userStats
    };
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    throw new Error(`Failed to fetch portfolio data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchUserBadges = async (
  address: string, 
  portfolio: Portfolio, 
  farcasterUser?: Context.User
): Promise<Badge[]> => {
  const badges: Badge[] = [
    {
      id: 'monad-pioneer',
      name: 'Monad Pioneer',
      description: 'Holds NFT from earliest Monad collections',
      icon: '🏆',
      category: 'nft',
      earned: portfolio.nfts.some(nft => nft.collection === 'Monad Genesis'),
      rarity: 'legendary'
    },
    {
      id: 'collector',
      name: 'Collector',
      description: 'Holds NFTs from 3+ different collections',
      icon: '🎨',
      category: 'nft',
      earned: new Set(portfolio.nfts.map(nft => nft.collection)).size >= 3,
      rarity: 'rare'
    },
    {
      id: 'monad-whale',
      name: 'Monad Whale',
      description: 'Portfolio value exceeds $1,000',
      icon: '🐋',
      category: 'portfolio',
      earned: portfolio.totalValue > 1000,
      rarity: 'rare'
    },
    {
      id: 'monad-holder',
      name: 'Monad Holder',
      description: 'Holds MON tokens in wallet',
      icon: '💎',
      category: 'portfolio',
      earned: (portfolio.userStats?.monadBalance || 0) > 0,
      rarity: 'common'
    },
    {
      id: 'active-user',
      name: 'Active User',
      description: 'Completed 10+ transactions',
      icon: '⚡',
      category: 'usage',
      earned: (portfolio.userStats?.totalTransactions || 0) >= 10,
      rarity: 'common'
    },
    {
      id: 'farcaster-native',
      name: 'Farcaster Native',
      description: 'Connected via Farcaster with verified profile',
      icon: '💜',
      category: 'usage',
      earned: !!farcasterUser,
      rarity: 'rare'
    }
  ];

  badges.forEach(badge => {
    if (badge.earned) {
      badge.earnedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    }
  });

  return badges;
};

export const fetchMonadNews = async (): Promise<NewsItem[]> => {
  return [
    {
      id: '1',
      title: 'Monad Testnet Launches with Record-Breaking Performance',
      summary: 'The highly anticipated Monad testnet goes live, demonstrating unprecedented transaction throughput and low latency.',
      url: 'https://monad.xyz',
      source: 'Monad Official',
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      category: 'official'
    },
    {
      id: '2',
      title: 'Major DeFi Protocol Announces Monad Integration',
      summary: 'Leading decentralized exchange confirms plans to deploy on Monad mainnet, citing superior performance metrics.',
      url: 'https://monad.xyz',
      source: 'DeFi Pulse',
      publishedAt: new Date('2024-01-14T14:30:00Z'),
      category: 'ecosystem'
    },
    {
      id: '3',
      title: 'Monad Developer Grants Program Opens Applications',
      summary: 'The Monad Foundation launches a $10M grants program to support ecosystem development and innovation.',
      url: 'https://monad.xyz',
      source: 'Monad Foundation',
      publishedAt: new Date('2024-01-13T09:15:00Z'),
      category: 'official'
    }
  ];
};

export const mintPortfolioNFT = async (
  userAddress: string,
  portfolio: Portfolio,
  colorPalette: string,
  showTotalValue: boolean
): Promise<{ success: boolean; txHash?: string; tokenId?: string; error?: string }> => {
  try {
    console.log('🎨 Starting portfolio NFT minting process...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    const mockTokenId = Math.floor(Math.random() * 10000).toString();
    
    return {
      success: true,
      txHash: mockTxHash,
      tokenId: mockTokenId
    };
    
  } catch (error) {
    console.error('❌ NFT minting failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const validateMonadAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};