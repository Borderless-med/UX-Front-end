
// Treatment categories and labels for the clinic directory
// IMPORTANT: All keys must match properties in Clinic.treatments interface

// Basic services list - used to distinguish specialty services
export const basicServices = [
  'toothFilling',
  'rootCanal',
  'dentalCrown',
  'wisdomTooth',
  'gumTreatment',
  'teethWhitening'
];

export const specialServicesLabels = {
  // Basic treatments - matching Clinic.treatments properties
  toothFilling: 'Tooth Filling',
  rootCanal: 'Root Canal',
  dentalCrown: 'Dental Crown',
  wisdomTooth: 'Wisdom Tooth Extraction',
  gumTreatment: 'Gum Treatment',
  teethWhitening: 'Teeth Whitening',
  
  // Restorative treatments
  dentalImplant: 'Dental Implant',
  inlaysOnlays: 'Inlays/Onlays',
  dentalBonding: 'Dental Bonding',
  
  // Cosmetic treatments
  compositeVeneers: 'Composite Veneers',
  porcelainVeneers: 'Porcelain Veneers',
  enamelShaping: 'Enamel Shaping',
  
  // Orthodontic
  braces: 'Braces/Orthodontics',
  
  // Surgical treatments
  gingivectomy: 'Gingivectomy',
  boneGrafting: 'Bone Grafting',
  sinusLift: 'Sinus Lift',
  frenectomy: 'Frenectomy',
  crownLengthening: 'Crown Lengthening',
  alveoplasty: 'Alveoplasty',
  
  // Specialized treatments
  tmjTreatment: 'TMJ Treatment',
  sleepApneaAppliances: 'Sleep Apnea Appliances',
  oralCancerScreening: 'Oral Cancer Screening'
};

export const treatmentCategories = {
  basic: {
    label: 'Basic Treatments',
    treatments: [
      // Only treatments that exist in Clinic.treatments interface
      'toothFilling',
      'rootCanal',
      'dentalCrown',
      'wisdomTooth',
      'gumTreatment',
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
