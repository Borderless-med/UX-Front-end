
import { Clinic } from '@/types/clinic';
import { basicServices, specialServicesLabels, treatmentCategories } from './clinicConstants';

export const filterClinics = (
  clinics: Clinic[],
  searchTerm: string,
  selectedTreatments: string[],
  selectedTownships: string[],
  ratingFilter: number,
  maxDistance: number,
  minReviews: number,
  mdaLicenseFilter: string
) => {
  return clinics.filter(clinic => {
    // Text search
    const matchesSearch = 
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.dentist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.township.toLowerCase().includes(searchTerm.toLowerCase());

    // Treatment filter - clinic must have ALL selected treatments
    const matchesTreatments = selectedTreatments.length === 0 || 
      selectedTreatments.every(treatment => 
        clinic.treatments[treatment as keyof typeof clinic.treatments]
      );

    // Township filter
    const matchesTownship = selectedTownships.length === 0 || 
      selectedTownships.includes(clinic.township);

    // Google rating filter
    const matchesRating = clinic.rating >= ratingFilter;

    // Distance filter - handle null distances by treating them as "always included"
    const matchesDistance = clinic.distance === null || clinic.distance === undefined || clinic.distance <= maxDistance;

    // Google reviews filter
    const matchesReviews = clinic.reviews >= minReviews;

    // MDA License filter
    const matchesMdaLicense = (() => {
      if (mdaLicenseFilter === 'all') return true;
      
      const hasValidLicense = clinic.mdaLicense && 
        !clinic.mdaLicense.toLowerCase().includes('pending') && 
        !clinic.mdaLicense.toLowerCase().includes('not available') &&
        clinic.mdaLicense.trim() !== '';
      
      if (mdaLicenseFilter === 'verified') return hasValidLicense;
      if (mdaLicenseFilter === 'pending') return !hasValidLicense;
      
      return true;
    })();

    return matchesSearch && matchesTreatments && matchesTownship && matchesRating && matchesDistance && matchesReviews && matchesMdaLicense;
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

export const getAvailableCategories = (clinic: Clinic) => {
  const availableCategories = [];
  
  // Always include Basic Treatment as the first category
  availableCategories.push('Basic Treatment');
  
  // Check each category to see if clinic offers any treatments in that category
  Object.entries(treatmentCategories).forEach(([categoryKey, category]) => {
    // Skip basic category since we already added it
    if (categoryKey === 'basic') return;
    
    const hasAnyTreatmentInCategory = category.treatments.some(treatment => 
      clinic.treatments[treatment as keyof typeof clinic.treatments]
    );
    
    if (hasAnyTreatmentInCategory) {
      availableCategories.push(category.label);
    }
  });
  
  return availableCategories;
};

export const getSpecialties = (clinic: Clinic) => {
  const specialties = [];
  
  // Check for major specialties based on advanced treatments
  if (clinic.treatments.dentalImplant || clinic.treatments.boneGrafting || clinic.treatments.sinusLift) {
    specialties.push('Implant Dentistry');
  }
  
  if (clinic.treatments.braces) {
    specialties.push('Orthodontics');
  }
  
  if (clinic.treatments.rootCanal) {
    specialties.push('Endodontics');
  }
  
  if (clinic.treatments.porcelainVeneers || clinic.treatments.compositeVeneers || clinic.treatments.teethWhitening) {
    specialties.push('Cosmetic Dentistry');
  }
  
  if (clinic.treatments.gumTreatment || clinic.treatments.gingivectomy) {
    specialties.push('Periodontics');
  }
  
  if (clinic.treatments.tmjTreatment || clinic.treatments.sleepApneaAppliances) {
    specialties.push('TMJ/Sleep Therapy');
  }
  
  return specialties.slice(0, 2); // Show max 2 main specialties
};

export const getSpecialServices = (clinic: Clinic) => {
  const specialServices = [];
  
  // Check each treatment, excluding basic services
  Object.entries(clinic.treatments).forEach(([key, value]) => {
    if (value && !basicServices.includes(key) && specialServicesLabels[key as keyof typeof specialServicesLabels]) {
      specialServices.push(specialServicesLabels[key as keyof typeof specialServicesLabels]);
    }
  });
  
  return specialServices.slice(0, 6); // Show max 6 special services
};

export const getUniqueTownships = (clinics: Clinic[]) => {
  return [...new Set(clinics.map(clinic => clinic.township))].sort();
};

export const getTreatmentsByCategory = (clinic: Clinic) => {
  const categorizedTreatments: Record<string, string[]> = {};
  
  Object.entries(treatmentCategories).forEach(([categoryKey, category]) => {
    const categoryTreatments = category.treatments.filter(treatment => 
      clinic.treatments[treatment as keyof typeof clinic.treatments]
    ).map(treatment => specialServicesLabels[treatment as keyof typeof specialServicesLabels]);
    
    if (categoryTreatments.length > 0) {
      categorizedTreatments[category.label] = categoryTreatments;
    }
  });
  
  return categorizedTreatments;
};
