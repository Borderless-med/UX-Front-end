
import { useMemo } from 'react';
import { filterClinics, sortClinics } from '../utils/clinicFilterUtils';
import { Clinic } from '@/types/clinic';

interface UseClinicSearchProps {
  clinics: Clinic[];
  searchTerm: string;
  selectedTreatments: string[];
  selectedTownships: string[];
  ratingFilter: number;
  maxDistance: number;
  minReviews: number;
  sortBy: string;
}

export const useClinicSearch = ({
  clinics,
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
      clinics,
      searchTerm,
      selectedTreatments,
      selectedTownships,
      ratingFilter,
      maxDistance,
      minReviews
    );
    
    return sortClinics(filtered, sortBy);
  }, [clinics, searchTerm, selectedTreatments, selectedTownships, ratingFilter, maxDistance, minReviews, sortBy]);

  return { filteredAndSortedClinics };
};
