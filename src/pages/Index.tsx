
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PriceComparison from '@/components/PriceComparison';
import ClinicsSection from '@/components/ClinicsSection';
import WaitlistSection from '@/components/WaitlistSection';

const Index = () => {
  return (
    <div className="min-h-screen font-inter bg-white">
      <Navigation />
      <HeroSection />
      <PriceComparison />
      <ClinicsSection />
      <WaitlistSection />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <span className="text-xl font-bold">SG-JB Dental</span>
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
