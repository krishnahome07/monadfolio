import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, Palette, Share2, RefreshCw } from 'lucide-react';
import { Portfolio, PortfolioSettings, ColorPalette } from '../types/portfolio';

interface PortfolioSnapshotProps {
  portfolio: Portfolio;
  settings: PortfolioSettings;
  onSettingsChange: (settings: Partial<PortfolioSettings>) => void;
  onToggleAsset: (symbol: string) => void;
  onShare: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

const COLOR_PALETTES: Record<ColorPalette, { name: string; colors: string[] }> = {
  purple: {
    name: 'Purple Haze',
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE']
  },
  blue: {
    name: 'Ocean Blue',
    colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE']
  },
  green: {
    name: 'Forest Green',
    colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5']
  },
  orange: {
    name: 'Sunset Orange',
    colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7']
  },
  pink: {
    name: 'Rose Pink',
    colors: ['#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8', '#FCE7F3']
  }
};

export const PortfolioSnapshot: React.FC<PortfolioSnapshotProps> = ({
  portfolio,
  settings,
  onSettingsChange,
  onToggleAsset,
  onShare,
  onRefresh,
  loading = false
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const visibleAssets = portfolio.assets.filter(
    asset => !settings.hiddenAssets.includes(asset.symbol)
  );
  
  const totalVisibleValue = visibleAssets.reduce((sum, asset) => sum + asset.value, 0);
  const colors = COLOR_PALETTES[settings.colorPalette].colors;

  const getAssetSize = (asset: any) => {
    const percentage = (asset.value / totalVisibleValue) * 100;
    return Math.max(percentage, 5); // Minimum 5% for visibility
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Portfolio Snapshot</h2>
              <p className="text-purple-100">
                Last updated: {portfolio.lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
            >
              <Palette className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Total Value */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">
              {settings.showTotalValue ? `$${totalVisibleValue.toLocaleString()}` : '••••••'}
            </div>
            <div className="text-purple-100">
              {visibleAssets.length} assets • {portfolio.nfts.length} NFTs
            </div>
          </div>
          <button
            onClick={() => onSettingsChange({ showTotalValue: !settings.showTotalValue })}
            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            {settings.showTotalValue ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="space-y-4">
            {/* Color Palette Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Palette
              </label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
                  <button
                    key={key}
                    onClick={() => onSettingsChange({ colorPalette: key as ColorPalette })}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                      settings.colorPalette === key
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex space-x-1">
                      {palette.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-xs mt-1 text-gray-600">{palette.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Visibility
              </label>
              <div className="space-y-2">
                {portfolio.assets.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[portfolio.assets.indexOf(asset) % colors.length] }}
                      />
                      <span className="text-sm font-medium">{asset.symbol}</span>
                      <span className="text-sm text-gray-500">${asset.value.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => onToggleAsset(asset.symbol)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      {settings.hiddenAssets.includes(asset.symbol) ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Visualization */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-h-[200px]">
          {visibleAssets.map((asset, index) => {
            const size = getAssetSize(asset);
            const color = colors[index % colors.length];
            const heightPercentage = Math.max(size * 2, 30); // Ensure minimum height
            
            return (
              <div
                key={asset.symbol}
                className="rounded-lg flex flex-col justify-center items-center text-white font-semibold transition-all duration-300 hover:scale-105 cursor-pointer p-3"
                style={{ 
                  backgroundColor: color, 
                  minHeight: `${heightPercentage}px`,
                  height: `${Math.max(heightPercentage, 80)}px`
                }}
                title={`${asset.name}: $${asset.value.toLocaleString()} (${size.toFixed(1)}%)`}
              >
                <div className="text-base md:text-lg font-bold text-center">{asset.symbol}</div>
                <div className="text-xs md:text-sm opacity-90 text-center">${asset.value.toLocaleString()}</div>
                <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-200' : 'text-red-200'} text-center`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NFT Showcase */}
      {portfolio.nfts.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">NFT Collection</h3>
          <div className="grid grid-cols-4 gap-4">
            {portfolio.nfts.slice(0, 4).map((nft) => (
              <div key={nft.id} className="relative group">
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="font-semibold">{nft.name}</div>
                    {nft.floorPrice && (
                      <div>{nft.floorPrice} ETH</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onShare}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Portfolio</span>
        </button>
      </div>
    </div>
  );
};