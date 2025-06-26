
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

        {/* Minimum Google Rating */}
        <div>
          <label className="block text-sm font-medium text-blue-dark mb-2">Minimum Google Rating</label>
          <Select value={ratingFilter.toString()} onValueChange={(value) => onRatingChange(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any Google Rating</SelectItem>
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
              <SelectItem value="rating">Highest Google Rating</SelectItem>
              <SelectItem value="reviews">Most Google Reviews</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Basic Services Notice - Positioned after treatment filter for context */}
      <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Basic Services Available at All Clinics</p>
            <p className="text-xs text-gray-600">
              Generally, all clinics offer basic services such as <strong>Tooth Filling, Root Canal, Crown, Whitening, Braces, Wisdom Tooth Removal, and Gum Treatment</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicMainFilters;
