
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
        const start = performance.now();
        
        // Environment diagnostics
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        const isIframe = typeof window !== 'undefined' && window.self !== window.top;
        const isLovable = /lovable\.dev|sandbox\.lovable\.dev/.test(hostname);
        const timeoutMs = isIframe ? 12000 : 8000; // extend timeout when inside an iframe
        
        console.log('Fetching clinics from Supabase (optimized columns)...', {
          hostname,
          isIframe,
          isLovable,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
          timeoutMs,
        });

        // Log an example of the REST URL for diagnostics (not used for fetching)
        const debugColumns = 'id, name, address, dentist, rating, reviews, distance, sentiment, mda_license, credentials, township, website_url, google_review_url, operating_hours, tooth_filling, root_canal, dental_crown, dental_implant, teeth_whitening, braces, wisdom_tooth, gum_treatment, composite_veneers, porcelain_veneers, dental_bonding, inlays_onlays, enamel_shaping, gingivectomy, bone_grafting, sinus_lift, frenectomy, tmj_treatment, sleep_apnea_appliances, crown_lengthening, oral_cancer_screening, alveoplasty';
        const restUrlExample = `https://uzppuebjzqxeavgmwtvr.supabase.co/rest/v1/clinics_data?select=${encodeURIComponent(debugColumns)}&order=distance.asc`;
        console.log('Supabase REST example URL (debug):', restUrlExample);

        const supabaseQuery = () =>
          supabase
            .from('clinics_data')
            .select(`
              id, name, address, dentist, rating, reviews, distance, sentiment,
              mda_license, credentials, township, website_url, google_review_url, operating_hours,
              tooth_filling, root_canal, dental_crown, dental_implant, teeth_whitening, braces,
              wisdom_tooth, gum_treatment, composite_veneers, porcelain_veneers, dental_bonding,
              inlays_onlays, enamel_shaping, gingivectomy, bone_grafting, sinus_lift, frenectomy,
              tmj_treatment, sleep_apnea_appliances, crown_lengthening, oral_cancer_screening, alveoplasty
            `)
            .order('distance', { ascending: true });

        const withTimeout = <T,>(p: Promise<T>) =>
          Promise.race<T>([
            p,
            new Promise<T>((_, reject) =>
              setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
            ),
          ]);

        type SupabaseResult = { data: any[] | null; error: any };
        const exec = () => supabaseQuery() as unknown as Promise<SupabaseResult>;

        let data: any[] | null = null;
        let error: any = null;

        const stallTimer = window.setTimeout(() => {
          console.warn('Clinic fetch still in progress after 5s. This may be due to preview iframe/network routing. ', {
            hostname,
            isIframe,
          });
        }, 5000);

        try {
          ({ data, error } = await withTimeout<SupabaseResult>(exec()));
        } catch (e) {
          console.warn('First attempt failed, retrying once...', e);
          // brief backoff then retry once
          await new Promise((res) => setTimeout(res, 400));
          ({ data, error } = await withTimeout<SupabaseResult>(exec()));
        } finally {
          clearTimeout(stallTimer);
        }

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        const duration = Math.round(performance.now() - start);
        console.log(`Raw data from database: ${data?.length || 0} records in ${duration}ms`);
        if (data && data.length > 0) {
          console.log('Sample raw record (trimmed):', {
            id: data[0].id,
            name: data[0].name,
            rating: data[0].rating,
            reviews: data[0].reviews,
          });
        }

        // Transform database data to match Clinic interface
        const transformedClinics: Clinic[] = (data || []).map((clinic) => {
          const transformed = {
            id: clinic.id,
            name: clinic.name || '',
            address: clinic.address || '',
            dentist: clinic.dentist || '',
            rating: clinic.rating || 0,
            reviews: clinic.reviews || 0,
            distance: Number(clinic.distance) || 0,
            sentiment: Number(clinic.sentiment) || 0,
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
            },
          };

          // Debug log for first few records
          if (clinic.id <= 5) {
            console.log(`Transformed clinic ${clinic.id}:`, {
              name: transformed.name,
              address: transformed.address,
              rating: transformed.rating,
              reviews: transformed.reviews,
              websiteUrl: transformed.websiteUrl,
              googleReviewUrl: transformed.googleReviewUrl,
              operatingHours: transformed.operatingHours,
            });
          }

          return transformed;
        });

        console.log('Successfully transformed', transformedClinics.length, 'clinics');
        setClinics(transformedClinics);
      } catch (err) {
        console.error('Error fetching clinics:', err);
        const message = err instanceof Error ? err.message : 'Failed to fetch clinics';
        const isNetworkError = typeof message === 'string' && /timed out|Failed to fetch|NetworkError|TypeError/i.test(message);
        if (isNetworkError) {
          console.warn('Network/CORS hint: If viewing inside a Lovable preview iframe, cross-origin requests can be slower or blocked. Try opening the app in a new tab. ', {
            hostname: typeof window !== 'undefined' ? window.location.hostname : 'n/a',
          });
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  return { clinics, loading, error };
};
