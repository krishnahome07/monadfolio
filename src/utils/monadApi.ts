import { Portfolio, Asset, NFT, Badge, NewsItem, UserStats } from '../types/portfolio';
import type { Context } from '@farcaster/frame-core';
import { createPublicClient, http, formatEther, getAddress } from 'viem';
import { monadTestnet } from '../lib/wagmi';

// Create Viem client for Monad Testnet
const monadClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz', {
    timeout: 30000, // 30 second timeout
    retryCount: 3
  })
});

// ERC-20 ABI for token detection and balance checking
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
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function'
  }
];

// ERC-20 Transfer event signature
const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

// Known Monad ecosystem tokens (add more as they become available)
const KNOWN_MONAD_TOKENS = [
  {
    address: '0x0000000000000000000000000000000000000000', // Placeholder - replace with real addresses
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6
  },
  {
    address: '0x0000000000000000000000000000000000000001', // Placeholder - replace with real addresses
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18
  },
  {
    address: '0x0000000000000000000000000000000000000002', // Placeholder - replace with real addresses
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8
  }
];

// Discover ERC-20 tokens by scanning Transfer events
const discoverTokenContracts = async (userAddress: string): Promise<string[]> => {
  try {
    console.log('🔍 Discovering ERC-20 tokens for address:', userAddress);
    
    // Get current block number
    const currentBlock = await monadClient.getBlockNumber();
    const fromBlock = currentBlock - BigInt(50000); // Scan last 50k blocks for more coverage
    
    console.log(`📊 Scanning blocks ${fromBlock} to ${currentBlock} for token transfers`);
    
    // Get Transfer events where the user is the recipient
    const incomingLogs = await monadClient.getLogs({
      topics: [
        TRANSFER_EVENT_SIGNATURE,
        null, // from (any address)
        `0x000000000000000000000000${userAddress.slice(2).toLowerCase()}` // to (user address, padded)
      ],
      fromBlock,
      toBlock: currentBlock
    });
    
    // Get Transfer events where the user is the sender
    const outgoingLogs = await monadClient.getLogs({
      topics: [
        TRANSFER_EVENT_SIGNATURE,
        `0x000000000000000000000000${userAddress.slice(2).toLowerCase()}`, // from (user address, padded)
        null // to (any address)
      ],
      fromBlock,
      toBlock: currentBlock
    });
    
    console.log(`📋 Found ${incomingLogs.length} incoming and ${outgoingLogs.length} outgoing Transfer events`);
    
    // Combine and extract unique contract addresses
    const allLogs = [...incomingLogs, ...outgoingLogs];
    const contractAddresses = [...new Set(allLogs.map(log => log.address))];
    
    console.log(`🏭 Found ${contractAddresses.length} unique token contracts:`, contractAddresses);
    
    return contractAddresses;
  } catch (error) {
    console.error('❌ Error discovering token contracts:', error);
    return [];
  }
};

// Check if a contract is a valid ERC-20 token
const isERC20Contract = async (contractAddress: string): Promise<boolean> => {
  try {
    // Try to call totalSupply() - most ERC-20 tokens have this
    await monadClient.readContract({
      address: getAddress(contractAddress),
      abi: ERC20_ABI,
      functionName: 'totalSupply'
    });
    return true;
  } catch (error) {
    // If totalSupply fails, try balanceOf with zero address
    try {
      await monadClient.readContract({
        address: getAddress(contractAddress),
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: ['0x0000000000000000000000000000000000000000']
      });
      return true;
    } catch (error2) {
      return false;
    }
  }
};

// Get token info (symbol, name, decimals)
const getTokenInfo = async (contractAddress: string) => {
  try {
    const [symbol, name, decimals] = await Promise.all([
      monadClient.readContract({
        address: getAddress(contractAddress),
        abi: ERC20_ABI,
        functionName: 'symbol'
      }).catch(() => 'UNKNOWN'),
      monadClient.readContract({
        address: getAddress(contractAddress),
        abi: ERC20_ABI,
        functionName: 'name'
      }).catch(() => 'Unknown Token'),
      monadClient.readContract({
        address: getAddress(contractAddress),
        abi: ERC20_ABI,
        functionName: 'decimals'
      }).catch(() => 18)
    ]);
    
    return { symbol, name, decimals };
  } catch (error) {
    console.error(`Error getting token info for ${contractAddress}:`, error);
    return { symbol: 'UNKNOWN', name: 'Unknown Token', decimals: 18 };
  }
};

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
        value: monBalance * 1, // Placeholder price
        price: 1,
        change24h: 0,
        transactionCount: userStats.totalTransactions
      });
    }
    
    // Discover tokens by scanning blockchain events
    const discoveredTokens = await discoverTokenContracts(address);
    
    // Check balances for discovered tokens
    for (const tokenAddress of discoveredTokens) {
      try {
        // Verify it's a valid ERC-20 contract
        const isValidToken = await isERC20Contract(tokenAddress);
        if (!isValidToken) {
          console.log(`⚠️ Skipping ${tokenAddress} - not a valid ERC-20 token`);
          continue;
        }
        
        const tokenAsset = await fetchTokenBalance(tokenAddress, address);
        if (tokenAsset) {
          assets.push(tokenAsset);
        }
      } catch (error) {
        console.error(`❌ Error processing token ${tokenAddress}:`, error);
      }
    }
    
    // Also check known Monad ecosystem tokens (if they have real addresses)
    for (const knownToken of KNOWN_MONAD_TOKENS) {
      if (knownToken.address !== '0x0000000000000000000000000000000000000000') {
        try {
          const tokenAsset = await fetchTokenBalance(knownToken.address, address);
          if (tokenAsset && !assets.find(a => a.symbol === tokenAsset.symbol)) {
            assets.push(tokenAsset);
          }
        } catch (error) {
          console.error(`❌ Error fetching known token ${knownToken.symbol}:`, error);
        }
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