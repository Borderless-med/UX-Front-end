
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '@/types/clinic';

// Centralized anon key
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA';

// Explicit column list to avoid PostgREST select parse errors
const SELECT_COLUMNS = [
  'id','name','address','township','rating','reviews','distance','sentiment',
  'website_url','google_review_url','operating_hours','dentist','mda_license','credentials',
  'tooth_filling','root_canal','dental_crown','dental_implant','teeth_whitening','braces','wisdom_tooth',
  'gum_treatment','composite_veneers','porcelain_veneers','dental_bonding','inlays_onlays','enamel_shaping',
  'gingivectomy','bone_grafting','sinus_lift','frenectomy','tmj_treatment','sleep_apnea_appliances',
  'crown_lengthening','oral_cancer_screening','alveoplasty'
].join(',');

export const useSupabaseClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchClinics = async () => {
      const startTime = performance.now();
      let requestStarted = false;
      
      try {
        setLoading(true);
        
        // Create abort controller for canceling losing requests
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        
        // Environment detection
        const isInIframe = window.self !== window.top;
        const isLovableDev = window.location.hostname.includes('sandbox.lovable.dev');
        const isDev = isInIframe || isLovableDev;
        
        // Check for debug fetch strategy override
        const urlParams = new URLSearchParams(window.location.search);
        const fetchStrategy = urlParams.get('fetchStrategy');
        
        console.log('🔍 Environment diagnostics:', {
          isInIframe,
          isLovableDev,
          isDev,
          fetchStrategy,
          hostname: window.location.hostname,
          userAgent: navigator.userAgent.substring(0, 100)
        });
        
        console.log('📡 Starting optimized clinic fetch at:', new Date().toISOString());
        
        // Set up hard timeout - unified 10s for both environments for production reliability
        const timeoutMs = 10000;
        timeoutRef.current = setTimeout(() => {
          console.error('⚠️ HARD TIMEOUT after', timeoutMs + 'ms');
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          setError(`Request timeout after ${timeoutMs/1000}s`);
          setLoading(false);
        }, timeoutMs);
        
        // Mark request as started
        requestStarted = true;
        const requestTime = performance.now();
        
        let data, error;
        
        // Force specific strategy if debug param provided
        if (fetchStrategy) {
          console.log(`🎯 Debug mode: forcing ${fetchStrategy} strategy`);
          
          if (fetchStrategy === 'direct') {
            const result = await supabase
              .from('clinics_data')
              .select(SELECT_COLUMNS)
              .order('distance', { ascending: true });
            data = result.data;
            error = result.error;
          } else if (fetchStrategy === 'edge') {
            const result = await supabase.functions.invoke('get-clinics-data');
            data = result.data?.data;
            error = result.error || result.data?.error;
          }
        } else {
          // Environment-aware strategy preferences
          console.log('🏁 Racing optimized fetch strategies...');
          
          const createTimeoutPromise = (ms: number, name: string) => 
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error(`${name} timeout after ${ms}ms`)), ms)
            );
          
          // Production: prefer edge function first, Dev: prefer direct query
          const strategiesOrder = isDev ? ['direct', 'edge'] : ['edge', 'direct'];
          
          // Create individual abort controllers for each strategy
          const strategyControllers = strategiesOrder.map(() => new AbortController());
          
          const strategies = strategiesOrder.map((strategyName, index) => {
            const timeout = 4000 + (index * 1000); // More generous timeouts: 4s, 5s
            const strategySignal = strategyControllers[index].signal;
            
            if (strategyName === 'direct') {
              return Promise.race([
                (async () => {
                  if (strategySignal.aborted) throw new Error('Strategy cancelled');
                  console.log('📡 Strategy: Direct Supabase (optimized)...');
                  const result = await supabase
                    .from('clinics_data')
                    .select(SELECT_COLUMNS)
                    .order('distance', { ascending: true });
                  if (result.error) throw result.error;
                  if (strategySignal.aborted) throw new Error('Strategy cancelled');
                  console.log('✅ Direct query completed');
                  return { source: 'direct', data: result.data, error: null };
                })(),
                createTimeoutPromise(timeout, 'Direct query')
              ]);
            } else if (strategyName === 'edge') {
              return Promise.race([
                (async () => {
                  if (strategySignal.aborted) throw new Error('Strategy cancelled');
                  console.log('🔧 Strategy: Edge function...');
                  const result = await supabase.functions.invoke('get-clinics-data');
                  if ((result as any).error) throw (result as any).error;
                  if (strategySignal.aborted) throw new Error('Strategy cancelled');
                  console.log('✅ Edge function completed');
                  let edgeData = (result as any).data;
                  if (edgeData && typeof edgeData === 'object' && edgeData.data) {
                    edgeData = edgeData.data;
                  }
                  if (!edgeData || (Array.isArray(edgeData) && edgeData.length === 0)) {
                    throw new Error('Edge function returned no data');
                  }
                  return { 
                    source: 'edge-function', 
                    data: edgeData, 
                    error: null 
                  };
                })(),
                createTimeoutPromise(timeout, 'Edge function')
              ]);
            }
          });
        
          try {
            // First successful result wins, others get cancelled
            const result = await new Promise((resolve, reject) => {
              let resolved = false;
              let rejectedCount = 0;
              const errors: any[] = [];
              
              strategies.forEach((strategy, index) => {
                strategy
                  .then(result => {
                    if (!resolved) {
                      resolved = true;
                      console.log(`🎯 Winner: ${(result as any).source} strategy succeeded`);
                      
                      // Cancel all other strategy controllers
                      strategyControllers.forEach((controller, ctrlIndex) => {
                        if (ctrlIndex !== index && !controller.signal.aborted) {
                          controller.abort();
                        }
                      });
                      
                      resolve(result);
                    }
                  })
                  .catch(err => {
                    // Don't log cancellation errors as actual errors
                    if (!err.message.includes('cancelled') && !err.message.includes('aborted')) {
                      console.error(`❌ Strategy ${strategiesOrder[index]} failed:`, err.message);
                    }
                    
                    errors[index] = err;
                    rejectedCount++;
                    
                    if (rejectedCount === strategies.length && !resolved) {
                      const realErrors = errors.filter(e => 
                        !e.message.includes('cancelled') && !e.message.includes('aborted')
                      );
                      reject(new Error(`All strategies failed: ${realErrors.map(e => e.message).join(', ')}`));
                    }
                  });
              });
            });
            
            data = (result as any).data;
            error = (result as any).error;
            
          } catch (allErrors) {
            console.error('❌ All racing strategies failed, trying fallback...');
            
            // Fallback: try edge function alone with longer timeout
            try {
              console.log('🔄 Fallback: Single edge function call...');
              const fallbackResult = await Promise.race([
                supabase.functions.invoke('get-clinics-data'),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Fallback timeout')), 8000)
                )
              ]);
              
              let fallbackData = (fallbackResult as any).data;
              if (fallbackData && typeof fallbackData === 'object' && fallbackData.data) {
                fallbackData = fallbackData.data;
              }
              
              data = fallbackData;
              error = (fallbackResult as any).error;
              console.log('✅ Fallback strategy succeeded');
              
            } catch (fallbackError) {
              console.error('❌ Fallback also failed:', fallbackError);
              throw new Error('All strategies including fallback failed - unable to load clinic data');
            }
          }
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
    
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { clinics, loading, error };
};
