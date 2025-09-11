// Environment detection utilities

export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const isLovableEnvironment = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.includes('lovable.app') || hostname.includes('lovable.dev') || hostname === 'localhost';
};

export const isProductionEnvironment = (): boolean => {
  const hostname = window.location.hostname;
  return !hostname.includes('lovable') && hostname !== 'localhost';
};

export const getProductionUrl = (): string => {
  // Update this with your actual Vercel deployment URL after publishing
  return 'https://jb-dental-directory.vercel.app';
};

export const shouldUseIframeWorkaround = (): boolean => {
  // Only use workaround when actually in iframe AND in development environment
  // Published Lovable apps are not in iframes, so they should work normally
  return isInIframe() && isLovableEnvironment() && window.location.hostname !== window.parent?.location?.hostname;
};