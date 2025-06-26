
import Navigation from '@/components/Navigation';
import ClinicsSection from '@/components/ClinicsSection';
import Footer from '@/components/Footer';
import DataMigrationButton from '@/components/admin/DataMigrationButton';

const Clinics = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <div className="pt-16">
        <ClinicsSection />
      </div>
      <Footer />
      <DataMigrationButton />
    </div>
  );
};

export default Clinics;
