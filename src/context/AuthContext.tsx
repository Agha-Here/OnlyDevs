import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  supabase, 
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getProfile,
  getCreator,
  subscribeToCreator as supabaseSubscribeToCreator,
  Profile,
  Creator
} from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  creator: Creator | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string, displayName: string, isCreator: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  subscribeToCreator: (creatorId: string, tierName: string) => Promise<boolean>;
  isSubscribedTo: (creatorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setCreator(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const profileData = await getProfile(userId);
      setProfile(profileData);

      if (profileData.is_creator) {
        const creatorData = await getCreator(userId);
        setCreator(creatorData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await supabaseSignIn(email, password);
      toast.success('Welcome back, gorgeous! 💕');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string,
    isCreator: boolean
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await supabaseSignUp(email, password, username, displayName, isCreator);
      toast.success(
        isCreator 
          ? 'Welcome to the creator community! 🌟' 
          : 'Welcome to OnlyDevs! 🚀'
      );
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabaseSignOut();
      toast.success('See you later, gorgeous! 👋');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const subscribeToCreator = async (
    creatorId: string,
    tierName: string
  ): Promise<boolean> => {
    if (!user || !profile) {
      toast.error('Please login to subscribe');
      return false;
    }

    try {
      await supabaseSubscribeToCreator(user.id, creatorId, tierName);
      await loadUserData(user.id);
      toast.success('Successfully subscribed! 🎉');
      return true;
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Subscription failed');
      return false;
    }
  };

  const isSubscribedTo = (creatorId: string): boolean => {
    return profile?.subscriptions?.includes(creatorId) || false;
  };

  const value = {
    user,
    profile,
    creator,
    loading,
    login,
    signup,
    logout,
    subscribeToCreator,
    isSubscribedTo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};