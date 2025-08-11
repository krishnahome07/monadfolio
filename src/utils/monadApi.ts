import { Portfolio, Asset, NFT, Badge, NewsItem, UserStats } from '../types/portfolio';
import type { Context } from '@farcaster/frame-core';

export const fetchUserStats = async (address: string): Promise<UserStats> => {
  console.log('📊 Fetching user stats for address:', address);
  
  // Return empty stats - no mock data
  return {
    monadBalance: 0,
    totalTransactions: 0,
    isActiveWallet: false,
    stakingAmount: 0,
    activeProtocols: []
  };
};

export const fetchPortfolio = async (address: string, farcasterUser?: Context.User): Promise<Portfolio> => {
  console.log('📊 Fetching portfolio for address:', address);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const userStats = await fetchUserStats(address);
  
  // Return empty portfolio - no mock data
  return {
    totalValue: 0,
    assets: [],
    nfts: [],
    lastUpdated: new Date(),
    userStats
  };
};

export const fetchUserBadges = async (
  address: string, 
  portfolio: Portfolio, 
  farcasterUser?: Context.User
): Promise<Badge[]> => {
  // Define available badges but none are earned without real data
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

  // Only the Farcaster connection badge can be earned
  badges.forEach(badge => {
    if (badge.earned) {
      badge.earnedAt = new Date();
    }
  });

  return badges;
};

export const fetchMonadNews = async (): Promise<NewsItem[]> => {
  // Return empty news array - no mock data
  return [];
};

export const validateMonadAddress = (address: string): boolean => {
  // Basic Ethereum address validation
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};