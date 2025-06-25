
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterControlsProps {
  showAdvancedFilters: boolean;
  onToggleAdvanced: () => void;
  activeFiltersCount: number;
  onClearAll: () => void;
}

const FilterControls = ({ 
  showAdvancedFilters, 
  onToggleAdvanced, 
  activeFiltersCount, 
  onClearAll 
}: FilterControlsProps) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <Button
        onClick={onToggleAdvanced}
        variant="outline"
        className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
      >
        {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
      </Button>

      {activeFiltersCount > 0 && (
        <Button
          onClick={onClearAll}
          variant="ghost"
          size="sm"
          className="text-blue-primary hover:text-blue-dark"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
};

export default FilterControls;
