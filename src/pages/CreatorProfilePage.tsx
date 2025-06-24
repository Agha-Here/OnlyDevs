import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, PlayCircle, Verified, Heart, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SubscriptionModal } from '../components/subscription/SubscriptionModal';
import { featuredCreators, mockContent } from '../data/mockData';

export const CreatorProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Find the creator from mock data
  const creator = featuredCreators.find(c => c.username === username);
  const creatorContent = mockContent.filter(c => c.creatorId === creator?.id);

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

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Creator Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="relative">
                <img
                  src={creator.avatar}
                  alt={creator.displayName}
                  className="w-full aspect-square object-cover rounded-2xl"
                />
                {creator.isVerified && (
                  <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-2">
                    <Verified className="text-white" size={24} />
                  </div>
                )}
                {creator.isOnline && (
                  <div className="absolute top-4 left-4 bg-green-500 rounded-full px-3 py-1 flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                    <span className="text-white text-sm font-medium">Online</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <Star className="text-yellow-400 mr-2" size={16} />
                  <span className="text-white font-semibold">{creator.hotnessRating.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center mb-4">
                <h1 className="text-3xl font-bold text-white mr-4">{creator.displayName}</h1>
                <span className="text-secondary-500 font-medium">@{creator.username}</span>
                {creator.isVerified && (
                  <Verified className="text-blue-500 ml-2" size={24} />
                )}
              </div>
              <p className="text-gray-300 text-lg mb-6">{creator.bio}</p>
              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.techStack.map(tech => (
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
                      {creator.subscriberCount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-400">Subscribers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <PlayCircle className="text-primary-500 mr-2" size={20} />
                    <span className="text-2xl font-bold text-white">
                      {creator.contentCount}
                    </span>
                  </div>
                  <p className="text-gray-400">Content</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="text-yellow-400 mr-2" size={20} />
                    <span className="text-2xl font-bold text-white">
                      {creator.hotnessRating}
                    </span>
                  </div>
                  <p className="text-gray-400">Rating</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => setIsSubscriptionModalOpen(true)}>
                  <Heart size={20} className="mr-2" />
                  Subscribe Now
                </Button>
                <Button size="lg" variant="outline">
                  <MessageCircle size={20} className="mr-2" />
                  Send Message
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Content Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Content Previews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="group">
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-sm text-white">
                      {content.duration}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-secondary-500 transition-colors">
                    {content.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {content.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{content.views.toLocaleString()} views</span>
                    <span className="text-secondary-500">{content.requiredTier}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        creator={creator}
      />
    </div>
  );
};