
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import WaitlistSection from '@/components/WaitlistSection';
import Footer from '@/components/Footer';
import FloatingClinicTab from '@/components/FloatingClinicTab';
import PricingBookingDisclaimer from '@/components/PricingBookingDisclaimer';

const Index = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-gray-900">
      <Navigation />
      <HeroSection />
      
      {/* Add Pricing & Booking Disclaimer */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <PricingBookingDisclaimer />
      </section>
      
      <WaitlistSection />
      <Footer />
      <FloatingClinicTab />
    </div>
  );
};

export default Index;
