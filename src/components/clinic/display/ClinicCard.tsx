
import { useState } from 'react';
import { Star, MapPin, Phone, Clock, ExternalLink, Globe, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getSpecialServices } from '../utils/clinicFilterUtils';
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
  const specialServices = getSpecialServices(clinic);

  // Check if MDA license looks valid (not "Pending" or "Not available")
  const hasValidMDALicense = clinic.mdaLicense && 
    !clinic.mdaLicense.toLowerCase().includes('pending') && 
    !clinic.mdaLicense.toLowerCase().includes('not available');

  return (
    <>
      <Card className="bg-light-card border-blue-light hover:border-blue-primary transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-blue-dark">{clinic.name}</h3>
                {hasValidMDALicense && (
                  <UserCheck className="h-4 w-4 text-green-600" title="MDA Licensed" />
                )}
              </div>
              {clinic.websiteUrl && (
                <a 
                  href={clinic.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-primary hover:text-blue-dark transition-colors"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Visit Website
                </a>
              )}
            </div>
            <div className="flex items-center text-right">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium text-blue-dark">{clinic.rating}</span>
                </div>
                <span className="text-xs text-neutral-gray">({clinic.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
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
            <h4 className="text-sm font-medium text-blue-dark mb-2">Special Services:</h4>
            {specialServices.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {specialServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-light/20 text-blue-primary text-xs px-2 py-1 rounded"
                  >
                    {service}
                  </span>
                ))}
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
            {/* Claim Clinic Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => setShowClaimModal(true)}
                variant="outline"
                size="sm"
                className="text-xs border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Claim This Clinic
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
