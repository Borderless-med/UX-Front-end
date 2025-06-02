
import { useState } from 'react';
import { Search, Calculator, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const PriceComparison = () => {
  const [selectedTreatment, setSelectedTreatment] = useState('');

  const treatments = [
    { id: 'implants', name: 'Dental Implants', sgPrice: 'S$3,000 - S$6,000', jbPrice: 'RM2,500 - RM4,500', savings: '40-60%' },
    { id: 'root-canal', name: 'Root Canal Treatment', sgPrice: 'S$800 - S$1,500', jbPrice: 'RM400 - RM800', savings: '45-65%' },
    { id: 'crown', name: 'Dental Crown', sgPrice: 'S$1,200 - S$2,500', jbPrice: 'RM600 - RM1,200', savings: '50-70%' },
    { id: 'cleaning', name: 'Professional Cleaning', sgPrice: 'S$80 - S$150', jbPrice: 'RM60 - RM120', savings: '25-45%' },
    { id: 'filling', name: 'Tooth Filling', sgPrice: 'S$150 - S$400', jbPrice: 'RM80 - RM200', savings: '40-60%' },
    { id: 'extraction', name: 'Tooth Extraction', sgPrice: 'S$200 - S$500', jbPrice: 'RM100 - RM250', savings: '45-65%' }
  ];

  const selectedTreatmentData = treatments.find(t => t.id === selectedTreatment);

  return (
    <section id="compare" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compare Treatment Costs
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            See how much you can save on quality dental care by choosing treatments in Johor Bahru
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Treatment Selection */}
          <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Select Treatment</CardTitle>
                  <CardDescription>Choose a dental treatment to compare prices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedTreatment} value={selectedTreatment}>
                <SelectTrigger className="w-full text-lg p-6 border-2 bg-white">
                  <SelectValue placeholder="Choose a dental treatment..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {treatments.map((treatment) => (
                    <SelectItem key={treatment.id} value={treatment.id} className="text-lg p-3">
                      {treatment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Price Comparison Results */}
          {selectedTreatmentData && (
            <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in">
              {/* Singapore Prices */}
              <Card className="border-2 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-red-50 to-white">
                  <CardTitle className="text-xl text-red-700 flex items-center gap-2">
                    🇸🇬 Singapore
                  </CardTitle>
                  <CardDescription>Typical price range</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedTreatmentData.sgPrice}
                  </div>
                  <p className="text-neutral-gray">Average market rate</p>
                </CardContent>
              </Card>

              {/* Johor Bahru Prices */}
              <Card className="border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                  <CardTitle className="text-xl text-green-700 flex items-center gap-2">
                    🇲🇾 Johor Bahru
                  </CardTitle>
                  <CardDescription>Typical price range</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedTreatmentData.jbPrice}
                  </div>
                  <p className="text-neutral-gray">Quality verified clinics</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Savings Highlight */}
          {selectedTreatmentData && (
            <Card className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl animate-fade-in">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <TrendingDown className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Potential Savings</h3>
                      <p className="text-blue-100">On {selectedTreatmentData.name}</p>
                    </div>
                  </div>
                  <div className="text-5xl font-bold mb-4">{selectedTreatmentData.savings}</div>
                  <p className="text-xl text-blue-100 mb-6">
                    Save significantly while maintaining quality standards
                  </p>
                  <Button 
                    className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => {
                      const element = document.getElementById('waitlist');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Get Early Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coming Soon Notice */}
          {!selectedTreatment && (
            <Card className="border-2 border-yellow-200 bg-yellow-50 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Calculator className="h-8 w-8 text-yellow-600" />
                  <h3 className="text-xl font-semibold text-yellow-800">Interactive Price Calculator</h3>
                </div>
                <p className="text-yellow-700 mb-4">
                  Select a treatment above to see detailed price comparisons and potential savings
                </p>
                <p className="text-sm text-yellow-600">
                  Full clinic directory and booking system launching August 2025
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
