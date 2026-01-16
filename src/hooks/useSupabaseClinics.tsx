import { useState, useEffect, useRef } from 'react';
import { Clinic } from '@/types/clinic';
import { restSelect } from '@/utils/restClient';
// Note: The 'useAuth' context is no longer needed for this specific hook's logic,
// but it's fine to leave the import if other parts of your app use it.
import { useAuth } from '@/contexts/AuthContext'; 

export type ClinicSource = 'sg' | 'jb' | 'all';

// Simple in-memory cache (module-level) to prevent duplicate fetches across components
interface CacheEntry { data: Clinic[]; timestamp: number }
const CLINICS_CACHE: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes (increased from 5 minutes)

export const useSupabaseClinics = (source: ClinicSource = 'all') => {
  console.log('[useSupabaseClinics] Hook initialized for source:', source, 'at', new Date().toISOString());
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  const fetchInProgressRef = useRef(false);
  const currentSourceRef = useRef<ClinicSource>(source);
  const hasInitialDataRef = useRef(false);

  useEffect(() => {
    console.log('[useSupabaseClinics] useEffect triggered for source:', source, 'at', new Date().toISOString());
    
    // FIX: Prevent duplicate fetches for the SAME source
    if (fetchInProgressRef.current && currentSourceRef.current === source) {
      console.log('[useSupabaseClinics] ⚠️ Fetch already in progress for same source, skipping duplicate request');
      return;
    }
    
    // FIX: If we already have data and cache is still valid, don't refetch unnecessarily
    const cacheKey = source;
    const cached = CLINICS_CACHE[cacheKey];
    if (hasInitialDataRef.current && cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS && currentSourceRef.current === source) {
      console.log('[useSupabaseClinics] ⚠️ Already have valid data for this source, skipping unnecessary refetch');
      return;
    }
    
    // Update current source
    currentSourceRef.current = source;
    
    const fetchClinics = async () => {
      const startTime = performance.now();
      
      // Mark fetch as in progress
      fetchInProgressRef.current = true;
      
      try {
        // Check cache FIRST before setting loading state
        const cacheKey = source;
        const cached = CLINICS_CACHE[cacheKey];
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
          console.log(`[useSupabaseClinics] ✅ Using cached clinic data for '${source}' (age ${(Date.now() - cached.timestamp)/1000}s)`);
          setClinics(cached.data);
          setLoading(false);
          setError(null);
          fetchInProgressRef.current = false;
          hasInitialDataRef.current = true;
          return; // skip network fetch
        }
        
        // Only set loading=true if we don't have valid cached data
        setLoading(true);
        // FIX: DON'T clear existing clinics during loading (keeps data visible on 4G)
        // setClinics([]); // ← REMOVED - prevents flickering on slow connections
        
        console.log('🚀 Starting REST-first clinic fetch at:', new Date().toISOString());
        
        // Abort any in-flight request from previous source change
        if (abortControllerRef.current) {
          console.log('⏹️ Aborting previous fetch request');
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Adaptive timeout: 20s for 'all' (fetches 2 tables), 15s for single source
        const timeoutDuration = source === 'all' ? 20000 : 15000;
        timeoutRef.current = setTimeout(() => {
          console.error(`⚠️ HARD TIMEOUT after ${timeoutDuration/1000}s - clinic fetch failed for source: ${source}`);
          abortControllerRef.current?.abort();
          // FIX: Don't set error if we already have clinics displayed (background refresh timeout)
          if (clinics.length === 0) {
            setError(`Unable to load clinic data. Please check your connection and try again.`);
          } else {
            console.warn('⚠️ Timeout on background refresh, keeping existing clinics visible');
          }
          setLoading(false);
        }, timeoutDuration);
        
        // REST-first strategy: Direct fetch with optimized settings
        // Helper to attempt a select ordered by distance, falling back to rating if needed
        const loadTable = async (table: string) => {
          // Always prefer rating sort (higher first) per business directive
          try {
            return await restSelect(table, {
              select: '*',
              order: { column: 'rating', ascending: false }
            }, { timeout: 8000, retries: 1 });
          } catch (e: any) {
            console.warn(`[useSupabaseClinics] primary rating sort failed on ${table}; attempting distance as fallback`, e?.message);
            return await restSelect(table, {
              select: '*',
              order: { column: 'distance', ascending: true }
            }, { timeout: 8000, retries: 1 });
          }
        };

        // Deterministic per your schema:
        // - JB -> clinics_data
        // - SG -> sg_clinics
        // - ALL -> union of both
        let data: any[] = [];
        if (source === 'sg') {
          data = await loadTable('sg_clinics');
          console.log('✅ Loaded from sg_clinics (sorted by rating):', data?.length ?? 0);
        } else if (source === 'jb') {
          data = await loadTable('clinics_data');
          console.log('✅ Loaded from clinics_data (JB, sorted by rating):', data?.length ?? 0);
        } else {
          let [sg, jb] = await Promise.all([
            loadTable('sg_clinics').catch(() => []),
            loadTable('clinics_data').catch(() => []),
          ]);
          // Ensure country is present for downstream logic
          if (Array.isArray(sg)) {
            sg = sg.map((c: any) => ({ ...c, country: c.country ?? 'SG' }));
          }
          if (Array.isArray(jb)) {
            jb = jb.map((c: any) => ({ ...c, country: c.country ?? 'MY' }));
          }
          data = [...(sg || []), ...(jb || [])];
          console.log('✅ Loaded union sg_clinics + clinics_data (each sorted by rating):', data?.length ?? 0);
        }

        // Clear timeout on successful response
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

  console.log('Raw data from database:', data?.length || 0, 'records');
        if (data && data.length > 0) {
          console.log('Sample raw record:', data[0]);
        }

        // Transform database data to match Clinic interface
        const transformedClinics: Clinic[] = (data || []).map((clinic: any) => {
          // Helper to build canonical links for Google Reviews and Google Maps
          const buildLinks = (): { reviewsHref: string; mapsHref: string; hasReviews: boolean } => {
            const name: string = clinic.name || '';
            const country: string | undefined = clinic.country || (source === 'sg' ? 'SG' : source === 'jb' ? 'MY' : undefined);
            const township: string = clinic.township || '';
            const placeId: string | undefined = clinic.place_id || clinic.placeId;
            const reviewUrl: string | undefined = clinic.google_review_url || clinic.googleReviewUrl;
            const address: string = clinic.address || '';

            const gl = country === 'SG' ? 'sg' : country === 'MY' ? 'my' : 'sg';

            // Attempt to extract CID from a google_review_url like https://maps.google.com/?cid=12345
            const extractCid = (url?: string): string | null => {
              if (!url) return null;
              try {
                const u = new URL(url);
                const cid = u.searchParams.get('cid');
                return cid && cid.match(/^\d+$/) ? cid : null;
              } catch {
                return null;
              }
            };
            const cid = extractCid(reviewUrl);

            // Build Maps href
            let mapsHref = '';
            if (cid) {
              mapsHref = `https://www.google.com/maps?cid=${cid}&hl=en&gl=${gl}`;
            } else if (placeId && String(placeId).trim() !== '') {
              mapsHref = `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(String(placeId).trim())}&hl=en&gl=${gl}`;
            } else {
              const q = [name, address || township].filter(Boolean).join(' ');
              mapsHref = `https://www.google.com/maps/search/${encodeURIComponent(q)}?hl=en&gl=${gl}`;
            }

            // Build Reviews href (prefer reviews view when CID exists)
            let reviewsHref = '';
            if (cid) {
              const q = `${name} reviews`;
              reviewsHref = `https://www.google.com/search?q=${encodeURIComponent(q)}&hl=en&gl=${gl}&ludocid=${cid}`;
            } else if (placeId && String(placeId).trim() !== '') {
              // place_id cannot reliably deep-link reviews; use a strong search fallback
              const locality = country === 'SG' ? 'Singapore' : township || (country === 'MY' ? 'Johor Bahru' : '');
              const q = `${name} reviews ${locality}`.trim();
              reviewsHref = `https://www.google.com/search?q=${encodeURIComponent(q)}&hl=en&gl=${gl}`;
            } else {
              const locality = country === 'SG' ? 'Singapore' : township || (country === 'MY' ? 'Johor Bahru' : '');
              const q = `${name} reviews ${locality}`.trim();
              reviewsHref = q ? `https://www.google.com/search?q=${encodeURIComponent(q)}&hl=en&gl=${gl}` : '';
            }

            const hasReviews = !!reviewsHref;
            return { reviewsHref, mapsHref, hasReviews };
          };

          const { reviewsHref: googleReviewsHref, mapsHref: googleMapsHref, hasReviews: hasReviewsLink } = buildLinks();

          const transformed: Clinic = {
            id: clinic.id,
            name: clinic.name || '',
            address: clinic.address || '',
            dentist: clinic.dentist || '',
            rating: clinic.rating || 0,
            reviews: clinic.reviews || 0,
            distance: clinic.distance || 0,
            sentiment: clinic.sentiment || 0,
            sentimentDentistSkill: clinic.sentiment_dentist_skill || undefined,
            sentimentPainManagement: clinic.sentiment_pain_management || undefined,
            sentimentCostValue: clinic.sentiment_cost_value || undefined,
            sentimentStaffService: clinic.sentiment_staff_service || undefined,
            sentimentAmbianceCleanliness: clinic.sentiment_ambiance_cleanliness || undefined,
            sentimentConvenience: clinic.sentiment_convenience || undefined,
            mdaLicense: clinic.mda_license || '',
            credentials: clinic.credentials || '',
            country: clinic.country || (source === 'sg' ? 'SG' : source === 'jb' ? 'MY' : undefined),
            township: clinic.township || '',
            websiteUrl: clinic.website_url || '',
            googleReviewUrl: clinic.google_review_url || '',
            placeId: clinic.place_id || undefined,
            googleReviewsHref,
            googleMapsHref,
            hasReviewsLink,
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
              googleReviewsHref: transformed.googleReviewsHref,
              operatingHours: transformed.operatingHours
            });
          }
          
          return transformed;
        });

        const totalTime = performance.now() - startTime;
        console.log('✅ Successfully transformed', transformedClinics.length, 'clinics in', totalTime.toFixed(1) + 'ms');
        hasInitialDataRef.current = true;
        setClinics(transformedClinics);
        // Store in cache
        CLINICS_CACHE[cacheKey] = { data: transformedClinics, timestamp: Date.now() };
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
        
        // CRITICAL FIX: Preserve existing clinics on error - never show empty state if we have data
        const cacheKey = source;
        const staleCache = CLINICS_CACHE[cacheKey];
        
        // Priority 1: Keep currently displayed clinics (don't clear state on background refresh failures)
        if (clinics.length > 0) {
          console.warn('⚠️ Fetch failed, but keeping currently displayed clinics to prevent UI from going blank');
          setError(null); // Don't show error if we already have data displayed
        }
        // Priority 2: Use stale cache if available
        else if (staleCache && staleCache.data.length > 0) {
          console.warn('⚠️ Fetch failed, using stale cached data from', new Date(staleCache.timestamp).toISOString());
          setClinics(staleCache.data);
          setError(null);
        } 
        // Priority 3: Only show error if we have no data at all
        else {
          console.error('❌ No cached or existing data available, showing error to user');
          setError(err instanceof Error ? err.message : 'Failed to fetch clinics');
        }
      } finally {
        setLoading(false);
        // FIX: Mark fetch as complete
        fetchInProgressRef.current = false;
      }
    };

    fetchClinics();
    
    // Cleanup function - only aborts when source changes or component unmounts
    // This prevents clinics from disappearing during normal re-renders
    return () => {
      console.log('[useSupabaseClinics] 🧹 Cleanup triggered');
      // Mark fetch as not in progress to allow new fetches
      fetchInProgressRef.current = false;
      // Abort in-flight requests when source changes or component unmounts
      if (abortControllerRef.current) {
        console.log('[useSupabaseClinics] ⏹️ Aborting request due to cleanup');
        abortControllerRef.current.abort();
      }
      // Clear timeout to prevent memory leaks
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // NOTE: We don't clear clinics state here to prevent cards from disappearing
    };
  }, [source]);

  return { clinics, loading, error };
};