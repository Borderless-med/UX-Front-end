

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, X, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    const bannerDismissed = sessionStorage.getItem('clinic-banner-dismissed');
    
    if (roleParam === 'clinic' && !bannerDismissed) {
      setShowBanner(true);
    }
  }, [searchParams]);

  const dismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('clinic-banner-dismissed', 'true');
  };

  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToCompare = () => {
    navigate('/compare');
  };

  return (
    <>
      {/* Clinic Banner */}
      {showBanner && (
        <div className="bg-black/60 text-white py-3 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium">
              Dentist? Join our network of 101 verified clinics
            </span>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white font-medium px-4 py-2 text-sm rounded-lg"
              >
                Become a Partner
              </Button>
              <button
                onClick={dismissBanner}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Dismiss banner"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Hero Section */}
      <section id="home" className="pt-6 pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Header - Main Focus */}
          <div className="text-center animate-fade-in mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-none">
              World-Class Dental Care.<br />
              Smart Savings & <span className="text-blue-600">AI Concierge</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
              Save 50-70% with intelligent guidance every step of the way
            </p>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Experience premium dental care with AI-powered recommendations, transparent pricing, and seamless booking across Singapore & Malaysia
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={scrollToBooking}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Book Now
              </Button>
              <Button 
                onClick={goToCompare}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Calculate Your Savings
              </Button>
            </div>
          </div>

          {/* Two Key Trust Signals */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-12 max-w-4xl mx-auto">
            <Card className="p-8 text-center bg-green-50 border-green-200 hover:shadow-lg transition-shadow flex-1">
              <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">50,000+</div>
              <div className="text-gray-600">Singaporeans Seek JB Dental Care Annually</div>
            </Card>
            
            <Card className="p-8 text-center bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow flex-1">
              <Star className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600">JB Clinics Rated by 500+ Singapore Patient Reviews</div>
            </Card>
          </div>

          {/* Revolutionary AI Features Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Revolutionary AI Features Now Live
              </h2>
              <p className="text-lg text-gray-600">
                Experience intelligent dental care assistance with our AI concierge
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 bg-white/70 rounded-lg p-6 border border-blue-100">
                <div className="text-2xl mb-3">🤖</div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 AI Dental Assistant</h3>
                <p className="text-gray-600">Instant booking, recommendations, and answers</p>
              </div>
              
              <div className="flex-1 bg-white/70 rounded-lg p-6 border border-blue-100">
                <div className="text-2xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics Dashboard</h3>
                <p className="text-gray-600">Real-time insights for clinic partners</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={scrollToBooking}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Book Now
              </Button>
            </div>
          </div>

          {/* Simple Testimonial */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-xl text-gray-700 italic mb-4">
                "Saved $3,200 on my dental implants compared to Singapore prices. The quality was exceptional, and the clinic was just 25 minutes from Woodlands checkpoint."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">LW</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Linda Wong</div>
                  <div className="text-sm text-gray-600">Singapore Resident</div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Pricing Teaser */}
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transparent Pricing - No Hidden Costs
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              See exactly how much you can save on every dental treatment
            </p>
            <Button 
              onClick={goToCompare}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg"
            >
              View Complete Pricing Guide
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;

