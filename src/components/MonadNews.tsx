import React, { useState } from 'react';
import { Newspaper, ExternalLink, Clock, Filter, RefreshCw } from 'lucide-react';
import { NewsItem } from '../types/portfolio';

interface MonadNewsProps {
  news: NewsItem[];
  loading?: boolean;
  onRefresh?: () => void;
}

const CATEGORY_COLORS = {
  official: 'bg-purple-100 text-purple-800 border-purple-200',
  ecosystem: 'bg-blue-100 text-blue-800 border-blue-200',
  news: 'bg-green-100 text-green-800 border-green-200'
};

const CATEGORY_ICONS = {
  official: '🏛️',
  ecosystem: '🌐',
  news: '📰'
};

export const MonadNews: React.FC<MonadNewsProps> = ({
  news,
  loading = false,
  onRefresh
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'official' | 'ecosystem' | 'news'>('all');
  
  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Newspaper className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Monad News</h2>
              <p className="text-indigo-100">
                Latest updates from the Monad ecosystem
              </p>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex space-x-2">
            {['all', 'official', 'ecosystem', 'news'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category !== 'all' && (
                  <span className="mr-1">{CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}</span>
                )}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading latest news...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNewsClick(item.url)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          CATEGORY_COLORS[item.category]
                        }`}
                      >
                        <span className="mr-1">{CATEGORY_ICONS[item.category]}</span>
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.source}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(item.publishedAt)}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No News Available</h3>
            <p className="text-gray-500">
              News feed is not currently connected to live data sources. 
              Check back later for the latest Monad ecosystem updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};