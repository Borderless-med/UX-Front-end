
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
}

const ClinicGrid = ({ 
  clinics, 
  isAuthenticated, 
  onSignInClick, 
  onViewPractitionerDetails, 
  onClearAllFilters,
  activeFiltersCount,
  hideDistance = false,
  selection
}: ClinicGridProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 md:gap-4 mb-16 min-w-0 auto-rows-min">
      {clinics.map((clinic) => {
        const perClinicHideDistance = hideDistance || (selection === 'all' && clinic?.country === 'SG');
        const isSingaporeClinic = clinic?.country === 'SG';
        
        // Render minimal card for Singapore clinics (HCSA compliance)
        if (isSingaporeClinic) {
          return <MinimalClinicCard key={clinic.id} clinic={clinic} />;
        }
        
        // Render full card for JB/Malaysian clinics
        return (
        <ClinicCard
          key={clinic.id}
          clinic={clinic}
          isAuthenticated={isAuthenticated}
          onSignInClick={onSignInClick}
          onViewPractitionerDetails={onViewPractitionerDetails}
          hideDistance={perClinicHideDistance}
        />
      );})}
    </div>
  );
};

export default ClinicGrid;
