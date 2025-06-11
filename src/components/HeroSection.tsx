import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Users, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToCompare = () => {
    navigate('/compare');
  };

  return (
    <section id="home" className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <div className="text-center animate-fade-in mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            World-Class Dental Care<br />
            <span className="text-blue-600">Just Across the Causeway</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
            Save 50-70% Without Compromising Quality
          </p>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of smart Singapore patients who've discovered quality, affordable dental care in Johor Bahru
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={scrollToWaitlist}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Your Free Consultation
            </Button>
            <Button 
              onClick={goToCompare}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Calculate Your Savings
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <Card className="p-6 text-center bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">MDC Verified</div>
            <div className="text-sm text-gray-600">Malaysian Dental Council Registered Clinics</div>
          </Card>
          
          <Card className="p-6 text-center bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">5,000+</div>
            <div className="text-sm text-gray-600">Singapore Patients Treated Successfully</div>
          </Card>
          
          <Card className="p-6 text-center bg-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
            <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">30 Minutes</div>
            <div className="text-sm text-gray-600">From Singapore CBD to Quality Care</div>
          </Card>
          
          <Card className="p-6 text-center bg-orange-50 border-orange-200 hover:shadow-lg transition-shadow">
            <DollarSign className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">50-70%</div>
            <div className="text-sm text-gray-600">Average Savings vs Singapore Prices</div>
          </Card>
        </div>

        {/* Social Proof Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Thousands of Singapore Patients Choose JB Dental Care
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">LW</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Linda Wong</div>
                  <div className="text-sm text-gray-600">Singapore Resident</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Saved $3,200 on my dental implants compared to Singapore prices. The quality was exceptional, and the clinic was just 25 minutes from Woodlands checkpoint."
              </p>
            </Card>
            
            <Card className="p-6 bg-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">MT</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Marcus Tan</div>
                  <div className="text-sm text-gray-600">Singapore Resident</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The dentist was UK-trained with 15 years experience. Got my root canal done for RM800 instead of $1,500 in Singapore. No compromise on quality!"
              </p>
            </Card>
            
            <Card className="p-6 bg-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">SL</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Lim</div>
                  <div className="text-sm text-gray-600">Singapore Resident</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Family of 4 got complete dental checkups and cleanings for what I'd pay for just one person in Singapore. Professional service, modern equipment."
              </p>
            </Card>
          </div>
        </div>

        {/* Price Comparison Preview */}
        <div className="bg-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Transparent Pricing - Know Exactly What You'll Pay
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Teeth Whitening</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Singapore:</span>
                  <span className="text-red-600 line-through font-semibold">$900+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">JB Clinic:</span>
                  <span className="text-green-600 font-bold">RM1,300 (~$390)</span>
                </div>
                <div className="border-t pt-2">
                  <div className="text-center text-green-600 font-bold">Save 57%</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Root Canal</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Singapore:</span>
                  <span className="text-red-600 line-through font-semibold">$1,500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">JB Clinic:</span>
                  <span className="text-green-600 font-bold">RM800 (~$240)</span>
                </div>
                <div className="border-t pt-2">
                  <div className="text-center text-green-600 font-bold">Save 68%</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-white border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dental Implant</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Singapore:</span>
                  <span className="text-red-600 line-through font-semibold">$4,500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">JB Clinic:</span>
                  <span className="text-green-600 font-bold">RM4,200 (~$1,260)</span>
                </div>
                <div className="border-t pt-2">
                  <div className="text-center text-green-600 font-bold">Save 72%</div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">*Prices include consultation, treatment, and follow-up care. No hidden costs.</p>
            <Button 
              onClick={goToCompare}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              View Complete Pricing Guide
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
