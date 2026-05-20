import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe, UserCheck, Calendar, Phone, MessageCircle } from 'lucide-react';

interface ClinicCardActionsProps {
  clinic: {
    name: string;
    websiteUrl: string;
    phone?: string;
    whatsappNumber?: string;
    isVerifiedPartner?: boolean;
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
  const handleContactClick = () => {
    if (clinic.websiteUrl && clinic.websiteUrl.trim() !== '' && clinic.websiteUrl !== 'N/A') {
      window.open(clinic.websiteUrl, '_blank');
    } else if (clinic.phone) {
      window.open(`tel:${clinic.phone}`, '_self');
    }
  };

  const handleWhatsAppClick = () => {
    if (clinic.whatsappNumber) {
      // Format: Remove all non-digit characters and ensure country code
      const cleanNumber = clinic.whatsappNumber.replace(/\D/g, '');
      const message = encodeURIComponent(`Hi, I found your clinic on OraChope.com and would like to inquire about dental services at ${clinic.name}.`);
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3 pb-2">
        {/* Verified Partner: WhatsApp + Book Now (side by side) */}
        {clinic.isVerifiedPartner && clinic.whatsappNumber ? (
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-sm py-2.5"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={onBookNow}
              className="flex-1 bg-blue-primary hover:bg-blue-primary/90 text-white flex items-center justify-center text-sm py-2.5"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book
            </Button>
          </div>
        ) : (
          /* Regular Clinic: Book Now only */
          <Button
            onClick={onBookNow}
            className="w-full bg-blue-primary hover:bg-blue-primary/90 text-white flex items-center justify-center text-sm py-2.5"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        )}

        {/* Secondary actions row - wraps on narrow widths */}
        <div className="flex flex-wrap gap-2 w-full">
          {/* View Practitioner Details */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={isAuthenticated ? onViewPractitioner : onSignInClick}
                variant="outline"
                className="flex-1 min-w-[5.5rem] border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white text-xs py-2"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Details
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAuthenticated ? 'View practitioner details' : 'Sign in to view dentist names, MDA licenses, chat history, and transactions'}</p>
            </TooltipContent>
          </Tooltip>

          {/* Contact/Website Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleContactClick}
                variant="outline"
                className="flex-1 min-w-[5.5rem] border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white text-xs py-2"
                disabled={!clinic.websiteUrl || clinic.websiteUrl === 'N/A' || clinic.websiteUrl.trim() === ''}
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
                  : 'Website not available'}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Update Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onClaimClinic}
                variant="outline"
                className="flex-1 min-w-[5.5rem] border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-xs py-2"
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
    </TooltipProvider>
  );
};

export default ClinicCardActions;
