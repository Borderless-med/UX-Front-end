
import { useState, useEffect } from 'react';
import { CookieConsent } from '../types/cookieTypes';
import { getSavedConsent, parseSavedConsent, saveConsent, removeSavedConsent } from '../utils/cookieUtils';

export const useCookieStorage = () => {
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const loadSavedConsent = (): CookieConsent | null => {
    const savedConsent = getSavedConsent();
    if (savedConsent) {
      const parsed = parseSavedConsent(savedConsent);
      if (parsed) {
        setHasConsented(true);
        setShowBanner(false);
        return parsed;
      } else {
        // Consent expired
        removeSavedConsent();
        setShowBanner(true);
        return null;
      }
    } else {
      // No saved consent
      setShowBanner(true);
      return null;
    }
  };

  const updateStoredConsent = (consent: CookieConsent) => {
    saveConsent(consent);
    setHasConsented(true);
    setShowBanner(false);
  };

  return {
    hasConsented,
    showBanner,
    setShowBanner,
    loadSavedConsent,
    updateStoredConsent,
  };
};
