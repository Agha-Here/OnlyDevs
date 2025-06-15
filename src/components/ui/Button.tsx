import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-secondary-500 to-primary-500 text-white hover:from-secondary-600 hover:to-primary-600 shadow-lg hover:shadow-xl hover:shadow-secondary-500/25',
    secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white',
    ghost: 'text-secondary-500 hover:bg-secondary-500/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};