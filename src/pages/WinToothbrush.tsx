import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Sparkles, CheckCircle, Shield } from 'lucide-react';
import PDPARegistrationForm from '@/components/auth/PDPARegistrationForm';
import Footer from '@/components/Footer';

const WinToothbrush = () => {
  const navigate = useNavigate();

  const handleRegistrationSuccess = () => {
    // Redirect to homepage after successful registration
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    // For giveaway page, we don't show login - just redirect to homepage
    navigate('/');
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
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Announcement Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-6 py-3 rounded-full">
              <Gift className="h-5 w-5 text-amber-600" />
              <span className="text-amber-900 font-bold text-sm uppercase tracking-wide">
                Launch Giveaway • Free Entry
              </span>
            </div>
          </div>

          {/* Two Column Layout: Giveaway Left, Form Right */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            
            {/* LEFT COLUMN: Giveaway Details (40%) */}
            <div className="lg:col-span-2">
              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Sign Up & Win an
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AI Toothbrush!
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                Join OraChope.org and get a chance to win a premium <strong>Xiaomi Mijia Sonic Electric Toothbrush</strong>.
              </p>

              {/* Product Image */}
              <div className="relative mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 shadow-lg">
                  {/* Inline SVG toothbrush illustration */}
                  <svg viewBox="0 0 200 400" className="w-full h-auto max-h-80 mx-auto" xmlns="http://www.w3.org/2000/svg">
                    {/* Toothbrush body */}
                    <rect x="75" y="50" width="50" height="250" rx="25" fill="#ffffff" stroke="#0891b2" strokeWidth="2"/>
                    {/* Power button */}
                    <circle cx="100" cy="150" r="8" fill="#0891b2"/>
                    {/* Neck */}
                    <rect x="85" y="10" width="30" height="50" rx="15" fill="#e0f2fe" stroke="#0891b2" strokeWidth="2"/>
                    {/* Brush head */}
                    <ellipse cx="100" cy="10" rx="20" ry="15" fill="#ffffff" stroke="#0891b2" strokeWidth="2"/>
                    {/* Bristles */}
                    <line x1="85" y1="5" x2="85" y2="15" stroke="#06b6d4" strokeWidth="1.5"/>
                    <line x1="92" y1="3" x2="92" y2="17" stroke="#06b6d4" strokeWidth="1.5"/>
                    <line x1="100" y1="2" x2="100" y2="18" stroke="#06b6d4" strokeWidth="1.5"/>
                    <line x1="108" y1="3" x2="108" y2="17" stroke="#06b6d4" strokeWidth="1.5"/>
                    <line x1="115" y1="5" x2="115" y2="15" stroke="#06b6d4" strokeWidth="1.5"/>
                    {/* Brand text */}
                    <text x="100" y="200" textAnchor="middle" fill="#0891b2" fontSize="12" fontWeight="bold">Xiaomi</text>
                    <text x="100" y="215" textAnchor="middle" fill="#0891b2" fontSize="10">Mijia</text>
                  </svg>
                </div>
                {/* Floating Badge */}
                <div className="absolute -top-3 -right-3 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12">
                  <span className="font-bold text-sm">FREE!</span>
                </div>
              </div>

              {/* Product Benefits - Compact */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700"><strong>Smart Sonic Technology</strong> - 31,000 vibrations/min</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700"><strong>Long Battery Life</strong> - Up to 25 days</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700"><strong>IPX7 Waterproof</strong> - 2-minute smart timer</p>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-900">100% Free • No Purchase Required</p>
                    <p className="text-xs text-green-700">Winner contacted via email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Registration Form (60%) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6 md:p-8 sticky top-4">
                {/* Form Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Enter to Win Now
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Create your free account to enter the giveaway
                  </p>
                  {/* Benefit Badges */}
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      ✓ Verified Clinics
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      ✓ Price Comparisons
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      ✓ AI Assistant
                    </span>
                  </div>
                </div>

                {/* Form Component */}
                <PDPARegistrationForm
                  onSuccess={handleRegistrationSuccess}
                  onSwitchToLogin={handleSwitchToLogin}
                  submitButtonText="Enter to Win"
                  registrationSource="Giveaway registration"
                  hideLoginLink={true}
                />

                {/* Additional Info */}
                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>By entering, you agree to our <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
                  <p className="mt-1">Winner will be randomly selected and notified within 7 days.</p>
                </div>
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
