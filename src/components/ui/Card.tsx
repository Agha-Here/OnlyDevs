import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, glow = false }) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      className={clsx(
        'bg-dark-800 rounded-xl border border-primary-500/20 p-6',
        hover && 'cursor-pointer transition-all duration-300 hover:border-secondary-500/40',
        glow && 'shadow-lg shadow-secondary-500/10',
        className
      )}
    >
      {children}
    </motion.div>
  );
};