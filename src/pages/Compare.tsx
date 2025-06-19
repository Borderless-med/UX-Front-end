
import Navigation from '@/components/Navigation';
import PriceComparison from '@/components/PriceComparison';
import Footer from '@/components/Footer';

const Compare = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-blue-dark">
      <Navigation />
      <div className="pt-16">
        <PriceComparison />
      </div>
      <Footer />
    </div>
  );
};

export default Compare;
