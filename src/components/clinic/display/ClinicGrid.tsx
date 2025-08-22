
import { Button } from '@/components/ui/button';
import ClinicCard from './ClinicCard';

interface ClinicGridProps {
  clinics: any[];
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onViewPractitionerDetails: (clinic: any) => void;
  onClearAllFilters: () => void;
  activeFiltersCount: number;
}

const ClinicGrid = ({ 
  clinics, 
  isAuthenticated, 
  onSignInClick, 
  onViewPractitionerDetails, 
  onClearAllFilters,
  activeFiltersCount 
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-16 min-w-0">
      {clinics.map((clinic) => (
        <ClinicCard
          key={clinic.id}
          clinic={clinic}
          isAuthenticated={isAuthenticated}
          onSignInClick={onSignInClick}
          onViewPractitionerDetails={onViewPractitionerDetails}
        />
      ))}
    </div>
  );
};

export default ClinicGrid;
