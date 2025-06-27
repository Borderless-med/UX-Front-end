
import { Button } from '@/components/ui/button';
import { Globe, UserCheck } from 'lucide-react';

interface ClinicCardActionsProps {
  clinic: {
    websiteUrl: string;
  };
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitioner: () => void;
  onClaimClinic: () => void;
}

const ClinicCardActions = ({ 
  clinic, 
  isAuthenticated, 
  onSignInClick, 
  onViewPractitioner, 
  onClaimClinic 
}: ClinicCardActionsProps) => {
  const handleWebsiteClick = () => {
    if (clinic.websiteUrl && clinic.websiteUrl.trim() !== '' && clinic.websiteUrl !== 'N/A') {
      window.open(clinic.websiteUrl, '_blank');
    }
  };

  return (
    <div className="space-y-3 pb-2">
      {/* Practitioner Details */}
      <Button
        onClick={isAuthenticated ? onViewPractitioner : onSignInClick}
        className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white flex items-center justify-center text-sm py-2.5"
      >
        <UserCheck className="h-4 w-4 mr-2" />
        {isAuthenticated ? 'View Practitioner Details' : 'Sign In to View Details'}
      </Button>

      {/* Website and Update Clinic Buttons */}
      <div className="flex gap-2">
        {clinic.websiteUrl && clinic.websiteUrl !== 'N/A' && clinic.websiteUrl.trim() !== '' && (
          <Button
            onClick={handleWebsiteClick}
            variant="outline"
            className="flex-1 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white flex items-center justify-center text-sm py-2"
          >
            <Globe className="h-4 w-4 mr-2" />
            Website
          </Button>
        )}
        
        <Button
          onClick={onClaimClinic}
          variant="outline"
          className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-xs py-2"
        >
          Update My Clinic
        </Button>
      </div>
    </div>
  );
};

export default ClinicCardActions;
