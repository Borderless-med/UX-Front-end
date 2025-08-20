
import { Button } from '@/components/ui/button';
import { Globe, UserCheck, Calendar } from 'lucide-react';

interface ClinicCardActionsProps {
  clinic: {
    name: string;
    websiteUrl: string;
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

      {/* Secondary actions row */}
      <div className="flex gap-2">
        {/* View Practitioner Details - Now secondary */}
        <Button
          onClick={isAuthenticated ? onViewPractitioner : onSignInClick}
          variant="outline"
          className="flex-1 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white text-xs py-2"
        >
          <UserCheck className="h-3 w-3 mr-1" />
          {isAuthenticated ? 'Details' : 'Sign In'}
        </Button>
        {clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && clinic.websiteUrl.trim() !== '' && (
          <Button
            onClick={handleWebsiteClick}
            variant="outline"
            className="flex-1 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white text-xs py-2"
          >
            <Globe className="h-3 w-3 mr-1" />
            Website
          </Button>
        )}
        
        <Button
          onClick={onClaimClinic}
          variant="outline"
          className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-xs py-2"
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default ClinicCardActions;
