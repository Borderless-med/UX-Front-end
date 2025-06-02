
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PriceComparison from '@/components/PriceComparison';
import ClinicsSection from '@/components/ClinicsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import QASection from '@/components/QASection';
import WaitlistSection from '@/components/WaitlistSection';

const Index = () => {
  return (
    <div className="min-h-screen font-inter bg-dark-bg text-white">
      <Navigation />
      <HeroSection />
      <PriceComparison />
      <ClinicsSection />
      <HowItWorksSection />
      <QASection />
      <WaitlistSection />
      
      {/* Footer */}
      <footer className="bg-dark-card text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-xl font-bold text-teal-accent">SG-JB Dental</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting you to quality, affordable dental care across borders
          </p>
          <div className="text-sm text-gray-500">
            © 2024 SG-JB Dental. Launching August 2025.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
