import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserProfile } from "@/contexts/AuthContext";

interface User {
  id: string;
  display_name: string;
  email: string;
  role: string;
  division_name?: string;
}

interface UserSession {
  id: string;
  original_user_id: string;
  impersonated_user_id: string;
  session_token: string;
  created_at: string;
  expires_at: string;
}

export function useSwitchUser() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchAvailableUsers();
      checkCurrentSession();
    }
  }, [user, profile]);

  const fetchAvailableUsers = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      
      // Get all users that current user can impersonate
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          email,
          division_id,
          divisions(name),
          user_roles(role)
        `)
        .neq('user_id', user.id); // Exclude current user

      if (error) throw error;

      // Filter users based on role hierarchy and check permissions
      const filteredUsers: User[] = [];
      
      for (const userData of usersData || []) {
        // Check if current user can impersonate this user
        const { data: canImpersonate, error: permError } = await supabase
          .rpc('can_impersonate_user', {
            impersonator_id: user.id,
            target_user_id: userData.user_id
          });

        if (!permError && canImpersonate) {
          const userRole = userData.user_roles && userData.user_roles.length > 0 
            ? (userData.user_roles[0] as any).role 
            : 'marketing';
          
          filteredUsers.push({
            id: userData.user_id,
            display_name: userData.display_name,
            email: userData.email,
            role: userRole,
            division_name: userData.divisions?.name
          });
        }
      }

      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentSession = async () => {
    if (!user) return;

    try {
      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('original_user_id', user.id)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (error) throw error;

      if (sessions && sessions.length > 0) {
        setCurrentSession(sessions[0]);
        setIsImpersonating(true);
      } else {
        setCurrentSession(null);
        setIsImpersonating(false);
      }
    } catch (error) {
      console.error('Error checking current session:', error);
    }
  };

  const switchToUser = async (targetUserId: string) => {
    if (!user) return;

    try {
      setLoading(true);

      // End any existing session first
      await endImpersonation();

      // Create new impersonation session
      const sessionToken = `switch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

      const { data: session, error } = await supabase
        .from('user_sessions')
        .insert({
          original_user_id: user.id,
          impersonated_user_id: targetUserId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: window.location.hostname,
          user_agent: navigator.userAgent
        })
        .select()
        .single();

      if (error) throw error;

      // Store session info in localStorage for persistence across page reloads
      localStorage.setItem('impersonation_session', JSON.stringify({
        sessionId: session.id,
        originalUserId: user.id,
        impersonatedUserId: targetUserId,
        sessionToken: sessionToken
      }));

      setCurrentSession(session);
      setIsImpersonating(true);

      toast({
        title: "Success",
        description: "Successfully switched user view",
      });

      // Refresh the page to update the context
      window.location.reload();

    } catch (error) {
      console.error('Error switching user:', error);
      toast({
        title: "Error",
        description: "Failed to switch user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const endImpersonation = async () => {
    if (!currentSession) return;

    try {
      setLoading(true);

      // End the session in database
      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      // Clear localStorage
      localStorage.removeItem('impersonation_session');

      setCurrentSession(null);
      setIsImpersonating(false);

      toast({
        title: "Success",
        description: "Returned to your original account",
      });

      // Refresh the page to update the context
      window.location.reload();

    } catch (error) {
      console.error('Error ending impersonation:', error);
      toast({
        title: "Error",
        description: "Failed to end impersonation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getImpersonatedUserInfo = async (): Promise<UserProfile | null> => {
    if (!currentSession) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          email,
          division_id,
          user_roles(role)
        `)
        .eq('user_id', currentSession.impersonated_user_id)
        .single();

      if (error) throw error;

      const userRole = profile.user_roles && profile.user_roles.length > 0 
        ? (profile.user_roles[0] as any).role 
        : 'marketing';

      return {
        id: profile.user_id,
        user_id: profile.user_id,
        display_name: profile.display_name,
        email: profile.email,
        division_id: profile.division_id,
        role: userRole
      };
    } catch (error) {
      console.error('Error getting impersonated user info:', error);
      return null;
    }
  };

  return {
    availableUsers,
    loading,
    isImpersonating,
    currentSession,
    switchToUser,
    endImpersonation,
    getImpersonatedUserInfo,
    refetch: fetchAvailableUsers
  };
}