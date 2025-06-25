
export const COOKIE_STORAGE_KEY = 'cookie-consent';
export const CONSENT_EXPIRY_DAYS = 365;

export const COOKIE_CATEGORIES = {
  ESSENTIAL: 'essential',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
} as const;

export const COOKIE_CATEGORY_INFO = {
  [COOKIE_CATEGORIES.ESSENTIAL]: {
    title: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or logging in.',
    examples: 'Session cookies, authentication tokens, cookie consent preferences',
    color: 'green',
    required: true,
  },
  [COOKIE_CATEGORIES.ANALYTICS]: {
    title: 'Analytics Cookies',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website performance and user experience.',
    examples: 'Google Analytics, page view tracking, session duration',
    color: 'blue',
    required: false,
  },
  [COOKIE_CATEGORIES.MARKETING]: {
    title: 'Marketing Cookies',
    description: 'These cookies are used to deliver advertisements more relevant to you and your interests. They may be set by our advertising partners and used to build a profile of your interests.',
    examples: 'Facebook Pixel, Google Ads, remarketing tags',
    color: 'orange',
    required: false,
  },
} as const;
