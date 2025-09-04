import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '@/types/clinic';

// Build verification: v2.1 - Force clean rebuild and cache invalidation

interface UseClinicsDataEdgeReturn {
  clinics: Clinic[];
  loading: boolean;
  error: string | null;
}

export const useClinicsDataEdge = (): UseClinicsDataEdgeReturn => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinicsFromEdge = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔧 Simple edge function call at:', new Date().toISOString());
        
        const { data, error: functionError } = await supabase.functions.invoke('get-clinics-data');

        console.log('📊 Response received:', { 
          hasData: !!data, 
          hasError: !!functionError,
          dataType: typeof data 
        });

        if (functionError) {
          console.error('❌ Function error:', functionError);
          throw new Error(`Function failed: ${functionError.message || 'Unknown error'}`);
        }

        if (!data) {
          throw new Error('No data received');
        }

        // Get clinics array from response
        const clinicsArray = data.clinics || data;
        
        if (!Array.isArray(clinicsArray)) {
          console.error('❌ Invalid data structure:', data);
          throw new Error('Invalid response format');
        }

        console.log(`✅ Processing ${clinicsArray.length} clinics`);

        // Transform the data to match Clinic interface
        const transformedClinics: Clinic[] = clinicsArray.map((clinic: any) => ({
          id: clinic.id,
          name: clinic.name || 'Unknown Clinic',
          address: clinic.address || '',
          dentist: clinic.dentist || 'Not specified',
          rating: parseFloat(clinic.rating) || 0,
          reviews: parseInt(clinic.reviews) || 0,
          distance: parseFloat(clinic.distance) || 0,
          sentiment: parseFloat(clinic.sentiment) || 0,
          mdaLicense: clinic.mda_license || '',
          credentials: clinic.credentials || '',
          township: clinic.township || '',
          websiteUrl: clinic.website_url || '',
          googleReviewUrl: clinic.google_review_url || '',
          operatingHours: clinic.operating_hours || '',
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
        
      } catch (err: any) {
        console.error('❌ Clinic fetch failed:', err);
        if (err.name === 'AbortError') {
          setError('Request timeout - please try again');
        } else {
          setError(err.message || 'Failed to load clinics');
        }
        setClinics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicsFromEdge();
  }, []);

  return { clinics, loading, error };
};