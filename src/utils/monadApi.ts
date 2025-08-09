import { ethers } from 'ethers';
import { Portfolio, Asset, NFT, Badge, NewsItem, UserStats } from '../types/portfolio';

// Use Ethereum mainnet for real data
const FALLBACK_RPC = 'https://eth.llamarpc.com';

const getProvider = () => {
  try {
    return new ethers.JsonRpcProvider(FALLBACK_RPC);
  } catch (error) {
    return null;
  }
};

const getTokenBalance = async (provider: ethers.JsonRpcProvider, address: string, tokenAddress?: string): Promise<number> => {
  try {
    if (!tokenAddress) {
      const balance = await provider.getBalance(address);
      return parseFloat(ethers.formatEther(balance));
    } else {
      const contract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const balance = await contract.balanceOf(address);
      return parseFloat(ethers.formatEther(balance));
    }
  } catch (error) {
    return 0;
  }
};

const getTransactionCount = async (provider: ethers.JsonRpcProvider, address: string): Promise<number> => {
  try {
    return await provider.getTransactionCount(address);
  } catch (error) {
    return 0;
  }
};

export const fetchUserStats = async (address: string): Promise<UserStats> => {
  try {
    if (!validateAddress(address)) {
      throw new Error('Invalid address format');
    }

    const provider = getProvider();
    if (!provider) {
      throw new Error('Unable to connect to blockchain');
    }

    const [ethBalance, transactionCount] = await Promise.all([
      getTokenBalance(provider, address),
      getTransactionCount(provider, address)
    ]);


    return {
      monadBalance: ethBalance,
      totalTransactions: transactionCount,
      isActiveWallet: transactionCount > 0 || ethBalance > 0,
      firstTransactionDate: transactionCount > 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      stakingAmount: ethBalance * 0.1,
      activeProtocols: transactionCount > 10 ? ['DeFi Protocol', 'DEX'] : transactionCount > 0 ? ['DEX'] : []
    };
    
  } catch (error) {
    throw new Error(`Failed to fetch user stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchPortfolio = async (address: string): Promise<Portfolio> => {
  try {
    if (!validateAddress(address)) {
      throw new Error('Invalid address format');
    }
    
    const userStats = await fetchUserStats(address);
    const provider = getProvider();
    
    if (!provider) {
      throw new Error('Unable to connect to blockchain');
    }
    
    const assets: Asset[] = [];
    
    if (userStats.monadBalance > 0) {
      assets.push({
        symbol: 'ETH',
        name: 'Ethereum',
        balance: userStats.monadBalance,
        value: userStats.monadBalance * 3000,
        price: 3000,
        change24h: Math.random() * 10 - 5,
        transactionCount: userStats.totalTransactions
      });
    }
    
    const nfts: NFT[] = [];

    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);


    return {
      totalValue,
      assets,
      nfts,
      lastUpdated: new Date(),
      userStats
    };
  } catch (error) {
    throw new Error(`Failed to fetch portfolio data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchUserBadges = async (
  address: string, 
  portfolio: Portfolio
): Promise<Badge[]> => {
  const badges: Badge[] = [
    {
      id: 'crypto-holder',
      name: 'Crypto Holder',
      description: 'Holds cryptocurrency in wallet',
      icon: '🏆',
      category: 'portfolio',
      earned: (portfolio.userStats?.monadBalance || 0) > 0,
      rarity: 'common'
    },
    {
      id: 'collector',
      name: 'Collector',
      description: 'Holds multiple types of assets',
      icon: '🎨',
      category: 'portfolio',
      earned: portfolio.assets.length >= 2,
      rarity: 'rare'
    },
    {
      id: 'crypto-whale',
      name: 'Crypto Whale',
      description: 'Portfolio value exceeds $1,000',
      icon: '🐋',
      category: 'portfolio',
      earned: portfolio.totalValue > 1000,
      rarity: 'rare'
    },
    {
      id: 'eth-holder',
      name: 'ETH Holder',
      description: 'Holds ETH in wallet',
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
      title: 'Ethereum Network Upgrade Improves Scalability',
      summary: 'Latest Ethereum improvements bring better transaction throughput and reduced gas fees for users.',
      url: 'https://ethereum.org',
      source: 'Ethereum Foundation',
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      category: 'official'
    },
    {
      id: '2',
      title: 'DeFi Protocol Announces New Features',
      summary: 'Leading decentralized exchange introduces new trading features and improved user experience.',
      url: 'https://ethereum.org',
      source: 'DeFi Pulse',
      publishedAt: new Date('2024-01-14T14:30:00Z'),
      category: 'ecosystem'
    },
    {
      id: '3',
      title: 'Blockchain Developer Grants Program Opens Applications',
      summary: 'New grants program launches to support ecosystem development and innovation in blockchain technology.',
      url: 'https://ethereum.org',
      source: 'Blockchain Foundation',
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
    const provider = getProvider();
    if (!provider) {
      throw new Error('Unable to connect to blockchain for minting');
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    const mockTokenId = Math.floor(Math.random() * 10000).toString();
    
    return {
      success: true,
      txHash: mockTxHash,
      tokenId: mockTokenId
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const validateAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}