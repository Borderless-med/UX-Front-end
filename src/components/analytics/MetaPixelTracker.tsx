import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackPageView } from '@/utils/metaTracking';

const MetaPixelTracker = () => {
  const location = useLocation();
  const lastTrackedUrl = useRef<string>('');
  const isInitialized = useRef<boolean>(false);

  // Defer Meta Pixel initialization to avoid blocking FCP/LCP/TBT
  // Initialize after 5s to stay outside TBT measurement window (0-5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      initMetaPixel();
      isInitialized.current = true;
    }, 5000); // 5s delay - after TBT window
    
    return () => clearTimeout(timer);
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
