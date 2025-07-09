
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SecurityContextType {
  isSecureConnection: boolean;
  userAgent: string;
  ipAddress: string | null;
  sessionId: string;
  reportSecurityEvent: (event: string, details?: any) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecureConnection, setIsSecureConnection] = useState(false);
  const [userAgent] = useState(navigator.userAgent);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    // Check if connection is secure
    setIsSecureConnection(window.location.protocol === 'https:');
    
    // Get user's IP address (for logging purposes)
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress('unknown'));
  }, []);

  const reportSecurityEvent = (event: string, details?: any) => {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent,
      ipAddress,
      sessionId,
      url: window.location.href
    };
    
    // Log to console for now (in production, send to security monitoring service)
    console.warn('Security Event:', securityEvent);
    
    // In production, you might want to send this to your monitoring service
    // fetch('/api/security-events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(securityEvent)
    // });
  };

  return (
    <SecurityContext.Provider value={{
      isSecureConnection,
      userAgent,
      ipAddress,
      sessionId,
      reportSecurityEvent
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
