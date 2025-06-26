
export interface Clinic {
  id: number;
  name: string;
  address: string;
  dentist: string;
  /** Google rating from 0-5 stars */
  rating: number;
  /** Number of Google reviews */
  reviews: number;
  distance: number;
  sentiment: number;
  mdaLicense: string;
  credentials: string;
  township: string;
  websiteUrl?: string;
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
