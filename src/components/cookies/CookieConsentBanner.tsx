
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, X } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import ConsentActions from './components/ConsentActions';

const CookieConsentBanner = () => {
  const { 
    showBanner, 
    acceptAll, 
    acceptEssentialOnly, 
    hideBanner, 
    setShowPreferences 
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50">
      <Card className="max-w-4xl mx-auto bg-white border-gray-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                We use cookies to enhance your experience
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                We use essential cookies to make our site work. We'd also like to set optional cookies 
                to help us improve our website and analyze how it's used. You can choose which cookies 
                to accept below, or manage your preferences at any time.
              </p>
              
              <ConsentActions
                onAcceptAll={acceptAll}
                onEssentialOnly={acceptEssentialOnly}
                onManagePreferences={() => setShowPreferences(true)}
                variant="banner"
              />
              
              <p className="text-xs text-gray-500 mt-3">
                By clicking "Accept All", you agree to our use of cookies. 
                View our <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a> for more details.
              </p>
            </div>
            
            <button
              onClick={hideBanner}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsentBanner;
