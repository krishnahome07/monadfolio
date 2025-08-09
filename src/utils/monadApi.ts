import { ethers } from 'ethers';
import { switchChain } from 'viem/actions';
import { createWalletClient, custom } from 'viem';
import { Portfolio, Asset, NFT, Badge, UserProfile, NewsItem } from '../types/portfolio';

// Mock Monad RPC endpoint - replace with actual endpoint
const MONAD_RPC_URL = 'https://rpc.monad.xyz';

// Monad Testnet configuration
const MONAD_TESTNET = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet1.monad.xyz'],
    },
    public: {
      http: ['https://testnet1.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
};

export const checkAndSwitchToMonad = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('No wallet detected');
      return false;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    // Check if already on Monad Testnet
    if (Number(network.chainId) === MONAD_TESTNET.id) {
      console.log('✅ Already connected to Monad Testnet');
      return true;
    }

    console.log(`🔄 Switching from chain ${network.chainId} to Monad Testnet (${MONAD_TESTNET.id})`);
    
    // Create wallet client for viem
    const walletClient = createWalletClient({
      transport: custom(window.ethereum)
    });

    try {
      // Try to switch to Monad Testnet
      await switchChain(walletClient, { id: MONAD_TESTNET.id });
      console.log('✅ Successfully switched to Monad Testnet');
      return true;
    } catch (switchError: any) {
      // If switch fails, try to add the network first
      if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain ID')) {
        console.log('🔧 Adding Monad Testnet to wallet...');
        
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${MONAD_TESTNET.id.toString(16)}`,
            chainName: MONAD_TESTNET.name,
            nativeCurrency: MONAD_TESTNET.nativeCurrency,
            rpcUrls: MONAD_TESTNET.rpcUrls.default.http,
            blockExplorerUrls: [MONAD_TESTNET.blockExplorers.default.url],
          }],
        });
        
        console.log('✅ Monad Testnet added and switched successfully');
        return true;
      }
      
      throw switchError;
    }
  } catch (error) {
    console.error('❌ Failed to switch to Monad Testnet:', error);
    return false;
  }
};

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
  // Generate a more detailed portfolio visualization for NFT
  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];
  const visibleAssets = portfolio.assets.filter(asset => !asset.hidden);
  const totalValue = visibleAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const assetBlocks = visibleAssets.map((asset, index) => {
    const percentage = (asset.value / totalValue) * 100;
    const height = Math.max(percentage * 2, 20);
    const color = colors[index % colors.length];
    const x = 50 + (index * 80);
    
    return `
      <rect x="${x}" y="${200 - height}" width="60" height="${height}" fill="${color}" rx="8"/>
      <text x="${x + 30}" y="${220}" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${asset.symbol}</text>
      <text x="${x + 30}" y="${235}" text-anchor="middle" fill="white" font-size="8">$${asset.value.toLocaleString()}</text>
    `;
  }).join('');
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6B46C1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="500" height="300" fill="url(#bg)" rx="20"/>
      <text x="250" y="40" text-anchor="middle" fill="white" font-size="24" font-weight="bold">Monadfolio Portfolio</text>
      <text x="250" y="65" text-anchor="middle" fill="#E0E7FF" font-size="14">On-Chain Identity NFT</text>
      ${assetBlocks}
      <text x="250" y="260" text-anchor="middle" fill="white" font-size="16" font-weight="bold">
        ${showTotalValue ? `Total: $${totalValue.toLocaleString()}` : 'Portfolio Value Hidden'}
      </text>
      <text x="250" y="280" text-anchor="middle" fill="#C4B5FD" font-size="12">
        ${visibleAssets.length} Assets • ${portfolio.nfts.length} NFTs • Powered by Monad
      </text>
    </svg>
  `)}`;
};

export const mintPortfolioNFT = async (
  userAddress: string,
  portfolio: Portfolio,
  colorPalette: string,
  showTotalValue: boolean
): Promise<{ success: boolean; txHash?: string; tokenId?: string; error?: string }> => {
  try {
    console.log('🎨 Starting portfolio NFT minting process...');
    
    // Ensure we're on Monad network before minting
    const networkSwitched = await checkAndSwitchToMonad();
    if (!networkSwitched) {
      throw new Error('Please switch to Monad Testnet to mint NFT');
    }
    
    // Generate portfolio image for NFT metadata
    const imageUrl = await generatePortfolioImage(
      portfolio,
      colorPalette,
      showTotalValue
    );
    
    // Create NFT metadata
    const metadata = {
      name: `Monadfolio Portfolio #${Date.now()}`,
      description: `On-chain portfolio identity featuring ${portfolio.assets.length} assets and ${portfolio.nfts.length} NFTs on Monad blockchain. Total value: ${showTotalValue ? `$${portfolio.totalValue.toLocaleString()}` : 'Hidden'}`,
      image: imageUrl,
      attributes: [
        {
          trait_type: "Total Assets",
          value: portfolio.assets.length
        },
        {
          trait_type: "NFT Count", 
          value: portfolio.nfts.length
        },
        {
          trait_type: "Portfolio Value",
          value: showTotalValue ? portfolio.totalValue : "Hidden"
        },
        {
          trait_type: "Color Palette",
          value: colorPalette
        },
        {
          trait_type: "Blockchain",
          value: "Monad"
        },
        {
          trait_type: "Network",
          value: "Monad Testnet"
        },
        {
          trait_type: "Created Date",
          value: new Date().toISOString().split('T')[0]
        }
      ],
      external_url: "https://monadfolio.vercel.app",
      background_color: "6B46C1"
    };
    
    // In a real implementation, this would:
    // 1. Upload metadata to IPFS
    // 2. Call Monad Testnet NFT contract to mint
    // 3. Return transaction hash and token ID
    
    // For demo purposes, simulate the minting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    const mockTokenId = Math.floor(Math.random() * 10000).toString();
    
    console.log('✅ Portfolio NFT minted successfully on Monad Testnet!');
    console.log('📄 Transaction Hash:', mockTxHash);
    console.log('🎨 Token ID:', mockTokenId);
    
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

export const connectWallet = async (): Promise<string | null> => {
  try {
    console.log('🔌 Attempting wallet connection...');
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.ethereum) {
      console.log('🦊 MetaMask detected, requesting accounts...');
      
      // First ensure we're on the correct network
      const networkSwitched = await checkAndSwitchToMonad();
      if (!networkSwitched) {
        throw new Error('Failed to connect to Monad network');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts && accounts.length > 0) {
        console.log('✅ Wallet connected:', accounts[0]);
        return accounts[0];
      }
    }
    
    console.log('⚠️ No wallet detected or no accounts available');
    return null;
  } catch (error) {
    console.error('❌ Wallet connection failed:', error);
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