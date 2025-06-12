
export interface Clinic {
  name: string;
  address: string;
  dentist: string;
  qualifications: string;
  googleRating: number | null;
  reviews: number | null;
  distance: number;
  sentiment: number;
  mdaLicense: string;
  professionalCredentials: string;
  procedures: {
    toothFilling: boolean;
    rootCanal: boolean;
    dentalCrown: boolean;
    dentalImplant: boolean;
    teethWhitening: boolean;
    braces: boolean;
    wisdomToothRemoval: boolean;
    gumTreatment: boolean;
    compositeVeneers: boolean;
    porcelainVeneers: boolean;
    dentalBonding: boolean;
    inlaysOnlays: boolean;
    enamelShaping: boolean;
    gingivectomy: boolean;
    boneGrafting: boolean;
    sinusLift: boolean;
    frenectomy: boolean;
    tmjTreatment: boolean;
    sleepApneaAppliances: boolean;
    crownLengthening: boolean;
    oralCancerScreening: boolean;
    alveoplasty: boolean;
  };
}

export interface ProcedureFilter {
  id: keyof Clinic['procedures'];
  label: string;
  category: 'basic' | 'cosmetic' | 'surgical' | 'specialized';
}
