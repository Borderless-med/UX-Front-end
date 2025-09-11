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
  // Replace with your actual Vercel deployment URL
  return 'https://your-app.vercel.app';
};

export const shouldUseIframeWorkaround = (): boolean => {
  return isInIframe() && isLovableEnvironment();
};