
export interface Clinic {
  id: number;
  name: string;
  address: string;
  dentist: string;
  rating: number;
  reviews: number;
  distance: number;
  sentiment: number;
  mdaLicense: string;
  credentials: string;
  treatments: {
    toothFilling: boolean;
    rootCanal: boolean;
    dentalCrown: boolean;
    dentalImplant: boolean;
    teethWhitening: boolean;
    braces: boolean;
    wisdomTooth: boolean;
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
