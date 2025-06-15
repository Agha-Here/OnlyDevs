export interface SubscriptionTier {
  name: string;
  price: number;
  subtitle: string;
  features: string[];
  cta: string;
  popular?: boolean;
  premium?: boolean;
  badge?: string;
}

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  techStack: string[];
  hotnessRating: number;
  subscriberCount: number;
  contentCount: number;
  earnings: number;
  isVerified: boolean;
  categories: ContentCategory[];
  isOnline?: boolean;
  monthlyEarnings?: number;
}

export interface ContentCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  contentCount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  isCreator: boolean;
  subscriptionTier: string;
  subscriptions: string[];
  joinDate: Date;
  totalSpent?: number;
}

export interface StreamSession {
  id: string;
  creatorId: string;
  title: string;
  category: string;
  viewerCount: number;
  isLive: boolean;
  startTime: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Content {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  requiredTier: string;
}