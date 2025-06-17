import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Users, PlayCircle, Verified, Heart, Filter, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getAllCreators, Creator, Profile } from '../lib/supabase';
import toast from 'react-hot-toast';

type CreatorWithProfile = Creator & { profile: Profile };

export const CreatorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [creators, setCreators] = useState<CreatorWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      setLoading(true);
      const creatorsData = await getAllCreators();
      setCreators(creatorsData);
    } catch (error) {
      console.error('Error loading creators:', error);
      toast.error('Failed to load creators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.profile.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && creator.tech_stack.includes(selectedCategory);
  });

  const categories = Array.from(
    new Set(creators.flatMap(creator => creator.tech_stack))
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-secondary-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading our hottest creators... 🔥</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Discover Your Next <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">Coding Mentor</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our curated selection of talented developers ready to share their knowledge and passion
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-primary-500/30 rounded-xl text-white appearance-none cursor-pointer focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
                >
                  <option value="all">All Technologies</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No creators found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/creator/${creator.profile.username}`}>
                  <Card hover glow className="group h-full">
                    <div className="relative">
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

                      {/* Rating */}
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
                        <span className="text-secondary-500 font-medium">@{creator.profile.username}</span>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{creator.bio || 'No bio available'}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {creator.tech_stack.slice(0, 3).map(tech => (
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

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Users size={16} className="text-secondary-500 mr-1" />
                          <span className="text-white font-semibold">
                            {creator.subscriber_count.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">Subscribers</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <PlayCircle size={16} className="text-accent-500 mr-1" />
                          <span className="text-white font-semibold">{creator.content_count}</span>
                        </div>
                        <span className="text-gray-400 text-xs">Videos</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Star size={16} className="text-yellow-400 mr-1" />
                          <span className="text-white font-semibold">{creator.hotness_rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 text-xs">Rating</span>
                      </div>
                    </div>

                    <Button className="w-full group-hover:scale-105 transition-transform">
                      <Heart size={16} className="mr-2" />
                      View Profile
                    </Button>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};