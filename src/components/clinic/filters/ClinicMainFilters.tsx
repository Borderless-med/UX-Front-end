
import TreatmentFilters from './components/TreatmentFilters';
import BasicFilters from './components/BasicFilters';

interface ClinicMainFiltersProps {
  selectedTreatments: string[];
  onTreatmentChange: (treatments: string[]) => void;
  ratingFilter: number;
  onRatingChange: (rating: number) => void;
  selectedTownships: string[];
  onTownshipChange: (townships: string[]) => void;
  townships: string[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  mdaLicenseFilter: string;
  onMdaLicenseFilterChange: (filter: string) => void;
}

const ClinicMainFilters = ({
  selectedTreatments,
  onTreatmentChange,
  ratingFilter,
  onRatingChange,
  selectedTownships,
  onTownshipChange,
  townships,
  sortBy,
  onSortChange,
  mdaLicenseFilter,
  onMdaLicenseFilterChange
}: ClinicMainFiltersProps) => {
  return (
    <div className="space-y-6">
      <TreatmentFilters
        selectedTreatments={selectedTreatments}
        onTreatmentChange={onTreatmentChange}
      />

      <BasicFilters
        ratingFilter={ratingFilter}
        onRatingChange={onRatingChange}
        selectedTownships={selectedTownships}
        onTownshipChange={onTownshipChange}
        townships={townships}
        sortBy={sortBy}
        onSortChange={onSortChange}
        mdaLicenseFilter={mdaLicenseFilter}
        onMdaLicenseFilterChange={onMdaLicenseFilterChange}
      />
    </div>
  );
};

export default ClinicMainFilters;
