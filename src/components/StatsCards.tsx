
import { Card, CardContent } from '@/components/ui/card';

const StatsCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="bg-blue-light/20 border-blue-light">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-dark mb-2">Average Savings</h3>
          <p className="text-2xl font-bold text-success-green">65-75%</p>
          <p className="text-sm text-neutral-gray mt-2">Typical cost reduction when choosing JB clinics</p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-light/20 border-blue-light">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-dark mb-2">Directory Coverage</h3>
          <p className="text-2xl font-bold text-blue-primary">100+</p>
          <p className="text-sm text-neutral-gray mt-2">Clinic listings with comprehensive information</p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-light/20 border-blue-light">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-dark mb-2">Travel Time</h3>
          <p className="text-2xl font-bold text-blue-primary">45-90min</p>
          <p className="text-sm text-neutral-gray mt-2">From Singapore to partner clinics</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
