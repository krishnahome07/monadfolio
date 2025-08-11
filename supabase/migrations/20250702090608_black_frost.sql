/*
  # Create users table for puzzle game statistics

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `username` (text, unique, not null) - User's chosen username
      - `total_puzzles_solved` (integer, default 0) - Count of completed puzzles
      - `best_time` (integer, default 0) - Best completion time in seconds
      - `average_moves` (integer, default 0) - Average moves per puzzle
      - `created_at` (timestamptz, default now()) - Account creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for anonymous users to read all user data (for leaderboards)
    - Add policy for anonymous users to insert new users
    - Add policy for anonymous users to update existing users by username
*/

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  total_puzzles_solved integer DEFAULT 0,
  best_time integer DEFAULT 0,
  average_moves integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read all user data (for leaderboards and stats)
CREATE POLICY "Allow anonymous users to read user data"
  ON public.users
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert new users
CREATE POLICY "Allow anonymous users to create users"
  ON public.users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update user stats
CREATE POLICY "Allow anonymous users to update user stats"
  ON public.users
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);