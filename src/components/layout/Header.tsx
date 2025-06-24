import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Menu, X, Crown, Zap, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-lg border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                  <Heart size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">OnlyDevs</span>
                <span className="text-xs bg-secondary-500 text-white px-2 py-1 rounded-full">BETA</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/creators" className="text-gray-300 hover:text-secondary-500 transition-colors">Creators</Link>
              <a href="#categories" className="text-gray-300 hover:text-secondary-500 transition-colors">Categories</a>
              <a href="#pricing" className="text-gray-300 hover:text-secondary-500 transition-colors">Pricing</a>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Crown size={16} className="text-yellow-400" />
                <span>2,847 earning $500+/month</span>
              </div>
             <a
  href="https://codepulsepro.netlify.app"
  target="_blank"
  rel="noopener noreferrer"
  className="ml-4 px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:from-pink-400 hover:to-indigo-400 transition-all animate-pulse border-2 border-secondary-500"
  style={{ boxShadow: '0 0 16px 2px #a78bfa, 0 0 32px 4px #ec4899' }}
>
  CodePulse
</a>

            </nav>

            {/* Desktop Auth/User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-white hover:text-secondary-500 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span>{user.displayName}</span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-dark-800 border border-primary-500/20 rounded-xl shadow-lg py-2"
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-primary-500/10 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => handleAuthClick('login')}>
                    <User size={18} className="mr-2" />
                    Login
                  </Button>
                  <Button onClick={() => handleAuthClick('signup')}>
                  <Heart size={20} className="mr-2" />
                    Start Earning
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark-800 border-t border-primary-500/20"
            >
              <div className="px-4 py-6 space-y-4">
                <Link to="/creators" className="block text-gray-300 hover:text-secondary-500 transition-colors py-2">Creators</Link>
                <a href="#categories" className="block text-gray-300 hover:text-secondary-500 transition-colors py-2">Categories</a>
                <a href="#pricing" className="block text-gray-300 hover:text-secondary-500 transition-colors py-2">Pricing</a>
                <a
  href="https://codepulsepro.netlify.app"
  target="_blank"
  rel="noopener noreferrer"
  className="ml-4 px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:from-pink-400 hover:to-indigo-400 transition-all animate-pulse border-2 border-secondary-500"
  style={{ boxShadow: '0 0 16px 2px #a78bfa, 0 0 32px 4px #ec4899' }}
>
  CodePulse
</a>

                
                {user ? (
                  <div className="pt-4 border-t border-primary-500/20 space-y-3">
                    <Link to="/dashboard" className="block text-gray-300 hover:text-secondary-500 transition-colors py-2">Dashboard</Link>
                    <button onClick={handleLogout} className="block text-gray-300 hover:text-red-400 transition-colors py-2">Logout</button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-primary-500/20 space-y-3">
                    <Button variant="outline" className="w-full" onClick={() => handleAuthClick('login')}>
                      Login
                    </Button>
                    <Button className="w-full" onClick={() => handleAuthClick('signup')}>
                      Start Earning
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Bolt Logo in top-right below navbar */}
<a
  href="https://bolt.new"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed top-20 right-8 z-30 hidden md:block"
>
  <div className="flex items-center justify-end">
    <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full shadow-xl p-2 border-4 border-white/10">
      <svg width="48" height="22" viewBox="0 0 51 21.9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24.1 19.3c-4.7 0-7-2.7-7-6.1s3.2-7.7 7.9-7.7 7 2.7 7 6.1-3.2 7.7-7.9 7.7Zm.2-4.3c1.6 0 2.7-1.5 2.7-3.1s-.8-2-2.2-2-2.7 1.5-2.7 3.1.8 2 2.2 2ZM37 19h-4.9l4-18.2H41l-4 18.1Z" fill="#fff"/>
        <path d="M9.6 19.3c-1.5 0-3-.5-3.8-1.7L5.5 19 0 21.9.6 19 4.6.8h4.9L8.1 7.2c1.1-1.2 2.2-1.7 3.6-1.7 3 0 4.9 1.9 4.9 5.5s-2.3 8.3-7 8.3Zm1.9-7.3c0 1.7-1.2 3-2.8 3s-1.7-.3-2.2-.9l.8-3.3c.6-.6 1.2-.9 2-.9 1.2 0 2.2.9 2.2 2.2Z" fill="#fff" fillRule="evenodd"/>
        <path d="M46.1 19.3c-2.8 0-4.9-1-4.9-3.3s0-.7.1-1l1.1-4.9h-2.2l1-4.2h2.2l.8-3.6L49.7 0l-.6 2.3-.8 3.6H51l-1 4.2h-2.7l-.7 3.2v.6c0 .6.4 1.1 1.2 1.1s.6 0 .7-.1v3.9c-.5.4-1.4.5-2.3.5Z" fill="#fff"/>
      </svg>
    </div>
  </div>
</a>


      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
      />
    </>
  );
};