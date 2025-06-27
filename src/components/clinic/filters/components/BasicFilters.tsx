
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-blue-dark mb-2 flex items-center">
          <Star className="h-4 w-4 mr-1" />
          Minimum Google Rating
        </label>
        <Select value={ratingFilter.toString()} onValueChange={(value) => onRatingChange(Number(value))}>
          <SelectTrigger>
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

      {/* Township Filter */}
      <div>
        <label className="block text-sm font-medium text-blue-dark mb-2 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          Location
        </label>
        <Select 
          value={selectedTownships.length === 1 ? selectedTownships[0] : 'all'} 
          onValueChange={handleTownshipChange}
        >
          <SelectTrigger>
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

      {/* MDA License Filter */}
      <div>
        <label className="block text-sm font-medium text-blue-dark mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-1" />
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
        <label className="block text-sm font-medium text-blue-dark mb-2">
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
  );
};

export default BasicFilters;
