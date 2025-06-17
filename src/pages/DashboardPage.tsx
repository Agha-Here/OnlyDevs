import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Heart, MessageCircle, PlayCircle, Star, Crown, Loader, Upload } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getUserSubscriptions, Subscription, Creator, Profile } from '../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

type SubscriptionWithCreator = Subscription & { creator: Creator & { profile: Profile } };

export const DashboardPage: React.FC = () => {
  const { user, profile, creator, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithCreator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      loadUserData();
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userSubscriptions = await getUserSubscriptions(user.id);
      setSubscriptions(userSubscriptions);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-secondary-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your dashboard... ✨</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-2">Please login to access dashboard</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const creatorStats = profile.is_creator && creator ? {
    totalEarnings: creator.earnings,
    monthlyEarnings: creator.monthly_earnings,
    subscribers: creator.subscriber_count,
    contentViews: creator.content_count * 150, // Mock calculation
    messages: 23 // Mock data
  } : null;

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile.display_name}! 
              {profile.is_creator && <Crown size={28} className="inline-block ml-2 text-yellow-400" />}
            </h1>
            <p className="text-gray-400">
              {profile.is_creator 
                ? "Here's how your content is performing" 
                : "Your developer journey dashboard"
              }
            </p>
          </motion.div>
        </div>

        {profile.is_creator && creatorStats ? (
          /* Creator Dashboard */
          <div className="space-y-8">
            {/* Creator Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold text-white">${creatorStats.totalEarnings.toFixed(2)}</p>
                    </div>
                    <DollarSign size={24} className="text-green-400" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">This Month</p>
                      <p className="text-2xl font-bold text-white">${creatorStats.monthlyEarnings.toFixed(2)}</p>
                    </div>
                    <TrendingUp size={24} className="text-secondary-500" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Subscribers</p>
                      <p className="text-2xl font-bold text-white">{creatorStats.subscribers}</p>
                    </div>
                    <Users size={24} className="text-primary-500" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Views</p>
                      <p className="text-2xl font-bold text-white">{creatorStats.contentViews.toLocaleString()}</p>
                    </div>
                    <PlayCircle size={24} className="text-accent-500" />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Creator Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Upload size={18} className="mr-2" />
                    Upload New Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle size={18} className="mr-2" />
                    Check Messages ({creatorStats.messages})
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp size={18} className="mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">New subscriber: @devfan123</span>
                    <span className="text-gray-400">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Tip received: $25</span>
                    <span className="text-gray-400">4h ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Content liked: "React Hooks Deep Dive"</span>
                    <span className="text-gray-400">6h ago</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* Subscriber Dashboard */
          <div className="space-y-8">
            {/* Subscriber Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Subscriptions</p>
                      <p className="text-2xl font-bold text-white">{subscriptions.length}</p>
                    </div>
                    <Heart size={24} className="text-secondary-500" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Current Tier</p>
                      <p className="text-lg font-bold text-white">{profile.subscription_tier}</p>
                    </div>
                    <Star size={24} className="text-yellow-400" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                      <p className="text-2xl font-bold text-white">${profile.total_spent.toFixed(2)}</p>
                    </div>
                    <DollarSign size={24} className="text-green-400" />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Subscribed Creators */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Your Subscriptions</h2>
              {subscriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptions.map((subscription, index) => (
                    <motion.div
                      key={subscription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card hover>
                        <Link to={`/creator/${subscription.creator.profile.username}`}>
                          <div className="flex items-center space-x-4 mb-4">
                            <img
                              src={subscription.creator.profile.avatar_url || `https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=100`}
                              alt={subscription.creator.profile.display_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="text-white font-semibold">{subscription.creator.profile.display_name}</h3>
                              <p className="text-gray-400 text-sm">@{subscription.creator.profile.username}</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm line-clamp-2 mb-3">{subscription.creator.bio || 'No bio available'}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-secondary-500 font-medium">{subscription.tier_name}</span>
                            <span className="text-gray-400">{subscription.creator.content_count} videos</span>
                          </div>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="text-center py-8">
                    <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">No subscriptions yet</h3>
                    <p className="text-gray-400 mb-4">Discover amazing creators and start your learning journey</p>
                    <Link to="/creators">
                      <Button>Browse Creators</Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};