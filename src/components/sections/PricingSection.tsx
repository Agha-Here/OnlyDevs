import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { subscriptionTiers } from '../../data/mockData';
import { AuthModal } from '../auth/AuthModal';

export const PricingSection: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <section id="pricing" className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Your <span className="bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">Commitment Level</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From casual browsing to ultimate patronage - find the perfect way to support your favorite coding creators
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subscriptionTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Crown size={16} className="mr-1" />
                      {tier.badge}
                    </div>
                  </div>
                )}
                
                <Card 
                  className={`h-full ${tier.premium ? 'border-yellow-400/40 bg-gradient-to-b from-yellow-400/5 to-dark-800' : ''} ${tier.popular ? 'border-secondary-500/40 transform scale-105' : ''}`}
                  glow={tier.popular}
                >
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                      {tier.premium ? (
                        <Crown size={32} className="text-yellow-400" />
                      ) : tier.popular ? (
                        <Zap size={32} className="text-secondary-500" />
                      ) : (
                        <Heart size={32} className="text-primary-500" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-gray-400 mb-4">{tier.subtitle}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      {tier.price !== '$0' && <span className="text-gray-400">/month</span>}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <Check size={16} className="text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={tier.popular ? 'primary' : tier.premium ? 'secondary' : 'outline'}
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    {tier.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pricing Psychology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 mb-4">Start with 3 days free premium access • Cancel anytime • No commitments</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span>🔒 100% Secure</span>
              <span>💳 All Payment Methods</span>
              <span>🌍 Available Worldwide</span>
              <span>📱 Mobile Optimized</span>
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