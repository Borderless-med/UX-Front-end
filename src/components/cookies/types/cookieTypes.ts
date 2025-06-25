
export type CookieCategory = 'essential' | 'analytics' | 'marketing';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp?: number;
}

export interface CookieConsentContextType {
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

export interface CookieCategoryInfo {
  title: string;
  description: string;
  examples: string;
  color: string;
  required: boolean;
}
