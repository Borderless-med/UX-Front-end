
import Navigation from '@/components/Navigation';
import ClinicsSection from '@/components/ClinicsSection';
import Footer from '@/components/Footer';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

const Clinics = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      
      {/* Important Disclaimer - Properly positioned at top */}
      <div className="pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <MedicalDisclaimer variant="banner" fullWidth={true} />
          </div>
        </div>
      </div>
      
      {/* Empty spacer for visual separation */}
      <div className="py-20"></div>
      
      <div className="pt-16">
        <ClinicsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Clinics;
