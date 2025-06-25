
import { clinics } from '@/data/clinics';

interface ResultsCountProps {
  filteredCount: number;
  activeFiltersCount: number;
}

const ResultsCount = ({ filteredCount, activeFiltersCount }: ResultsCountProps) => {
  return (
    <div className="mb-6 text-center">
      <p className="text-neutral-gray">
        Showing {filteredCount} of {clinics.length} clinics
        {activeFiltersCount > 0 && ` with ${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`}
      </p>
    </div>
  );
};

export default ResultsCount;
