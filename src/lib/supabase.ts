import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
};

const isValidKey = (key: string): boolean => {
  return typeof key === 'string' && key.length > 20 && key.startsWith('eyJ');
};

// Only create client if we have valid values
const hasValidConfig = supabaseUrl && supabaseKey && 
                     supabaseUrl !== 'undefined' && supabaseKey !== 'undefined' &&
                     isValidUrl(supabaseUrl) && isValidKey(supabaseKey);

export const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseKey) : null;

if (!hasValidConfig) {
  console.warn('⚠️ Supabase not properly configured. Stats will not be saved.');
}

// Input sanitization helper
const sanitizeUsername = (username: string): string => {
  if (!username || typeof username !== 'string') {
    throw new Error('Invalid username provided');
  }
  
  const sanitized = username
    .trim()
    .replace(/[<>\"'&]/g, '')
    .substring(0, 50);
  
  if (sanitized.length === 0) {
    throw new Error('Username cannot be empty after sanitization');
  }
  
  return sanitized;
};

// Input validation helper
const validateGameStats = (time: number, moves: number): void => {
  if (!Number.isInteger(time) || time < 0 || time > 86400) {
    throw new Error('Invalid time value');
  }
  
  if (!Number.isInteger(moves) || moves < 0 || moves > 1000) {
    throw new Error('Invalid moves value');
  }
};

export const getUserStats = async (username: string) => {
  if (!supabase) {
    return null;
  }

  try {
    const sanitizedUsername = sanitizeUsername(username);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, username, total_puzzles_solved, best_time, average_moves, created_at, updated_at')
      .eq('username', sanitizedUsername)
      .limit(1);

    if (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Failed to get user stats:', error);
    return null;
  }
};

export const updateUserStats = async (
  username: string,
  time: number,
  moves: number
) => {
  if (!supabase) {
    return null;
  }

  try {
    const sanitizedUsername = sanitizeUsername(username);
    validateGameStats(time, moves);
    
    const currentStats = await getUserStats(sanitizedUsername);
    
    if (!currentStats) {
      // Create new user
      const newUser = await supabase
        .from('users')
        .insert([
          {
            username: sanitizedUsername,
            total_puzzles_solved: 1,
            best_time: time,
            average_moves: moves
          }
        ])
        .select('id, username, total_puzzles_solved, best_time, average_moves, created_at, updated_at')
        .single();
      
      if (newUser.error) {
        throw newUser.error;
      }
      
      return newUser.data;
    }

    // Update existing user
    const currentTotal = currentStats.total_puzzles_solved || 0;
    const newTotalSolved = currentTotal + 1;
    const newBestTime = currentStats.best_time === 0 ? time : Math.min(currentStats.best_time || time, time);
    
    const currentAverage = currentStats.average_moves || 0;
    const newAverageMoves = Math.round(
      ((currentAverage * currentTotal) + moves) / newTotalSolved
    );

    const updateData = {
      total_puzzles_solved: newTotalSolved,
      best_time: newBestTime,
      average_moves: newAverageMoves,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('username', sanitizedUsername)
      .select('id, username, total_puzzles_solved, best_time, average_moves, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update user stats:', error);
    throw error;
  }
};