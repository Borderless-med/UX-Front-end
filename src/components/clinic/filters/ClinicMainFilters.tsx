
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Star, MapPin, Shield, X, ChevronDown } from 'lucide-react';
import { treatmentCategories, specialServicesLabels } from '../utils/clinicConstants';

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
  const toggleTreatment = (treatment: string) => {
    const newTreatments = selectedTreatments.includes(treatment)
      ? selectedTreatments.filter(t => t !== treatment)
      : [...selectedTreatments, treatment];
    onTreatmentChange(newTreatments);
  };

  const removeTreatment = (treatment: string) => {
    onTreatmentChange(selectedTreatments.filter(t => t !== treatment));
  };

  const handleTownshipChange = (value: string) => {
    if (value === 'all') {
      onTownshipChange([]);
    } else {
      onTownshipChange([value]);
    }
  };

  const getCategoryActiveCount = (categoryKey: string) => {
    const category = treatmentCategories[categoryKey as keyof typeof treatmentCategories];
    return category.treatments.filter(treatment => selectedTreatments.includes(treatment)).length;
  };

  return (
    <div className="space-y-6">
      {/* Treatment Filters */}
      <div>
        <h4 className="text-sm font-medium text-blue-dark mb-3 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Treatment Services
        </h4>
        
        {/* Selected Treatments Display */}
        {selectedTreatments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {selectedTreatments.map(treatment => (
              <Badge 
                key={treatment} 
                variant="secondary" 
                className="bg-blue-primary/10 text-blue-primary hover:bg-blue-primary/20 cursor-pointer"
                onClick={() => removeTreatment(treatment)}
              >
                {specialServicesLabels[treatment as keyof typeof specialServicesLabels]}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}

        {/* Horizontal Treatment Category Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(treatmentCategories).map(([categoryKey, category]) => {
            const activeCount = getCategoryActiveCount(categoryKey);
            return (
              <DropdownMenu key={categoryKey}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-xs px-2 py-2 h-auto min-h-[2.5rem] relative"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{category.label}</span>
                      {activeCount > 0 && (
                        <span className="text-xs text-blue-primary">
                          {activeCount} selected
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 max-h-64 overflow-y-auto bg-white border shadow-lg z-50"
                  align="start"
                >
                  {category.treatments.map(treatment => (
                    <DropdownMenuItem
                      key={treatment}
                      className="flex items-center space-x-2 cursor-pointer p-2"
                      onSelect={(e) => {
                        e.preventDefault();
                        toggleTreatment(treatment);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTreatments.includes(treatment)}
                        onChange={() => toggleTreatment(treatment)}
                        className="rounded border-gray-300 text-blue-primary focus:ring-blue-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm text-neutral-gray">
                        {specialServicesLabels[treatment as keyof typeof specialServicesLabels]}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      </div>

      {/* Main Filter Row */}
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
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="reviews">Reviews Count</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ClinicMainFilters;
