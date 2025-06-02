
import { Building2, Shield, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ClinicsSection = () => {
  const clinics = [
    {
      name: 'JB Dental Excellence',
      status: 'Verification Complete',
      statusColor: 'bg-success-green',
      rating: 4.8,
      reviews: 156,
      specialties: ['Implants', 'Orthodontics']
    },
    {
      name: 'Mahkota Medical Centre',
      status: 'Final Review',
      statusColor: 'bg-yellow-500',
      rating: 4.7,
      reviews: 203,
      specialties: ['General', 'Surgery']
    },
    {
      name: 'Smile Specialist Clinic',
      status: 'Documents Pending',
      statusColor: 'bg-gray-500',
      rating: 4.6,
      reviews: 89,
      specialties: ['Cosmetic', 'Whitening']
    },
    {
      name: 'Advanced Dental Care',
      status: 'Verification Complete',
      statusColor: 'bg-success-green',
      rating: 4.9,
      reviews: 234,
      specialties: ['Endodontics', 'Periodontics']
    },
    {
      name: 'Premier Oral Health',
      status: 'Final Review',
      statusColor: 'bg-yellow-500',
      rating: 4.5,
      reviews: 167,
      specialties: ['General', 'Pediatric']
    }
  ];

  return (
    <section id="clinics" className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Clinics
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Meet Our First Partners in August 2025
          </p>
        </div>

        {/* Verification Progress */}
        <Card className="mb-12 bg-dark-bg border-gray-600">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Verification Progress</h3>
            <div className="flex justify-center items-center mb-6">
              <span className="text-4xl font-bold text-success-green">23</span>
              <span className="text-2xl text-gray-400 mx-2">/</span>
              <span className="text-2xl text-gray-400">100</span>
              <span className="text-lg text-gray-300 ml-4">Clinics Verified</span>
            </div>
            <div className="max-w-md mx-auto mb-6">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-success-green h-3 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner Clinic Preview */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Partner Clinic Preview</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.slice(0, 5).map((clinic, index) => (
              <Card key={index} className="bg-dark-bg border-gray-600 hover:border-teal-accent transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-white text-lg">{clinic.name}</CardTitle>
                    <Badge className={`${clinic.statusColor} text-white text-xs`}>
                      {clinic.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-semibold">{clinic.rating}</span>
                    <span className="text-gray-400">({clinic.reviews} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {clinic.specialties.map((specialty, i) => (
                      <Badge key={i} variant="outline" className="border-gray-600 text-gray-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Early Access CTA */}
        <Card className="bg-gradient-to-r from-teal-accent to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Request Early Access</h3>
            <p className="text-lg mb-6">
              Be among the first to book with our verified partner clinics when we launch in August 2025
            </p>
            <Button 
              className="bg-white text-teal-accent hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-lg"
              onClick={() => {
                const element = document.getElementById('waitlist');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Get Priority Access
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ClinicsSection;
