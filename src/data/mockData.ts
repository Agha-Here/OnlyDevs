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

export const featuredCreators: Creator[] = [
  {
    id: "1",
    username: "codequeen",
    displayName: "Sarah Chen",
    avatar: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Full-stack goddess who makes React look sexy 💅 FAANG veteran turned indie creator",
    techStack: ["React", "Node.js", "TypeScript", "AWS"],
    hotnessRating: 9.2,
    subscriberCount: 1247,
    contentCount: 89,
    earnings: 15420,
    monthlyEarnings: 4200,
    isVerified: true,
    isOnline: true,
    categories: contentCategories.slice(0, 3)
  },
  {
    id: "2",
    username: "algorithmdaddy",
    displayName: "Marcus Rivera",
    avatar: "https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Your favorite algorithm daddy 🔥 Making data structures irresistible since 2019",
    techStack: ["Python", "Machine Learning", "Go", "Kubernetes"],
    hotnessRating: 8.9,
    subscriberCount: 892,
    contentCount: 156,
    earnings: 12890,
    monthlyEarnings: 3100,
    isVerified: true,
    isOnline: false,
    categories: contentCategories.slice(1, 4)
  },
  {
    id: "3",
    username: "devdiva",
    displayName: "Zoe Taylor",
    avatar: "https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Mobile dev diva who knows how to make apps that make you swipe right 📱✨",
    techStack: ["Swift", "Kotlin", "Flutter", "React Native"],
    hotnessRating: 9.5,
    subscriberCount: 2156,
    contentCount: 234,
    earnings: 28750,
    monthlyEarnings: 6800,
    isVerified: true,
    isOnline: true,
    categories: contentCategories
  },
  {
    id: "4",
    username: "hackergirl",
    displayName: "Luna Rodriguez",
    avatar: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Cybersecurity queen who'll hack your heart and secure your code 🔐💕",
    techStack: ["Python", "Rust", "Linux", "Docker"],
    hotnessRating: 9.1,
    subscriberCount: 1456,
    contentCount: 178,
    earnings: 18900,
    monthlyEarnings: 4500,
    isVerified: true,
    isOnline: true,
    categories: contentCategories.slice(0, 4)
  },
  {
    id: "5",
    username: "cloudking",
    displayName: "Alex Thompson",
    avatar: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "AWS architect who'll make your infrastructure as solid as my abs 💪☁️",
    techStack: ["AWS", "Terraform", "Kubernetes", "Python"],
    hotnessRating: 8.7,
    subscriberCount: 987,
    contentCount: 134,
    earnings: 14200,
    monthlyEarnings: 3400,
    isVerified: true,
    isOnline: false,
    categories: contentCategories.slice(2, 5)
  },
  {
    id: "6",
    username: "aigoddess",
    displayName: "Priya Patel",
    avatar: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "AI researcher who'll train your models and your heart 🤖💖",
    techStack: ["TensorFlow", "PyTorch", "Python", "CUDA"],
    hotnessRating: 9.3,
    subscriberCount: 1789,
    contentCount: 201,
    earnings: 22100,
    monthlyEarnings: 5200,
    isVerified: true,
    isOnline: true,
    categories: contentCategories.slice(1, 5)
  },
  {
    id: "7",
    username: "frontendfire",
    displayName: "Emma Wilson",
    avatar: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Frontend wizard who makes UIs so hot they'll melt your screen 🔥✨",
    techStack: ["Vue.js", "React", "CSS", "JavaScript"],
    hotnessRating: 8.8,
    subscriberCount: 1123,
    contentCount: 167,
    earnings: 16800,
    monthlyEarnings: 3900,
    isVerified: true,
    isOnline: false,
    categories: contentCategories.slice(0, 3)
  },
  {
    id: "8",
    username: "blockchainbabe",
    displayName: "Sophia Kim",
    avatar: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400",
    bio: "Blockchain developer who'll decentralize your heart 💎⛓️",
    techStack: ["Solidity", "Web3", "Ethereum", "JavaScript"],
    hotnessRating: 9.0,
    subscriberCount: 1334,
    contentCount: 145,
    earnings: 17600,
    monthlyEarnings: 4100,
    isVerified: true,
    isOnline: true,
    categories: contentCategories.slice(2, 5)
  }
];

export const mockContent: Content[] = [
  {
    id: "1",
    creatorId: "1",
    title: "Debugging in My Pajamas 🛏️",
    description: "Late night React debugging session in my cozy bedroom setup",
    category: "coding-in-bed",
    thumbnail: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400",
    duration: "45:32",
    views: 2847,
    likes: 234,
    requiredTier: "Simp Tier"
  },
  {
    id: "2",
    creatorId: "2",
    title: "Why Your Code is Uglier Than My Ex 💔",
    description: "Brutal code review session with some tough love",
    category: "hot-takes",
    thumbnail: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400",
    duration: "32:18",
    views: 1923,
    likes: 189,
    requiredTier: "Free Tier"
  },
  {
    id: "3",
    creatorId: "3",
    title: "Strip This React Component With Me 🔥",
    description: "Breaking down complex components layer by layer",
    category: "strip-the-bug",
    thumbnail: "https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg?auto=compress&cs=tinysrgb&w=400",
    duration: "28:45",
    views: 3456,
    likes: 412,
    requiredTier: "Sugar Daddy Tier"
  }
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