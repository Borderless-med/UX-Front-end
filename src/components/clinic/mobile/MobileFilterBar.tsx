import { X, Filter, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileFilterBarProps {
  searchTerm: string;
  selectedTreatments: string[];
  selectedTownships: string[];
  ratingFilter: number;
  mdaLicenseFilter: string;
  activeFiltersCount: number;
  onClearAll: () => void;
  onOpenFilters: () => void;
  onRemoveTreatment: (treatment: string) => void;
  onRemoveTownship: (township: string) => void;
  onClearRating: () => void;
  onClearSearch: () => void;
}

const MobileFilterBar = ({
  searchTerm,
  selectedTreatments,
  selectedTownships,
  ratingFilter,
  mdaLicenseFilter,
  activeFiltersCount,
  onClearAll,
  onOpenFilters,
  onRemoveTreatment,
  onRemoveTownship,
  onClearRating,
  onClearSearch
}: MobileFilterBarProps) => {
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="lg:hidden bg-gradient-to-r from-primary/10 via-blue-50 to-primary/10 border-b border-primary/20 shadow-md z-20 sticky top-[88px]">
      {/* Enhanced Filter Actions */}
      <div className="flex items-center justify-between p-4">
        <Button
          onClick={onOpenFilters}
          variant="default"
          size="default"
          className={`relative min-w-[120px] shadow-sm ${
            activeFiltersCount === 0 ? 'animate-gentle-pulse motion-reduce:animate-none' : ''
          }`}
        >
          <Filter className="h-5 w-5 mr-2" />
          {activeFiltersCount > 0 ? `${activeFiltersCount} Active` : 'Filter Clinics'}
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs flex items-center justify-center bg-destructive text-destructive-foreground border-2 border-background"
            >
              {activeFiltersCount > 9 ? '9+' : activeFiltersCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            onClick={onClearAll}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {/* Search Term */}
            {searchTerm && (
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 pr-1"
              >
                Search: "{searchTerm.length > 15 ? searchTerm.slice(0, 15) + '...' : searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0.5 hover:bg-transparent"
                  onClick={onClearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {/* Treatment Filters */}
            {selectedTreatments.slice(0, 2).map((treatment) => (
              <Badge 
                key={treatment}
                variant="secondary" 
                className="flex items-center gap-1 pr-1"
              >
                {treatment.length > 12 ? treatment.slice(0, 12) + '...' : treatment}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0.5 hover:bg-transparent"
                  onClick={() => onRemoveTreatment(treatment)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {/* Show count if more treatments */}
            {selectedTreatments.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{selectedTreatments.length - 2} more
              </Badge>
            )}

            {/* Township Filters */}
            {selectedTownships.slice(0, 2).map((township) => (
              <Badge 
                key={township}
                variant="secondary" 
                className="flex items-center gap-1 pr-1"
              >
                <MapPin className="h-3 w-3" />
                {township}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0.5 hover:bg-transparent"
                  onClick={() => onRemoveTownship(township)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {/* Show count if more townships */}
            {selectedTownships.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{selectedTownships.length - 2} more
              </Badge>
            )}

            {/* Rating Filter */}
            {ratingFilter > 0 && (
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 pr-1"
              >
                <Star className="h-3 w-3" />
                {ratingFilter}+ stars
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0.5 hover:bg-transparent"
                  onClick={onClearRating}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {/* MDA License Filter */}
            {mdaLicenseFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {mdaLicenseFilter === 'licensed' ? 'MDA Licensed' : 'Non-Licensed'}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFilterBar;