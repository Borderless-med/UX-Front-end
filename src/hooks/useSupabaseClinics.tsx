import { useState, useEffect, useRef } from 'react';
import { Clinic } from '@/types/clinic';
import { restSelect } from '@/utils/restClient';
// Note: The 'useAuth' context is no longer needed for this specific hook's logic,
// but it's fine to leave the import if other parts of your app use it.
import { useAuth } from '@/contexts/AuthContext'; 

export const useSupabaseClinics = () => {
  console.log('[useSupabaseClinics] Hook initialized at', new Date().toISOString());
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('[useSupabaseClinics] useEffect triggered at', new Date().toISOString());
    const fetchClinics = async () => {
      const startTime = performance.now();
      
      try {
        setLoading(true);
        
        console.log('🚀 Starting REST-first clinic fetch at:', new Date().toISOString());
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set up timeout for the entire operation
        timeoutRef.current = setTimeout(() => {
          console.error('⚠️ HARD TIMEOUT after 10s - clinic fetch failed');
          setError(`Unable to load clinic data. Please check your connection and try again.`);
          setLoading(false);
        }, 10000);
        
        // REST-first strategy: Direct fetch with optimized settings
        const data = await restSelect('clinics_data', {
          select: '*',
          // Note: The 'distance' column is assumed to exist. If not, this order clause might need adjustment.
          order: { column: 'distance', ascending: true } 
        }, {
          timeout: 8000,
          retries: 2
        });

        // Clear timeout on successful response
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
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
            country: clinic.country || undefined,
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
            totalTime: performance.now() - startTime
          });
          
          // Check for common network issues
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            console.error('🌐 Network error detected - possible CORS/CSP issue or offline');
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
    // AMENDMENT: Changed the dependency array from [user] to [].
    // This ensures the data is fetched once when the component mounts,
    // which is correct for a public list of clinics.
  }, []);

  return { clinics, loading, error };
};