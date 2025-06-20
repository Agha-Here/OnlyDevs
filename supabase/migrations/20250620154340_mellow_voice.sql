/*
  # Complete OnlyDevs Database Schema

  1. New Tables
    - `profiles` - User profiles with authentication data
    - `creators` - Creator-specific data and stats
    - `content` - Creator content uploads
    - `subscriptions` - User subscriptions to creators
    - `messages` - Direct messaging system

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for all operations
    - Secure user data access patterns

  3. Functions
    - Helper functions for incrementing stats
    - Automated triggers for data consistency
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  is_creator boolean DEFAULT false,
  subscription_tier text DEFAULT 'Free Tier',
  subscriptions text[] DEFAULT '{}',
  join_date timestamptz DEFAULT now(),
  total_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio text,
  tech_stack text[] DEFAULT '{}',
  hotness_rating numeric DEFAULT 7.0 CHECK (hotness_rating >= 0 AND hotness_rating <= 10),
  subscriber_count integer DEFAULT 0,
  content_count integer DEFAULT 0,
  earnings numeric DEFAULT 0,
  monthly_earnings numeric DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_online boolean DEFAULT true,
  categories text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  thumbnail_url text,
  video_url text,
  duration text,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  required_tier text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  tier_name text NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(subscriber_id, creator_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Creators policies
CREATE POLICY "Anyone can view creators"
  ON creators FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can update own data"
  ON creators FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Creators can insert own data"
  ON creators FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Content policies
CREATE POLICY "Anyone can view content"
  ON content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage own content"
  ON content FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);

CREATE POLICY "Users can create subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = subscriber_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = subscriber_id)
  WITH CHECK (auth.uid() = subscriber_id);

-- Messages policies
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id)
  WITH CHECK (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Helper functions
CREATE OR REPLACE FUNCTION increment_subscriber_count(creator_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE creators 
  SET subscriber_count = subscriber_count + 1,
      updated_at = now()
  WHERE id = creator_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_creator_earnings(creator_id uuid, amount numeric)
RETURNS void AS $$
BEGIN
  UPDATE creators 
  SET earnings = earnings + amount,
      monthly_earnings = monthly_earnings + amount,
      updated_at = now()
  WHERE id = creator_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_content_count(creator_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE creators 
  SET content_count = content_count + 1,
      updated_at = now()
  WHERE id = creator_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO profiles (id, username, display_name, email, avatar_url, is_creator, subscription_tier, subscriptions, total_spent) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'codequeen', 'Sarah Chen', 'sarah@example.com', 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Free Tier', '{}', 0),
  ('550e8400-e29b-41d4-a716-446655440002', 'algorithmdaddy', 'Marcus Rivera', 'marcus@example.com', 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Free Tier', '{}', 0),
  ('550e8400-e29b-41d4-a716-446655440003', 'devdiva', 'Zoe Taylor', 'zoe@example.com', 'https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Free Tier', '{}', 0),
  ('550e8400-e29b-41d4-a716-446655440004', 'hackergirl', 'Luna Rodriguez', 'luna@example.com', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Free Tier', '{}', 0),
  ('550e8400-e29b-41d4-a716-446655440005', 'cloudking', 'Alex Thompson', 'alex@example.com', 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Free Tier', '{}', 0),
  ('550e8400-e29b-41d4-a716-446655440006', 'aigoddess', 'Priya Patel', 'priya@example.com', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400', true, 'Free Tier', '{}', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO creators (id, bio, tech_stack, hotness_rating, subscriber_count, content_count, earnings, monthly_earnings, is_verified, is_online, categories) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Full-stack goddess who makes React look sexy 💅 FAANG veteran turned indie creator', '{"React", "Node.js", "TypeScript", "AWS"}', 9.2, 1247, 89, 15420, 4200, true, true, '{"coding-in-bed", "strip-the-bug", "dirty-algorithms"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Your favorite algorithm daddy 🔥 Making data structures irresistible since 2019', '{"Python", "Machine Learning", "Go", "Kubernetes"}', 8.9, 892, 156, 12890, 3100, true, false, '{"strip-the-bug", "dirty-algorithms", "private-sessions"}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mobile dev diva who knows how to make apps that make you swipe right 📱✨', '{"Swift", "Kotlin", "Flutter", "React Native"}', 9.5, 2156, 234, 28750, 6800, true, true, '{"coding-in-bed", "strip-the-bug", "dirty-algorithms", "private-sessions", "hot-takes"}'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Cybersecurity queen who will hack your heart and secure your code 🔐💕', '{"Python", "Rust", "Linux", "Docker"}', 9.1, 1456, 178, 18900, 4500, true, true, '{"coding-in-bed", "strip-the-bug", "dirty-algorithms", "private-sessions"}'),
  ('550e8400-e29b-41d4-a716-446655440005', 'AWS architect who will make your infrastructure as solid as my abs 💪☁️', '{"AWS", "Terraform", "Kubernetes", "Python"}', 8.7, 987, 134, 14200, 3400, true, false, '{"dirty-algorithms", "private-sessions", "hot-takes"}'),
  ('550e8400-e29b-41d4-a716-446655440006', 'AI researcher who will train your models and your heart 🤖💖', '{"TensorFlow", "PyTorch", "Python", "CUDA"}', 9.3, 1789, 201, 22100, 5200, true, true, '{"strip-the-bug", "dirty-algorithms", "private-sessions", "hot-takes"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO content (creator_id, title, description, category, thumbnail_url, duration, views, likes, required_tier) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Debugging in My Pajamas 🛏️', 'Late night React debugging session in my cozy bedroom setup', 'coding-in-bed', 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400', '45:32', 2847, 234, 'Simp Tier'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Why Your Code is Uglier Than My Ex 💔', 'Brutal code review session with some tough love', 'hot-takes', 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400', '32:18', 1923, 189, 'Free Tier'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Strip This React Component With Me 🔥', 'Breaking down complex components layer by layer', 'strip-the-bug', 'https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg?auto=compress&cs=tinysrgb&w=400', '28:45', 3456, 412, 'Sugar Daddy Tier'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Intimate TypeScript Tutorial 💕', 'Get close and personal with advanced TypeScript features', 'private-sessions', 'https://images.pexels.com/photos/4348405/pexels-photo-4348405.jpeg?auto=compress&cs=tinysrgb&w=400', '52:15', 1876, 298, 'Whale Tier'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Hacking Hearts and Systems 💖', 'Cybersecurity fundamentals with a romantic twist', 'dirty-algorithms', 'https://images.pexels.com/photos/4348406/pexels-photo-4348406.jpeg?auto=compress&cs=tinysrgb&w=400', '38:22', 2134, 345, 'Sugar Daddy Tier'),
  ('550e8400-e29b-41d4-a716-446655440006', 'AI Models That Make You Swoon 🤖', 'Deep learning techniques that will blow your mind', 'dirty-algorithms', 'https://images.pexels.com/photos/4348407/pexels-photo-4348407.jpeg?auto=compress&cs=tinysrgb&w=400', '41:33', 2987, 456, 'Simp Tier')
ON CONFLICT DO NOTHING;