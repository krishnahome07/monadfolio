import { useState, useEffect } from 'react';
import { NewsItem } from '../types/portfolio';
import { fetchMonadNews } from '../utils/monadApi';

export const useMonadNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📰 Loading Monad news...');
      const newsData = await fetchMonadNews();
      setNews(newsData);
      console.log('✅ News loaded successfully');
    } catch (err) {
      console.error('❌ Error loading news:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const getNewsByCategory = (category: 'official' | 'ecosystem' | 'news') => {
    return news.filter(item => item.category === category);
  };

  const getRecentNews = (hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return news.filter(item => item.publishedAt > cutoff);
  };

  useEffect(() => {
    loadNews();
    
    // Refresh news every 30 minutes
    const interval = setInterval(loadNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    news,
    loading,
    error,
    refreshNews: loadNews,
    getNewsByCategory,
    getRecentNews
  };
};