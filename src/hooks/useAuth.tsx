
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  showOnboarding: false,
  setShowOnboarding: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Fetch profile when user changes
  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
        // Show onboarding if profile is not complete
        if (!data.profile_complete) {
          setShowOnboarding(true);
        }
      } else {
        setProfile(null);
      }
    };

    if (user) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session ? 'session exists' : 'no session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clear profile when user signs out
        if (event === 'SIGNED_OUT' || !session) {
          setProfile(null);
          setShowOnboarding(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear local state immediately to ensure UI updates
      setUser(null);
      setSession(null);
      setProfile(null);
      setShowOnboarding(false);
      
      // Try to sign out from Supabase, but don't let errors prevent UI updates
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Supabase sign out error:', error);
          // Don't throw - we've already cleared local state
        } else {
          console.log('Supabase sign out successful');
        }
      } catch (supabaseError) {
        console.error('Supabase sign out exception:', supabaseError);
        // Don't throw - we've already cleared local state
      }
      
      // Force clear any remaining session data
      await supabase.auth.getSession().then(() => {
        // This helps ensure the session is fully cleared
        console.log('Session cleanup complete');
      }).catch(() => {
        // Ignore errors during cleanup
        console.log('Session cleanup had errors, but continuing...');
      });
      
    } catch (error) {
      console.error('Sign out process error:', error);
      // Even if everything fails, ensure state is cleared
      setUser(null);
      setSession(null);
      setProfile(null);
      setShowOnboarding(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      signOut,
      showOnboarding,
      setShowOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};
