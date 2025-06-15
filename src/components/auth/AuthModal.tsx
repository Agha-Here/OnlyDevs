import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Eye, EyeOff, Heart, Zap, User, Crown } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
}

interface FormData {
  email: string;
  password: string;
  username?: string;
  confirmPassword?: string;
  isCreator?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const { login, signup } = useAuth();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (type === 'login') {
        success = await login(data.email, data.password);
      } else {
        success = await signup(data.email, data.password, data.username!, data.isCreator || false);
      }

      if (success) {
        toast.success(type === 'login' ? 'Welcome back, beautiful! 💕' : 'Welcome to the revolution! 🚀');
        onClose();
      } else {
        toast.error('Something went wrong. Try again!');
      }
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSignup = type === 'signup';
  const password = watch('password');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          {isSignup ? <Zap size={32} className="text-white" /> : <Heart size={32} className="text-white" />}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isSignup ? 'Join the Revolution' : 'Welcome Back, Beautiful'}
        </h2>
        <p className="text-gray-400">
          {isSignup 
            ? 'Turn your code into cold hard cash 💰' 
            : 'Your favorite developers missed you 💕'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username (make it memorable 😉)
            </label>
            <input
              {...register('username', { 
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' }
              })}
              className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
              placeholder="codecrusher69"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })}
            type="email"
            className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <div className="relative">
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all pr-12"
              placeholder="Make it strong 💪"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {isSignup && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-3 p-4 bg-primary-500/10 rounded-xl border border-primary-500/20">
              <input
                {...register('isCreator')}
                type="checkbox"
                id="isCreator"
                className="w-4 h-4 text-secondary-500 bg-dark-900 border-primary-500/30 rounded focus:ring-secondary-500 focus:ring-2"
              />
              <label htmlFor="isCreator" className="text-gray-300 text-sm flex items-center">
                <Crown size={16} className="text-yellow-400 mr-2" />
                I want to become a creator and start earning
              </label>
            </div>
          </>
        )}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isSignup ? 'Start Your Empire' : 'Enter Paradise'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-500/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-800 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-4 py-3 border border-primary-500/30 rounded-xl text-white hover:border-secondary-500/50 transition-all"
          >
            <Github size={20} className="mr-2" />
            GitHub
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-4 py-3 border border-primary-500/30 rounded-xl text-white hover:border-secondary-500/50 transition-all"
          >
            <Mail size={20} className="mr-2" />
            Google
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};