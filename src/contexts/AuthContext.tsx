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
  
  // --- CHANGE 2: Add the new useEffect hook for session restoration ---
  useEffect(() => {
    // This effect runs whenever the user's authentication state changes.
    // We use a unique key for session ID to avoid interference from Supabase or other libraries.
    if (user && session) { 
      // We only care about when a user has just logged IN.
      const restoreSession = async () => {
        const restoredSessionId = localStorage.getItem('gsp-chatbot-session-id');
        if (restoredSessionId) {
          console.log(`User ${user.id} logged in. Attempting to restore session: ${restoredSessionId}`);
          setSessionId(restoredSessionId);
          try {
            const data = await restInvokeFunction('restore_session', {
              body: { session_id: restoredSessionId, user_id: user.id },
              headers: { 'x-environment': getEnvironment() },
            });
            if (data.success && data.context) {
              console.log('✅ Session successfully restored from backend.');
            } else {
              console.warn('Backend restore call did not succeed, starting fresh.', data);
              localStorage.removeItem('gsp-chatbot-session-id');
              setSessionId(null);
            }
          } catch (error) {
            console.error('Failed to restore session:', error);
            localStorage.removeItem('gsp-chatbot-session-id');
            setSessionId(null);
          }
        } else {
          console.log("User logged in, but no previous chat session ID found in localStorage. A new session will be created on the first message.");
          setSessionId(null);
        }
      };
      restoreSession();
    }
  }, [user, session]); // This code runs ONLY when the 'user' or 'session' object changes.


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
    console.log('🔴 LOGOUT FUNCTION CALLED - Our custom logout is running!');
    
    // --- THIS IS THE CRITICAL FIX ---
    // Step 1: Read the session ID from storage and save it in a temporary variable.
    // We use a unique key for session ID to avoid interference from Supabase or other libraries.
  const lastSessionId = localStorage.getItem('gsp-chatbot-session-id');
    console.log('🔴 Preparing to log out. Last session ID was:', lastSessionId);

    // Step 2: Call the signOut function with no parameters (safest default)
    await supabase.auth.signOut();

    // Step 3: Immediately after signOut completes, write the session ID back.
    if (lastSessionId) {
      localStorage.setItem('gsp-chatbot-session-id', lastSessionId);
      console.log('🔴 Logout complete. Session ID has been restored to localStorage.');
    } else {
      console.log('🔴 No session ID to preserve (this is expected if you had no previous chat)');
    }
    // --- END OF FIX ---
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