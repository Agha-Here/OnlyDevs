import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, PlayCircle, Verified, Heart, DollarSign, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getAllCreators, Creator, Profile } from '../../lib/supabase';

type CreatorWithProfile = Creator & { profile: Profile };

export const CreatorsSection: React.FC = () => {
  const [creators, setCreators] = useState<CreatorWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const creatorsData = await getAllCreators();
      setCreators(creatorsData.slice(0, 6)); // Show only first 6 for homepage
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="creators" className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-secondary-500 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="creators" className="py-20 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Your New <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">Coding Crushes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These talented developers are ready to share their expertise, mentor your growth, and make you fall in love with code again
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/creator/${creator.profile.username}`}>
                <Card hover glow className="group cursor-pointer">
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-xl overflow-hidden mb-4">
                      <img
                        src={creator.profile.avatar_url || `https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400`}
                        alt={creator.profile.display_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Status indicators */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {creator.is_verified && (
                        <div className="bg-blue-500 rounded-full p-1">
                          <Verified size={16} className="text-white" />
                        </div>
                      )}
                      {creator.is_online && (
                        <div className="bg-green-500 rounded-full p-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Hotness Rating */}
                    <div className="absolute bottom-6 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star size={12} className="text-yellow-400 mr-1" />
                      <span className="text-white text-xs font-semibold">{creator.hotness_rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-secondary-500 transition-colors">
                        {creator.profile.display_name}
                      </h3>
                      <span className="text-secondary-500 font-semibold">@{creator.profile.username}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                      {creator.bio || 'No bio available'}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {creator.tech_stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {creator.tech_stack.length > 3 && (
                        <span className="text-gray-400 text-xs">+{creator.tech_stack.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Users size={16} className="text-secondary-500 mr-1" />
                        <span className="text-white font-semibold">{creator.subscriber_count.toLocaleString()}</span>
                      </div>
                      <span className="text-gray-400 text-xs">Subscribers</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <PlayCircle size={16} className="text-accent-500 mr-1" />
                        <span className="text-white font-semibold">{creator.content_count}</span>
                      </div>
                      <span className="text-gray-400 text-xs">Content</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign size={16} className="text-green-400 mr-1" />
                        <span className="text-white font-semibold">${(creator.earnings / 1000).toFixed(1)}k</span>
                      </div>
                      <span className="text-gray-400 text-xs">Earned</span>
                    </div>
                  </div>

                  <Button className="w-full group-hover:scale-105 transition-transform">
                    <Heart size={16} className="mr-2" />
                    Subscribe & Support
                  </Button>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Browse All Creators CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/creators">
            <Button size="lg" variant="outline">
              Browse All 36+ Creators
            </Button>
          </Link>
          <p className="text-gray-400 mt-4">New creators join daily • Find your perfect coding match</p>
        </motion.div>
      </div>
    </section>
  );
};