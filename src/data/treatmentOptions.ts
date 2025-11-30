// Treatment options extracted from proceduresData.ts for appointment booking
export const treatmentOptions = [
  // Essential/Routine treatments (12 - most common)
  'Dental Checkup/Examination',
  'Dental Cleaning (Scaling & Polishing)',
  'Tooth Filling',
  'Simple Tooth Extraction',
  'Wisdom Tooth Extraction',
  'Dental X-rays',
  'Fluoride Treatment',
  'Dental Sealants',
  'Emergency Dental Care',
  'Gum Treatment',
  'Root Canal',
  'Dental Crown',
  
  // Restorative treatments (5)
  'Dental Implant',
  'Dental Bridge',
  'Dentures',
  'Inlays/Onlays',
  'Dental Bonding',
  
  // Cosmetic treatments (4)
  'Teeth Whitening',
  'Composite Veneers',
  'Porcelain Veneers',
  'Enamel Shaping',
  
  // Orthodontic treatments (2)
  'Orthodontic Braces',
  'Invisalign/Clear Aligners',
  
  // Specialized treatments (3)
  'TMJ Treatment',
  'Sleep Apnea Appliances',
  'Bone Grafting',
  
  // Surgical treatments (6)
  'Gingivectomy',
  'Sinus Lift',
  'Frenectomy',
  'Crown Lengthening',
  'Oral Cancer Screening',
  'Alveoplasty',
] as const;

export type TreatmentType = typeof treatmentOptions[number];

// Treatment categories for organized dropdown display
export const treatmentCategories = {
  essential: {
    label: 'Essential & Routine',
    treatments: [
      'Dental Checkup/Examination',
      'Dental Cleaning (Scaling & Polishing)',
      'Tooth Filling',
      'Simple Tooth Extraction',
      'Wisdom Tooth Extraction',
      'Dental X-rays',
      'Fluoride Treatment',
      'Dental Sealants',
      'Emergency Dental Care',
      'Gum Treatment',
      'Root Canal',
      'Dental Crown',
    ] as const
  },
  restorative: {
    label: 'Restorative',
    treatments: [
      'Dental Implant',
      'Dental Bridge',
      'Dentures',
      'Inlays/Onlays',
      'Dental Bonding',
    ] as const
  },
  cosmetic: {
    label: 'Cosmetic',
    treatments: [
      'Teeth Whitening',
      'Composite Veneers',
      'Porcelain Veneers',
      'Enamel Shaping',
    ] as const
  },
  orthodontic: {
    label: 'Orthodontic',
    treatments: [
      'Orthodontic Braces',
      'Invisalign/Clear Aligners',
    ] as const
  },
  specialized: {
    label: 'Specialized',
    treatments: [
      'TMJ Treatment',
      'Sleep Apnea Appliances',
      'Bone Grafting',
    ] as const
  },
  surgical: {
    label: 'Surgical',
    treatments: [
      'Gingivectomy',
      'Sinus Lift',
      'Frenectomy',
      'Crown Lengthening',
      'Oral Cancer Screening',
      'Alveoplasty',
    ] as const
  }
} as const;