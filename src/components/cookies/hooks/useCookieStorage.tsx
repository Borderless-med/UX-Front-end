
import { useState, useEffect } from 'react';
import { CookieConsent } from '../types/cookieTypes';
import { getSavedConsent, parseSavedConsent, saveConsent, removeSavedConsent } from '../utils/cookieUtils';

export const useCookieStorage = () => {
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);

  // Delay banner to prevent LCP interference
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let scrollTriggered = false;

    const handleScroll = () => {
      if (!scrollTriggered) {
        scrollTriggered = true;
        setDelayComplete(true);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('touchstart', handleScroll);
      }
    };

    // Show banner after 3 seconds OR on first scroll/touch
    timeoutId = setTimeout(() => {
      setDelayComplete(true);
    }, 3000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleScroll);
    };
  }, []);

  const loadSavedConsent = (): CookieConsent | null => {
    const savedConsent = getSavedConsent();
    if (savedConsent) {
      const parsed = parseSavedConsent(savedConsent);
      if (parsed) {
        setHasConsented(true);
        setShowBanner(false);
        return parsed;
      } else {
        // Consent expired - only show if delay is complete
        removeSavedConsent();
        if (delayComplete) {
          setShowBanner(true);
        }
        return null;
      }
    } else {
      // No saved consent - only show if delay is complete
      if (delayComplete) {
        setShowBanner(true);
      }
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
