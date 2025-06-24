import { SubscriptionTier, Creator, ContentCategory, User, Content } from '../types';

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: "Free Tier",
    price: 0,
    subtitle: "Just browsing? 👀",
    features: ["Basic tutorials", "Public repos", "Community access", "Limited chat access"],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Simp Tier",
    price: 9,
    subtitle: "Show some love 💕",
    features: ["Private Discord", "Code reviews", "Exclusive content", "Direct messages", "Priority chat"],
    cta: "Become a Simp",
    popular: false
  },
  {
    name: "Sugar Daddy Tier",
    price: 25,
    subtitle: "True dedication 🔥",
    features: ["1-on-1 mentoring", "Live coding sessions", "Priority support", "Custom requests", "Screen sharing"],
    cta: "Become Sugar Daddy",
    popular: true,
    badge: "MOST POPULAR"
  },
  {
    name: "Whale Tier",
    price: 60,
    subtitle: "Ultimate patron 👑",
    features: ["Unlimited access", "Personal coding buddy", "Career guidance", "Exclusive perks", "VIP status"],
    cta: "Own The Platform",
    popular: false,
    premium: true
  }
];

export const contentCategories: ContentCategory[] = [
  {
    id: "coding-in-bed",
    name: "Coding in Bed",
    emoji: "🛏️",
    description: "Casual late-night tutorials in comfortable settings",
    contentCount: 127
  },
  {
    id: "strip-the-bug",
    name: "Strip the Bug",
    emoji: "🐛",
    description: "Layer-by-layer debugging sessions with interactive audience",
    contentCount: 89
  },
  {
    id: "dirty-algorithms",
    name: "Dirty Algorithms",
    emoji: "💋",
    description: "Advanced concept explanations with cheeky commentary",
    contentCount: 156
  },
  {
    id: "private-sessions",
    name: "Private Sessions",
    emoji: "🔐",
    description: "Exclusive 1-on-1 mentoring content",
    contentCount: 45
  },
  {
    id: "hot-takes",
    name: "Hot Takes",
    emoji: "🔥",
    description: "Opinion pieces and industry commentary",
    contentCount: 203
  }
];

// Mock data for creators and content
export interface CreatorProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  techStack: string[];
  subscriberCount: number;
  contentCount: number;
  hotnessRating: number;
  isVerified: boolean;
  isOnline: boolean;
}

export interface ContentPreview {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  requiredTier: string;
}

export const featuredCreators: CreatorProfile[] = [
  {
    id: '1',
    username: 'codedaddy',
    displayName: 'Code Daddy',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'React, TypeScript, and late-night debugging. Let me refactor your life.',
    techStack: ['React', 'TypeScript', 'Node.js'],
    subscriberCount: 2400,
    contentCount: 18,
    hotnessRating: 9.2,
    isVerified: true,
    isOnline: true,
  },
  {
    id: '2',
    username: 'pyqueen',
    displayName: 'Py Queen',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Python, AI, and sassy scripts. Slide into my DMs for ML tips.',
    techStack: ['Python', 'AI', 'Machine Learning'],
    subscriberCount: 1270,
    contentCount: 22,
    hotnessRating: 8.7,
    isVerified: true,
    isOnline: false,
  },
  {
    id: '3',
    username: 'bughunter',
    displayName: 'Bug Hunter',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    bio: 'I find bugs in your code and in your heart. JavaScript specialist.',
    techStack: ['JavaScript', 'Vue', 'CSS'],
    subscriberCount: 892,
    contentCount: 15,
    hotnessRating: 8.1,
    isVerified: false,
    isOnline: true,
  },
  {
    id: '4',
    username: 'uxdiva',
    displayName: 'UX Diva',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Design that seduces. Figma, UX, and pixel-perfect love.',
    techStack: ['Figma', 'UX', 'UI'],
    subscriberCount: 2100,
    contentCount: 19,
    hotnessRating: 9.0,
    isVerified: true,
    isOnline: true,
  },
  {
    id: '5',
    username: 'sqlsugar',
    displayName: 'SQL Sugar',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    bio: 'Databases, queries, and sweet, sweet normalization.',
    techStack: ['SQL', 'Postgres', 'Data Modeling'],
    subscriberCount: 1340,
    contentCount: 12,
    hotnessRating: 7.8,
    isVerified: false,
    isOnline: false,
  },
  {
    id: '6',
    username: 'cloudbae',
    displayName: 'Cloud Bae',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    bio: 'AWS, Azure, and cloud architecture. I’ll scale your backend.',
    techStack: ['AWS', 'Azure', 'DevOps'],
    subscriberCount: 980,
    contentCount: 10,
    hotnessRating: 8.3,
    isVerified: true,
    isOnline: true,
  },
  {
    id: '7',
    username: 'csswizard',
    displayName: 'CSS Wizard',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    bio: 'Animations, gradients, and magic. Watch me flex (box).',
    techStack: ['CSS', 'Sass', 'Animations'],
    subscriberCount: 1560,
    contentCount: 14,
    hotnessRating: 8.5,
    isVerified: false,
    isOnline: false,
  },
  {
    id: '8',
    username: 'javacharm',
    displayName: 'Java Charm',
    avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
    bio: 'Spring Boot, APIs, and a little bit of Java magic.',
    techStack: ['Java', 'Spring Boot', 'APIs'],
    subscriberCount: 1100,
    contentCount: 11,
    hotnessRating: 7.9,
    isVerified: true,
    isOnline: true,
  },
];

