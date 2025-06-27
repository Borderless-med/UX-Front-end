
import { Card, CardContent } from '@/components/ui/card';
import { Clinic } from '@/types/clinic';
import ClaimClinicModal from '../ClaimClinicModal';
import { useState } from 'react';
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

  const availableCategories = getAvailableCategories(clinic);

  const handleViewPractitioner = () => {
    if (isAuthenticated) {
      onViewPractitionerDetails(clinic);
    } else {
      onSignInClick();
    }
  };

  return (
    <>
      <Card className="h-[520px] shadow-sm hover:shadow-md transition-shadow border-blue-light">
        <CardContent className="p-6 h-full grid grid-rows-[1fr_90px_auto] gap-4">
          {/* Header Section - Expanded Height to accommodate all variations */}
          <div className="min-h-[220px] flex flex-col justify-between">
            <ClinicCardHeader clinic={clinic} />
            
            <ClinicCardInfo clinic={clinic} />
          </div>

          {/* Available Treatment Categories - Increased Height Section */}
          <ClinicCardServices availableCategories={availableCategories} />

          {/* Action Buttons - Fixed at Bottom with Proper Spacing */}
          <ClinicCardActions
            clinic={clinic}
            isAuthenticated={isAuthenticated}
            onSignInClick={onSignInClick}
            onViewPractitioner={handleViewPractitioner}
            onClaimClinic={() => setShowClaimModal(true)}
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
