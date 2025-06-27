
import Navigation from '@/components/Navigation';
import HowItWorksSection from '@/components/HowItWorksSection';
import Footer from '@/components/Footer';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import PricingBookingDisclaimer from '@/components/PricingBookingDisclaimer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-gray-900">
      <Navigation />
      
      {/* Important Disclaimer - Properly positioned at top */}
      <div className="pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <MedicalDisclaimer variant="banner" fullWidth={true} />
          </div>
        </div>
      </div>
      
      {/* Reduced spacer for visual separation */}
      <div className="py-4"></div>
      
      <div className="pt-6">
        <HowItWorksSection />
      </div>

      {/* Pricing & Booking Disclaimer */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PricingBookingDisclaimer />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
