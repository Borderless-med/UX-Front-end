
import { useState } from 'react';

export const useClinicFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedTownships, setSelectedTownships] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [maxDistance, setMaxDistance] = useState(40);
  const [minReviews, setMinReviews] = useState(0);
  const [sortBy, setSortBy] = useState('distance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [mdaLicenseFilter, setMdaLicenseFilter] = useState('all');
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTreatments([]);
    setSelectedTownships([]);
    setRatingFilter(0);
    setMaxDistance(40);
    setMinReviews(0);
    setSortBy('distance');
    setMdaLicenseFilter('all');
    setSelectedCredentials([]);
  };

  const activeFiltersCount = 
    (searchTerm ? 1 : 0) +
    selectedTreatments.length +
    selectedTownships.length +
    (ratingFilter > 0 ? 1 : 0) +
    (maxDistance < 40 ? 1 : 0) +
    (minReviews > 0 ? 1 : 0) +
    (mdaLicenseFilter !== 'all' ? 1 : 0) +
    selectedCredentials.length;

  return {
    searchTerm,
    setSearchTerm,
    selectedTreatments,
    setSelectedTreatments,
    selectedTownships,
    setSelectedTownships,
    ratingFilter,
    setRatingFilter,
    maxDistance,
    setMaxDistance,
    minReviews,
    setMinReviews,
    sortBy,
    setSortBy,
    showAdvancedFilters,
    setShowAdvancedFilters,
    mdaLicenseFilter,
    setMdaLicenseFilter,
    selectedCredentials,
    setSelectedCredentials,
    clearAllFilters,
    activeFiltersCount
  };
};
