import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Sparkles, CheckCircle, Shield } from 'lucide-react';
import PDPARegistrationForm from '@/components/auth/PDPARegistrationForm';
import Footer from '@/components/Footer';

const WinToothbrush = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

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

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Announcement Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-6 py-3 rounded-full">
              <Gift className="h-5 w-5 text-amber-600" />
              <span className="text-amber-900 font-bold text-sm uppercase tracking-wide">
                Launch Giveaway • Free Entry
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-6">
            Sign Up & Win an
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              AI Toothbrush!
            </span>
          </h1>

          <p className="text-center text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join OraChope.org and get a chance to win a premium <strong>Xiaomi Mijia Sonic Electric Toothbrush</strong>. 
            Simply create your free account below to enter.
          </p>

          {/* Product Showcase */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Product Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 shadow-xl">
                <img
                  src="https://gadgetbreeze.com.bd/wp-content/uploads/2022/11/Xiaomi-Mijia-Sonic-Electric-Toothbrush-T100-2-700x700.png"
                  alt="Xiaomi Mijia Sonic Electric Toothbrush"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23e0f2fe"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%230891b2"%3EXiaomi Toothbrush%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12">
                <span className="font-bold text-lg">FREE!</span>
              </div>
            </div>

            {/* Product Benefits */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What You Could Win
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Smart Sonic Technology</h3>
                    <p className="text-gray-600">31,000 vibrations per minute for superior cleaning</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Long Battery Life</h3>
                    <p className="text-gray-600">Up to 25 days on a single charge</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Gentle & Effective</h3>
                    <p className="text-gray-600">IPX7 waterproof with 2-minute smart timer</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Worth SGD $45</h3>
                    <p className="text-gray-600">Premium dental care technology from Xiaomi</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">100% Free • No Purchase Required</p>
                    <p className="text-xs text-green-700">Winner will be contacted directly via email</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enter to Win Now
            </h2>
            <p className="text-gray-600">
              Create your free OraChope account to enter the giveaway. You'll also get access to:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                ✓ Verified Dental Clinics
              </span>
              <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                ✓ Price Comparisons
              </span>
              <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                ✓ AI Chat Assistant
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
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By entering, you agree to our <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
            <p className="mt-2">Winner will be randomly selected and notified within 7 days of campaign end.</p>
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
