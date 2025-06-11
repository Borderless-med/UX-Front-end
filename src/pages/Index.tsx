
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import WaitlistSection from '@/components/WaitlistSection';

const Index = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <HeroSection />
      <HowItWorksSection />
      <WaitlistSection />
      
      {/* Footer */}
      <footer className="bg-blue-light text-blue-dark py-8 px-4 sm:px-6 lg:px-8 border-t border-blue-light">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-xl font-bold text-blue-primary">SG-JB Dental</span>
          </div>
          <p className="text-neutral-gray mb-4">
            Connecting you to quality, affordable dental care across borders
          </p>
          <div className="text-sm text-neutral-gray">
            © 2024 SG-JB Dental. Launching August 2025.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
