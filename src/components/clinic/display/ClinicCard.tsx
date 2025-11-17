
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
import PractitionerDetailsModal from './PractitionerDetailsModal';

interface ClinicCardProps {
  clinic: Clinic;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitionerDetails: (clinic: Clinic) => void;
  hideDistance?: boolean; // hide distance line when viewing Singapore clinics
}

const ClinicCard = ({ clinic, isAuthenticated, onSignInClick, onViewPractitionerDetails, hideDistance = false }: ClinicCardProps) => {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showPractitionerModal, setShowPractitionerModal] = useState(false);
  const navigate = useNavigate();

  const availableCategories = getAvailableCategories(clinic);

  const handleViewPractitioner = () => {
    if (isAuthenticated) {
      setShowPractitionerModal(true);
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
  <Card className="relative overflow-hidden flex flex-col min-h-[26rem] max-h-[32rem] w-full sm:min-w-[16rem] shadow-sm hover:shadow-md transition-shadow border-blue-light">
        {/* Allow content to grow naturally; grid rows replaced with flex column for better wrapping */}
  <CardContent className="p-3 md:p-4 h-full flex flex-col gap-2 md:gap-3 overflow-hidden">
          {/* Header Section - Flexible layout */}
          <div className="min-h-[11rem] flex flex-col justify-between gap-2 overflow-visible">
            <ClinicCardHeader clinic={clinic} />
            
            <ClinicCardInfo clinic={clinic} hideDistance={hideDistance} />
          </div>

          {/* Available Treatment Categories - Flexible Height Section */}
          <ClinicCardServices availableCategories={availableCategories} />

          {/* Action Buttons - Fixed at Bottom with Proper Spacing */}
          <div className="mt-auto pt-1">
          <ClinicCardActions
            clinic={clinic}
            isAuthenticated={isAuthenticated}
            onSignInClick={onSignInClick}
            onViewPractitioner={handleViewPractitioner}
            onClaimClinic={() => setShowClaimModal(true)}
            onBookNow={handleBookNow}
          />
          </div>
        </CardContent>
      </Card>

      <ClaimClinicModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        clinic={clinic}
      />

      <PractitionerDetailsModal
        isOpen={showPractitionerModal}
        onClose={() => setShowPractitionerModal(false)}
        clinic={clinic}
      />
    </>
  );
};

export default ClinicCard;
