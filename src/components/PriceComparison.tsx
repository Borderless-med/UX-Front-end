
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const PriceComparison = () => {
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [priceRange, setPriceRange] = useState([100, 5000]);

  const treatments = [
    { 
      id: 'tooth-filling', 
      name: 'Tooth Filling', 
      sgPrice: '$300', 
      jbPrice: '$100', 
      savings: '$200',
      action: 'Book Consultation'
    },
    { 
      id: 'root-canal', 
      name: 'Root Canal', 
      sgPrice: '$1800', 
      jbPrice: '$600', 
      savings: '$1200',
      action: 'Book Consultation'
    },
    { 
      id: 'dental-crown', 
      name: 'Dental Crown', 
      sgPrice: '$1200', 
      jbPrice: '$400', 
      savings: '$800',
      action: 'Book Consultation'
    },
    { 
      id: 'dental-implant', 
      name: 'Dental Implant', 
      sgPrice: '$4000', 
      jbPrice: '$1500', 
      savings: '$2500',
      action: 'Book Consultation'
    },
    { 
      id: 'teeth-whitening', 
      name: 'Teeth Whitening', 
      sgPrice: '$400-800', 
      jbPrice: '$150-300', 
      savings: '$250',
      action: 'Book Consultation'
    },
    { 
      id: 'braces-metal', 
      name: 'Braces (Metal)', 
      sgPrice: '$4000-6000', 
      jbPrice: '$1500-2500', 
      savings: '$2500',
      action: 'Book Consultation'
    },
    { 
      id: 'wisdom-tooth', 
      name: 'Wisdom Tooth Removal', 
      sgPrice: '$800-1500', 
      jbPrice: '$250-500', 
      savings: '$550',
      action: 'Book Consultation'
    },
    { 
      id: 'gum-treatment', 
      name: 'Gum Treatment', 
      sgPrice: '$500-1200', 
      jbPrice: '$200-400', 
      savings: '$300',
      action: 'Book Consultation'
    },
  ];

  return (
    <section id="compare" className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Compare Dental Prices
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Comprehensive filtering system to find your perfect dental solution
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-dark-card border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Treatment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select onValueChange={setSelectedTreatment} value={selectedTreatment}>
                <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                  <SelectValue placeholder="All Treatments" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-gray-600">
                  <SelectItem value="all">All Treatments</SelectItem>
                  {treatments.map((treatment) => (
                    <SelectItem key={treatment.id} value={treatment.id} className="text-white">
                      {treatment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                  <SelectValue placeholder="$100 - $5000" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-gray-600">
                  <SelectItem value="100-500" className="text-white">$100 - $500</SelectItem>
                  <SelectItem value="500-1000" className="text-white">$500 - $1000</SelectItem>
                  <SelectItem value="1000-5000" className="text-white">$1000 - $5000</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                  <SelectValue placeholder="Any Distance" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-gray-600">
                  <SelectItem value="any" className="text-white">Any Distance</SelectItem>
                  <SelectItem value="near" className="text-white">Near Causeway</SelectItem>
                  <SelectItem value="city" className="text-white">JB City Center</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-dark-bg border-gray-600 text-white">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-gray-600">
                  <SelectItem value="any" className="text-white">Any Rating</SelectItem>
                  <SelectItem value="4plus" className="text-white">4+ Stars</SelectItem>
                  <SelectItem value="4.5plus" className="text-white">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Comparison Table */}
        <Card className="bg-dark-card border-gray-600">
          <CardHeader className="bg-teal-accent/20">
            <div className="grid grid-cols-5 gap-4 text-white font-semibold">
              <div>Treatment</div>
              <div>Singapore Price</div>
              <div>JB Partner Price</div>
              <div>Potential Savings</div>
              <div>Action</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {treatments.map((treatment, index) => (
              <div key={treatment.id} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-600 hover:bg-dark-bg/50 transition-colors">
                <div className="text-white font-medium">{treatment.name}</div>
                <div className="text-red-400 font-semibold">{treatment.sgPrice}</div>
                <div className="text-success-green font-semibold">{treatment.jbPrice}</div>
                <div className="text-teal-accent font-semibold">+{treatment.savings}</div>
                <div>
                  <Button 
                    size="sm" 
                    className="bg-gray-600 hover:bg-gray-500 text-white"
                    onClick={() => {
                      const element = document.getElementById('waitlist');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {treatment.action}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PriceComparison;
