import { Portfolio, Asset, NFT, Badge, NewsItem, UserStats } from '../types/portfolio';
import type { Context } from '@farcaster/frame-core';

export const fetchUserStats = async (address: string): Promise<UserStats> => {
  return {
    monadBalance: 0,
    totalTransactions: 0,
    isActiveWallet: false,
    stakingAmount: 0,
    activeProtocols: []
  };
};

export const fetchPortfolio = async (address: string, farcasterUser?: Context.User): Promise<Portfolio> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const userStats = await fetchUserStats(address);
  
  // Sample portfolio data for demonstration
  const sampleAssets: Asset[] = [
    {
      symbol: 'MON',
      name: 'Monad',
      balance: 1250.5,
      value: 3126.25,
      price: 2.50,
      change24h: 12.5,
      transactionCount: 15
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 850.0,
      value: 850.0,
      price: 1.00,
      change24h: 0.1,
      transactionCount: 8
    },
    {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      balance: 0.75,
      value: 2400.0,
      price: 3200.0,
      change24h: -2.3,
      transactionCount: 5
    },
    {
      symbol: 'MSTAKE',
      name: 'Monad Staking Token',
      balance: 500.0,
      value: 1250.0,
      price: 2.50,
      change24h: 8.7,
      transactionCount: 3
    }
  ];

  const sampleNFTs: NFT[] = [
    {
      id: '1',
      name: 'Monad Genesis #1234',
      collection: 'Monad Genesis',
      imageUrl: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400',
      floorPrice: 0.5
    },
    {
      id: '2',
      name: 'Monad Builders #567',
      collection: 'Monad Builders',
      imageUrl: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400',
      floorPrice: 0.25
    }
  ];

  const totalValue = sampleAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalTransactions = sampleAssets.reduce((sum, asset) => sum + (asset.transactionCount || 0), 0);

  return {
    totalValue,
    assets: sampleAssets,
    nfts: sampleNFTs,
    lastUpdated: new Date(),
    userStats: {
      ...userStats,
      monadBalance: sampleAssets.find(a => a.symbol === 'MON')?.balance || 0,
      totalTransactions,
      isActiveWallet: totalTransactions > 0,
      firstTransactionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      stakingAmount: sampleAssets.find(a => a.symbol === 'MSTAKE')?.balance || 0,
      activeProtocols: ['MonadSwap', 'MonadStake', 'MonadLend']
    }
  };
};

export const fetchUserBadges = async (
  address: string, 
  portfolio: Portfolio, 
  farcasterUser?: Context.User
): Promise<Badge[]> => {
  const badges: Badge[] = [
    {
      id: 'monad-holder',
      name: 'Monad Holder',
      description: 'Holds MON tokens in wallet',
      icon: '🏆',
      category: 'portfolio',
      earned: false,
      rarity: 'common'
    },
    {
      id: 'monad-collector',
      name: 'Monad Collector',
      description: 'Holds multiple Monad ecosystem tokens',
      icon: '🎨',
      category: 'portfolio',
      earned: false,
      rarity: 'rare'
    },
    {
      id: 'monad-whale',
      name: 'Monad Whale',
      description: 'Portfolio value exceeds $1,000',
      icon: '🐋',
      category: 'portfolio',
      earned: false,
      rarity: 'rare'
    },
    {
      id: 'monad-pioneer',
      name: 'Monad Pioneer',
      description: 'Early adopter of Monad ecosystem',
      icon: '💎',
      category: 'portfolio',
      earned: false,
      rarity: 'common'
    },
    {
      id: 'monad-active',
      name: 'Monad Active',
      description: 'Completed 10+ transactions on Monad',
      icon: '⚡',
      category: 'usage',
      earned: false,
      rarity: 'common'
    },
    {
      id: 'monad-social',
      name: 'Monad Social',
      description: 'Connected wallet via Farcaster',
      icon: '💜',
      category: 'usage',
      earned: !!farcasterUser,
      rarity: 'rare'
    },
    {
      id: 'monad-defi',
      name: 'Monad DeFi User',
      description: 'Active in Monad DeFi ecosystem',
      icon: '🔥',
      category: 'usage',
      earned: false,
      rarity: 'rare'
    }
  ];

  badges.forEach(badge => {
    if (badge.earned) {
      badge.earnedAt = new Date();
    }
  });

  return badges;
};

export const fetchMonadNews = async (): Promise<NewsItem[]> => {
  return [];
};

export const validateMonadAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};