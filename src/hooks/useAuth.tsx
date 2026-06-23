import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    metadata: { 
      full_name: string; 
      phone: string; 
      city_of_origin: string;
      role?: 'STUDENT' | 'HOSTEL_OWNER';
      hostel_id?: string;
    }
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  isDemoMode: boolean;
  isLocalUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemoMode = !isSupabaseConfigured();

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };  useEffect(() => {
    if (isDemoMode) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);



  const signIn = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode: simulate login
      const demoUser = { id: 'demo-user', email } as User;
      const demoProfile: Profile = {
        id: 'demo-user',
        full_name: 'Demo Student',
        phone: '+92 300 1234567',
        city_of_origin: 'Lahore',
        role: 'STUDENT',
        created_at: new Date().toISOString(),
      };
      setUser(demoUser);
      setProfile(demoProfile);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message ?? null };
  }, [isDemoMode]);

  const signUp = useCallback(async (
    email: string,
    password: string,
    metadata: { full_name: string; phone: string; city_of_origin: string; role?: string }
  ) => {
    if (isDemoMode) {
      const demoUser = { id: 'demo-user', email } as User;
      const demoProfile: Profile = {
        id: 'demo-user',
        full_name: metadata.full_name,
        phone: metadata.phone,
        city_of_origin: metadata.city_of_origin,
        role: (metadata.role || 'STUDENT') as 'STUDENT' | 'ADMIN' | 'HOSTEL_OWNER',
        is_verified: metadata.role === 'HOSTEL_OWNER' ? false : true,
        hostel_id: (metadata as { hostel_id?: string }).hostel_id ?? null,
        created_at: new Date().toISOString(),
      };
      setUser(demoUser);
      setProfile(demoProfile);
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          phone: metadata.phone,
          city_of_origin: metadata.city_of_origin,
          role: metadata.role || 'STUDENT',
          hostel_id: (metadata as { hostel_id?: string }).hostel_id,
        },
      },
    });

    if (error) return { error: error.message };
    return { error: null };
  }, [isDemoMode]);

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [isDemoMode]);

  const signInWithGoogle = useCallback(async () => {
    if (isDemoMode) {
      // Demo mode fallback
      return { error: 'Google sign in is not available in demo mode.' };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/hostels`,
      },
    });
    return { error: error?.message ?? null };
  }, [isDemoMode]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    if (isDemoMode) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return { error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }
    return { error: error?.message ?? null };
  }, [user, isDemoMode]);

  // A "local user" is anyone without a real Supabase session:
  // - demo mode users (Supabase not configured)
  // - admin backdoor users (dev-only fake login)
  const isLocalUser = isDemoMode || (!!user && !session);

  const contextValue = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
    isDemoMode,
    isLocalUser,
  }), [user, profile, session, loading, signIn, signUp, signOut, signInWithGoogle, updateProfile, isDemoMode, isLocalUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
