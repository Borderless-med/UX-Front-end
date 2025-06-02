
import { Building2, Shield, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ClinicsSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Verified Quality',
      description: 'All clinics undergo rigorous verification for safety and quality standards'
    },
    {
      icon: Star,
      title: 'Patient Reviews',
      description: 'Real patient experiences and ratings to help you make informed decisions'
    },
    {
      icon: Clock,
      title: 'Easy Booking',
      description: 'Seamless appointment scheduling that works with your travel plans'
    }
  ];

  return (
    <section id="clinics" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 text-sm font-medium bg-yellow-100 text-yellow-800 border-yellow-200">
            Coming Soon
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Verified Clinic Network
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            We're carefully selecting and verifying the best dental clinics in Johor Bahru 
            to ensure you receive quality care at affordable prices.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg border-0 hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader>
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Indicator */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Building2 className="h-10 w-10" />
                <div>
                  <h3 className="text-2xl font-bold mb-1">Network Development</h3>
                  <p className="text-blue-100">Building partnerships with quality providers</p>
                </div>
              </div>
              
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Clinic Verification Progress</span>
                  <span>23/50 Clinics</span>
                </div>
                <div className="w-full bg-blue-700 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full" style={{ width: '46%' }}></div>
                </div>
              </div>

              <p className="text-lg text-blue-100 mb-4">
                Join our waitlist to be notified when we launch with verified clinic partners
              </p>
              
              <div className="text-sm text-blue-200">
                Expected launch: August 2025
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ClinicsSection;
