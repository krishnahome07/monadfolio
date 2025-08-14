import { Portfolio, Asset, NFT, Badge, NewsItem, UserStats } from '../types/portfolio';
import type { Context } from '@farcaster/frame-core';
import { createPublicClient, http, formatEther, getAddress } from 'viem';
import { monadTestnet } from '../lib/wagmi';

// Create Viem client for Monad Testnet
const monadClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz')
});

// Common ERC-20 ABI for balance checking
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
  }
] as const;

// ERC-721 ABI for NFT checking
const ERC721_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }, { name: '_index', type: 'uint256' }],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  }
] as const;

// Known Monad Testnet token contracts (these would need to be updated with real addresses)
const KNOWN_TOKENS = [
  {
    address: '0x0000000000000000000000000000000000000000', // Placeholder - needs real MON token address
    symbol: 'MON',
    name: 'Monad',
    decimals: 18
  }
  // Add more tokens as they become available on testnet
];

// Known NFT contracts on Monad Testnet
const KNOWN_NFTS = [
  // Add real NFT contract addresses when available
  // {
  //   address: '0x...', 
  //   name: 'Monad Genesis',
  //   symbol: 'MGEN'
  // }
];

const fetchNFTMetadata = async (tokenURI: string) => {
  try {
    // Handle IPFS URLs
    let metadataUrl = tokenURI;
    if (tokenURI.startsWith('ipfs://')) {
      metadataUrl = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
    }
    
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const metadata = await response.json();
    return {
      name: metadata.name || 'Unknown NFT',
      description: metadata.description || '',
      image: metadata.image || '',
      attributes: metadata.attributes || []
    };
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return {
      name: 'Unknown NFT',
      description: '',
      image: '',
      attributes: []
    };
  }
};

const fetchNFTsFromContract = async (contractAddress: string, userAddress: string, contractInfo: any): Promise<NFT[]> => {
  try {
    // Get NFT balance
    const balance = await monadClient.readContract({
      address: getAddress(contractAddress),
      abi: ERC721_ABI,
      functionName: 'balanceOf',
      args: [getAddress(userAddress)]
    });
    
    const nftBalance = Number(balance);
    if (nftBalance === 0) {
      return [];
    }
    
    const nfts: NFT[] = [];
    
    // Fetch up to 10 NFTs to avoid too many requests
    const maxNFTs = Math.min(nftBalance, 10);
    
    for (let i = 0; i < maxNFTs; i++) {
      try {
        // Get token ID
        const tokenId = await monadClient.readContract({
          address: getAddress(contractAddress),
          abi: ERC721_ABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [getAddress(userAddress), BigInt(i)]
        });
        
        // Get token URI
        const tokenURI = await monadClient.readContract({
          address: getAddress(contractAddress),
          abi: ERC721_ABI,
          functionName: 'tokenURI',
          args: [tokenId]
        });
        
        // Fetch metadata
        const metadata = await fetchNFTMetadata(tokenURI);
        
        // Handle image URL
        let imageUrl = metadata.image;
        if (imageUrl.startsWith('ipfs://')) {
          imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
        }
        
        nfts.push({
          id: `${contractAddress}-${tokenId}`,
          name: `${metadata.name} #${tokenId}`,
          collection: contractInfo.name,
          imageUrl: imageUrl || 'https://via.placeholder.com/150?text=NFT',
          floorPrice: 0 // Would need marketplace integration
        });
      } catch (tokenError) {
        console.error(`Error fetching NFT ${i}:`, tokenError);
      }
    }
    
    return nfts;
  } catch (error) {
    console.error(`Error fetching NFTs from ${contractInfo.name}:`, error);
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

const fetchTokenBalance = async (tokenAddress: string, userAddress: string, tokenInfo: any) => {
  try {
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      // Skip placeholder addresses
      return null;
    }
    
    const balance = await monadClient.readContract({
      address: getAddress(tokenAddress),
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [getAddress(userAddress)]
    });
    
    const decimals = await monadClient.readContract({
      address: getAddress(tokenAddress),
      abi: ERC20_ABI,
      functionName: 'decimals'
    });
    
    const balanceFormatted = parseFloat(formatEther(balance)) * Math.pow(10, 18 - decimals);
    
    if (balanceFormatted > 0) {
      return {
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        balance: balanceFormatted,
        value: balanceFormatted * 1, // Would need price oracle integration
        price: 1, // Placeholder price
        change24h: 0, // Would need price history
        transactionCount: 0 // Would need transaction history
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching balance for ${tokenInfo.symbol}:`, error);
    return null;
  }
};

export const fetchPortfolio = async (address: string, farcasterUser?: Context.User): Promise<Portfolio> => {
  try {
    console.log('🔍 Fetching portfolio for address:', address);
    
    const userStats = await fetchUserStats(address);
    
    // Get native MON balance
    const nativeBalance = await monadClient.getBalance({ 
      address: getAddress(address) 
    });
    
    const assets: Asset[] = [];
    
    // Add native MON if balance > 0
    const monBalance = parseFloat(formatEther(nativeBalance));
    if (monBalance > 0) {
      assets.push({
        symbol: 'MON',
        name: 'Monad',
        balance: monBalance,
        value: monBalance * 1, // Would need real price data
        price: 1, // Placeholder price
        change24h: 0, // Would need price history
        transactionCount: userStats.totalTransactions
      });
    }
    
    // Fetch known token balances
    for (const token of KNOWN_TOKENS) {
      try {
        const tokenAsset = await fetchTokenBalance(token.address, address, token);
        if (tokenAsset) {
          assets.push(tokenAsset);
        }
      } catch (error) {
        console.error(`Error fetching ${token.symbol}:`, error);
      }
    }
    
    // Fetch NFTs from known contracts
    const nfts: NFT[] = [];
    for (const nftContract of KNOWN_NFTS) {
      try {
        const contractNFTs = await fetchNFTsFromContract(nftContract.address, address, nftContract);
        nfts.push(...contractNFTs);
      } catch (error) {
        console.error(`Error fetching NFTs from ${nftContract.name}:`, error);
      }
    }
    
    // Try to detect NFTs by checking for ERC-721 interface on common addresses
    // This is a fallback method when we don't know specific NFT contracts
    try {
      await detectAndFetchNFTs(address, nfts);
    } catch (error) {
      console.error('Error in NFT detection:', error);
    }
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    console.log('✅ Portfolio fetched:', { 
      totalValue, 
      assetsCount: assets.length, 
      nftsCount: nfts.length,
      transactions: userStats.totalTransactions 
    });
    
    return {
      totalValue,
      assets,
      nfts,
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

const detectAndFetchNFTs = async (userAddress: string, existingNFTs: NFT[]) => {
  // This function would implement NFT detection logic
  // For now, it's a placeholder for future implementation
  // You could:
  // 1. Query known NFT marketplaces
  // 2. Use event logs to find NFT transfers
  // 3. Check against a registry of known NFT contracts
  
  console.log('🔍 NFT detection not yet implemented for unknown contracts');
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