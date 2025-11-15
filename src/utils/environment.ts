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
  // Updated to use custom apex domain
  return 'https://orachope.org';
};

// Detect if running inside the Lovable Editor preview iframe
export const isLovableEditorPreview = (): boolean => {
  if (!isInIframe()) return false;
  try {
    const parentHostname = window.parent?.location?.hostname || '';
    const childHostname = window.location.hostname;
    const isParentLovable = parentHostname.includes('lovable.app') || parentHostname.includes('lovable.dev');
    const isDifferentHost = !!parentHostname && parentHostname !== childHostname;
    return isParentLovable && isDifferentHost;
  } catch {
    // Cross-origin access blocked → most likely the Lovable editor iframe
    return true;
  }
};

// Only use workaround inside the Lovable editor preview iframe
export const shouldUseIframeWorkaround = (): boolean => {
  return isLovableEditorPreview();
};