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
        
        console.log('🔧 Using edge function strategy v2.1 at:', new Date().toISOString());
        
        // Set up timeout for edge function call
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => {
          timeoutController.abort();
        }, 15000);

        const { data, error: functionError } = await supabase.functions.invoke('get-clinics-data', {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        clearTimeout(timeoutId);

        // DEBUG: Log the actual response structure
        console.log('🔍 Raw edge function response:', {
          data,
          functionError,
          dataType: typeof data,
          dataKeys: data ? Object.keys(data) : 'null/undefined',
          hasClinics: data?.clinics ? 'yes' : 'no',
          clinicsType: typeof data?.clinics,
          clinicsLength: Array.isArray(data?.clinics) ? data.clinics.length : 'not array'
        });

        if (functionError) {
          console.error('Edge function error:', functionError);
          throw new Error(`Edge function failed: ${functionError.message}`);
        }

        if (!data) {
          throw new Error('No data received from edge function');
        }

        if (!data.clinics) {
          console.error('Missing clinics property in response:', data);
          throw new Error('Missing clinics property in edge function response');
        }

        if (!Array.isArray(data.clinics)) {
          console.error('Clinics is not an array:', data.clinics);
          throw new Error('Clinics data is not an array');
        }

        console.log(`✅ Edge function returned ${data.clinics.length} clinics`);

        // Transform the data to match Clinic interface
        const transformedClinics: Clinic[] = data.clinics.map((clinic: any) => ({
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