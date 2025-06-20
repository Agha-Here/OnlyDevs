import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, CreditCard, Loader } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { subscriptionTiers } from '../../data/mockData';
import { Creator } from '../../types';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, creator }) => {
  const [selectedTier, setSelectedTier] = useState<string>('Sugar Daddy Tier');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, subscribeToCreator } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = await subscribeToCreator(creator.id, selectedTier);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedTierData = subscriptionTiers.find(tier => tier.name === selectedTier);
  const paidTiers = subscriptionTiers.filter(tier => tier.name !== 'Free Tier');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Subscribe to {creator.displayName}
        </h2>
        <p className="text-gray-400">
          Choose your level of support and unlock exclusive content
        </p>
      </div>

      {/* Tier Selection */}
      <div className="space-y-3 mb-6">
        {paidTiers.map((tier) => (
          <motion.div
            key={tier.name}
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer transition-all ${
              selectedTier === tier.name 
                ? 'ring-2 ring-secondary-500' 
                : 'hover:border-secondary-500/50'
            }`}
            onClick={() => setSelectedTier(tier.name)}
          >
            <Card className={`${tier.popular ? 'border-secondary-500/40' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedTier === tier.name 
                      ? 'bg-secondary-500 border-secondary-500' 
                      : 'border-gray-400'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">{tier.name}</h3>
                      {tier.popular && (
                        <span className="bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
                          POPULAR
                        </span>
                      )}
                      {tier.premium && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{tier.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">${tier.price}</div>
                  <div className="text-gray-400 text-sm">/month</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Tier Features */}
      {selectedTierData && (
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">What you'll get:</h3>
          <div className="space-y-2">
            {selectedTierData.features.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-300">
                <Check size={16} className="text-green-400 mr-3 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Section */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">Payment Method</h3>
        <Card className="border-primary-500/30">
          <div className="flex items-center space-x-3">
            <CreditCard size={20} className="text-gray-400" />
            <div className="flex-1">
              <div className="text-white font-medium">•••• •••• •••• 4242</div>
              <div className="text-gray-400 text-sm">Expires 12/25</div>
            </div>
            <Button variant="ghost" size="sm">Change</Button>
          </div>
        </Card>
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Total (first month)</span>
          <span className="text-white font-bold text-lg">
            ${selectedTierData ? Math.round(selectedTierData.price * 0.5) : 0} 
            <span className="text-sm text-gray-400 ml-1">(50% off)</span>
          </span>
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Then ${selectedTierData?.price}/month. Cancel anytime.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={handleSubscribe} className="flex-1" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Subscribe for $${selectedTierData ? Math.round(selectedTierData.price * 0.5) : 0}`
          )}
        </Button>
      </div>

      <p className="text-center text-gray-400 text-xs mt-4">
        🔒 Secure payment • Cancel anytime • 7-day money back guarantee
      </p>
    </Modal>
  );
};