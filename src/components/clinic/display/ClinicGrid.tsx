
import { Button } from '@/components/ui/button';
import ClinicCard from './ClinicCard';
import MinimalClinicCard from './MinimalClinicCard';

interface ClinicGridProps {
  clinics: any[];
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitionerDetails: (clinic: any) => void;
  onClearAllFilters: () => void;
  activeFiltersCount: number;
  hideDistance?: boolean; // global override
  selection?: 'sg' | 'jb' | 'all'; // to allow per-clinic distance hiding logic
  selectedTreatments?: string[]; // For Option 4 conditional display on SG cards
}

const ClinicGrid = ({ 
  clinics, 
  isAuthenticated, 
  onSignInClick, 
  onViewPractitionerDetails, 
  onClearAllFilters,
  activeFiltersCount,
  hideDistance = false,
  selection,
  selectedTreatments = []
}: ClinicGridProps) => {
  // Dual ranking: Separate verified partners from regular clinics
  const verifiedPartners = clinics.filter(clinic => clinic.isVerifiedPartner === true);
  const regularClinics = clinics.filter(clinic => !clinic.isVerifiedPartner);

  if (clinics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-gray text-lg">No clinics found matching your search criteria.</p>
        <p className="text-neutral-gray text-sm mt-2">Try adjusting your search terms or clearing some filters.</p>
        {activeFiltersCount > 0 && (
          <Button
            onClick={onClearAllFilters}
            variant="outline"
            className="mt-4 border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
          >
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Pricing Disclaimer */}
      <div className="mb-4 px-2 py-2 bg-amber-50 border-l-4 border-amber-500 rounded">
        <p className="text-sm text-gray-700 italic">
          Prices shown are estimated and subject to change. Always confirm with the clinic before booking.
        </p>
      </div>

      {/* Verified Partners Section */}
      {verifiedPartners.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 px-4 py-3 bg-green-50 border-l-4 border-green-600 rounded">
            <h3 className="text-lg font-semibold text-green-800 flex items-center">
              ✅ Verified Partners ({verifiedPartners.length})
              <span className="ml-2 text-sm font-normal text-green-700">
                - 24-hour response guarantee
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 md:gap-4 min-w-0 auto-rows-min">
            {verifiedPartners.map((clinic) => {
              const perClinicHideDistance = hideDistance || (selection === 'all' && clinic?.country === 'SG');
              const isSingaporeClinic = clinic?.country === 'SG';
              const useMinimalCard = isSingaporeClinic && !clinic.isVerifiedPartner;
            
              if (useMinimalCard) {
                return (
                  <MinimalClinicCard 
                    key={clinic.id} 
                    clinic={clinic} 
                    selectedTreatments={selectedTreatments}
                  />
                );
              }
            
              return (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  isAuthenticated={isAuthenticated}
                  onSignInClick={onSignInClick}
                  onViewPractitionerDetails={onViewPractitionerDetails}
                  hideDistance={perClinicHideDistance}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Clinics Section */}
      {regularClinics.length > 0 && (
        <div>
          {verifiedPartners.length > 0 && (
            <div className="mb-4 px-4 py-2 bg-gray-50 border-l-4 border-gray-400 rounded">
              <h3 className="text-lg font-semibold text-gray-700">
                Other Clinics ({regularClinics.length})
              </h3>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 md:gap-4 mb-16 min-w-0 auto-rows-min">
            {regularClinics.map((clinic) => {
              const perClinicHideDistance = hideDistance || (selection === 'all' && clinic?.country === 'SG');
              const isSingaporeClinic = clinic?.country === 'SG';
            
              if (isSingaporeClinic) {
                return (
                  <MinimalClinicCard 
                    key={clinic.id} 
                    clinic={clinic} 
                    selectedTreatments={selectedTreatments}
                  />
                );
              }
            
              return (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  isAuthenticated={isAuthenticated}
                  onSignInClick={onSignInClick}
                  onViewPractitionerDetails={onViewPractitionerDetails}
                  hideDistance={perClinicHideDistance}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ClinicGrid;
