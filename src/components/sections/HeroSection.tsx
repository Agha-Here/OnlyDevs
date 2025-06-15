import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, TrendingUp, Users, DollarSign, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';

export const HeroSection: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartJourney = () => {
    if (user) {
      navigate('/creators');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleBrowseCreators = () => {
    navigate('/creators');
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-primary-900/20 to-dark-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-secondary-500/10 border border-secondary-500/20 rounded-full px-4 py-2 mb-6">
              <Star size={16} className="text-secondary-500 mr-2" />
              <span className="text-secondary-500 text-sm font-medium">Limited Beta Access - Only 1000 Spots Available</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Finally, Developers Can Get<br />
              <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                The Love They Deserve
              </span>
              <Heart className="inline-block ml-4 text-secondary-500 animate-pulse-glow" size={60} />
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Subscribe to exclusive coding content from your favorite developers.<br />
              From algorithms to intimate debugging sessions.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button size="lg" onClick={handleStartJourney}>
              <Zap size={20} className="mr-2" />
              {user ? 'Browse Creators' : 'Start Your Developer Journey'}
            </Button>
            <Button variant="outline" size="lg" onClick={handleBrowseCreators}>
              <Heart size={20} className="mr-2" />
              Browse Hot Creators
            </Button>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="text-secondary-500 mr-2" size={24} />
                <span className="text-3xl font-bold text-white">2,847</span>
              </div>
              <p className="text-gray-400">Developers earning $500+/month</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-primary-500 mr-2" size={24} />
                <span className="text-3xl font-bold text-white">15,420</span>
              </div>
              <p className="text-gray-400">Active subscribers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="text-accent-500 mr-2" size={24} />
                <span className="text-3xl font-bold text-white">$2.1M</span>
              </div>
              <p className="text-gray-400">Paid to creators this year</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="text-yellow-400 mr-2" size={24} />
                <span className="text-3xl font-bold text-white">4.9</span>
              </div>
              <p className="text-gray-400">Average creator rating</p>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              SSL Secured
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Money Back Guarantee
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Featured in TechCrunch
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              FAANG Approved
            </div>
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type="signup"
      />
    </>
  );
};