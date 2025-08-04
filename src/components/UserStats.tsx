import React, { useState, useEffect } from 'react';
import { User, Trophy, Clock, TrendingUp, Users } from 'lucide-react';
import { UserStats as UserStatsType } from '../types/game';
import { getUserStats } from '../lib/supabase';
import { formatTime } from '../utils/gameLogic';
import type { Context } from '@farcaster/frame-core';

interface UserStatsProps {
  userIdentifier: string | null;
  farcasterUser?: Context.User;
  isInFarcaster: boolean;
  refreshTrigger?: number;
}

export const UserStats: React.FC<UserStatsProps> = ({ 
  userIdentifier, 
  farcasterUser, 
  isInFarcaster,
  refreshTrigger = 0
}) => {
  const [stats, setStats] = useState<UserStatsType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userIdentifier) {
      loadUserStats();
    }
  }, [userIdentifier, refreshTrigger]);

  const loadUserStats = async () => {
    if (!userIdentifier) return;
    
    setLoading(true);
    try {
      console.log('📊 Loading stats for user:', userIdentifier);
      const userStats = await getUserStats(userIdentifier);
      console.log('📈 Loaded stats:', userStats);
      setStats(userStats);
    } catch (error) {
      console.error('❌ Error loading user stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (farcasterUser) {
      return farcasterUser.displayName || farcasterUser.username || `User ${farcasterUser.fid}`;
    }
    return userIdentifier?.startsWith('guest_') ? 'Guest Player' : (userIdentifier || 'Anonymous Player');
  };

  const getAvatarUrl = () => {
    return farcasterUser?.pfpUrl || null;
  };

  const isGuestUser = !farcasterUser && userIdentifier?.startsWith('guest_');

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-shrink-0">
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-purple-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-800">{getDisplayName()}</h2>
              {isInFarcaster && (
                <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  <Users className="w-3 h-3" />
                  <span>Farcaster</span>
                </div>
              )}
            </div>
            {farcasterUser?.username && (
              <p className="text-sm text-gray-600">@{farcasterUser.username}</p>
            )}
            {isGuestUser && (
              <p className="text-xs text-purple-600 mt-1">
                For better experience try farcaster mini app
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading stats...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{stats.total_puzzles_solved || 0}</div>
              <div className="text-sm text-purple-600">Puzzles Solved</div>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                {stats.best_time > 0 ? formatTime(stats.best_time) : '--:--'}
              </div>
              <div className="text-sm text-blue-600">Best Time</div>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-orange-100 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{stats.average_moves || 0}</div>
              <div className="text-sm text-green-600">Avg Moves</div>
            </div>
          </div>
        ) : userIdentifier ? (
          <div className="text-center py-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">New player!</p>
              <p className="text-sm text-gray-600 mt-1">Complete your first puzzle to see stats</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Welcome to Number Crunch!</p>
              <p className="text-sm text-gray-600 mt-1">Start playing to track your progress</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};