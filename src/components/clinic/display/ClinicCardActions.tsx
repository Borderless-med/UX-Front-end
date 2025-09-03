import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe, UserCheck, Calendar, Phone } from 'lucide-react';

interface ClinicCardActionsProps {
  clinic: {
    name: string;
    websiteUrl: string;
    phone?: string;
  };
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitioner: () => void;
  onClaimClinic: () => void;
  onBookNow: () => void;
}

const ClinicCardActions = ({ 
  clinic, 
  isAuthenticated, 
  onSignInClick, 
  onViewPractitioner, 
  onClaimClinic,
  onBookNow 
}: ClinicCardActionsProps) => {
  const handleWebsiteClick = () => {
    if (clinic.websiteUrl && clinic.websiteUrl.trim() !== '' && clinic.websiteUrl !== 'N/A') {
      window.open(clinic.websiteUrl, '_blank');
    }
  };

  const handleContactClick = () => {
    if (clinic.websiteUrl && clinic.websiteUrl.trim() !== '' && clinic.websiteUrl !== 'N/A') {
      window.open(clinic.websiteUrl, '_blank');
    } else if (clinic.phone) {
      window.open(`tel:${clinic.phone}`, '_self');
    }
  };

  return (
    <div className="space-y-3 pb-2">
      {/* Book Now - Primary CTA */}
      <Button
        onClick={onBookNow}
        className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white flex items-center justify-center text-sm py-2.5"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Now
      </Button>

      {/* Secondary actions row - Always 3 buttons */}
      <div className="flex gap-2">
        {/* View Practitioner Details */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={isAuthenticated ? onViewPractitioner : onSignInClick}
              variant="outline"
              className="flex-1 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white text-xs py-2"
            >
              <UserCheck className="h-3 w-3 mr-1" />
              Details
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isAuthenticated ? 'View practitioner details' : 'Sign in to view dentist name and MDA license'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Contact/Website Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleContactClick}
              variant="outline"
              className="flex-1 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white text-xs py-2"
              disabled={!clinic.websiteUrl || (clinic.websiteUrl === 'N/A') || clinic.websiteUrl.trim() === ''}
            >
              {clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && clinic.websiteUrl.trim() !== '' ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Website
                </>
              ) : (
                <>
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && clinic.websiteUrl.trim() !== '' 
                ? 'Visit clinic website'
                : 'Website not available'
              }
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Update Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClaimClinic}
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-xs py-2"
            >
              Update
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Update clinic information</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ClinicCardActions;