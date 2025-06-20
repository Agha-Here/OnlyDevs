import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Eye, EyeOff, Heart, Zap, User, Crown, Loader } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  username?: string;
  displayName?: string;
  isCreator?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormData>();
  const { login, signup } = useAuth();

  const password = watch('password');
  const isSignup = type === 'signup';

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      let success = false;

      if (isSignup) {
        success = await signup(
          data.email,
          data.password,
          data.username!,
          data.displayName || data.username!,
          data.isCreator || false
        );
      } else {
        success = await login(data.email, data.password);
      }

      if (success) {
        reset();
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          {isSignup ? (
            <Zap size={32} className="text-white" />
          ) : (
            <Heart size={32} className="text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isSignup ? 'Join the Revolution' : 'Welcome Back, Beautiful'}
        </h2>
        <p className="text-gray-400">
          {isSignup 
            ? 'Turn your code into cold hard cash 💰'
            : 'Your favorite developers missed you 💕'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isSignup && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers and underscores'
                  }
                })}
                className="input-primary w-full"
                placeholder="codecrusher69"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                {...register('displayName')}
                className="input-primary w-full"
                placeholder="Your beautiful name"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="input-primary w-full"
            placeholder="your.name@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              className="input-primary w-full pr-10"
              placeholder="Make it strong 💪"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-400" />
              ) : (
                <Eye size={20} className="text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {isSignup && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => 
                    value === password || 'Passwords do not match'
                })}
                type="password"
                className="input-primary w-full"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 p-4 bg-primary-500/10 rounded-xl">
              <input
                {...register('isCreator')}
                type="checkbox"
                id="isCreator"
                className="checkbox-primary"
              />
              <label 
                htmlFor="isCreator" 
                className="text-gray-300 text-sm flex items-center"
              >
                <Crown size={16} className="text-yellow-400 mr-2" />
                I want to become a creator and start earning
              </label>
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={20} className="mr-2 animate-spin" />
              {isSignup ? 'Creating your empire...' : 'Logging in...'}
            </>
          ) : (
            isSignup ? 'Create Account' : 'Login'
          )}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-800 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-gray-400">
        {isSignup ? (
          <>
            Already have an account?{' '}
            <button
              onClick={() => onClose()}
              className="text-primary-500 hover:text-primary-400"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => onClose()}
              className="text-primary-500 hover:text-primary-400"
            >
              Sign up
            </button>
          </>
        )}
      </p>
    </Modal>
  );
};