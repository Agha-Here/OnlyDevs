import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnclrfzxxxbpcavzinmj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2xyZnp4eHhicGNhdnppbm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODUwMzEsImV4cCI6MjA2NTc2MTAzMX0.z6L1bybJp1iGJlgN7N3IMlmNYmMcgIihLMPtnFt8pV0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url?: string
  is_creator: boolean
  subscription_tier: string
  subscriptions: string[]
  join_date: string
  total_spent: number
}

export interface Creator {
  id: string
  bio?: string
  tech_stack: string[]
  hotness_rating: number
  subscriber_count: number
  content_count: number
  earnings: number
  monthly_earnings: number
  is_verified: boolean
  is_online: boolean
  categories: string[]
  profile?: Profile
}

export interface Content {
  id: string
  creator_id: string
  title: string
  description?: string
  category: string
  thumbnail_url?: string
  duration?: string
  views: number
  likes: number
  required_tier: string
  created_at: string
}

export interface Subscription {
  id: string
  subscriber_id: string
  creator_id: string
  tier_name: string
  start_date: string
  end_date?: string
  status: string
}

// Auth helpers
export const signUp = async (email: string, password: string, username: string, displayName: string, isCreator: boolean = false) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  if (authData.user) {
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username,
        display_name: displayName,
        is_creator: isCreator,
        subscription_tier: 'Free Tier',
        subscriptions: [],
        total_spent: 0
      })

    if (profileError) throw profileError

    // If creator, create creator profile
    if (isCreator) {
      const { error: creatorError } = await supabase
        .from('creators')
        .insert({
          id: authData.user.id,
          bio: '',
          tech_stack: [],
          hotness_rating: 0,
          subscriber_count: 0,
          content_count: 0,
          earnings: 0,
          monthly_earnings: 0,
          is_verified: false,
          is_online: false,
          categories: []
        })

      if (creatorError) throw creatorError
    }
  }

  return authData
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Profile
}

export const getCreator = async (userId: string) => {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Creator & { profile: Profile }
}

export const getAllCreators = async () => {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      *,
      profile:profiles(*)
    `)
    .order('subscriber_count', { ascending: false })

  if (error) throw error
  return data as (Creator & { profile: Profile })[]
}

export const getCreatorByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      creator:creators(*)
    `)
    .eq('username', username)
    .eq('is_creator', true)
    .single()

  if (error) throw error
  return data as Profile & { creator: Creator }
}

export const getCreatorContent = async (creatorId: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Content[]
}

export const subscribeToCreator = async (subscriberId: string, creatorId: string, tierName: string) => {
  // Check if subscription already exists
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .eq('status', 'active')
    .single()

  if (existing) {
    throw new Error('Already subscribed to this creator')
  }

  // Create subscription
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      subscriber_id: subscriberId,
      creator_id: creatorId,
      tier_name: tierName,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error

  // Update creator subscriber count
  const { error: updateError } = await supabase.rpc('increment_subscriber_count', {
    creator_id: creatorId
  })

  if (updateError) console.error('Failed to update subscriber count:', updateError)

  // Update subscriber's subscriptions array
  const { error: profileError } = await supabase.rpc('add_subscription', {
    user_id: subscriberId,
    creator_id: creatorId
  })

  if (profileError) console.error('Failed to update profile subscriptions:', profileError)

  return data as Subscription
}

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
    .eq('status', 'active')

  if (error) throw error
  return data as (Subscription & { creator: Creator & { profile: Profile } })[]
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export const updateCreator = async (userId: string, updates: Partial<Creator>) => {
  const { data, error } = await supabase
    .from('creators')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Creator
}