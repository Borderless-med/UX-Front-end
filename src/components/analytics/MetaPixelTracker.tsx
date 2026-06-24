import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackPageView } from '@/utils/metaTracking';

const MetaPixelTracker = () => {
  const location = useLocation();
  const lastTrackedUrl = useRef<string>('');

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
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
