
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Shield, Stethoscope, CheckCircle, Search } from 'lucide-react';

interface ResultsCountProps {
  filteredCount: number;
  totalCount: number;
  activeFiltersCount: number;
  selectedTreatments?: string[];
  selectedTownships?: string[];
  ratingFilter?: number;
  mdaLicenseFilter?: string;
  isSingapore?: boolean; // HCSA compliance - hide rating/license filters
}

const ResultsCount = ({ 
  filteredCount, 
  totalCount, 
  activeFiltersCount,
  selectedTreatments = [],
  selectedTownships = [],
  ratingFilter = 0,
  mdaLicenseFilter = 'all',
  isSingapore = false
}: ResultsCountProps) => {
  const getFilterSummary = () => {
    const filters = [];
    
    if (selectedTreatments.length > 0) {
      filters.push(`${selectedTreatments.length} treatment${selectedTreatments.length > 1 ? 's' : ''}`);
    }
    
    if (selectedTownships.length > 0) {
      filters.push(`${selectedTownships.length} location${selectedTownships.length > 1 ? 's' : ''}`);
    }
    
    // HCSA compliance: Don't show rating filter for SG clinics
    if (!isSingapore && ratingFilter > 0) {
      filters.push(`${ratingFilter}+ star rating`);
    }
    
    // HCSA compliance: Don't show license filter for SG clinics
    if (!isSingapore) {
      if (mdaLicenseFilter === 'verified') {
        filters.push('verified license');
      } else if (mdaLicenseFilter === 'pending') {
        filters.push('pending verification');
      }
    }
    
    return filters;
  };

  const filterSummary = getFilterSummary();

  // Determine result state for dynamic styling
  const getResultState = () => {
    if (activeFiltersCount === 0) return 'default';
    if (filteredCount === 0) return 'no-results';
    return 'success';
  };

  const resultState = getResultState();

  // Dynamic styling based on result state
  const getContainerClasses = () => {
    const baseClasses = "bg-white border rounded-lg p-4 mb-6 transition-all duration-300";
    
    switch (resultState) {
      case 'success':
        return `${baseClasses} border-red-500 bg-red-50/30 shadow-md animate-pulse-once`;
      case 'no-results':
        return `${baseClasses} border-amber-400 bg-amber-50/30`;
      default:
        return `${baseClasses} border-blue-light`;
    }
  };

  const getHeaderClasses = () => {
    const baseClasses = "text-xl font-semibold transition-colors duration-300";
    
    switch (resultState) {
      case 'success':
        return `${baseClasses} text-red-600`;
      case 'no-results':
        return `${baseClasses} text-amber-700`;
      default:
        return `${baseClasses} text-blue-dark`;
    }
  };

  const getResultIcon = () => {
    switch (resultState) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-red-500" />;
      case 'no-results':
        return <Search className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {getResultIcon()}
          <div className="flex items-center gap-2">
            <h3 className={getHeaderClasses()}>
              {filteredCount} {filteredCount === 1 ? 'Clinic' : 'Clinics'} Found
            </h3>
            {filteredCount !== totalCount && (
              <span className="text-sm text-neutral-gray">
                (out of {totalCount} total)
              </span>
            )}
          </div>
          {resultState === 'success' && (
            <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs animate-fade-in">
              Filtered
            </Badge>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-neutral-gray">Filtered by:</span>
            {filterSummary.map((filter, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-blue-primary/10 text-blue-primary text-xs"
              >
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {filteredCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Stethoscope className="h-4 w-4 text-blue-primary mb-1" />
              <span className="text-xs text-neutral-gray">Treatment Services</span>
              <span className="text-sm font-medium text-blue-dark">
                {selectedTreatments.length || 'All'}
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <MapPin className="h-4 w-4 text-blue-primary mb-1" />
              <span className="text-xs text-neutral-gray">Locations</span>
              <span className="text-sm font-medium text-blue-dark">
                {selectedTownships.length || 'All Areas'}
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <Star className="h-4 w-4 text-blue-primary mb-1" />
              <span className="text-xs text-neutral-gray">Min Rating</span>
              <span className="text-sm font-medium text-blue-dark">
                {ratingFilter > 0 ? `${ratingFilter}+` : 'Any'}
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <Shield className="h-4 w-4 text-blue-primary mb-1" />
              <span className="text-xs text-neutral-gray">License Status</span>
              <span className="text-sm font-medium text-blue-dark">
                {mdaLicenseFilter === 'verified' ? 'Verified' : 
                 mdaLicenseFilter === 'pending' ? 'Pending' : 'All'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsCount;
