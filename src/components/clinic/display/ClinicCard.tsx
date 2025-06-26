
import { useState } from 'react';
import { Star, MapPin, Phone, Clock, ExternalLink, Globe, UserCheck, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { getSpecialServices, getSpecialties } from '../utils/clinicFilterUtils';
import { treatmentCategories, specialServicesLabels } from '../utils/clinicConstants';
import PractitionerDetails from './PractitionerDetails';
import ClaimClinicModal from '../ClaimClinicModal';

interface ClinicCardProps {
  clinic: any;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitionerDetails: (clinic: any) => void;
}

const ClinicCard = ({ 
  clinic, 
  isAuthenticated, 
  onSignInClick, 
  onViewPractitionerDetails 
}: ClinicCardProps) => {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAllTreatments, setShowAllTreatments] = useState(false);
  const specialServices = getSpecialServices(clinic);
  const specialties = getSpecialties(clinic);

  // Get all available treatments for this clinic
  const availableTreatments = Object.entries(clinic.treatments)
    .filter(([key, value]) => value === true)
    .map(([key]) => ({
      key,
      label: specialServicesLabels[key as keyof typeof specialServicesLabels]
    }));

  // Group treatments by category
  const groupedTreatments = Object.entries(treatmentCategories).reduce((acc, [categoryKey, category]) => {
    const categoryTreatments = availableTreatments.filter(treatment => 
      category.treatments.includes(treatment.key)
    );
    if (categoryTreatments.length > 0) {
      acc[categoryKey] = {
        label: category.label,
        treatments: categoryTreatments
      };
    }
    return acc;
  }, {} as Record<string, { label: string; treatments: { key: string; label: string }[] }>);

  // Check if MDA license looks valid
  const hasValidMDALicense = clinic.mdaLicense && 
    !clinic.mdaLicense.toLowerCase().includes('pending') && 
    !clinic.mdaLicense.toLowerCase().includes('not available');

  return (
    <>
      <Card className="bg-light-card border-blue-light hover:border-blue-primary transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-blue-dark">{clinic.name}</h3>
                {hasValidMDALicense && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              {/* Specialties */}
              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-primary text-blue-primary">
                      <Award className="h-3 w-3 mr-1" />
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}

              {clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && (
                <a 
                  href={clinic.websiteUrl.startsWith('http') ? clinic.websiteUrl : `https://${clinic.websiteUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-primary hover:text-blue-dark transition-colors"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Visit Website
                </a>
              )}
            </div>
            
            {/* Rating Section */}
            <div className="flex items-center text-right">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium text-blue-dark">{clinic.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-neutral-gray">({clinic.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Location & Contact */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-blue-primary mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-neutral-gray">{clinic.address}</p>
                <p className="text-xs text-blue-primary font-medium">{clinic.township}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-primary mr-2" />
                <p className="text-sm text-neutral-gray">Contact Available</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-gray">Distance</p>
                <p className="text-sm font-medium text-success-green">{clinic.distance}km away</p>
              </div>
            </div>
          </div>

          {/* Enhanced Services Display */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-blue-dark">Available Services</h4>
              {availableTreatments.length > 8 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllTreatments(!showAllTreatments)}
                  className="text-xs h-auto p-1"
                >
                  {showAllTreatments ? 'Show Less' : `+${availableTreatments.length - 8} More`}
                </Button>
              )}
            </div>
            
            {Object.keys(groupedTreatments).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(groupedTreatments).map(([categoryKey, categoryData], index) => {
                  const shouldShow = showAllTreatments || index < 2;
                  
                  if (!shouldShow) return null;
                  
                  return (
                    <div key={categoryKey}>
                      <p className="text-xs font-medium text-blue-primary mb-1">{categoryData.label}</p>
                      <div className="flex flex-wrap gap-1">
                        {categoryData.treatments.map((treatment, treatmentIndex) => {
                          const shouldShowTreatment = showAllTreatments || treatmentIndex < 4;
                          
                          if (!shouldShowTreatment) return null;
                          
                          return (
                            <span
                              key={treatment.key}
                              className="inline-block bg-blue-light/20 text-blue-primary text-xs px-2 py-1 rounded"
                            >
                              {treatment.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-gray italic">General dental services</p>
            )}
          </div>

          {/* Enhanced Practitioner Details */}
          <PractitionerDetails
            clinic={clinic}
            isAuthenticated={isAuthenticated}
            onSignInClick={onSignInClick}
            onViewDetails={onViewPractitionerDetails}
          />

          {/* Clinic Management Section */}
          <div className="border-t border-gray-100 pt-3 mt-4 space-y-2">
            {/* Update My Clinic Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => setShowClaimModal(true)}
                variant="outline"
                size="sm"
                className="text-xs border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Update My Clinic
              </Button>
            </div>
            
            {/* Opt-out link */}
            <div className="flex justify-center">
              <Link
                to={`/opt-out-report?clinic=${encodeURIComponent(clinic.name)}&clinicId=${clinic.id}`}
                className="text-xs text-gray-500 hover:text-orange-600 underline flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Remove listing
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <ClaimClinicModal 
        isOpen={showClaimModal} 
        onClose={() => setShowClaimModal(false)} 
        clinic={clinic} 
      />
    </>
  );
};

export default ClinicCard;
