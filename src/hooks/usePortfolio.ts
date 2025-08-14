import { useState, useEffect } from 'react';
import { Portfolio, Badge, UserProfile, PortfolioSettings } from '../types/portfolio';
import { fetchPortfolio, fetchUserBadges } from '../utils/monadApi';
import type { Context } from '@farcaster/frame-core';

export const usePortfolio = (address: string | null, farcasterUser?: Context.User) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<PortfolioSettings>({
    colorPalette: 'purple',
    hiddenAssets: [],
    showTotalValue: true,
    showBadges: true
  });

  const loadPortfolio = async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const portfolioData = await fetchPortfolio(address, farcasterUser);
      const badgeData = await fetchUserBadges(address, portfolioData, farcasterUser);
      
      setPortfolio(portfolioData);
      setBadges(badgeData);
    } catch (err) {
      console.error('❌ Error loading portfolio:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<PortfolioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('monadfolio-settings', JSON.stringify({ ...settings, ...newSettings }));
  };

  const toggleAssetVisibility = (symbol: string) => {
    const newHiddenAssets = settings.hiddenAssets.includes(symbol)
      ? settings.hiddenAssets.filter(s => s !== symbol)
      : [...settings.hiddenAssets, symbol];
    
    updateSettings({ hiddenAssets: newHiddenAssets });
  };

  const getVisibleAssets = () => {
    if (!portfolio) return [];
    return portfolio.assets.filter(asset => !settings.hiddenAssets.includes(asset.symbol));
  };

  const getEarnedBadges = () => {
    return badges.filter(badge => badge.earned);
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('monadfolio-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (address) {
      loadPortfolio();
    }
  }, [address, farcasterUser?.fid]);

  return {
    portfolio,
    badges,
    loading,
    error,
    settings,
    updateSettings,
    toggleAssetVisibility,
    getVisibleAssets,
    getEarnedBadges,
    refreshPortfolio: loadPortfolio
  };
};