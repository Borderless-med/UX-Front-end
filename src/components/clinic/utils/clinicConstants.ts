
// Treatment categories and labels for the clinic directory
export const basicServices = [
  'toothFilling',
  'dentalCrown', 
  'teethWhitening',
  'wisdomTooth'
];

export const specialServicesLabels = {
  // Basic treatments
  toothFilling: 'Tooth Filling',
  rootCanal: 'Root Canal',
  dentalCrown: 'Dental Crown',
  dentalImplant: 'Dental Implant',
  teethWhitening: 'Teeth Whitening',
  braces: 'Braces/Orthodontics',
  wisdomTooth: 'Wisdom Tooth Extraction',
  gumTreatment: 'Gum Treatment',
  
  // Cosmetic treatments
  compositeVeneers: 'Composite Veneers',
  porcelainVeneers: 'Porcelain Veneers',
  dentalBonding: 'Dental Bonding',
  enamelShaping: 'Enamel Shaping',
  
  // Advanced treatments
  inlaysOnlays: 'Inlays/Onlays',
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

export const treatmentCategories = {
  basic: {
    label: 'Basic Treatments',
    treatments: [
      'toothFilling',
      'dentalCrown',
      'teethWhitening',
      'wisdomTooth',
      'gumTreatment'
    ]
  },
  restorative: {
    label: 'Restorative',
    treatments: [
      'rootCanal',
      'dentalImplant',
      'inlaysOnlays',
      'dentalBonding'
    ]
  },
  cosmetic: {
    label: 'Cosmetic',
    treatments: [
      'compositeVeneers',
      'porcelainVeneers',
      'enamelShaping'
    ]
  },
  orthodontic: {
    label: 'Orthodontic',
    treatments: [
      'braces'
    ]
  },
  surgical: {
    label: 'Surgical',
    treatments: [
      'gingivectomy',
      'boneGrafting',
      'sinusLift',
      'frenectomy',
      'crownLengthening',
      'alveoplasty'
    ]
  },
  specialized: {
    label: 'Specialized',
    treatments: [
      'tmjTreatment',
      'sleepApneaAppliances',
      'oralCancerScreening'
    ]
  }
};

export const allTreatments = Object.keys(specialServicesLabels);

// User category labels for authentication display
export const categoryLabels = {
  patient: 'Patient',
  dentist: 'Dental Professional',
  researcher: 'Researcher',
  student: 'Student',
  other: 'Other'
};

// Credential options for advanced filtering
export const credentialOptions = [
  { key: 'bds', label: 'BDS (Bachelor of Dental Surgery)' },
  { key: 'mds', label: 'MDS (Master of Dental Surgery)' },
  { key: 'fellowship', label: 'Fellowship' },
  { key: 'specialist', label: 'Specialist Registration' },
  { key: 'implantology', label: 'Implantology Certification' },
  { key: 'orthodontics', label: 'Orthodontics Specialization' },
  { key: 'endodontics', label: 'Endodontics Specialization' },
  { key: 'periodontics', label: 'Periodontics Specialization' }
];
