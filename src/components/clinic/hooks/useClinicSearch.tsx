
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
  selectedCredentials: string[];
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
  mdaLicenseFilter,
  selectedCredentials
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
      mdaLicenseFilter,
      selectedCredentials
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
    mdaLicenseFilter,
    selectedCredentials
  ]);

  return { filteredAndSortedClinics };
};
