
import { Clinic } from '../../types/clinic';
import { baseClinicData } from './baseClinicData';
import { generateRemainingClinics } from './clinicGenerator';

// Create the complete clinics array
export const clinics: Clinic[] = [
  ...baseClinicData,
  ...generateRemainingClinics()
];
