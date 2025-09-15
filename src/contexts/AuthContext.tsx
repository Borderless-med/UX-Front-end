// src/contexts/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log("--- TRACER BULLET: LOGIN ATTEMPT START ---");
    console.log(`Attempting to sign in user: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("--- TRACER BULLET: LOGIN FAILED ---", error);
        throw error;
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

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    console.log("--- TRACER BULLET: REGISTER ATTEMPT START ---");
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("--- TRACER BULLET: REGISTER FAILED ---", error);
        throw error;
      }
      
      console.log("--- TRACER BULLET: REGISTER SUCCEEDED ---", data);
      // Even on success, signUp returns data, so we create our own success object
      return { success: true };

    } catch (error: any) {
      return { success: false, error: error.message || 'An unknown error occurred' };
    } finally {
      setIsLoading(false);
      console.log("--- TRACER BULLET: REGISTER ATTEMPT END ---");
    }
  };






  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, register, logout }}>
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