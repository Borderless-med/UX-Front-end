
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Shield } from 'lucide-react';

interface BasicFiltersProps {
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

const BasicFilters = ({
  ratingFilter,
  onRatingChange,
  selectedTownships,
  onTownshipChange,
  townships,
  sortBy,
  onSortChange,
  mdaLicenseFilter,
  onMdaLicenseFilterChange
}: BasicFiltersProps) => {
  const handleTownshipChange = (value: string) => {
    if (value === 'all') {
      onTownshipChange([]);
    } else {
      onTownshipChange([value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Filters Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sidebar-foreground">Main Filters</h3>
        
        {/* Location Filter - Most Important */}
        <div>
          <label className="block text-base font-medium text-sidebar-foreground mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </label>
          <Select 
            value={selectedTownships.length === 1 ? selectedTownships[0] : 'all'} 
            onValueChange={handleTownshipChange}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Any Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Location</SelectItem>
              {townships.map(township => (
                <SelectItem key={township} value={township}>{township}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-base font-medium text-sidebar-foreground mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Minimum Google Rating
          </label>
          <Select value={ratingFilter.toString()} onValueChange={(value) => onRatingChange(Number(value))}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any Rating</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Secondary Filters Section */}
      <div className="pt-4 border-t border-sidebar-border">
        <h4 className="text-base font-medium text-sidebar-muted-foreground mb-4">Additional Filters</h4>
        <div className="space-y-4">
          {/* License Status Filter */}
          <div>
            <label className="block text-base font-medium text-sidebar-foreground mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              License Status
            </label>
            <Select value={mdaLicenseFilter} onValueChange={onMdaLicenseFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="verified">Verified License</SelectItem>
                <SelectItem value="pending">Pending Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-base font-medium text-sidebar-foreground mb-2">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance from CIQ</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Reviews Count</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicFilters;
