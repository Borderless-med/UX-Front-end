
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserCategory = Database['public']['Enums']['user_category'];

interface AuthUser extends User {
  profile?: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  hasValidConsent: () => Promise<boolean>;
  logDataAccess: (dataType: string, clinicId?: string, practitionerName?: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  organization?: string;
  purposeOfUse: string;
  userCategory: UserCategory;
  consentGiven: boolean;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          setUser({ ...session.user, profile });

          // Log first login for PDPA compliance
          if (event === 'SIGNED_IN' && profile) {
            setTimeout(() => {
              logConsentRecord(session.user.id, 'initial_login', true);
            }, 0);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Defer profile fetch to avoid auth state change conflicts
        setTimeout(async () => {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          setUser({ ...session.user, profile });
          setSession(session);
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to log consent records
  const logConsentRecord = async (
    userId: string, 
    consentType: string, 
    consentStatus: boolean,
    details?: any
  ) => {
    try {
      await supabase.rpc('log_consent', {
        p_user_id: userId,
        p_consent_type: consentType,
        p_consent_status: consentStatus,
        p_ip_address: null, // Could be enhanced to capture real IP
        p_user_agent: navigator.userAgent,
        p_consent_details: details
      });
    } catch (error) {
      console.error('Error logging consent:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Profile will be fetched in the auth state change handler
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred during login' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      if (!data.consentGiven) {
        setIsLoading(false);
        return { success: false, error: 'PDPA consent is required to create an account' };
      }

      // Determine user category based on email domain for healthcare professionals
      let userCategory = data.userCategory;
      const emailDomain = data.email.split('@')[1];
      
      // Auto-detect healthcare professionals by email domain
      const healthcareDomains = [
        'clinic.com.sg', 'dental.com.sg', 'moh.gov.sg', 
        'hospital.com.sg', 'polyclinic.sg'
      ];
      
      if (healthcareDomains.some(domain => emailDomain.includes(domain)) && 
          userCategory === 'patient') {
        userCategory = 'healthcare_professional';
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName,
            organization: data.organization,
            purpose_of_use: data.purposeOfUse,
            user_category: userCategory,
          }
        }
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Log initial consent for PDPA compliance
      if (authData.user) {
        await logConsentRecord(authData.user.id, 'initial_registration', true, {
          email: data.email,
          user_category: userCategory,
          consent_timestamp: new Date().toISOString()
        });
      }

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An unexpected error occurred during registration' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user?.id) {
        return { success: false, error: 'No user logged in' };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Refresh user profile
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);
      setUser({ ...user, profile });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred while updating profile' };
    }
  };

  const hasValidConsent = async (): Promise<boolean> => {
    try {
      if (!user?.id) return false;

      const { data, error } = await supabase.rpc('has_valid_consent', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error checking consent:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in hasValidConsent:', error);
      return false;
    }
  };

  const logDataAccess = async (
    dataType: string, 
    clinicId?: string, 
    practitionerName?: string
  ): Promise<void> => {
    try {
      if (!user?.id) return;

      await supabase.rpc('audit_data_access', {
        p_user_id: user.id,
        p_data_type: dataType,
        p_clinic_id: clinicId,
        p_practitioner_name: practitionerName,
        p_ip_address: null, // Could be enhanced to capture real IP
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error logging data access:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    isAuthenticated: !!user && !!session,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    hasValidConsent,
    logDataAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
