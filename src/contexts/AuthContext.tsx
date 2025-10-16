// src/contexts/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
// --- CHANGE 1: Import the API client and the environment helper ---
import { restInvokeFunction } from '@/utils/restClient';

const getEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }
  return 'production';
};

// --- (No changes to this interface) ---
interface RegistrationData {
  email: string;
  password: string;
  fullName: string;
  organization: string;
  purposeOfUse: string;
  userCategory: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (registrationData: RegistrationData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const register = async (registrationData: RegistrationData) => {
    setIsLoading(true);
    console.log("--- TRACER BULLET: REGISTER ATTEMPT START ---");
    try {
      const { email, password, fullName, organization, purposeOfUse, userCategory } = registrationData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            organization: organization,
            purpose_of_use: purposeOfUse,
            user_category: userCategory,
          }
        }
      });

      if (error) {
        console.error("--- TRACER BULLET: REGISTER FAILED ---", error);
        throw error;
      }
      console.log("--- TRACER BULLET: REGISTER SUCCEEDED ---", data);
      return { success: true };

    } catch (error: any) {
      return { success: false, error: error.message || 'An unknown error occurred' };
    } finally {
      setIsLoading(false);
      console.log("--- TRACER BULLET: REGISTER ATTEMPT END ---");
    }
  };
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  // --- FIX: Remove sessionId restoration from localStorage after login ---
  useEffect(() => {
    if (user && session) {
      setSessionId(null);
      localStorage.removeItem('gsp-chatbot-session-id');
      console.log('SessionId cleared after login. New chat will create a new session.');
    }
  }, [user, session]);


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log("--- TRACER BULLET: LOGIN ATTEMPT START ---");
    console.log(`Attempting to sign in user: ${email}`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Supabase signInWithPassword response:', { data, error });
      if (error) {
        console.error("--- TRACER BULLET: LOGIN FAILED ---", error);
        return { success: false, error: error.message || 'Login failed' };
      }
      console.log("--- TRACER BULLET: LOGIN SUCCEEDED ---", data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An unknown error occurred' };
    } finally {
      setIsLoading(false);
      console.log("--- TRACER BULLET: LOGIN ATTEMPT END ---");
    }
  };
  
  const logout = async () => {
    setSessionId(null);
    localStorage.removeItem('gsp-chatbot-session-id');
    await supabase.auth.signOut();
    console.log('Logout complete. Session ID cleared from localStorage.');
  };



  return (
    <AuthContext.Provider value={{ user, session, isLoading, sessionId, setSessionId, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};