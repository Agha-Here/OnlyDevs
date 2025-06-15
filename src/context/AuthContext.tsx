import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string, isCreator: boolean) => Promise<boolean>;
  logout: () => void;
  updateSubscription: (tier: string) => void;
  subscribeToCreator: (creatorId: string) => void;
  isSubscribedTo: (creatorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('onlydevs_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login - in real app, this would validate against backend
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: email.split('@')[0],
      email,
      displayName: email.split('@')[0],
      isCreator: false,
      subscriptionTier: 'Free Tier',
      subscriptions: [],
      joinDate: new Date(),
      totalSpent: 0
    };

    setUser(mockUser);
    localStorage.setItem('onlydevs_user', JSON.stringify(mockUser));
    return true;
  };

  const signup = async (email: string, password: string, username: string, isCreator: boolean): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      displayName: username,
      isCreator,
      subscriptionTier: 'Free Tier',
      subscriptions: [],
      joinDate: new Date(),
      totalSpent: 0
    };

    setUser(mockUser);
    localStorage.setItem('onlydevs_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('onlydevs_user');
  };

  const updateSubscription = (tier: string) => {
    if (user) {
      const updatedUser = { ...user, subscriptionTier: tier };
      setUser(updatedUser);
      localStorage.setItem('onlydevs_user', JSON.stringify(updatedUser));
    }
  };

  const subscribeToCreator = (creatorId: string) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        subscriptions: [...user.subscriptions, creatorId],
        totalSpent: (user.totalSpent || 0) + 25 // Assume Sugar Daddy tier
      };
      setUser(updatedUser);
      localStorage.setItem('onlydevs_user', JSON.stringify(updatedUser));
    }
  };

  const isSubscribedTo = (creatorId: string): boolean => {
    return user?.subscriptions.includes(creatorId) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateSubscription,
      subscribeToCreator,
      isSubscribedTo
    }}>
      {children}
    </AuthContext.Provider>
  );
};