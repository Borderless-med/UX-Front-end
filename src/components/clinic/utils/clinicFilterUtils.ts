
import { clinics } from '@/data/clinics';
import { Clinic } from '@/types/clinic';

export const filterClinics = (
  searchTerm: string,
  selectedTreatments: string[],
  selectedTownships: string[],
  ratingFilter: number,
  maxDistance: number,
  minReviews: number
) => {
  return clinics.filter(clinic => {
    // Text search
    const matchesSearch = 
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.township.toLowerCase().includes(searchTerm.toLowerCase());

    // Treatment filter
    const matchesTreatments = selectedTreatments.length === 0 || 
      selectedTreatments.some(treatment => 
        clinic.treatments[treatment as keyof typeof clinic.treatments]
      );

    // Township filter
    const matchesTownship = selectedTownships.length === 0 || 
      selectedTownships.includes(clinic.township);

    // Google rating filter
    const matchesRating = clinic.rating >= ratingFilter;

    // Distance filter
    const matchesDistance = clinic.distance <= maxDistance;

    // Google reviews filter
    const matchesReviews = clinic.reviews >= minReviews;

    return matchesSearch && matchesTreatments && matchesTownship && matchesRating && matchesDistance && matchesReviews;
  });
};

export const sortClinics = (clinics: Clinic[], sortBy: string) => {
  return [...clinics].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating; // Sort by Google rating (highest first)
      case 'distance':
        return a.distance - b.distance;
      case 'reviews':
        return b.reviews - a.reviews; // Sort by Google reviews count (most first)
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
};

export const getSpecialties = (clinic: Clinic) => {
  const specialties = [];
  if (clinic.treatments.dentalImplant) specialties.push('Dental Implants');
  if (clinic.treatments.braces) specialties.push('Orthodontics');
  if (clinic.treatments.rootCanal) specialties.push('Endodontics');
  if (clinic.treatments.teethWhitening) specialties.push('Cosmetic Dentistry');
  if (clinic.treatments.gumTreatment) specialties.push('Periodontics');
  return specialties.slice(0, 3); // Show max 3 specialties
};

export const getUniqueTownships = () => {
  return [...new Set(clinics.map(clinic => clinic.township))].sort();
};
