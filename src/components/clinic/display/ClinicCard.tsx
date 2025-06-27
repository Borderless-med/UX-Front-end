
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Star, MapPin, Globe, Clock, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { Clinic } from '@/types/clinic';
import ClaimClinicModal from '../ClaimClinicModal';
import { useState } from 'react';
import { specialServicesLabels } from '../utils/clinicConstants';

interface ClinicCardProps {
  clinic: Clinic;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitionerDetails: (clinic: Clinic) => void;
}

const ClinicCard = ({ clinic, isAuthenticated, onSignInClick, onViewPractitionerDetails }: ClinicCardProps) => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  const availableTreatments = Object.entries(clinic.treatments)
    .filter(([_, available]) => available)
    .map(([key]) => key as keyof typeof specialServicesLabels);

  const handleRatingClick = () => {
    if (clinic.googleReviewUrl && clinic.googleReviewUrl.trim() !== '') {
      window.open(clinic.googleReviewUrl, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (clinic.websiteUrl && clinic.websiteUrl.trim() !== '' && clinic.websiteUrl !== 'N/A') {
      window.open(clinic.websiteUrl, '_blank');
    }
  };

  const handleViewPractitioner = () => {
    if (isAuthenticated) {
      onViewPractitionerDetails(clinic);
    } else {
      onSignInClick();
    }
  };

  const formatOperatingHours = (hours: string) => {
    if (!hours || hours === 'Not Listed' || hours === 'Operating hours not available') {
      return 'Operating hours not available';
    }
    return hours.split('\n').map((line, index) => (
      <div key={index} className="text-sm">
        {line.trim()}
      </div>
    ));
  };

  const hasGoogleReviews = clinic.googleReviewUrl && clinic.googleReviewUrl.trim() !== '';
  const hasValidOperatingHours = clinic.operatingHours && clinic.operatingHours !== 'Operating hours not available';

  return (
    <>
      <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-blue-light">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-blue-dark mb-2 line-clamp-2">
              {clinic.name}
            </h3>
            <p className="text-sm text-neutral-gray mb-3 line-clamp-2">
              {clinic.address}
            </p>
            
            {/* Rating and Reviews */}
            <div className="flex items-center justify-between mb-3">
              <div 
                className={`flex items-center ${hasGoogleReviews ? 'cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors' : ''}`}
                onClick={hasGoogleReviews ? handleRatingClick : undefined}
                title={hasGoogleReviews ? "Click to view Google Reviews" : "Google Reviews not available"}
              >
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium text-blue-dark">
                    {clinic.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-neutral-gray ml-1">
                    ({clinic.reviews} reviews)
                  </span>
                </div>
              </div>
              
              {/* Operating Hours */}
              <div className="flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-gray-50"
                      title="View operating hours"
                    >
                      <Clock className="h-4 w-4 text-blue-primary" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-dark">Operating Hours</h4>
                      <div className="text-neutral-gray">
                        {hasValidOperatingHours ? formatOperatingHours(clinic.operatingHours) : 'Operating hours not available'}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Distance and License Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-neutral-gray">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{clinic.distance.toFixed(1)}km from CIQ</span>
            </div>
            
            <div className="flex items-center">
              {clinic.mdaLicense && clinic.mdaLicense !== 'Pending verification' && clinic.mdaLicense !== 'Pending Application' ? (
                <div className="flex items-center text-sm text-green-600">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Verified</span>
                </div>
              ) : (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Pending</span>
                </div>
              )}
            </div>
          </div>

          {/* Available Treatments */}
          {availableTreatments.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-blue-dark mb-2">Available Services:</p>
              <div className="flex flex-wrap gap-1">
                {availableTreatments.slice(0, 3).map((treatment) => (
                  <Badge 
                    key={treatment} 
                    variant="secondary" 
                    className="text-xs bg-blue-primary/10 text-blue-primary"
                  >
                    {specialServicesLabels[treatment]}
                  </Badge>
                ))}
                {availableTreatments.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    +{availableTreatments.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Practitioner Details */}
            <Button
              onClick={handleViewPractitioner}
              className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white flex items-center justify-center"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'View Practitioner Details' : 'Sign In to View Details'}
            </Button>

            {/* Website and Claim Buttons */}
            <div className="flex gap-2">
              {clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && clinic.websiteUrl.trim() !== '' && (
                <Button
                  onClick={handleWebsiteClick}
                  variant="outline"
                  className="flex-1 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white flex items-center justify-center"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </Button>
              )}
              
              <Button
                onClick={() => setShowClaimModal(true)}
                variant="outline"
                className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-xs"
              >
                Claim Clinic
              </Button>
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
