
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { treatmentOptions } from '../utils/clinicConstants';

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
  onSortChange
}: ClinicMainFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Treatment Needed */}
      <div>
        <label className="block text-sm font-medium text-blue-dark mb-2">Treatment Needed</label>
        <Select 
          value={selectedTreatments.length > 0 ? selectedTreatments[0] : "all"} 
          onValueChange={(value) => {
            if (value === "all") {
              onTreatmentChange([]);
            } else {
              onTreatmentChange([value]);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Treatments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Treatments</SelectItem>
            {treatmentOptions.map((treatment) => (
              <SelectItem key={treatment.key} value={treatment.key}>
                {treatment.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-sm font-medium text-blue-dark mb-2">Minimum Rating</label>
        <Select value={ratingFilter.toString()} onValueChange={(value) => onRatingChange(Number(value))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Rating</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
            <SelectItem value="4.8">4.8+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Township */}
      <div>
        <label className="block text-sm font-medium text-blue-dark mb-2">Township</label>
        <Select 
          value={selectedTownships.length > 0 ? selectedTownships[0] : "all"} 
          onValueChange={(value) => {
            if (value === "all") {
              onTownshipChange([]);
            } else {
              onTownshipChange([value]);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Townships" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Townships</SelectItem>
            {townships.map((township) => (
              <SelectItem key={township} value={township}>
                {township}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-blue-dark mb-2">Sort By</label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance from CIQ</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClinicMainFilters;
