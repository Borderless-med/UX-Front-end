
import Navigation from '@/components/Navigation';
import PriceComparison from '@/components/PriceComparison';
import Footer from '@/components/Footer';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

const Compare = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
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
        <PriceComparison />
      </div>
      <Footer />
    </div>
  );
};

export default Compare;
