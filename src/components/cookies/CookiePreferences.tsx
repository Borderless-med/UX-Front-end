
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import CookieTypeCard from './components/CookieTypeCard';
import ConsentActions from './components/ConsentActions';
import { COOKIE_CATEGORIES } from './constants/cookieConstants';

const CookiePreferences = () => {
  const { 
    consent, 
    updateConsent, 
    showPreferences, 
    setShowPreferences 
  } = useCookieConsent();

  const handleSavePreferences = () => {
    updateConsent(consent);
  };

  const handleToggle = (category: 'analytics' | 'marketing', value: boolean) => {
    updateConsent({ [category]: value });
  };

  return (
    <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-blue-600" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            Manage your cookie preferences below. You can enable or disable different categories 
            of cookies except for essential cookies which are required for the website to function.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          
          <div className="space-y-6">
            <CookieTypeCard
              category={COOKIE_CATEGORIES.ESSENTIAL}
              isEnabled={consent.essential}
            />

            <CookieTypeCard
              category={COOKIE_CATEGORIES.ANALYTICS}
              isEnabled={consent.analytics}
              onToggle={(checked) => handleToggle('analytics', checked)}
            />

            <CookieTypeCard
              category={COOKIE_CATEGORIES.MARKETING}
              isEnabled={consent.marketing}
              onToggle={(checked) => handleToggle('marketing', checked)}
            />
          </div>

          <ConsentActions
            onAcceptAll={handleSavePreferences}
            onEssentialOnly={() => setShowPreferences(false)}
            onManagePreferences={() => setShowPreferences(false)}
            variant="preferences"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferences;
