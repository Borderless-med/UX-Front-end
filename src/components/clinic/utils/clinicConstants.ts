
// Treatment categories and labels for the clinic directory
// These are the most common essential services that almost all clinics offer
export const basicServices = [
  'dentalCheckup',
  'dentalCleaning',
  'toothFilling',
  'simpleExtraction',
  'wisdomTooth',
  'dentalXrays',
  'fluorideTreatment',
  'dentalSealants',
  'emergencyCare',
  'gumTreatment',
  'rootCanal',
  'dentalCrown'
];

export const specialServicesLabels = {
  // Essential/Basic treatments (12 essential services)
  dentalCheckup: 'Dental Checkup/Examination',
  dentalCleaning: 'Dental Cleaning (Scaling & Polishing)',
  toothFilling: 'Tooth Filling',
  simpleExtraction: 'Simple Tooth Extraction',
  wisdomTooth: 'Wisdom Tooth Extraction',
  dentalXrays: 'Dental X-rays',
  fluorideTreatment: 'Fluoride Treatment',
  dentalSealants: 'Dental Sealants',
  emergencyCare: 'Emergency Dental Care',
  gumTreatment: 'Gum Treatment',
  rootCanal: 'Root Canal',
  dentalCrown: 'Dental Crown',
  
  // Additional common treatments
  dentalImplant: 'Dental Implant',
  teethWhitening: 'Teeth Whitening',
  braces: 'Braces/Orthodontics',
  
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
      // All 12 essential services
      'dentalCheckup',
      'dentalCleaning',
      'toothFilling',
      'simpleExtraction',
      'wisdomTooth',
      'dentalXrays',
      'fluorideTreatment',
      'dentalSealants',
      'emergencyCare',
      'gumTreatment',
      'rootCanal',
      'dentalCrown',
      // Additional common
      'teethWhitening'
    ]
  },
  restorative: {
    label: 'Restorative',
    treatments: [
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

// Common townships from the imported data for reference
export const commonTownships = [
  'Taman Kebun Teh',
  'Pasir Gudang',
  'Skudai',
  'Taman Molek',
  'Taman Bukit Indah',
  'Tanjung Puteri',
  'Taman Sentosa',
  'Taman Pelangi',
  'Bandar Dato Onn',
  'Taman Mount Austin',
  'Bandar Baru Uda',
  'Taman Ungku Tun Aminah',
  'Adda Heights',
  'Bandar Johor Bahru',
  'Taman Universiti',
  'Taman Nusa Bestari',
  'Larkin',
  'Gelang Patah',
  'Taman Nusantara',
  'Taman Kota Masai',
  'Taman Sri Tebrau',
  'Taman Damansara Aliff',
  'Taman Abad',
  'Taman Setia Tropika',
  'Bandar Baru Permas Jaya',
  'Kota Southkey',
  'Taman Perling',
  'Taman Sutera Utama',
  'Taman Century',
  'Taman Daya',
  'Taman Johor Jaya',
  'Kebun Teh',
  'Taman Setia Indah',
  'Taman Nusa Bestari Jaya',
  'Mutiara Rini',
  'Taman Impian Emas',
  'Bandar Baru Seri Alam',
  'Century Garden',
  'Kulai Besar',
  'Taman Kulai Besar',
  'Taman Bukit Tiram',
  'Taman Gaya',
  'Taman Desa Cemerlang',
  'Taman Tiram Baru',
  'Pekan Nanas',
  'Pontian',
  'Batu Pahat',
  'Shah Alam',
  'Bandar Indahpura',
  'Taman Eko Botani',
  'Horizon Hills',
  'Ulu Tiram',
  'Bandar Putra Kulai',
  'Indahpura',
  'Taman Kulai',
  'Iskandar Puteri'
];
