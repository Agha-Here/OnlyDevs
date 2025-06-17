import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Heart, MessageCircle, PlayCircle, Star, Crown, Loader, Upload, BarChart3, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ContentUploadModal } from '../components/creator/ContentUploadModal';
import { useAuth } from '../context/AuthContext';
import { getUserSubscriptions, getCreatorContent, Subscription, Creator, Profile, Content } from '../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

type SubscriptionWithCreator = Subscription & { creator: Creator & { profile: Profile } };

export const DashboardPage: React.FC = () => {
  const { user, profile, creator, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithCreator[]>([]);
  const [creatorContent, setCreatorContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      loadUserData();
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      if (profile?.is_creator) {
        // Load creator content
        const content = await getCreatorContent(user.id);
        setCreatorContent(content);
      } else {
        // Load user subscriptions
        const userSubscriptions = await getUserSubscriptions(user.id);
        setSubscriptions(userSubscriptions);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleContentUploadSuccess = () => {
    loadUserData(); // Refresh data after upload
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
    contentViews: creatorContent.reduce((sum, content) => sum + content.views, 0),
    totalContent: creatorContent.length,
    avgRating: creator.hotness_rating
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
                ? "Here's how your content empire is performing" 
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
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold text-white">${creatorStats.totalEarnings.toFixed(2)}</p>
                      <p className="text-green-400 text-sm">+12% this month</p>
                    </div>
                    <DollarSign size={24} className="text-green-400" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/5 border-secondary-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">This Month</p>
                      <p className="text-2xl font-bold text-white">${creatorStats.monthlyEarnings.toFixed(2)}</p>
                      <p className="text-secondary-400 text-sm">+8% vs last month</p>
                    </div>
                    <TrendingUp size={24} className="text-secondary-500" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Subscribers</p>
                      <p className="text-2xl font-bold text-white">{creatorStats.subscribers.toLocaleString()}</p>
                      <p className="text-primary-400 text-sm">+{Math.floor(creatorStats.subscribers * 0.05)} this week</p>
                    </div>
                    <Users size={24} className="text-primary-500" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-gradient-to-br from-accent-500/10 to-accent-600/5 border-accent-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Views</p>
                      <p className="text-2xl font-bold text-white">{creatorStats.contentViews.toLocaleString()}</p>
                      <p className="text-accent-400 text-sm">{creatorStats.totalContent} videos</p>
                    </div>
                    <PlayCircle size={24} className="text-accent-500" />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Creator Actions & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Upload size={20} className="mr-2 text-secondary-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <Upload size={18} className="mr-2" />
                    Upload New Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle size={18} className="mr-2" />
                    Check Messages (23)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 size={18} className="mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar size={18} className="mr-2" />
                    Schedule Live Session
                  </Button>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-green-400" />
                  Performance Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-dark-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{creatorStats.avgRating.toFixed(1)}</div>
                    <div className="text-gray-400 text-sm">Hotness Rating</div>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < Math.floor(creatorStats.avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-600'} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-dark-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">94%</div>
                    <div className="text-gray-400 text-sm">Satisfaction</div>
                    <div className="text-green-400 text-xs mt-1">+2% this month</div>
                  </div>
                  <div className="text-center p-4 bg-dark-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{Math.floor(creatorStats.contentViews / creatorStats.totalContent)}</div>
                    <div className="text-gray-400 text-sm">Avg Views</div>
                    <div className="text-blue-400 text-xs mt-1">per video</div>
                  </div>
                  <div className="text-center p-4 bg-dark-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">${(creatorStats.monthlyEarnings / creatorStats.subscribers).toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">Revenue/Sub</div>
                    <div className="text-purple-400 text-xs mt-1">monthly</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Content */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <PlayCircle size={24} className="mr-2 text-secondary-500" />
                Your Content ({creatorContent.length})
              </h2>
              {creatorContent.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creatorContent.slice(0, 6).map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card hover className="group">
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                          <img
                            src={content.thumbnail_url || `https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400`}
                            alt={content.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-sm text-white">
                            {content.duration}
                          </div>
                          <div className="absolute top-2 left-2 bg-secondary-500/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white font-medium">
                            {content.required_tier}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-secondary-500 transition-colors line-clamp-1">
                          {content.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {content.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-400">{content.views.toLocaleString()} views</span>
                            <div className="flex items-center text-gray-400">
                              <Heart size={14} className="mr-1" />
                              {content.likes.toLocaleString()}
                            </div>
                          </div>
                          <span className="text-green-400 font-medium">
                            ${(content.views * 0.01).toFixed(2)}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="text-center py-8">
                    <Upload size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">No content yet</h3>
                    <p className="text-gray-400 mb-4">Start creating and sharing your expertise with the world</p>
                    <Button onClick={() => setIsUploadModalOpen(true)}>
                      <Upload size={16} className="mr-2" />
                      Upload Your First Video
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Subscriber Dashboard */
          <div className="space-y-8">
            {/* Subscriber Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/5 border-secondary-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-white">{subscriptions.length}</p>
                      <p className="text-secondary-400 text-sm">creators you support</p>
                    </div>
                    <Heart size={24} className="text-secondary-500" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Current Tier</p>
                      <p className="text-lg font-bold text-white">{profile.subscription_tier}</p>
                      <p className="text-yellow-400 text-sm">premium access</p>
                    </div>
                    <Star size={24} className="text-yellow-400" />
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Invested</p>
                      <p className="text-2xl font-bold text-white">${profile.total_spent.toFixed(2)}</p>
                      <p className="text-green-400 text-sm">in your growth</p>
                    </div>
                    <DollarSign size={24} className="text-green-400" />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions for Subscribers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/creators">
                    <Button className="w-full justify-start">
                      <Heart size={18} className="mr-2" />
                      Discover New Creators
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle size={18} className="mr-2" />
                    Check Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star size={18} className="mr-2" />
                    Rate Your Experience
                  </Button>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">Learning Progress</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-dark-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{subscriptions.length * 15}</div>
                    <div className="text-gray-400 text-sm">Hours Learned</div>
                  </div>
                  <div className="text-center p-4 bg-dark-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">{subscriptions.length * 8}</div>
                    <div className="text-gray-400 text-sm">Skills Gained</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Subscribed Creators */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Heart size={24} className="mr-2 text-secondary-500" />
                Your Subscriptions ({subscriptions.length})
              </h2>
              {subscriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptions.map((subscription, index) => (
                    <motion.div
                      key={subscription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card hover className="group">
                        <Link to={`/creator/${subscription.creator.profile.username}`}>
                          <div className="flex items-center space-x-4 mb-4">
                            <img
                              src={subscription.creator.profile.avatar_url || `https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=100`}
                              alt={subscription.creator.profile.display_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="text-white font-semibold group-hover:text-secondary-500 transition-colors">
                                {subscription.creator.profile.display_name}
                              </h3>
                              <p className="text-gray-400 text-sm">@{subscription.creator.profile.username}</p>
                            </div>
                            {subscription.creator.is_online && (
                              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                            )}
                          </div>
                          <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                            {subscription.creator.bio || 'No bio available'}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-secondary-500 font-medium bg-secondary-500/10 px-2 py-1 rounded-lg">
                              {subscription.tier_name}
                            </span>
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
                      <Button>
                        <Heart size={16} className="mr-2" />
                        Browse Creators
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Upload Modal */}
      <ContentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleContentUploadSuccess}
      />
    </div>
  );
};