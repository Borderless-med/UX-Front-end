import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, CheckCircle, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Footer from '@/components/Footer';
import SocialLoginButtons from '@/components/giveaway/SocialLoginButtons';
import PDPAConsentCheckbox from '@/components/giveaway/PDPAConsentCheckbox';
import WhatsAppCaptureForm from '@/components/giveaway/WhatsAppCaptureForm';
import GiveawayThankYou from '@/components/giveaway/GiveawayThankYou';

type GiveawayStep = 'signup' | 'whatsapp' | 'thankyou';

const WinToothbrush = () => {
  const [currentStep, setCurrentStep] = useState<GiveawayStep>('signup');
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Email signup form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkExistingUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || null);
        setUserName(user.user_metadata?.full_name || null);
        
        // Check if they already have WhatsApp number
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('whatsapp_number')
          .eq('id', user.id)
          .single();
        
        if (profile?.whatsapp_number) {
          // Already completed - show thank you
          setCurrentStep('thankyou');
        } else {
          // Need to capture WhatsApp
          setCurrentStep('whatsapp');
        }
      }
    };
    
    checkExistingUser();
  }, []);

  // Handle email signup (passwordless)
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pdpaConsent) {
      setError('Please agree to the PDPA terms to continue');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Generate secure random password (shadow account)
      const randomPassword = crypto.randomUUID() + Math.random().toString(36).slice(2);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: randomPassword,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/win`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        setUserId(data.user.id);
        setUserEmail(data.user.email || null);
        setUserName(fullName.trim());
        setCurrentStep('whatsapp');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img
              src="/orachope.png"
              alt="OraChope.org"
              className="h-12 md:h-16 object-contain"
              onError={(e) => { 
                (e.currentTarget as HTMLImageElement).src = '/orachope-logo.svg'; 
              }}
            />
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Limited Offer
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section - Side by Side Layout */}
      <section className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Announcement Badge */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-4 py-2 rounded-full">
              <Gift className="h-4 w-4 text-amber-600" />
              <span className="text-amber-900 font-bold text-xs uppercase tracking-wide">
                Launch Giveaway • Free Entry
              </span>
            </div>
          </div>
              </span>
            </div>
          </div>

          {/* Two Column Layout: Giveaway Left, Form Right */}
          <div className="grid lg:grid-cols-5 gap-6 items-stretch">
            
            {/* LEFT COLUMN: Giveaway Details (40%) */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Main Heading */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Sign Up & Win an
                <span className="block mt-1 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AI Toothbrush!
                </span>
              </h1>

              <p className="text-base text-gray-600 mb-4">
                Join OraChope.org and win a <strong>Xiaomi Mijia Sonic Electric Toothbrush</strong>.
              </p>

              {/* Product Image */}
              <div className="relative mb-4 flex-grow flex items-center">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 shadow-lg w-full">
                  <img
                    src="/xiaomi-toothbrush.jpg"
                    alt="Xiaomi Mijia Sonic Electric Toothbrush"
                    className="w-full h-auto object-contain rounded-lg max-h-64"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23e0f2fe"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%230891b2"%3EXiaomi Mijia Toothbrush%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg transform rotate-12">
                  <span className="font-bold text-xs">FREE!</span>
                </div>
              </div>

              {/* Product Benefits - Compact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-gray-700"><strong>Smart Sonic</strong> - 31,000 vibrations/min</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-gray-700"><strong>25-day Battery</strong> - Long-lasting charge</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-gray-700"><strong>IPX7 Waterproof</strong> - Smart timer</p>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-auto">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-900">100% Free • No Purchase Required</p>
                    <p className="text-xs text-green-700">Winner contacted via email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Dynamic Content Based on Step (60%) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-4 md:p-6">
                
                {/* STEP 1: SIGNUP FORM */}
                {currentStep === 'signup' && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        Enter to Win Now
                      </h2>
                      <p className="text-gray-600 text-xs mb-3">
                        Quick signup - takes less than 30 seconds
                      </p>
                    </div>

                    {/* PDPA Consent */}
                    <PDPAConsentCheckbox
                      checked={pdpaConsent}
                      onCheckedChange={setPdpaConsent}
                      disabled={isLoading}
                    />

                    {/* Social Login Buttons */}
                    <SocialLoginButtons
                      onError={setError}
                      disabled={!pdpaConsent || isLoading}
                    />

                    {/* Divider */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">Or enter manually</span>
                      </div>
                    </div>

                    {/* Manual Email Signup Form */}
                    <form onSubmit={handleEmailSignup} className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                          <Input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your name"
                            disabled={!pdpaConsent || isLoading}
                            autoComplete="off"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-xs">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            disabled={!pdpaConsent || isLoading}
                            autoComplete="off"
                            className="h-10"
                          />
                        </div>
                      </div>

                      {error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        disabled={!pdpaConsent || isLoading || !fullName || !email}
                        className="w-full bg-blue-primary hover:bg-blue-dark h-11 text-base font-semibold"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          'Enter to Win'
                        )}
                      </Button>
                    </form>

                    <p className="text-[10px] text-center text-gray-500 mt-4">
                      By signing up, you agree to our{' '}
                      <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms</a>
                      {' '}and{' '}
                      <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                )}

                {/* STEP 2: WHATSAPP CAPTURE */}
                {currentStep === 'whatsapp' && userId && (
                  <WhatsAppCaptureForm
                    userId={userId}
                    userEmail={userEmail || undefined}
                    onSuccess={() => setCurrentStep('thankyou')}
                  />
                )}

                {/* STEP 3: THANK YOU */}
                {currentStep === 'thankyou' && (
                  <GiveawayThankYou userName={userName || undefined} />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why OraChope Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Join OraChope.org?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Clinics</h3>
              <p className="text-gray-600">Access 200+ verified dental clinics in Singapore and JB</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Money</h3>
              <p className="text-gray-600">Compare prices and find the best deals for your treatment</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600">Get instant answers to your dental questions 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WinToothbrush;
