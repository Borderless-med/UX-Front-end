
import { Card, CardContent } from '@/components/ui/card';
import { Clinic } from '@/types/clinic';
import ClaimClinicModal from '../ClaimClinicModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableCategories } from '../utils/clinicFilterUtils';
import ClinicCardHeader from './ClinicCardHeader';
import ClinicCardInfo from './ClinicCardInfo';
import ClinicCardServices from './ClinicCardServices';
import ClinicCardActions from './ClinicCardActions';

interface ClinicCardProps {
  clinic: Clinic;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitionerDetails: (clinic: Clinic) => void;
}

const ClinicCard = ({ clinic, isAuthenticated, onSignInClick, onViewPractitionerDetails }: ClinicCardProps) => {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const navigate = useNavigate();

  const availableCategories = getAvailableCategories(clinic);

  const handleViewPractitioner = () => {
    if (isAuthenticated) {
      onViewPractitionerDetails(clinic);
    } else {
      onSignInClick();
    }
  };

  const handleBookNow = () => {
    // Navigate to booking page with clinic name pre-filled
    navigate(`/book-now?clinic=${encodeURIComponent(clinic.name)}`);
  };

  return (
    <>
      <Card className="min-h-[26rem] max-h-[32rem] min-w-[17.5rem] shadow-sm hover:shadow-md transition-shadow border-blue-light">
        <CardContent className="p-3 md:p-4 h-full grid grid-rows-[1fr_4.5rem_auto] gap-2 md:gap-3">
          {/* Header Section - Flexible layout */}
          <div className="min-h-[11rem] flex flex-col justify-between overflow-hidden">
            <ClinicCardHeader clinic={clinic} />
            
            <ClinicCardInfo clinic={clinic} />
          </div>

          {/* Available Treatment Categories - Flexible Height Section */}
          <ClinicCardServices availableCategories={availableCategories} />

          {/* Action Buttons - Fixed at Bottom with Proper Spacing */}
          <ClinicCardActions
            clinic={clinic}
            isAuthenticated={isAuthenticated}
            onSignInClick={onSignInClick}
            onViewPractitioner={handleViewPractitioner}
            onClaimClinic={() => setShowClaimModal(true)}
            onBookNow={handleBookNow}
          />
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
