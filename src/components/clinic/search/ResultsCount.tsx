
interface ResultsCountProps {
  filteredCount: number;
  totalCount: number;
  activeFiltersCount: number;
}

const ResultsCount = ({ filteredCount, totalCount, activeFiltersCount }: ResultsCountProps) => {
  return (
    <div className="mb-6 text-center">
      <p className="text-neutral-gray">
        Showing {filteredCount} of {totalCount} clinics
        {activeFiltersCount > 0 && ` with ${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`}
      </p>
    </div>
  );
};

export default ResultsCount;
