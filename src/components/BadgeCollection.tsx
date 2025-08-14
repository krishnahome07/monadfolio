import React, { useState } from 'react';
import { Trophy, Award, Star, Flame, Zap, Palette } from 'lucide-react';
import { Badge } from '../types/portfolio';

interface BadgeCollectionProps {
  badges: Badge[];
  onShareBadges?: () => void;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  '🏆': <Trophy className="w-6 h-6" />,
  '🎨': <Palette className="w-6 h-6" />,
  '🐋': <div className="text-2xl">🐋</div>,
  '📊': <div className="text-2xl">📊</div>,
  '⚡': <Zap className="w-6 h-6" />,
  '🔥': <Flame className="w-6 h-6" />
};

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600'
};

const RARITY_BORDERS = {
  common: 'border-gray-300',
  rare: 'border-blue-400',
  legendary: 'border-yellow-400'
};

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  onShareBadges
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'nft' | 'portfolio' | 'usage'>('all');
  
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);
  
  const filteredEarnedBadges = selectedCategory === 'all' 
    ? earnedBadges 
    : earnedBadges.filter(badge => badge.category === selectedCategory);
  
  const filteredUnearnedBadges = selectedCategory === 'all'
    ? unearnedBadges
    : unearnedBadges.filter(badge => badge.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nft': return '🎨';
      case 'portfolio': return '💼';
      case 'usage': return '⚡';
      default: return '🏆';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Badge Collection</h2>
              <p className="text-yellow-100">
                {earnedBadges.length} of {badges.length} badges earned
              </p>
            </div>
          </div>
          {earnedBadges.length > 0 && onShareBadges && (
            <button
              onClick={onShareBadges}
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-semibold"
            >
              Share Badges
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round((earnedBadges.length / badges.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex space-x-2">
          {['all', 'portfolio', 'usage'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Earned Badges */}
      {filteredEarnedBadges.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Earned Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEarnedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-4 rounded-xl border-2 ${RARITY_BORDERS[badge.rarity]} bg-gradient-to-r ${RARITY_COLORS[badge.rarity]} text-white transform hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    {BADGE_ICONS[badge.icon] || <div className="text-2xl">{badge.icon}</div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg">{badge.name}</h4>
                      <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        {badge.rarity}
                      </div>
                    </div>
                    <p className="text-sm opacity-90 mt-1">{badge.description}</p>
                    {badge.earnedAt && (
                      <p className="text-xs opacity-75 mt-2">
                        Earned {formatDate(badge.earnedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unearned Badges */}
      {filteredUnearnedBadges.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-5 h-5 border-2 border-gray-400 rounded-full mr-2" />
            Available Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUnearnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {BADGE_ICONS[badge.icon] || <div className="text-2xl grayscale">{badge.icon}</div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg text-gray-700">{badge.name}</h4>
                      <div className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
                        {badge.rarity}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEarnedBadges.length === 0 && filteredUnearnedBadges.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No badges in this category</h3>
          <p className="text-gray-500">Try selecting a different category to see available badges.</p>
        </div>
      )}
    </div>
  );
};