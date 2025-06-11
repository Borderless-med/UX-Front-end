import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const PriceComparison = () => {
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const treatments = [
    { 
      id: 'tooth-filling', 
      name: 'Tooth Filling', 
      sgPrice: '$300', 
      jbPrice: '$100', 
      savings: '$200',
      action: 'Book Consultation',
      priceValue: 100
    },
    { 
      id: 'root-canal', 
      name: 'Root Canal', 
      sgPrice: '$1800', 
      jbPrice: '$600', 
      savings: '$1200',
      action: 'Book Consultation',
      priceValue: 600
    },
    { 
      id: 'dental-crown', 
      name: 'Dental Crown', 
      sgPrice: '$1200', 
      jbPrice: '$400', 
      savings: '$800',
      action: 'Book Consultation',
      priceValue: 400
    },
    { 
      id: 'dental-implant', 
      name: 'Dental Implant', 
      sgPrice: '$4000', 
      jbPrice: '$1500', 
      savings: '$2500',
      action: 'Book Consultation',
      priceValue: 1500
    },
    { 
      id: 'teeth-whitening', 
      name: 'Teeth Whitening', 
      sgPrice: '$400-800', 
      jbPrice: '$150-300', 
      savings: '$250',
      action: 'Book Consultation',
      priceValue: 225
    },
    { 
      id: 'braces-metal', 
      name: 'Braces (Metal)', 
      sgPrice: '$4000-6000', 
      jbPrice: '$1500-2500', 
      savings: '$2500',
      action: 'Book Consultation',
      priceValue: 2000
    },
    { 
      id: 'wisdom-tooth', 
      name: 'Wisdom Tooth Removal', 
      sgPrice: '$800-1500', 
      jbPrice: '$250-500', 
      savings: '$550',
      action: 'Book Consultation',
      priceValue: 375
    },
    { 
      id: 'gum-treatment', 
      name: 'Gum Treatment', 
      sgPrice: '$500-1200', 
      jbPrice: '$200-400', 
      savings: '$300',
      action: 'Book Consultation',
      priceValue: 300
    },
  ];

  // Filter treatments based on selected criteria
  const filteredTreatments = treatments.filter(treatment => {
    // Filter by treatment type
    if (selectedTreatment && selectedTreatment !== 'all' && treatment.id !== selectedTreatment) {
      return false;
    }

    // Filter by price range
    if (selectedPriceRange) {
      const priceValue = treatment.priceValue;
      switch (selectedPriceRange) {
        case '100-500':
          if (priceValue < 100 || priceValue > 500) return false;
          break;
        case '500-1000':
          if (priceValue < 500 || priceValue > 1000) return false;
          break;
        case '1000-5000':
          if (priceValue < 1000 || priceValue > 5000) return false;
          break;
      }
    }

    return true;
  });

  const handleResetFilters = () => {
    setSelectedTreatment('');
    setSelectedPriceRange('');
    setSelectedDistance('');
    setSelectedRating('');
  };

  return (
    <section id="compare" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            Compare Dental Prices
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Comprehensive filtering system to find your perfect dental solution
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-light-card border-blue-light">
          <CardHeader>
            <CardTitle className="text-blue-dark">Filter Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select onValueChange={setSelectedTreatment} value={selectedTreatment}>
                <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                  <SelectValue placeholder="All Treatments" />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-light z-50">
                  <SelectItem value="all" className="text-blue-dark">All Treatments</SelectItem>
                  {treatments.map((treatment) => (
                    <SelectItem key={treatment.id} value={treatment.id} className="text-blue-dark">
                      {treatment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select onValueChange={setSelectedPriceRange} value={selectedPriceRange}>
                <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                  <SelectValue placeholder="All Price Ranges" />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-light z-50">
                  <SelectItem value="100-500" className="text-blue-dark">$100 - $500</SelectItem>
                  <SelectItem value="500-1000" className="text-blue-dark">$500 - $1000</SelectItem>
                  <SelectItem value="1000-5000" className="text-blue-dark">$1000 - $5000</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setSelectedDistance} value={selectedDistance}>
                <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                  <SelectValue placeholder="Any Distance" />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-light z-50">
                  <SelectItem value="any" className="text-blue-dark">Any Distance</SelectItem>
                  <SelectItem value="near" className="text-blue-dark">Near Causeway</SelectItem>
                  <SelectItem value="city" className="text-blue-dark">JB City Center</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setSelectedRating} value={selectedRating}>
                <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-light z-50">
                  <SelectItem value="any" className="text-blue-dark">Any Rating</SelectItem>
                  <SelectItem value="4plus" className="text-blue-dark">4+ Stars</SelectItem>
                  <SelectItem value="4.5plus" className="text-blue-dark">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-neutral-gray">
                Showing {filteredTreatments.length} of {treatments.length} treatments
              </p>
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="border-blue-light text-blue-dark hover:bg-blue-light"
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Comparison Table */}
        <Card className="bg-light-card border-blue-light">
          <CardHeader className="bg-blue-light">
            <div className="grid grid-cols-5 gap-4 text-blue-dark font-semibold">
              <div>Treatment</div>
              <div>Singapore Price</div>
              <div>JB Partner Price</div>
              <div>Potential Savings</div>
              <div>Action</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTreatments.length === 0 ? (
              <div className="p-8 text-center text-neutral-gray">
                No treatments match your selected criteria. Try adjusting your filters.
              </div>
            ) : (
              filteredTreatments.map((treatment, index) => (
                <div key={treatment.id} className="grid grid-cols-5 gap-4 p-4 border-b border-blue-light hover:bg-blue-light/50 transition-colors">
                  <div className="text-blue-dark font-medium">{treatment.name}</div>
                  <div className="text-cta-red font-semibold">{treatment.sgPrice}</div>
                  <div className="text-success-green font-semibold">{treatment.jbPrice}</div>
                  <div className="text-blue-primary font-semibold">+{treatment.savings}</div>
                  <div>
                    <Button 
                      size="sm" 
                      className="bg-blue-secondary hover:bg-blue-primary text-white"
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
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PriceComparison;
