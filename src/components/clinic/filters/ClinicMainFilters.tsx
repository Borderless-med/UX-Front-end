
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Star, Award } from 'lucide-react';
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
  const [treatmentInput, setTreatmentInput] = useState('');
  const [townshipInput, setTownshipInput] = useState('');

  const handleTreatmentSelect = (treatmentKey: string) => {
    if (!selectedTreatments.includes(treatmentKey)) {
      onTreatmentChange([...selectedTreatments, treatmentKey]);
    }
    setTreatmentInput('');
  };

  const handleTreatmentRemove = (treatmentKey: string) => {
    onTreatmentChange(selectedTreatments.filter(t => t !== treatmentKey));
  };

  const handleTownshipSelect = (township: string) => {
    if (!selectedTownships.includes(township)) {
      onTownshipChange([...selectedTownships, township]);
    }
    setTownshipInput('');
  };

  const handleTownshipRemove = (township: string) => {
    onTownshipChange(selectedTownships.filter(t => t !== township));
  };

  const filteredTreatments = treatmentOptions.filter(
    treatment => 
      treatment.label.toLowerCase().includes(treatmentInput.toLowerCase()) &&
      !selectedTreatments.includes(treatment.key)
  );

  const filteredTownships = townships.filter(
    township => 
      township.toLowerCase().includes(townshipInput.toLowerCase()) &&
      !selectedTownships.includes(township)
  );

  return (
    <div className="space-y-6">
      {/* Treatments Filter */}
      <div>
        <Label className="text-sm font-medium text-blue-dark mb-2 block">
          Filter by Treatments
        </Label>
        <div className="space-y-2">
          <Input
            placeholder="Search treatments..."
            value={treatmentInput}
            onChange={(e) => setTreatmentInput(e.target.value)}
            className="border-blue-light focus:border-blue-primary"
          />
          {treatmentInput && filteredTreatments.length > 0 && (
            <div className="border border-blue-light rounded-md bg-white shadow-sm max-h-40 overflow-y-auto">
              {filteredTreatments.slice(0, 5).map((treatment) => (
                <button
                  key={treatment.key}
                  onClick={() => handleTreatmentSelect(treatment.key)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-light/20 text-sm"
                >
                  {treatment.label}
                </button>
              ))}
            </div>
          )}
          {selectedTreatments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTreatments.map((treatmentKey) => {
                const treatment = treatmentOptions.find(t => t.key === treatmentKey);
                return (
                  <Badge key={treatmentKey} variant="secondary" className="bg-blue-light/20 text-blue-primary">
                    {treatment?.label}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleTreatmentRemove(treatmentKey)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Location and Rating Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Township Filter */}
        <div>
          <Label className="text-sm font-medium text-blue-dark mb-2 block">
            Filter by Township
          </Label>
          <div className="space-y-2">
            <Input
              placeholder="Search townships..."
              value={townshipInput}
              onChange={(e) => setTownshipInput(e.target.value)}
              className="border-blue-light focus:border-blue-primary"
            />
            {townshipInput && filteredTownships.length > 0 && (
              <div className="border border-blue-light rounded-md bg-white shadow-sm max-h-32 overflow-y-auto">
                {filteredTownships.slice(0, 5).map((township) => (
                  <button
                    key={township}
                    onClick={() => handleTownshipSelect(township)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-light/20 text-sm"
                  >
                    {township}
                  </button>
                ))}
              </div>
            )}
            {selectedTownships.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedTownships.map((township) => (
                  <Badge key={township} variant="secondary" className="bg-blue-light/20 text-blue-primary">
                    {township}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleTownshipRemove(township)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <Label className="text-sm font-medium text-blue-dark mb-2 block flex items-center gap-1">
            <Star className="h-4 w-4" />
            Minimum Rating
          </Label>
          <Select value={ratingFilter.toString()} onValueChange={(value) => onRatingChange(Number(value))}>
            <SelectTrigger className="border-blue-light focus:border-blue-primary">
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

        {/* MDA License Filter */}
        <div>
          <Label className="text-sm font-medium text-blue-dark mb-2 block flex items-center gap-1">
            <Award className="h-4 w-4" />
            MDA License Status
          </Label>
          <Select value={mdaLicenseFilter} onValueChange={onMdaLicenseFilterChange}>
            <SelectTrigger className="border-blue-light focus:border-blue-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clinics</SelectItem>
              <SelectItem value="verified">Verified MDA License</SelectItem>
              <SelectItem value="pending">Pending Verification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <Label className="text-sm font-medium text-blue-dark mb-2 block">
          Sort Results
        </Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="border-blue-light focus:border-blue-primary max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance (Nearest First)</SelectItem>
            <SelectItem value="rating">Rating (Highest First)</SelectItem>
            <SelectItem value="reviews">Reviews (Most First)</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClinicMainFilters;
