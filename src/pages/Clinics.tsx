
import Navigation from '@/components/Navigation';
import ClinicsSection from '@/components/ClinicsSection';

const Clinics = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <div className="pt-16">
        <ClinicsSection />
      </div>
    </div>
  );
};

export default Clinics;
