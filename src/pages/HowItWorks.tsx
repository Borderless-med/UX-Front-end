
import Navigation from '@/components/Navigation';
import HowItWorksSection from '@/components/HowItWorksSection';

const HowItWorks = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-text-dark">
      <Navigation />
      <div className="pt-16">
        <HowItWorksSection />
      </div>
    </div>
  );
};

export default HowItWorks;
