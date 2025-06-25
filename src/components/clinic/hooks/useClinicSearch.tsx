
import { useMemo } from 'react';
import { filterClinics, sortClinics } from '../utils/clinicFilterUtils';

interface UseClinicSearchProps {
  searchTerm: string;
  selectedTreatments: string[];
  selectedTownships: string[];
  ratingFilter: number;
  maxDistance: number;
  minReviews: number;
  sortBy: string;
}

export const useClinicSearch = ({
  searchTerm,
  selectedTreatments,
  selectedTownships,
  ratingFilter,
  maxDistance,
  minReviews,
  sortBy
}: UseClinicSearchProps) => {
  const filteredAndSortedClinics = useMemo(() => {
    const filtered = filterClinics(
      searchTerm,
      selectedTreatments,
      selectedTownships,
      ratingFilter,
      maxDistance,
      minReviews
    );
    
    return sortClinics(filtered, sortBy);
  }, [searchTerm, selectedTreatments, selectedTownships, ratingFilter, maxDistance, minReviews, sortBy]);

  return { filteredAndSortedClinics };
};
