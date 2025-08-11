// Treatment options extracted from proceduresData.ts for appointment booking
export const treatmentOptions = [
  'Tooth Filling',
  'Root Canal', 
  'Dental Crown',
  'Dental Implant',
  'Teeth Whitening',
  'Orthodontic Braces',
  'Wisdom Tooth Extraction',
  'Composite Veneers',
  'Porcelain Veneers',
  'Dental Bonding',
  'TMJ Treatment'
] as const;

export type TreatmentType = typeof treatmentOptions[number];