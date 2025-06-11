
import Navigation from '@/components/Navigation';
import QASection from '@/components/QASection';

const QA = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <div className="pt-16">
        <QASection />
      </div>
    </div>
  );
};

export default QA;
