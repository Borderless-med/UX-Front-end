
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import WaitlistSection from '@/components/WaitlistSection';
import Footer from '@/components/Footer';
import FloatingClinicTab from '@/components/FloatingClinicTab';

const Index = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-gray-900">
      <Navigation />
      <HeroSection />
      <WaitlistSection />
      <Footer />
      <FloatingClinicTab />
    </div>
  );
};

export default Index;
