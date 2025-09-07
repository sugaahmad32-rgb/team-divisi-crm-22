import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'superadmin' | 'owner' | 'manager' | 'supervisor' | 'marketing';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  division_id?: string;
  division_name?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  canManageRole: (targetRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for userId:', userId);
      
      // Check for impersonation session first
      const impersonationData = localStorage.getItem('user_impersonation');
      let targetUserId = userId;
      
      if (impersonationData) {
        try {
          const parsed = JSON.parse(impersonationData);
          if (parsed.expires_at && new Date(parsed.expires_at) > new Date()) {
            targetUserId = parsed.impersonated_user_id;
            console.log('👤 Using impersonated user ID:', targetUserId);
          } else {
            console.log('⏰ Impersonation session expired, clearing...');
            localStorage.removeItem('user_impersonation');
          }
        } catch (e) {
          console.error('Error parsing impersonation data:', e);
          localStorage.removeItem('user_impersonation');
        }
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          divisions!division_id(name)
        `)
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        return;
      }

      console.log('📋 Profile data received:', profileData);

      if (profileData) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', targetUserId)
          .maybeSingle();

        console.log('🔐 Role data received:', roleData);

        // Get division name from the joined data
        let divisionName = undefined;
        if (profileData.divisions && Array.isArray(profileData.divisions) && profileData.divisions.length > 0) {
          divisionName = profileData.divisions[0].name;
        }

        const finalProfile = {
          ...profileData,
          division_name: divisionName,
          role: roleData?.role
        };

        console.log('✅ Final profile set:', finalProfile);
        setProfile(finalProfile);
      } else {
        console.log('❌ No profile data found for user:', targetUserId);
      }
    } catch (error) {
      console.error('💥 Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName
          }
        }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const canManageRole = (targetRole: UserRole): boolean => {
    if (!profile?.role) return false;
    
    const roleHierarchy = {
      superadmin: ['owner', 'manager', 'supervisor', 'marketing'],
      owner: ['manager', 'supervisor', 'marketing'],
      manager: ['supervisor', 'marketing'],
      supervisor: [],
      marketing: []
    };
    
    return roleHierarchy[profile.role]?.includes(targetRole) || false;
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    canManageRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}