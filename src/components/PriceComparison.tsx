import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PriceComparison = () => {
  const procedures = [
    {
      procedure: 'Dental Cleaning',
      sgPrice: '80 - 120',
      jbPrice: '25 - 40',
      savings: '55 - 80',
      percentage: '60-70%'
    },
    {
      procedure: 'Tooth Filling',
      sgPrice: '150 - 300',
      jbPrice: '40 - 80',
      savings: '110 - 220',
      percentage: '70-75%'
    },
    {
      procedure: 'Root Canal',
      sgPrice: '800 - 1500',
      jbPrice: '200 - 400',
      savings: '600 - 1100',
      percentage: '70-75%'
    },
    {
      procedure: 'Dental Crown',
      sgPrice: '1200 - 2000',
      jbPrice: '300 - 600',
      savings: '900 - 1400',
      percentage: '70-75%'
    },
    {
      procedure: 'Teeth Whitening',
      sgPrice: '400 - 800',
      jbPrice: '100 - 200',
      savings: '300 - 600',
      percentage: '75%'
    },
    {
      procedure: 'Dental Implant',
      sgPrice: '3000 - 5000',
      jbPrice: '800 - 1500',
      savings: '2200 - 3500',
      percentage: '70-75%'
    },
    {
      procedure: 'Wisdom Tooth Extraction',
      sgPrice: '300 - 800',
      jbPrice: '80 - 200',
      savings: '220 - 600',
      percentage: '70-75%'
    },
    {
      procedure: 'Orthodontic Braces',
      sgPrice: '4000 - 8000',
      jbPrice: '1200 - 2500',
      savings: '2800 - 5500',
      percentage: '70%'
    },
    // New procedures from the uploaded image
    {
      procedure: 'Composite Veneers',
      sgPrice: '163 - 327',
      jbPrice: '75 - 135',
      savings: '88 - 192',
      percentage: '60-75%'
    },
    {
      procedure: 'Porcelain Veneers',
      sgPrice: '1,000 - 1,962',
      jbPrice: '450 - 515',
      savings: '550 - 1,447',
      percentage: '50-70%'
    },
    {
      procedure: 'Dental Bonding',
      sgPrice: '163 - 500',
      jbPrice: '28 - 150',
      savings: '135 - 350',
      percentage: '70-85%'
    },
    {
      procedure: 'Gingivectomy',
      sgPrice: '1,000+',
      jbPrice: '150',
      savings: '850+',
      percentage: '60-85%'
    },
    {
      procedure: 'Bone Grafting',
      sgPrice: '800 - 3,000',
      jbPrice: '150 - 900',
      savings: '650 - 2,100',
      percentage: '50-80%'
    },
    {
      procedure: 'Sinus Lift',
      sgPrice: '800 - 2,000',
      jbPrice: '600 - 900',
      savings: '200 - 1,100',
      percentage: '60-75%'
    },
    {
      procedure: 'TMJ Treatment',
      sgPrice: '100 - 250+',
      jbPrice: '25+',
      savings: '75 - 225+',
      percentage: '75-90%'
    },
    {
      procedure: 'Sleep Apnea Appliance',
      sgPrice: '1,000 - 3,000',
      jbPrice: '150 - 900',
      savings: '850 - 2,100',
      percentage: '50-85%'
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8">
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
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-light/30 hover:bg-blue-light/30">
                  <TableHead className="font-semibold text-blue-dark">Procedure</TableHead>
                  <TableHead className="font-semibold text-blue-dark">SG Private Range (S$)</TableHead>
                  <TableHead className="font-semibold text-blue-dark">JB Range (S$)</TableHead>
                  <TableHead className="font-semibold text-blue-dark">Dollar Savings (S$)</TableHead>
                  <TableHead className="font-semibold text-blue-dark">% Savings (approx.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedures.map((item, index) => (
                  <TableRow key={index} className="hover:bg-blue-light/20 transition-colors">
                    <TableCell className="font-medium text-blue-dark py-4">{item.procedure}</TableCell>
                    <TableCell className="text-neutral-gray py-4">{item.sgPrice}</TableCell>
                    <TableCell className="text-success-green font-medium py-4">{item.jbPrice}</TableCell>
                    <TableCell className="text-success-green font-medium py-4">{item.savings}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className="bg-success-green/20 text-success-green font-semibold">
                        {item.percentage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="bg-blue-light/20 border-blue-light">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-dark mb-2">Average Savings</h3>
              <p className="text-2xl font-bold text-success-green">65-75%</p>
              <p className="text-sm text-neutral-gray mt-2">Typical cost reduction when choosing JB clinics</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-light/20 border-blue-light">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-dark mb-2">Quality Assurance</h3>
              <p className="text-2xl font-bold text-blue-primary">100%</p>
              <p className="text-sm text-neutral-gray mt-2">Verified clinics with international standards</p>
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

        <div className="mt-8 bg-teal-accent/10 border border-teal-accent/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-dark mb-3">Important Notes</h3>
          <ul className="text-sm text-neutral-gray space-y-1">
            <li>• Prices are estimates and may vary based on clinic, complexity, and individual cases</li>
            <li>• Singapore prices reflect private clinic rates; public healthcare options may be different</li>
            <li>• All partner clinics in JB are verified for quality and safety standards</li>
            <li>• Travel costs and time should be factored into overall treatment planning</li>
            <li>• Consultation fees and follow-up visits may apply separately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
