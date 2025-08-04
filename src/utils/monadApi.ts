import { ethers } from 'ethers';
import { Portfolio, Asset, NFT, Badge, UserProfile, NewsItem } from '../types/portfolio';

// Mock Monad RPC endpoint - replace with actual endpoint
const MONAD_RPC_URL = 'https://rpc.monad.xyz';

// Mock data for development - replace with actual API calls
export const fetchPortfolio = async (address: string): Promise<Portfolio> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock portfolio data
  const mockAssets: Asset[] = [
    {
      symbol: 'MON',
      name: 'Monad',
      balance: 1250.5,
      value: 3126.25,
      price: 2.5,
      change24h: 5.2
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 500,
      value: 500,
      price: 1.0,
      change24h: 0.1
    },
    {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      balance: 0.75,
      value: 1875,
      price: 2500,
      change24h: -2.3
    },
    {
      symbol: 'DEFI',
      name: 'DeFi Token',
      balance: 100,
      value: 250,
      price: 2.5,
      change24h: 12.5
    }
  ];

  const mockNFTs: NFT[] = [
    {
      id: '1',
      name: 'Monad Genesis #123',
      collection: 'Monad Genesis',
      imageUrl: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400',
      floorPrice: 0.5
    },
    {
      id: '2',
      name: 'Monad Builders #456',
      collection: 'Monad Builders',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      floorPrice: 0.2
    }
  ];

  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);

  return {
    totalValue,
    assets: mockAssets,
    nfts: mockNFTs,
    lastUpdated: new Date()
  };
};

export const fetchUserBadges = async (address: string, portfolio: Portfolio): Promise<Badge[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
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
      earned: new Set(portfolio.nfts.map(nft => nft.collection)).size >= 2,
      rarity: 'rare'
    },
    {
      id: 'monad-whale',
      name: 'Monad Whale',
      description: 'Portfolio value exceeds $5,000',
      icon: '🐋',
      category: 'portfolio',
      earned: portfolio.totalValue > 5000,
      rarity: 'rare'
    },
    {
      id: 'diversifier',
      name: 'Diversifier',
      description: 'Balanced portfolio across multiple assets',
      icon: '📊',
      category: 'portfolio',
      earned: portfolio.assets.length >= 4,
      rarity: 'common'
    },
    {
      id: 'active-user',
      name: 'Active User',
      description: 'Completed 100+ transactions',
      icon: '⚡',
      category: 'usage',
      earned: true, // Mock data
      rarity: 'common'
    },
    {
      id: 'defi-degen',
      name: 'DeFi Degenerate',
      description: 'Interacted with multiple DeFi protocols',
      icon: '🔥',
      category: 'usage',
      earned: true, // Mock data
      rarity: 'rare'
    }
  ];

  // Set earned date for earned badges
  badges.forEach(badge => {
    if (badge.earned) {
      badge.earnedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    }
  });

  return badges;
};

export const fetchMonadNews = async (): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock news data
  return [
    {
      id: '1',
      title: 'Monad Testnet Launches with Record-Breaking Performance',
      summary: 'The highly anticipated Monad testnet goes live, demonstrating unprecedented transaction throughput and low latency.',
      url: 'https://monad.xyz/blog/testnet-launch',
      source: 'Monad Official',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'official'
    },
    {
      id: '2',
      title: 'Major DeFi Protocol Announces Monad Integration',
      summary: 'Leading decentralized exchange confirms plans to deploy on Monad mainnet, citing superior performance metrics.',
      url: 'https://example.com/defi-monad',
      source: 'DeFi Pulse',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      category: 'ecosystem'
    },
    {
      id: '3',
      title: 'Monad Developer Grants Program Opens Applications',
      summary: 'The Monad Foundation launches a $10M grants program to support ecosystem development and innovation.',
      url: 'https://monad.xyz/grants',
      source: 'Monad Foundation',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      category: 'official'
    },
    {
      id: '4',
      title: 'Analysis: Why Monad Could Reshape Ethereum Scaling',
      summary: 'Technical deep-dive into Monad\'s parallel execution model and its potential impact on blockchain scalability.',
      url: 'https://example.com/monad-analysis',
      source: 'Crypto Research',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: 'news'
    },
    {
      id: '5',
      title: 'Monad NFT Collections See Surge in Trading Volume',
      summary: 'Genesis and Builder collections experience 300% increase in trading activity as mainnet approaches.',
      url: 'https://example.com/nft-surge',
      source: 'NFT Tracker',
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      category: 'ecosystem'
    }
  ];
};

export const generatePortfolioImage = async (
  portfolio: Portfolio,
  colorPalette: string,
  showTotalValue: boolean
): Promise<string> => {
  // This would generate an actual image in production
  // For now, return a placeholder
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#6B46C1"/>
      <text x="200" y="150" text-anchor="middle" fill="white" font-size="24" font-family="Arial">
        Portfolio Snapshot
      </text>
      <text x="200" y="180" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
        ${showTotalValue ? `$${portfolio.totalValue.toLocaleString()}` : 'Value Hidden'}
      </text>
    </svg>
  `)}`;
};

export const connectWallet = async (): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
};

export const validateMonadAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};