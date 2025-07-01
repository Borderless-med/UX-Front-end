
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PriceComparisonTable from './PriceComparisonTable';
import StatsCards from './StatsCards';
import PricingBookingDisclaimer from './PricingBookingDisclaimer';
import { proceduresData } from '@/data/proceduresData';

const PriceComparison = () => {
  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-dark mb-4">
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

        {/* Enhanced Experience Coming Soon Callout */}
        <div className="mt-8 mb-8">
          <div className="bg-blue-light border border-blue-primary/20 rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-dark mb-4">
                Enhanced Experience Coming Soon
              </h3>
              <p className="text-lg text-neutral-gray mb-6 max-w-3xl mx-auto">
                Our AI assistant will help you find the perfect clinic match and answer all your questions instantly - no more waiting for business hours
              </p>
              <Button 
                size="sm"
                onClick={() => window.location.href = '/#waitlist'}
                className="bg-blue-primary hover:bg-blue-accent text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Get Early Access
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <StatsCards />
        </div>

        <div className="mt-8">
          <PricingBookingDisclaimer />
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
