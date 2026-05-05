import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = async (userId) => {
    if (!userId) return;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error) setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial session check
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't await here, let it happen in background so loading can finish
          fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        // ALWAYS set loading to false to unblock the UI
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      // Ensure loading is false on any auth change event
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper to determine superuser status
  const isSuperuser = user?.email === 'i_salahouelhadj@estin.dz';

  return (
    <AuthContext.Provider value={{ 
      user: user ? { ...user, isSuperuser, profile } : null, 
      profile,
      isSuperuser,
      session,
      loading, 
      profileLoading,
      signInWithPassword: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signUp: (email, password, metadata = {}) => supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: metadata } 
      }),
      signOut: () => supabase.auth.signOut(),
      refreshProfile: () => user && fetchProfile(user.id)
    }}>
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
