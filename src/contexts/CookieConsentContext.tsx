
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CookieConsent, CookieConsentContextType } from '@/components/cookies/types/cookieTypes';
import { useCookieStorage } from '@/components/cookies/hooks/useCookieStorage';
import { createConsentObject } from '@/components/cookies/utils/cookieUtils';

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent>(createConsentObject());
  const [showPreferences, setShowPreferences] = useState(false);
  
  const {
    hasConsented,
    showBanner,
    setShowBanner,
    loadSavedConsent,
    updateStoredConsent,
  } = useCookieStorage();

  // Load saved consent on mount
  useEffect(() => {
    const savedConsent = loadSavedConsent();
    if (savedConsent) {
      setConsent(savedConsent);
    }
  }, []);

  // Apply consent changes to tracking scripts
  useEffect(() => {
    if (hasConsented) {
      // Enable/disable analytics based on consent
      if (consent.analytics) {
        console.log('Analytics enabled');
      } else {
        console.log('Analytics disabled');
      }

      // Enable/disable marketing based on consent
      if (consent.marketing) {
        console.log('Marketing cookies enabled');
      } else {
        console.log('Marketing cookies disabled');
      }
    }
  }, [consent, hasConsented]);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent = createConsentObject({
      analytics: newConsent.analytics ?? consent.analytics,
      marketing: newConsent.marketing ?? consent.marketing,
    });
    
    setConsent(updatedConsent);
    setShowPreferences(false);
    updateStoredConsent(updatedConsent);
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
