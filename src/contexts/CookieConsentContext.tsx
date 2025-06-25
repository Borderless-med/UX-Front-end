
import React, { createContext, useContext, useState, useEffect } from 'react';

export type CookieCategory = 'essential' | 'analytics' | 'marketing';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp?: number;
}

interface CookieConsentContextType {
  consent: CookieConsent;
  hasConsented: boolean;
  updateConsent: (newConsent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  showBanner: boolean;
  hideBanner: () => void;
  showPreferences: boolean;
  setShowPreferences: (show: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const STORAGE_KEY = 'cookie-consent';
const CONSENT_EXPIRY_DAYS = 365;

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true, // Always true
    analytics: false,
    marketing: false,
  });
  
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Load saved consent on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        const now = Date.now();
        const consentAge = now - (parsed.timestamp || 0);
        const maxAge = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        
        if (consentAge < maxAge) {
          setConsent({
            essential: true,
            analytics: parsed.analytics || false,
            marketing: parsed.marketing || false,
            timestamp: parsed.timestamp,
          });
          setHasConsented(true);
          setShowBanner(false);
        } else {
          // Consent expired, show banner
          localStorage.removeItem(STORAGE_KEY);
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error parsing saved consent:', error);
        setShowBanner(true);
      }
    } else {
      // No saved consent, show banner
      setShowBanner(true);
    }
  }, []);

  // Apply consent changes to tracking scripts
  useEffect(() => {
    if (hasConsented) {
      // Enable/disable analytics based on consent
      if (consent.analytics) {
        // Future: Initialize Google Analytics or other analytics
        console.log('Analytics enabled');
      } else {
        // Future: Disable analytics
        console.log('Analytics disabled');
      }

      // Enable/disable marketing based on consent
      if (consent.marketing) {
        // Future: Initialize marketing pixels (Facebook, Google Ads, etc.)
        console.log('Marketing cookies enabled');
      } else {
        // Future: Disable marketing cookies
        console.log('Marketing cookies disabled');
      }
    }
  }, [consent, hasConsented]);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent: CookieConsent = {
      essential: true, // Always true
      analytics: newConsent.analytics ?? consent.analytics,
      marketing: newConsent.marketing ?? consent.marketing,
      timestamp: Date.now(),
    };
    
    setConsent(updatedConsent);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConsent));
  };

  const acceptAll = () => {
    updateConsent({
      analytics: true,
      marketing: true,
    });
  };

  const acceptEssentialOnly = () => {
    updateConsent({
      analytics: false,
      marketing: false,
    });
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  const value: CookieConsentContextType = {
    consent,
    hasConsented,
    updateConsent,
    acceptAll,
    acceptEssentialOnly,
    showBanner,
    hideBanner,
    showPreferences,
    setShowPreferences,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
