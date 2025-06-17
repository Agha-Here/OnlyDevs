import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, PlayCircle, Verified, Crown, Heart, MessageCircle, Loader } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SubscriptionModal } from '../components/subscription/SubscriptionModal';
import { getCreatorByUsername, getCreatorContent, Profile, Creator, Content } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

type CreatorWithProfile = Profile & { creator: Creator };

export const CreatorProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user, isSubscribedTo } = useAuth();
  const [creator, setCreator] = useState<CreatorWithProfile | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  useEffect(() => {
    if (username) {
      loadCreatorData();
    }
  }, [username]);

  const loadCreatorData = async () => {
    if (!username) return;

    try {
      setLoading(true);
      const [creatorData, contentData] = await Promise.all([
        getCreatorByUsername(username),
        getCreatorByUsername(username).then(creator => getCreatorContent(creator.id))
      ]);
      
      setCreator(creatorData);
      setContent(contentData);
    } catch (error) {
      console.error('Error loading creator:', error);
      toast.error('Creator not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-secondary-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading creator profile... 💕</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Heart size={64} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-2">Creator not found</h1>
          <p className="text-gray-400">This coding hottie doesn't exist or has left the platform</p>
        </div>
      </div>
    );
  }

  const isSubscribed = user ? isSubscribedTo(creator.id) : false;

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Creator Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative">
                <img
                  src={creator.avatar_url || `https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400`}
                  alt={creator.display_name}
                  className="w-full aspect-square object-cover rounded-2xl"
                />
                {creator.creator.is_verified && (
                  <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-2">
                    <Verified className="text-white" size={24} />
                  </div>
                )}
                {creator.creator.is_online && (
                  <div className="absolute top-4 left-4 bg-green-500 rounded-full px-3 py-1 flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                    <span className="text-white text-sm font-medium">Online</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <Star className="text-yellow-400 mr-2" size={16} />
                  <span className="text-white font-semibold">{creator.creator.hotness_rating.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center mb-4">
                <h1 className="text-3xl font-bold text-white mr-4">{creator.display_name}</h1>
                <span className="text-secondary-500 font-medium">@{creator.username}</span>
                {creator.creator.is_verified && (
                  <Verified className="text-blue-500 ml-2" size={24} />
                )}
              </div>
              
              <p className="text-gray-300 text-lg mb-6">{creator.creator.bio || 'No bio available'}</p>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.creator.tech_stack.map(tech => (
                    <span
                      key={tech}
                      className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="text-secondary-500 mr-2" size={20} />
                    <span className="text-2xl font-bold text-white">
                      {creator.creator.subscriber_count.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400">Subscribers</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <PlayCircle className="text-primary-500 mr-2" size={20} />
                    <span className="text-2xl font-bold text-white">
                      {creator.creator.content_count}
                    </span>
                  </div>
                  <p className="text-gray-400">Content</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Crown className="text-yellow-400 mr-2" size={20} />
                    <span className="text-2xl font-bold text-white">
                      {creator.creator.hotness_rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-400">Rating</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {isSubscribed ? (
                  <>
                    <Button size="lg" variant="outline">
                      <MessageCircle size={20} className="mr-2" />
                      Send Message
                    </Button>
                    <Button size="lg" variant="secondary">
                      <Heart size={20} className="mr-2" />
                      Subscribed ✨
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={() => setIsSubscriptionModalOpen(true)}
                  >
                    <Heart size={20} className="mr-2" />
                    Subscribe & Support
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Exclusive Content</h2>
          {content.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <PlayCircle size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No content yet</h3>
                <p className="text-gray-400">This creator is still working on their first masterpiece</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="group">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                      <img
                        src={item.thumbnail_url || `https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-sm text-white">
                        {item.duration || '15:30'}
                      </div>
                      <div className="absolute top-2 left-2 bg-secondary-500/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white font-medium">
                        {item.required_tier}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-secondary-500 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{item.views.toLocaleString()} views</span>
                      <div className="flex items-center text-gray-400">
                        <Heart size={14} className="mr-1" />
                        {item.likes.toLocaleString()}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        creator={{
          id: creator.id,
          username: creator.username,
          displayName: creator.display_name,
          avatar: creator.avatar_url || '',
          bio: creator.creator.bio || '',
          techStack: creator.creator.tech_stack,
          hotnessRating: creator.creator.hotness_rating,
          subscriberCount: creator.creator.subscriber_count,
          contentCount: creator.creator.content_count,
          earnings: creator.creator.earnings,
          monthlyEarnings: creator.creator.monthly_earnings,
          isVerified: creator.creator.is_verified,
          isOnline: creator.creator.is_online,
          categories: []
        }}
      />
    </div>
  );
};