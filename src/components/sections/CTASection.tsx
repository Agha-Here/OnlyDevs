import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Heart, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { AuthModal } from '../auth/AuthModal';

export const CTASection: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-primary-900/20 via-secondary-900/20 to-dark-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Urgency indicator */}
            <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <Clock size={16} className="text-red-400 mr-2" />
              <span className="text-red-400 text-sm font-medium">Limited Time: 50% off first month</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Turn Your Code Into
              <br />
              <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                Cold Hard Cash?
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join the exclusive community of developers who've discovered that their skills are worth way more than they thought. 
              Your algorithms deserve better than Stack Overflow.
            </p>

            {/* Value props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center justify-center text-gray-300">
                <TrendingUp className="text-green-400 mr-2" size={20} />
                <span>Average 340% income increase</span>
              </div>
              <div className="flex items-center justify-center text-gray-300">
                <Zap className="text-yellow-400 mr-2" size={20} />
                <span>Setup takes less than 5 minutes</span>
              </div>
              <div className="flex items-center justify-center text-gray-300">
                <Heart className="text-secondary-500 mr-2" size={20} />
                <span>No upfront costs or commitments</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" onClick={() => setIsAuthModalOpen(true)}>
                <Zap size={20} className="mr-2" />
                Start Earning Today
              </Button>
              <Button variant="outline" size="lg">
                <Heart size={20} className="mr-2" />
                Browse Success Stories
              </Button>
            </div>

            {/* Final assurance */}
            <p className="text-gray-400 text-sm">
              Join 2,847 developers already earning $500+/month • Free 3-day trial • Cancel anytime
            </p>
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