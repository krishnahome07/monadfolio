import { Portfolio, Asset, NFT, Badge, NewsItem, UserStats } from '../types/portfolio';
import type { Context } from '@farcaster/frame-core';
import { createPublicClient, http, formatEther, getAddress } from 'viem';
import { monadTestnet } from '../lib/wagmi';

// Create Viem client for Monad Testnet
const monadClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz')
});

// ERC-20 ABI for balance checking
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  }
];

// Famous Monad blockchain tokens (replace with real contract addresses when available)
const FAMOUS_MONAD_TOKENS = [
  {
    address: '0x1234567890123456789012345678901234567890', // Replace with real USDC address
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    price: 1.00
  },
  {
    address: '0x2345678901234567890123456789012345678901', // Replace with real WETH address
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18
  },
  {
    address: '0x3456789012345678901234567890123456789012', // Replace with real WBTC address
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',

// Discover NFT contracts by scanning recent blocks for Transfer events
const discoverNFTContracts = async (userAddress: string): Promise<string[]> => {
  try {
    console.log('🔍 Discovering NFT contracts for address:', userAddress);
    
    // Get current block number
    const currentBlock = await monadClient.getBlockNumber();
    const fromBlock = currentBlock - BigInt(10000); // Scan last 10k blocks
    
    console.log(`📊 Scanning blocks ${fromBlock} to ${currentBlock}`);
    
    // Get Transfer events where the user is the recipient
    const logs = await monadClient.getLogs({
      address: undefined, // Any contract
      topics: [
        TRANSFER_EVENT_SIGNATURE,
        null, // from (any address)
        `0x000000000000000000000000${userAddress.slice(2)}` // to (user address, padded)
      ],
      fromBlock,
      toBlock: currentBlock
    });
    
    console.log(`📋 Found ${logs.length} Transfer events to user`);
    
    // Extract unique contract addresses
    const contractAddresses = [...new Set(logs.map(log => log.address))];
    
    console.log(`🏭 Found ${contractAddresses.length} unique contracts:`, contractAddresses);
    
    return contractAddresses;
  } catch (error) {
    console.error('❌ Error discovering NFT contracts:', error);
    return [];
  }
};

export const fetchUserStats = async (address: string): Promise<UserStats> => {
  try {
    // Get native MON balance
    const balance = await monadClient.getBalance({ 
      address: getAddress(address) 
    });
    
    // Get transaction count
    const transactionCount = await monadClient.getTransactionCount({ 
      address: getAddress(address) 
    });
    
    const monadBalance = parseFloat(formatEther(balance));
    
    return {
      monadBalance,
      totalTransactions: transactionCount,
      isActiveWallet: transactionCount > 0,
      stakingAmount: 0, // Would need staking contract integration
      activeProtocols: [] // Would need protocol-specific queries
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      monadBalance: 0,
      totalTransactions: 0,
      isActiveWallet: false,
      stakingAmount: 0,
      activeProtocols: []
    };
  }
};

// Fetch token balance for a specific contract
const fetchTokenBalance = async (tokenAddress: string, userAddress: string) => {
  try {
    // Skip zero address and other invalid addresses
    if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
      return null;
    }
    
    console.log(`🔍 Checking balance for token ${tokenAddress}`);
    
    // Get token info
    const tokenInfo = await getTokenInfo(tokenAddress);
    
    // Get user's balance
    const balance = await monadClient.readContract({
      address: getAddress(tokenAddress),
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [getAddress(userAddress)]
    });
    
    // Format balance based on token decimals
    const balanceFormatted = Number(balance) / Math.pow(10, tokenInfo.decimals);
    
    if (balanceFormatted > 0) {
      console.log(`✅ Found ${balanceFormatted} ${tokenInfo.symbol}`);
      return {
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        balance: balanceFormatted,
        value: balanceFormatted * 1, // Placeholder price - would need price oracle
        price: 1, // Placeholder price
        change24h: 0, // Would need price history
        transactionCount: 0
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error fetching balance for ${tokenAddress}:`, error);
    return null;
  }
};

export const fetchPortfolio = async (address: string, farcasterUser?: Context.User): Promise<Portfolio> => {
  try {
    console.log('🚀 Fetching portfolio for address:', address);
    
    const userStats = await fetchUserStats(address);
    
    // Get native MON balance
    const nativeBalance = await monadClient.getBalance({ 
      address: getAddress(address) 
    });
    
    const assets: Asset[] = [];
    
    // Add native MON if balance > 0
    const monBalance = parseFloat(formatEther(nativeBalance));
    console.log(`💰 Native MON balance: ${monBalance}`);
    
    if (monBalance > 0) {
      assets.push({
        symbol: 'MON',
        name: 'Monad',
        balance: monBalance,
        value: monBalance * 0.50, // Estimated MON price
        price: 0.50,
        change24h: Math.random() * 20 - 10, // Random change for demo
        transactionCount: userStats.totalTransactions
      });
    }
    
    // Check balances for famous Monad tokens
    console.log('🔍 Checking famous Monad tokens...');
    for (const token of FAMOUS_MONAD_TOKENS) {
      try {
        const tokenAsset = await fetchFamousTokenBalance(token, address);
        if (tokenAsset && !assets.find(a => a.symbol === tokenAsset.symbol)) {
          assets.push(tokenAsset);
        }
      } catch (error) {
        console.error(`❌ Error fetching ${token.symbol}:`, error);
      }
    }
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    console.log(`✅ Portfolio loaded: ${assets.length} assets, total value: $${totalValue}`);
    
    return {
      totalValue,
      assets,
      nfts: [],
      lastUpdated: new Date(),
      userStats
    };
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    
    // Fallback to empty portfolio on error
    const userStats = await fetchUserStats(address).catch(() => ({
      monadBalance: 0,
      totalTransactions: 0,
      isActiveWallet: false,
      stakingAmount: 0,
      activeProtocols: []
    }));
    
    return {
      totalValue: 0,
      assets: [],
      nfts: [],
      lastUpdated: new Date(),
      userStats
    };
  }
};

export const fetchUserBadges = async (
  address: string, 
  portfolio: Portfolio, 
  farcasterUser?: Context.User
): Promise<Badge[]> => {
  const hasMonTokens = portfolio.assets.some(asset => asset.symbol === 'MON' && asset.balance > 0);
  const hasMultipleTokens = portfolio.assets.length > 1;
  const isWhale = portfolio.totalValue > 1000;
  const isActive = portfolio.userStats?.totalTransactions && portfolio.userStats.totalTransactions >= 10;
  
  const badges: Badge[] = [
    {
      id: 'monad-holder',
      name: 'Monad Holder',
      description: 'Holds MON tokens in wallet',
      icon: '🏆',
      category: 'portfolio',
      earned: hasMonTokens,
      rarity: 'common'
    },
    {
      id: 'monad-collector',
      name: 'Monad Collector',
      description: 'Holds multiple Monad ecosystem tokens',
      icon: '🎨',
      category: 'portfolio',
      earned: hasMultipleTokens,
      rarity: 'rare'
    },
    {
      id: 'monad-whale',
      name: 'Monad Whale',
      description: 'Portfolio value exceeds $1,000',
      icon: '🐋',
      category: 'portfolio',
      earned: isWhale,
      rarity: 'rare'
    },
    {
      id: 'monad-pioneer',
      name: 'Monad Pioneer',
      description: 'Early adopter of Monad ecosystem',
      icon: '💎',
      category: 'portfolio',
      earned: portfolio.userStats?.totalTransactions ? portfolio.userStats.totalTransactions > 0 : false,
      rarity: 'common'
    },
    {
      id: 'monad-active',
      name: 'Monad Active',
      description: 'Completed 10+ transactions on Monad',
      icon: '⚡',
      category: 'usage',
      earned: !!isActive,
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
      earned: portfolio.userStats?.activeProtocols ? portfolio.userStats.activeProtocols.length > 0 : false,
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