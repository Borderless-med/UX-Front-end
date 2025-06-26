
export const treatmentOptions = [
  { key: 'dentalImplant', label: 'Dental Implants' },
  { key: 'braces', label: 'Braces/Orthodontics' },
  { key: 'rootCanal', label: 'Root Canal' },
  { key: 'teethWhitening', label: 'Teeth Whitening' },
  { key: 'gumTreatment', label: 'Gum Treatment' },
  { key: 'wisdomTooth', label: 'Wisdom Tooth Extraction' },
  { key: 'dentalCrown', label: 'Dental Crown' },
  { key: 'toothFilling', label: 'Tooth Filling' },
  { key: 'compositeVeneers', label: 'Composite Veneers' },
  { key: 'porcelainVeneers', label: 'Porcelain Veneers' }
];

export const credentialOptions = [
  { key: 'mda', label: 'Licensed Practitioners' },
  { key: 'specialist', label: 'Specialist Qualifications' },
  { key: 'experience', label: '5+ Years Experience' }
];

export const categoryLabels = {
  patient: 'Patient Account',
  healthcare_professional: 'Healthcare Professional',
  clinic_admin: 'Clinic Administrator',
  approved_partner: 'Approved Partner'
};

// Define basic services that all clinics offer
export const basicServices = [
  'toothFilling',
  'rootCanal', 
  'dentalCrown',
  'teethWhitening',
  'braces',
  'wisdomTooth',
  'gumTreatment'
];

// Special services mapping with user-friendly labels
export const specialServicesLabels = {
  dentalImplant: 'Dental Implants',
  compositeVeneers: 'Composite Veneers',
  porcelainVeneers: 'Porcelain Veneers',
  dentalBonding: 'Dental Bonding',
  inlaysOnlays: 'Inlays/Onlays',
  enamelShaping: 'Enamel Shaping',
  gingivectomy: 'Gingivectomy',
  boneGrafting: 'Bone Grafting',
  sinusLift: 'Sinus Lift',
  frenectomy: 'Frenectomy',
  tmjTreatment: 'TMJ Treatment',
  sleepApneaAppliances: 'Sleep Apnea Appliances',
  crownLengthening: 'Crown Lengthening',
  oralCancerScreening: 'Oral Cancer Screening',
  alveoplasty: 'Alveoplasty'
};
