
import { Clinic } from '../../types/clinic';
import { townships, dentistNames, websiteUrls } from './constants';

export const generateRemainingClinics = (): Clinic[] => {
  const additionalClinics: Clinic[] = [];

  for (let i = 13; i <= 101; i++) {
    const townshipIndex = (i - 13) % townships.length;
    const dentistIndex = (i - 13) % dentistNames.length;
    const websiteUrlIndex = (i - 13);
    const distance = Math.round((Math.random() * 50 + 1) * 10) / 10;
    const rating = Math.round((Math.random() * 1 + 4) * 10) / 10;
    const reviews = Math.floor(Math.random() * 500);
    const sentiment = Math.round(Math.random() * 30 + 70);
    
    additionalClinics.push({
      id: i,
      name: `Klinik Pergigian ${townships[townshipIndex]} ${i}`,
      address: `${10 + i} Jalan ${townships[townshipIndex]} ${Math.floor(i/10)}/${i % 10}`,
      dentist: `${dentistNames[dentistIndex]} (BDS)`,
      rating: rating,
      reviews: reviews,
      distance: distance,
      sentiment: sentiment,
      mdaLicense: `MDC-${2020 + (i % 5)}-JHR-${String(i).padStart(3, '0')}`,
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      township: townships[townshipIndex],
      websiteUrl: websiteUrlIndex < websiteUrls.length ? websiteUrls[websiteUrlIndex] : null,
      treatments: {
        toothFilling: true,
        rootCanal: Math.random() > 0.2,
        dentalCrown: Math.random() > 0.3,
        dentalImplant: Math.random() > 0.5,
        teethWhitening: Math.random() > 0.1,
        braces: Math.random() > 0.4,
        wisdomTooth: Math.random() > 0.2,
        gumTreatment: Math.random() > 0.3,
        compositeVeneers: Math.random() > 0.6,
        porcelainVeneers: Math.random() > 0.7,
        dentalBonding: Math.random() > 0.5,
        inlaysOnlays: Math.random() > 0.8,
        enamelShaping: Math.random() > 0.7,
        gingivectomy: Math.random() > 0.8,
        boneGrafting: Math.random() > 0.9,
        sinusLift: Math.random() > 0.9,
        frenectomy: Math.random() > 0.8,
        tmjTreatment: Math.random() > 0.7,
        sleepApneaAppliances: Math.random() > 0.9,
        crownLengthening: Math.random() > 0.8,
        oralCancerScreening: Math.random() > 0.4,
        alveoplasty: Math.random() > 0.9
      }
    });
  }
  
  return additionalClinics;
};
