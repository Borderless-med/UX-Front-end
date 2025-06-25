
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cookie, Shield, BarChart3, Target } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

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
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Manage your cookie preferences below. You can enable or disable different categories 
            of cookies except for essential cookies which are required for the website to function.
          </p>
          
          {/* Essential Cookies */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Essential Cookies</span>
                </div>
                <Switch checked={true} disabled className="opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600">
                These cookies are necessary for the website to function and cannot be switched off. 
                They are usually only set in response to actions made by you which amount to a request 
                for services, such as setting your privacy preferences or logging in.
              </p>
            </CardContent>
          </Card>

          {/* Analytics Cookies */}
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span>Analytics Cookies</span>
                </div>
                <Switch 
                  checked={consent.analytics} 
                  onCheckedChange={(checked) => handleToggle('analytics', checked)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-2">
                These cookies help us understand how visitors interact with our website by collecting 
                and reporting information anonymously. This helps us improve our website performance 
                and user experience.
              </p>
              <p className="text-xs text-gray-500">
                Examples: Google Analytics, page view tracking, session duration
              </p>
            </CardContent>
          </Card>

          {/* Marketing Cookies */}
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span>Marketing Cookies</span>
                </div>
                <Switch 
                  checked={consent.marketing} 
                  onCheckedChange={(checked) => handleToggle('marketing', checked)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-2">
                These cookies are used to deliver advertisements more relevant to you and your interests. 
                They may be set by our advertising partners and used to build a profile of your interests.
              </p>
              <p className="text-xs text-gray-500">
                Examples: Facebook Pixel, Google Ads, remarketing tags
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleSavePreferences}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex-1"
            >
              Save Preferences
            </Button>
            <Button 
              onClick={() => setShowPreferences(false)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferences;
