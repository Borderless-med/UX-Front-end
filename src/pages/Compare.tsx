
import Navigation from '@/components/Navigation';
import PriceComparison from '@/components/PriceComparison';

const Compare = () => {
  return (
    <div className="min-h-screen font-inter bg-white text-text-dark">
      <Navigation />
      <div className="pt-16">
        <PriceComparison />
      </div>
    </div>
  );
};

export default Compare;
