
import { Star, MapPin, Phone, Clock, ExternalLink, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { getSpecialServices } from '../utils/clinicFilterUtils';
import PractitionerDetails from './PractitionerDetails';

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
  const specialServices = getSpecialServices(clinic);

  return (
    <Card className="bg-light-card border-blue-light hover:border-blue-primary transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-dark mb-1">{clinic.name}</h3>
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
            <p className="text-xs text-neutral-gray italic">No special services listed</p>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-neutral-gray">Distance</p>
            <p className="text-sm font-medium text-success-green">{clinic.distance}km away</p>
          </div>
          <div>
            <p className="text-xs text-neutral-gray">Google Reviews</p>
            <p className="text-sm font-medium text-blue-dark">{clinic.reviews} reviews</p>
          </div>
        </div>

        <PractitionerDetails
          clinic={clinic}
          isAuthenticated={isAuthenticated}
          onSignInClick={onSignInClick}
          onViewDetails={onViewPractitionerDetails}
        />

        {/* Clinic Opt-out Section - Positioned at bottom for easy discovery */}
        <div className="border-t border-gray-100 pt-3 mt-4">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Clinic owner?</span>
            <Link
              to={`/opt-out-report?clinic=${encodeURIComponent(clinic.name)}&clinicId=${clinic.id}`}
              className="text-orange-600 hover:text-orange-700 underline flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Remove listing
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicCard;
