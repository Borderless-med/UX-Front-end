
import { useState } from 'react';
import { Search, MapPin, Phone, Clock, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clinics } from '@/data/clinics';
import { useNavigate } from 'react-router-dom';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

const ClinicsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter clinics based on search term
  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.township.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptOutClick = () => {
    navigate('/opt-out-report');
  };

  // Helper function to get basic specialties based on treatments
  const getSpecialties = (clinic: typeof clinics[0]) => {
    const specialties = [];
    if (clinic.treatments.dentalImplant) specialties.push('Dental Implants');
    if (clinic.treatments.braces) specialties.push('Orthodontics');
    if (clinic.treatments.rootCanal) specialties.push('Endodontics');
    if (clinic.treatments.teethWhitening) specialties.push('Cosmetic Dentistry');
    if (clinic.treatments.gumTreatment) specialties.push('Periodontics');
    return specialties.slice(0, 3); // Show max 3 specialties
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            Directory Listings
          </h1>
          <p className="text-lg text-neutral-gray mb-8 max-w-3xl mx-auto">
            Browse our comprehensive directory of dental clinics in Johor Bahru. 
            Find information about services, locations, and contact details to help you make informed decisions.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray h-4 w-4" />
            <Input
              type="text"
              placeholder="Search clinics or areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-blue-light focus:border-blue-primary"
            />
          </div>

          {/* Opt Out Button */}
          <div className="mb-8">
            <Button
              onClick={handleOptOutClick}
              variant="outline"
              className="border-[#FF6F61] text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white"
            >
              Opt Out or Report Issue
            </Button>
          </div>
        </div>

        {/* Medical Disclaimer - Positioned prominently but elegantly */}
        <div className="mb-10">
          <MedicalDisclaimer variant="banner" className="max-w-5xl mx-auto" />
        </div>

        {/* Clinics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => {
            const specialties = getSpecialties(clinic);
            
            return (
              <Card key={clinic.id} className="bg-light-card border-blue-light hover:border-blue-primary transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-blue-dark">{clinic.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-neutral-gray ml-1">{clinic.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-blue-primary mt-1 mr-2 flex-shrink-0" />
                      <p className="text-sm text-neutral-gray">{clinic.address}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-primary mr-2" />
                      <p className="text-sm text-neutral-gray">Contact Available</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-primary mr-2" />
                      <p className="text-sm text-neutral-gray">Operating Hours Available</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-blue-dark mb-2">Key Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-light/20 text-blue-primary text-xs px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-neutral-gray">Distance</p>
                      <p className="text-sm font-medium text-success-green">{clinic.distance}km away</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-gray">Reviews</p>
                      <p className="text-sm font-medium text-blue-dark">{clinic.reviews} reviews</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-neutral-gray mb-1">Dentist: {clinic.dentist}</p>
                    <p className="text-xs text-neutral-gray">MDA License: {clinic.mdaLicense}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-gray text-lg">No clinics found matching your search criteria.</p>
            <p className="text-neutral-gray text-sm mt-2">Try adjusting your search terms or browse all clinics.</p>
          </div>
        )}

        {/* Enhanced Directory Information Notice */}
        <div className="mt-16">
          <MedicalDisclaimer variant="subtle" className="max-w-5xl mx-auto" />
        </div>

        {/* Directory Disclaimer Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50/60 to-blue-100/40 p-8 rounded-xl border border-blue-200/30 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-dark mb-4 text-center">Directory Information Notice</h3>
            <div className="space-y-4 text-sm text-blue-800/90 leading-relaxed">
              <p>
                <strong>Information Accuracy:</strong> The information provided in this directory is compiled from 
                publicly available sources for informational purposes only. We make no representation or warranty 
                regarding the accuracy, completeness, or currency of this information.
              </p>
              <p>
                <strong>User Responsibility:</strong> Users are advised to verify all details directly with clinics 
                before making any decisions. This includes confirming practitioner credentials, treatment costs, 
                operating hours, and clinic policies.
              </p>
              <p>
                <strong>No Endorsement:</strong> Listing of a dental clinic does not imply any business relationship, 
                partnership, or endorsement. We have not verified the credentials or services of these clinics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-200/40 text-center">
              <p className="text-xs text-blue-700/80">
                For corrections or removal requests, please use our{' '}
                <button 
                  onClick={handleOptOutClick}
                  className="text-blue-primary hover:text-blue-dark underline font-medium"
                >
                  opt-out form
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicsSection;
