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
                    <Zap size={18} className="mr-2" />
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
      />
    </>
  );
};