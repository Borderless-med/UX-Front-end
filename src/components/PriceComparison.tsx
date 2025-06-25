
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PriceComparisonTable from './PriceComparisonTable';
import StatsCards from './StatsCards';
import MedicalDisclaimer from './MedicalDisclaimer';
import { proceduresData } from '@/data/proceduresData';

const PriceComparison = () => {
  return (
    <div className="min-h-screen bg-white py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-dark mb-4">
            Dental Price Comparison
          </h1>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Compare dental treatment costs between Singapore and Johor Bahru. 
            All prices are in Singapore Dollars (S$).
          </p>
        </div>

        <Card className="shadow-lg border border-blue-light">
          <CardHeader className="bg-blue-primary/10 border-b border-blue-light">
            <CardTitle className="text-2xl text-blue-dark">Treatment Price Comparison</CardTitle>
            <CardDescription className="text-neutral-gray">
              Savings when choosing Malaysian dental clinics over Singapore alternatives
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <PriceComparisonTable procedures={proceduresData} />
          </CardContent>
        </Card>

        <div className="mt-8">
          <StatsCards />
        </div>

        <div className="mt-8">
          <MedicalDisclaimer variant="important-disclaimer" />
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