export const mockContent: ContentPreview[] = [
  {
    id: 'c1',
    creatorId: '1',
    title: 'Debugging in My Pajamas 🛏️',
    description: 'Late-night bug squashing with Code Daddy.',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    duration: '12:34',
    views: 1200,
    requiredTier: 'Free Tier',
  },
  {
    id: 'c2',
    creatorId: '2',
    title: 'Why Your Code is Uglier Than My Ex 💔',
    description: 'Py Queen roasts your Python scripts.',
    thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    duration: '8:21',
    views: 980,
    requiredTier: 'Simp Tier',
  },
  {
    id: 'c3',
    creatorId: '3',
    title: 'Strip This React Component With Me 🔥',
    description: 'Bug Hunter gets hands-on with React.',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    duration: '15:02',
    views: 1500,
    requiredTier: 'Sugar Daddy Tier',
  },
  {
    id: 'c4',
    creatorId: '4',
    title: 'Late Night Database Desires 🌙',
    description: 'SQL Sugar reveals his favorite queries.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    duration: '10:45',
    views: 1100,
    requiredTier: 'Whale Tier',
  },
  {
    id: 'c5',
    creatorId: '5',
    title: 'Flexbox Fantasies',
    description: 'CSS Wizard shows off his best tricks.',
    thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    duration: '9:30',
    views: 800,
    requiredTier: 'Free Tier',
  },
  {
    id: 'c6',
    creatorId: '6',
    title: 'Cloudy With a Chance of DevOps',
    description: 'Cloud Bae scales your stack.',
    thumbnail: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c?auto=format&fit=crop&w=400&q=80',
    duration: '13:10',
    views: 900,
    requiredTier: 'Simp Tier',
  },
  {
    id: 'c7',
    creatorId: '7',
    title: 'Sassy Sass Animations',
    description: 'CSS Wizard animates your heart.',
    thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    duration: '7:45',
    views: 700,
    requiredTier: 'Sugar Daddy Tier',
  },
  {
    id: 'c8',
    creatorId: '8',
    title: 'Spring Booty',
    description: 'Java Charm gets you up and running.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    duration: '11:20',
    views: 650,
    requiredTier: 'Whale Tier',
  },
];

export const testimonials = [
  {
    name: "Alex Thompson",
    role: "Senior Engineer @ Google",
    content: "Finally found a platform that doesn't treat developers like robots. The mentorship here is next level! 🚀",
    rating: 5,
    avatar: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    name: "Maria Santos",
    role: "Full Stack Developer",
    content: "From junior to senior in 6 months thanks to OnlyDevs creators. Worth every penny of my Sugar Daddy subscription! 💰",
    rating: 5,
    avatar: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    name: "David Kim",
    role: "Startup CTO",
    content: "The 'Strip the Bug' sessions saved our production system. These creators know their stuff! 🔧",
    rating: 5,
    avatar: "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=100"
  }
];