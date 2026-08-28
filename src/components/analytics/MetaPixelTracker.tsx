import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackPageView } from '@/utils/metaTracking';

const MetaPixelTracker = () => {
  const location = useLocation();
  const lastTrackedUrl = useRef<string>('');
  const isInitialized = useRef<boolean>(false);

  // Defer Meta Pixel initialization to avoid blocking FCP/LCP
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initMetaPixel();
        isInitialized.current = true;
      }, { timeout: 3000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        initMetaPixel();
        isInitialized.current = true;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Only track if pixel is initialized
    if (!isInitialized.current) return;
    
    const currentUrl = `${location.pathname}${location.search}`;

    if (lastTrackedUrl.current === currentUrl) {
      return;
    }

    trackPageView();
    lastTrackedUrl.current = currentUrl;
  }, [location.pathname, location.search]);

  return null;
};

export default MetaPixelTracker;
