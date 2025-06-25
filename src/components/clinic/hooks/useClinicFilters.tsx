
import { useState } from 'react';

export const useClinicFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedTownships, setSelectedTownships] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [distanceRange, setDistanceRange] = useState<number[]>([0, 110]);
  const [maxDistance, setMaxDistance] = useState<number>(110);
  const [minReviews, setMinReviews] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('distance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  const handleTreatmentChange = (treatment: string, checked: boolean) => {
    if (checked) {
      setSelectedTreatments([...selectedTreatments, treatment]);
    } else {
      setSelectedTreatments(selectedTreatments.filter(t => t !== treatment));
    }
  };

  const handleTownshipChange = (township: string, checked: boolean) => {
    if (checked) {
      setSelectedTownships([...selectedTownships, township]);
    } else {
      setSelectedTownships(selectedTownships.filter(t => t !== township));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTreatments([]);
    setSelectedTownships([]);
    setRatingFilter(0);
    setDistanceRange([0, 110]);
    setMaxDistance(110);
    setMinReviews(0);
    setSortBy('distance');
  };

  const activeFiltersCount = selectedTreatments.length + selectedTownships.length + 
    (ratingFilter > 0 ? 1 : 0) + (maxDistance < 110 ? 1 : 0) + (minReviews > 0 ? 1 : 0);

  return {
    searchTerm,
    setSearchTerm,
    selectedTreatments,
    setSelectedTreatments,
    selectedTownships,
    setSelectedTownships,
    ratingFilter,
    setRatingFilter,
    distanceRange,
    setDistanceRange,
    maxDistance,
    setMaxDistance,
    minReviews,
    setMinReviews,
    sortBy,
    setSortBy,
    showAdvancedFilters,
    setShowAdvancedFilters,
    handleTreatmentChange,
    handleTownshipChange,
    clearAllFilters,
    activeFiltersCount
  };
};
