import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  supabase, 
  signUp as supabaseSignUp, 
  signIn as supabaseSignIn, 
  signOut as supabaseSignOut,
  getCurrentUser,
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
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
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserData(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserData(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setCreator(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
      toast.success('Welcome back, beautiful! 💕');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string, displayName: string, isCreator: boolean): Promise<boolean> => {
    try {
      setLoading(true);
      await supabaseSignUp(email, password, username, displayName, isCreator);
      toast.success('Welcome to the revolution! 🚀');
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message.includes('already registered')) {
        toast.error('That email is already taken by another coding hottie! 💕');
      } else if (error.message.includes('username')) {
        toast.error("That username's taken by another coding hottie!");
      } else {
        toast.error(error.message || 'Signup failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabaseSignOut();
      setUser(null);
      setProfile(null);
      setCreator(null);
      toast.success('See you later, gorgeous! 👋');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const subscribeToCreator = async (creatorId: string, tierName: string): Promise<boolean> => {
    if (!user || !profile) {
      toast.error('Please login to subscribe');
      return false;
    }

    try {
      await supabaseSubscribeToCreator(user.id, creatorId, tierName);
      
      // Reload profile to get updated subscriptions
      await loadUserData(user.id);
      
      toast.success(`Successfully subscribed! Welcome to the exclusive club! 🎉`);
      return true;
    } catch (error: any) {
      console.error('Subscription error:', error);
      if (error.message.includes('Already subscribed')) {
        toast.error('You\'re already subscribed to this hottie! 💕');
      } else {
        toast.error(error.message || 'Subscription failed. Please try again.');
      }
      return false;
    }
  };

  const isSubscribedTo = (creatorId: string): boolean => {
    return profile?.subscriptions?.includes(creatorId) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      creator,
      loading,
      login,
      signup,
      logout,
      subscribeToCreator,
      isSubscribedTo
    }}>
      {children}
    </AuthContext.Provider>
  );
};