
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '@/types/clinic';

export const useSupabaseClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clinics_data')
          .select('*')
          .order('distance', { ascending: true });

        if (error) {
          throw error;
        }

        // Transform database data to match Clinic interface
        const transformedClinics: Clinic[] = (data || []).map((clinic) => ({
          id: clinic.id,
          name: clinic.name || '',
          address: clinic.address || '',
          dentist: clinic.dentist || '',
          rating: clinic.rating || 0,
          reviews: clinic.reviews || 0,
          distance: clinic.distance || 0,
          sentiment: clinic.sentiment || 0,
          mdaLicense: clinic.mda_license || '',
          credentials: clinic.credentials || '',
          township: clinic.township || '',
          websiteUrl: clinic.website_url || '',
          treatments: {
            toothFilling: clinic.tooth_filling || false,
            rootCanal: clinic.root_canal || false,
            dentalCrown: clinic.dental_crown || false,
            dentalImplant: clinic.dental_implant || false,
            teethWhitening: clinic.teeth_whitening || false,
            braces: clinic.braces || false,
            wisdomTooth: clinic.wisdom_tooth || false,
            gumTreatment: clinic.gum_treatment || false,
            compositeVeneers: clinic.composite_veneers || false,
            porcelainVeneers: clinic.porcelain_veneers || false,
            dentalBonding: clinic.dental_bonding || false,
            inlaysOnlays: clinic.inlays_onlays || false,
            enamelShaping: clinic.enamel_shaping || false,
            gingivectomy: clinic.gingivectomy || false,
            boneGrafting: clinic.bone_grafting || false,
            sinusLift: clinic.sinus_lift || false,
            frenectomy: clinic.frenectomy || false,
            tmjTreatment: clinic.tmj_treatment || false,
            sleepApneaAppliances: clinic.sleep_apnea_appliances || false,
            crownLengthening: clinic.crown_lengthening || false,
            oralCancerScreening: clinic.oral_cancer_screening || false,
            alveoplasty: clinic.alveoplasty || false,
          }
        }));

        setClinics(transformedClinics);
      } catch (err) {
        console.error('Error fetching clinics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch clinics');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  return { clinics, loading, error };
};
