import React from 'react';
import Navigation from '@/components/Navigation';
import AppointmentBookingForm from '@/components/AppointmentBookingForm';
import Footer from '@/components/Footer';
import FloatingClinicTab from '@/components/FloatingClinicTab';
import PricingBookingDisclaimer from '@/components/PricingBookingDisclaimer';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

const BookNow = () => {
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
      
      {/* Add Pricing & Booking Disclaimer */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PricingBookingDisclaimer />
        </div>
      </section>
      
      <AppointmentBookingForm />
      <Footer />
      <FloatingClinicTab />
    </div>
  );
};

export default BookNow;