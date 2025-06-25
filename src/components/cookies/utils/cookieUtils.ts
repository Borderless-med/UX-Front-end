
import { CookieConsent } from '../types/cookieTypes';
import { COOKIE_STORAGE_KEY, CONSENT_EXPIRY_DAYS } from '../constants/cookieConstants';

export const parseSavedConsent = (savedConsent: string): CookieConsent | null => {
  try {
    const parsed = JSON.parse(savedConsent);
    const now = Date.now();
    const consentAge = now - (parsed.timestamp || 0);
    const maxAge = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    if (consentAge < maxAge) {
      return {
        essential: true,
        analytics: parsed.analytics || false,
        marketing: parsed.marketing || false,
        timestamp: parsed.timestamp,
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing saved consent:', error);
    return null;
  }
};

export const saveConsent = (consent: CookieConsent): void => {
  localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consent));
};

export const removeSavedConsent = (): void => {
  localStorage.removeItem(COOKIE_STORAGE_KEY);
};

export const getSavedConsent = (): string | null => {
  return localStorage.getItem(COOKIE_STORAGE_KEY);
};

export const createConsentObject = (overrides: Partial<CookieConsent> = {}): CookieConsent => {
  return {
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
    ...overrides,
  };
};
