
import Navigation from '@/components/Navigation';
import HowItWorksSection from '@/components/HowItWorksSection';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <HowItWorksSection />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
