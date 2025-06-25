
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Cookie, Settings, Clock, Shield, BarChart3, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { useEffect } from 'react';
import PolicySection from '@/components/cookies/components/PolicySection';
import IconWithText from '@/components/cookies/components/IconWithText';

const CookiePolicy = () => {
  const { setShowPreferences } = useCookieConsent();

  useEffect(() => {
    console.log('Cookie Policy page loaded successfully');
    document.title = 'Cookie Policy - SG-JB Dental';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-32 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600">✓ Cookie Policy Page Loaded</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Learn about how we use cookies and similar technologies on our website
            </p>
          </div>
          
          {/* Cookie Management */}
          <Card className="mb-8 border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle>
                <IconWithText 
                  icon={Settings} 
                  text="Manage Your Cookie Preferences"
                  iconClassName="h-5 w-5 text-blue-600"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                You can manage your cookie preferences at any time by clicking the button below.
              </p>
              <Button 
                onClick={() => {
                  console.log('Cookie preferences button clicked');
                  setShowPreferences(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Cookie Preferences
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <PolicySection title="What are Cookies?" icon={Cookie}>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you 
                visit a website. They are widely used to make websites work more efficiently and provide 
                information to website owners.
              </p>
              <p>
                We use cookies to enhance your browsing experience, analyze site traffic, and understand 
                where our visitors are coming from. We also use cookies to remember your preferences and 
                provide personalized content.
              </p>
            </PolicySection>

            <PolicySection title="Types of Cookies We Use">
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border-l-4 border-green-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    <IconWithText 
                      icon={Shield} 
                      text="Essential Cookies"
                      iconClassName="h-4 w-4 text-green-600"
                    />
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    These cookies are strictly necessary for the website to function properly. They enable 
                    core functionality such as security, network management, and accessibility.
                  </p>
                  <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
                    <strong>Examples:</strong> Session cookies, authentication tokens, cookie consent preferences
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    <IconWithText 
                      icon={BarChart3} 
                      text="Analytics Cookies"
                      iconClassName="h-4 w-4 text-blue-600"
                    />
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously. This data helps us improve our website.
                  </p>
                  <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
                    <strong>Examples:</strong> Google Analytics, page views, bounce rate, traffic sources
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border-l-4 border-orange-400 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    <IconWithText 
                      icon={Target} 
                      text="Marketing Cookies"
                      iconClassName="h-4 w-4 text-orange-600"
                    />
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    These cookies are used to deliver advertisements more relevant to you. They may be 
                    set by our advertising partners to build a profile of your interests.
                  </p>
                  <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
                    <strong>Examples:</strong> Facebook Pixel, Google Ads, remarketing pixels
                  </div>
                </div>
              </div>
            </PolicySection>

            <PolicySection title="Cookie Duration" icon={Clock}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Session Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Temporary cookies that are deleted when you close your browser.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Persistent Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Remain on your device for a set period or until you delete them.
                  </p>
                </div>
              </div>
              <p>
                Your cookie consent is valid for 365 days. After this period, we will ask for your 
                consent again to ensure your preferences are up to date.
              </p>
            </PolicySection>

            <PolicySection title="Your Cookie Rights">
              <p>
                Under PDPA and international data protection laws, you have the right to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Accept or decline non-essential cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Change your cookie preferences at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Delete cookies from your browser settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Opt out of targeted advertising</span>
                </li>
              </ul>
              <p className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                <strong>Note:</strong> Disabling certain cookies may affect website functionality 
                and your user experience.
              </p>
            </PolicySection>

            <PolicySection title="Questions About Cookies">
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, 
                please contact our Data Protection Officer through our official channels.
              </p>
            </PolicySection>
          </div>

          {/* Last Updated */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;
