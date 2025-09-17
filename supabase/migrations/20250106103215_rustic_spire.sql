/*
  # Initial Schema Setup for Vocabulary App

  1. New Tables
    - user_stats
      - id (uuid, primary key)
      - user_id (references auth.users)
      - streak (integer)
      - coins (integer)
      - last_login (timestamp)
    - daily_words
      - id (uuid, primary key)
      - word (text)
      - definition (text)
      - challenges (text array)
      - date (date)
    - completed_challenges
      - id (uuid, primary key)
      - user_id (references auth.users)
      - challenge_id (text)
      - completed_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  streak integer DEFAULT 0,
  coins integer DEFAULT 0,
  last_login timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create daily_words table
CREATE TABLE IF NOT EXISTS daily_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  definition text NOT NULL,
  challenges text[] NOT NULL,
  date date DEFAULT CURRENT_DATE
);

-- Create completed_challenges table
CREATE TABLE IF NOT EXISTS completed_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  challenge_id text NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_challenges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can read daily words"
  ON daily_words
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their completed challenges"
  ON completed_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their completed challenges"
  ON completed_challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);