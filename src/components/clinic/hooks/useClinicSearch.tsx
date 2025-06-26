
import { useMemo } from 'react';
import { Clinic } from '@/types/clinic';
import { filterClinics, sortClinics } from '../utils/clinicFilterUtils';

interface UseClinicSearchProps {
  clinics: Clinic[];
  searchTerm: string;
  selectedTreatments: string[];
  selectedTownships: string[];
  ratingFilter: number;
  maxDistance: number;
  minReviews: number;
  sortBy: string;
  mdaLicenseFilter: string;
}

export const useClinicSearch = ({
  clinics,
  searchTerm,
  selectedTreatments,
  selectedTownships,
  ratingFilter,
  maxDistance,
  minReviews,
  sortBy,
  mdaLicenseFilter
}: UseClinicSearchProps) => {
  const filteredAndSortedClinics = useMemo(() => {
    const filtered = filterClinics(
      clinics,
      searchTerm,
      selectedTreatments,
      selectedTownships,
      ratingFilter,
      maxDistance,
      minReviews,
      mdaLicenseFilter
    );
    
    return sortClinics(filtered, sortBy);
  }, [
    clinics,
    searchTerm,
    selectedTreatments,
    selectedTownships,
    ratingFilter,
    maxDistance,
    minReviews,
    sortBy,
    mdaLicenseFilter
  ]);

  return { filteredAndSortedClinics };
};
