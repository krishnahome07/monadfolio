export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
  hidden?: boolean;
  transactionCount?: number;
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  floorPrice?: number;
}

export interface UserStats {
  monadBalance: number;
  totalTransactions: number;
  isActiveWallet: boolean;
  firstTransactionDate?: Date;
  stakingAmount: number;
  activeProtocols: string[];
}

export interface Portfolio {
  totalValue: number;
  assets: Asset[];
  nfts: NFT[];
  lastUpdated: Date;
  userStats?: UserStats;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'nft' | 'portfolio' | 'usage';
  earned: boolean;
  earnedAt?: Date;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface UserProfile {
  address: string;
  portfolio: Portfolio;
  badges: Badge[];
  stats: {
    totalTransactions: number;
    firstTransactionDate: Date;
    activeProtocols: string[];
    stakingAmount: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: 'official' | 'ecosystem' | 'news';
}

export type ColorPalette = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

export interface PortfolioSettings {
  colorPalette: ColorPalette;
  hiddenAssets: string[];
  showTotalValue: boolean;
  showBadges: boolean;
}