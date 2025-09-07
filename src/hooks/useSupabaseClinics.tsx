
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '@/types/clinic';

export const useSupabaseClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchClinics = async () => {
      const startTime = performance.now();
      let requestStarted = false;
      
      try {
        setLoading(true);
        
        // Environment detection
        const isInIframe = window.self !== window.top;
        const isLovableDev = window.location.hostname.includes('sandbox.lovable.dev');
        const isDev = isInIframe || isLovableDev;
        
        console.log('🔍 Environment diagnostics:', {
          isInIframe,
          isLovableDev,
          isDev,
          hostname: window.location.hostname,
          userAgent: navigator.userAgent.substring(0, 100)
        });
        
        console.log('📡 Starting Supabase fetch at:', new Date().toISOString());
        console.log('🔗 REST URL would be: https://uzppuebjzqxeavgmwtvr.supabase.co/rest/v1/clinics_data?order=distance.asc&select=*');
        
        // Set up hard timeout for dev environments
        const timeoutMs = isDev ? 12000 : 8000;
        timeoutRef.current = setTimeout(() => {
          console.error('⚠️ HARD TIMEOUT after', timeoutMs + 'ms - request never resolved');
          setError(`Network connectivity issues detected. This may be a temporary platform problem. Visit /debug-test to run diagnostics.`);
          setLoading(false);
        }, timeoutMs);
        
        // Stall warning for dev
        if (isDev) {
          setTimeout(() => {
            if (!requestStarted) {
              console.warn('⚠️ Request appears stalled - no network activity detected after 5s');
            }
          }, 5000);
        }
        
        // Mark request as started
        requestStarted = true;
        const requestTime = performance.now();
        console.log('📤 Supabase SDK call initiated at:', requestTime - startTime + 'ms');
        
        let data: any = null;
        let error: any = null;

        // Sequential strategy with limited retries to avoid 429s
        const attemptWithTimeout = async (promise: Promise<any>, ms: number, label: string): Promise<any> => {
          return await Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms))
          ]);
        };
        // 1) Try Supabase SDK with small retry/backoff
        const maxRetries = 2;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            console.log(`📡 Supabase SDK attempt ${attempt + 1}/${maxRetries + 1}...`);
            const result = await attemptWithTimeout(
              (async () => await supabase.from('clinics_data').select('*').order('distance', { ascending: true }))(),
              4000,
              'Direct query'
            );
            data = (result as any).data;
            error = (result as any).error;
            if (!error && Array.isArray(data)) {
              console.log('✅ SDK fetch succeeded');
              break;
            }
            console.warn('⚠️ SDK fetch returned error, will consider fallback', error);
          } catch (e: any) {
            console.warn(`⚠️ SDK attempt ${attempt + 1} failed:`, e?.message || e);
          }

          if (attempt < maxRetries) {
            const backoff = 500 * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
            await new Promise(res => setTimeout(res, backoff));
          }
        }

        // 2) Fallback to REST if SDK failed
        if (!data || error) {
          console.log('🌐 Falling back to REST fetch...');
          const response = await attemptWithTimeout(
            fetch(`https://uzppuebjzqxeavgmwtvr.supabase.co/rest/v1/clinics_data?order=distance.asc&select=*`, {
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA'
              }
            }),
            4000,
            'REST fetch'
          );
          if (!(response as Response).ok) {
            throw new Error(`REST fetch failed with status ${(response as Response).status}`);
          }
          data = await (response as Response).json();
          error = null;
          console.log('✅ REST fetch succeeded');
        }
          
        const responseTime = performance.now();
        console.log('📥 Supabase response received at:', responseTime - startTime + 'ms');
        console.log('⏱️ Network round-trip:', responseTime - requestTime + 'ms');

        // Clear timeout on successful response
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        if (error) {
          console.error('❌ Supabase query error:', error);
          console.error('🔍 Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        console.log('Raw data from database:', data?.length || 0, 'records');
        if (data && data.length > 0) {
          console.log('Sample raw record:', data[0]);
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
            distance: clinic.distance || 0,
            sentiment: clinic.sentiment || 0,
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
              operatingHours: transformed.operatingHours
            });
          }
          
          return transformed;
        });

        const totalTime = performance.now() - startTime;
        console.log('✅ Successfully transformed', transformedClinics.length, 'clinics in', totalTime.toFixed(1) + 'ms');
        setClinics(transformedClinics);
      } catch (err) {
        // Clear timeout on error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        console.error('❌ Error fetching clinics:', err);
        
        // Enhanced error diagnostics
        if (err instanceof Error) {
          console.error('🔍 Error analysis:', {
            name: err.name,
            message: err.message,
            stack: err.stack?.substring(0, 500),
            requestStarted,
            totalTime: performance.now() - startTime
          });
          
          // Check for common network issues
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            console.error('🌐 Network error detected - possible CORS/CSP issue in dev environment');
          }
        }
        
        setError(err instanceof Error ? err.message : 'Failed to fetch clinics');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { clinics, loading, error };
};
