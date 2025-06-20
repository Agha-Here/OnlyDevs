import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnclrfzxxxbpcavzinmj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2xyZnp4eHhicGNhdnppbm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODUwMzEsImV4cCI6MjA2NTc2MTAzMX0.z6L1bybJp1iGJlgN7N3IMlmNYmMcgIihLMPtnFt8pV0';
//import.meta.env.VITE_SUPABASE_ANON_KEY
  
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  is_creator: boolean;
  subscription_tier: string;
  subscriptions: string[];
  join_date: string;
  total_spent: number;
}

export interface Creator {
  id: string;
  bio?: string;
  tech_stack: string[];
  hotness_rating: number;
  subscriber_count: number;
  content_count: number;
  earnings: number;
  monthly_earnings: number;
  is_verified: boolean;
  is_online: boolean;
  categories: string[];
  profile?: Profile;
}

export interface Content {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  category: string;
  thumbnail_url?: string;
  duration?: string;
  views: number;
  likes: number;
  required_tier: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  subscriber_id: string;
  creator_id: string;
  tier_name: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'cancelled';
  amount: number;
}

// Auth helpers
export const signUp = async (
  email: string, 
  password: string, 
  username: string, 
  displayName: string, 
  isCreator: boolean = false
) => {
  // Validate email format
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Check if email exists
  const { data: existingEmail } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .single();

  if (existingEmail) {
    throw new Error('Email already registered');
  }

  // Check if username exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existingUser) {
    throw new Error('Username already taken');
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName,
        is_creator: isCreator,
      }
    }
  });

  if (authError) throw authError;

  if (authData.user) {
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        username,
        display_name: displayName,
        is_creator: isCreator,
        subscription_tier: 'Free Tier',
        subscriptions: [],
        total_spent: 0,
        join_date: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // Create creator profile if applicable
    if (isCreator) {
      const { error: creatorError } = await supabase
        .from('creators')
        .insert({
          id: authData.user.id,
          bio: `Hey there! I'm ${displayName}, ready to share my coding knowledge!`,
          tech_stack: [],
          hotness_rating: 7.0,
          subscriber_count: 0,
          content_count: 0,
          earnings: 0,
          monthly_earnings: 0,
          is_verified: false,
          is_online: true,
          categories: []
        });

      if (creatorError) throw creatorError;
    }
  }

  return authData;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
};

export const getCreator = async (userId: string) => {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Creator & { profile: Profile };
};

export const getAllCreators = async () => {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      *,
      profile:profiles(*)
    `)
    .order('subscriber_count', { ascending: false });

  if (error) throw error;
  return data as (Creator & { profile: Profile })[];
};

export const getCreatorByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      creator:creators(*)
    `)
    .eq('username', username)
    .eq('is_creator', true)
    .single();

  if (error) throw error;
  return data as Profile & { creator: Creator };
};

export const getCreatorContent = async (creatorId: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const seedSampleData = async () => {
  // You can leave this empty or add mock seeding logic if you want
  return;
};

export const subscribeToCreator = async (
  subscriberId: string,
  creatorId: string,
  tierName: string
) => {
  // Check if already subscribed
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .eq('status', 'active')
    .single();

  if (existingSub) {
    throw new Error('Already subscribed to this creator');
  }

  // Get tier price
  const tierPrice = getTierPrice(tierName);

  // Start transaction
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      subscriber_id: subscriberId,
      creator_id: creatorId,
      tier_name: tierName,
      start_date: new Date().toISOString(),
      status: 'active',
      amount: tierPrice
    })
    .select()
    .single();

  if (error) throw error;

  // Update creator stats
  await supabase.rpc('increment_subscriber_count', { creator_id: creatorId });
  await supabase.rpc('increment_creator_earnings', { 
    creator_id: creatorId,
    amount: tierPrice 
  });

  return data as Subscription;
};

export const createContent = async (content: Partial<Content>) => {
  const { data, error } = await supabase
    .from('content')
    .insert(content)
    .select()
    .single();

  if (error) throw error;

  // Update creator content count
  await supabase.rpc('increment_content_count', { 
    creator_id: content.creator_id 
  });

  return data as Content;
};

export const getUserSubscriptions = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      creator:creators(
        *,
        profile:profiles(*)
      )
    `)
    .eq('subscriber_id', userId)
    .eq('status', 'active');

  if (error) throw error;
  return data as (Subscription & { 
    creator: Creator & { profile: Profile } 
  })[];
};

const getTierPrice = (tierName: string): number => {
  const tiers = {
    'Free Tier': 0,
    'Simp Tier': 9,
    'Sugar Daddy Tier': 25,
    'Whale Tier': 60
  };
  return tiers[tierName as keyof typeof tiers] || 0;
};