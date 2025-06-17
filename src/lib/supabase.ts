import { createClient } from '@supabase/supabase-js'

const supabaseUrl = https://hnclrfzxxxbpcavzinmj.supabase.co
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2xyZnp4eHhicGNhdnppbm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODUwMzEsImV4cCI6MjA2NTc2MTAzMX0.z6L1bybJp1iGJlgN7N3IMlmNYmMcgIihLMPtnFt8pV0
//import.meta.env.VITE_SUPABASE_ANON_KEY
  
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
  // Check if username already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    throw new Error("That username's taken by another coding hottie!")
  }

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

    // If creator, create creator profile with sample data
    if (isCreator) {
      const sampleTechStacks = [
        ['React', 'TypeScript', 'Node.js'],
        ['Python', 'Django', 'PostgreSQL'],
        ['Vue.js', 'JavaScript', 'Express'],
        ['Angular', 'TypeScript', 'MongoDB'],
        ['React Native', 'Swift', 'Kotlin'],
        ['Go', 'Docker', 'Kubernetes'],
        ['Rust', 'WebAssembly', 'Linux'],
        ['Java', 'Spring', 'MySQL']
      ]

      const randomTechStack = sampleTechStacks[Math.floor(Math.random() * sampleTechStacks.length)]

      const { error: creatorError } = await supabase
        .from('creators')
        .insert({
          id: authData.user.id,
          bio: `Passionate developer ready to share knowledge and make coding sexy! 💻✨`,
          tech_stack: randomTechStack,
          hotness_rating: Math.random() * 3 + 7, // 7-10 rating
          subscriber_count: Math.floor(Math.random() * 100),
          content_count: Math.floor(Math.random() * 50),
          earnings: Math.random() * 5000,
          monthly_earnings: Math.random() * 1000,
          is_verified: Math.random() > 0.7,
          is_online: Math.random() > 0.5,
          categories: ['Coding in Bed', 'Strip the Bug', 'Dirty Algorithms']
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
  const { error: updateError } = await supabase
    .from('creators')
    .update({ 
      subscriber_count: supabase.sql`subscriber_count + 1`,
      earnings: supabase.sql`earnings + ${getTierPrice(tierName)}`,
      monthly_earnings: supabase.sql`monthly_earnings + ${getTierPrice(tierName)}`
    })
    .eq('id', creatorId)

  if (updateError) console.error('Failed to update creator stats:', updateError)

  // Update subscriber's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscriptions, total_spent')
    .eq('id', subscriberId)
    .single()

  if (profile) {
    const newSubscriptions = [...(profile.subscriptions || []), creatorId]
    const newTotalSpent = (profile.total_spent || 0) + getTierPrice(tierName)

    await supabase
      .from('profiles')
      .update({ 
        subscriptions: newSubscriptions,
        total_spent: newTotalSpent,
        subscription_tier: tierName
      })
      .eq('id', subscriberId)
  }

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

export const createContent = async (content: Omit<Content, 'id' | 'created_at' | 'views' | 'likes'>) => {
  const { data, error } = await supabase
    .from('content')
    .insert({
      ...content,
      views: 0,
      likes: 0
    })
    .select()
    .single()

  if (error) throw error

  // Update creator content count
  await supabase
    .from('creators')
    .update({ content_count: supabase.sql`content_count + 1` })
    .eq('id', content.creator_id)

  return data as Content
}

// Helper function to get tier price
const getTierPrice = (tierName: string): number => {
  const prices: { [key: string]: number } = {
    'Free Tier': 0,
    'Simp Tier': 9,
    'Sugar Daddy Tier': 25,
    'Whale Tier': 60
  }
  return prices[tierName] || 0
}

// Seed sample data
export const seedSampleData = async () => {
  try {
    // Check if we already have creators
    const { data: existingCreators } = await supabase
      .from('creators')
      .select('id')
      .limit(1)

    if (existingCreators && existingCreators.length > 0) {
      console.log('Sample data already exists')
      return
    }

    console.log('Seeding sample data...')

    // Sample creators data
    const sampleCreators = [
      {
        email: 'sarah@onlydevs.com',
        password: 'password123',
        username: 'codequeen',
        displayName: 'Sarah Chen',
        bio: 'Full-stack goddess who makes React look sexy 💅 FAANG veteran turned indie creator',
        techStack: ['React', 'Node.js', 'TypeScript', 'AWS'],
        avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        email: 'marcus@onlydevs.com',
        password: 'password123',
        username: 'algorithmdaddy',
        displayName: 'Marcus Rivera',
        bio: 'Your favorite algorithm daddy 🔥 Making data structures irresistible since 2019',
        techStack: ['Python', 'Machine Learning', 'Go', 'Kubernetes'],
        avatar: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        email: 'zoe@onlydevs.com',
        password: 'password123',
        username: 'devdiva',
        displayName: 'Zoe Taylor',
        bio: 'Mobile dev diva who knows how to make apps that make you swipe right 📱✨',
        techStack: ['Swift', 'Kotlin', 'Flutter', 'React Native'],
        avatar: 'https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        email: 'luna@onlydevs.com',
        password: 'password123',
        username: 'hackergirl',
        displayName: 'Luna Rodriguez',
        bio: 'Cybersecurity queen who\'ll hack your heart and secure your code 🔐💕',
        techStack: ['Python', 'Rust', 'Linux', 'Docker'],
        avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        email: 'alex@onlydevs.com',
        password: 'password123',
        username: 'cloudking',
        displayName: 'Alex Thompson',
        bio: 'AWS architect who\'ll make your infrastructure as solid as my abs 💪☁️',
        techStack: ['AWS', 'Terraform', 'Kubernetes', 'Python'],
        avatar: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ]

    for (const creator of sampleCreators) {
      try {
        // Create auth user
        const { data: authData } = await supabase.auth.admin.createUser({
          email: creator.email,
          password: creator.password,
          email_confirm: true
        })

        if (authData.user) {
          // Create profile
          await supabase.from('profiles').insert({
            id: authData.user.id,
            username: creator.username,
            display_name: creator.displayName,
            avatar_url: creator.avatar,
            is_creator: true,
            subscription_tier: 'Free Tier',
            subscriptions: [],
            total_spent: 0
          })

          // Create creator profile
          await supabase.from('creators').insert({
            id: authData.user.id,
            bio: creator.bio,
            tech_stack: creator.techStack,
            hotness_rating: Math.random() * 2 + 8, // 8-10 rating
            subscriber_count: Math.floor(Math.random() * 2000) + 500,
            content_count: Math.floor(Math.random() * 100) + 50,
            earnings: Math.random() * 20000 + 5000,
            monthly_earnings: Math.random() * 5000 + 1000,
            is_verified: true,
            is_online: Math.random() > 0.5,
            categories: ['Coding in Bed', 'Strip the Bug', 'Dirty Algorithms', 'Private Sessions']
          })

          // Create sample content
          const contentTitles = [
            'Debugging in My Pajamas 🛏️',
            'Why Your Code is Uglier Than My Ex 💔',
            'Strip This React Component With Me 🔥',
            'Late Night Database Desires 🌙',
            'Making APIs Moan with Pleasure 😈',
            'Dirty Git Commands You Need to Know 💦'
          ]

          for (let i = 0; i < 3; i++) {
            await supabase.from('content').insert({
              creator_id: authData.user.id,
              title: contentTitles[Math.floor(Math.random() * contentTitles.length)],
              description: 'Exclusive content that will make your code compile and your heart race',
              category: ['Coding in Bed', 'Strip the Bug', 'Dirty Algorithms'][Math.floor(Math.random() * 3)],
              thumbnail_url: `https://images.pexels.com/photos/434840${i + 1}/pexels-photo-434840${i + 1}.jpeg?auto=compress&cs=tinysrgb&w=400`,
              duration: `${Math.floor(Math.random() * 30) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
              views: Math.floor(Math.random() * 5000) + 500,
              likes: Math.floor(Math.random() * 500) + 50,
              required_tier: ['Simp Tier', 'Sugar Daddy Tier', 'Whale Tier'][Math.floor(Math.random() * 3)]
            })
          }
        }
      } catch (error) {
        console.error(`Failed to create creator ${creator.username}:`, error)
      }
    }

    console.log('Sample data seeded successfully!')
  } catch (error) {
    console.error('Error seeding sample data:', error)
  }
}