
import Navigation from '@/components/Navigation';
import QASection from '@/components/QASection';
import Footer from '@/components/Footer';

const QA = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <div className="pt-16">
        <QASection />
      </div>
      <Footer />
    </div>
  );
};

export default QA;
