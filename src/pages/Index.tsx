import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AppointmentBookingForm from '@/components/AppointmentBookingForm';
import Footer from '@/components/Footer';
import FloatingClinicTab from '@/components/FloatingClinicTab';
import PricingBookingDisclaimer from '@/components/PricingBookingDisclaimer';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import ChatWidget from '@/components/ChatWidget';
import TestLogin from '@/components/auth/TestLogin';

const Index = () => {

  return (
    <div className="min-h-screen font-inter bg-white text-gray-900">
      <Navigation />
      {/* Important Disclaimer - Properly positioned at top */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <MedicalDisclaimer variant="banner" fullWidth={true} />
          </div>
        </div>
      </div>
      <HeroSection />

      {/* TEST: Render LoginForm and TestLogin directly for debugging */}
      <div className="max-w-md mx-auto my-8">
        <LoginForm
          onSuccess={() => alert('Login success!')}
          onSwitchToRegister={() => alert('Switch to register!')}
        />
        <TestLogin />
      </div>

      {/* Add Pricing & Booking Disclaimer */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PricingBookingDisclaimer />
        </div>
      </section>
      <Footer />
      <FloatingClinicTab />
      <ChatWidget />
    </div>
  );
};

export default Index;