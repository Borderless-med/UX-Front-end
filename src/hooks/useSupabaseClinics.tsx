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

// ========== MOBILE FIX: localStorage Persistence Layer ==========
// Survives tab suspension on mobile browsers (4G/5G network switches)
const STORAGE_KEY_PREFIX = 'orachope_clinics_';
const STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days max age

/**
 * Save clinic data to localStorage to survive mobile tab suspension
 * Falls back gracefully if localStorage is full or unavailable
 */
const saveToLocalStorage = (source: ClinicSource, data: Clinic[]): void => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${source}`;
    const payload = JSON.stringify({
      data,
      timestamp: Date.now(),
      version: '1.0' // For future schema migrations
    });
    localStorage.setItem(storageKey, payload);
    console.log(`[localStorage] ✅ Saved ${data.length} clinics for source '${source}'`);
  } catch (error) {
    // QuotaExceededError or localStorage disabled - graceful degradation
    console.warn('[localStorage] ⚠️ Failed to save (quota exceeded or disabled):', error);
    // App continues to work with in-memory cache only
  }
};

/**
 * Restore clinic data from localStorage
 * Returns null if not found, expired, or corrupted
 */
const loadFromLocalStorage = (source: ClinicSource): { data: Clinic[]; timestamp: number } | null => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${source}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      console.log(`[localStorage] No cached data for source '${source}'`);
      return null;
    }
    
    const parsed = JSON.parse(stored);
    const age = Date.now() - parsed.timestamp;
    
    // Check if data is too old (7 days)
    if (age > STORAGE_TTL_MS) {
      console.log(`[localStorage] ⏰ Cache expired (${(age / (24 * 60 * 60 * 1000)).toFixed(1)} days old), removing`);
      localStorage.removeItem(storageKey);
      return null;
    }
    
    // Validate data structure
    if (!Array.isArray(parsed.data) || parsed.data.length === 0) {
      console.warn('[localStorage] ⚠️ Invalid data structure, removing');
      localStorage.removeItem(storageKey);
      return null;
    }
    
    const ageInMinutes = Math.floor(age / (60 * 1000));
    console.log(`[localStorage] ✅ Restored ${parsed.data.length} clinics (${ageInMinutes} min old)`);
    
    return { data: parsed.data, timestamp: parsed.timestamp };
  } catch (error) {
    // JSON parse error or corrupted data
    console.error('[localStorage] ❌ Corrupted cache, clearing:', error);
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${source}`);
    } catch {
      // localStorage not available
    }
    return null;
  }
};

/**
 * Clear all clinic caches (both memory and localStorage)
 * Useful for debugging or manual refresh
 */
const clearAllCaches = (): void => {
  // Clear in-memory cache
  Object.keys(CLINICS_CACHE).forEach(key => delete CLINICS_CACHE[key]);
  
  // Clear localStorage cache
  try {
    ['sg', 'jb', 'all'].forEach(source => {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${source}`);
    });
    console.log('[localStorage] 🧹 All caches cleared');
  } catch (error) {
    console.warn('[localStorage] Failed to clear:', error);
  }
};

// Expose clear function globally for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).clearClinicCaches = clearAllCaches;
}
// ========== End localStorage Layer ==========

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

  // MOBILE FIX: Page Visibility API - Handle tab reactivation after suspension
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible again
        console.log('[useSupabaseClinics] 👁️ Tab became visible');
        
        // If we have no clinics and not currently loading, try to restore from localStorage
        if (clinics.length === 0 && !loading && !fetchInProgressRef.current) {
          console.log('[useSupabaseClinics] 🔄 No clinics visible after tab reactivation, attempting localStorage restore');
          const restored = loadFromLocalStorage(source);
          if (restored && restored.data.length > 0) {
            console.log('[useSupabaseClinics] ✅ Restored clinics from localStorage after tab reactivation');
            setClinics(restored.data);
            CLINICS_CACHE[source] = restored;
            setError(null);
            hasInitialDataRef.current = true;
          } else {
            console.log('[useSupabaseClinics] ⚠️ No localStorage backup found, clinics may have been cleared by browser');
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [source, clinics.length, loading]); // Dependencies ensure we react to state changes

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
        // MOBILE FIX: Check cache layers (memory → localStorage → network)
        const cacheKey = source;
        
        // Layer 1: Check in-memory cache (fastest)
        const memoryCached = CLINICS_CACHE[cacheKey];
        if (memoryCached && (Date.now() - memoryCached.timestamp) < CACHE_TTL_MS) {
          console.log(`[useSupabaseClinics] ✅ Using memory cache for '${source}' (age ${(Date.now() - memoryCached.timestamp)/1000}s)`);
          setClinics(memoryCached.data);
          setLoading(false);
          setError(null);
          fetchInProgressRef.current = false;
          hasInitialDataRef.current = true;
          return; // skip network fetch
        }
        
        // Layer 2: Check localStorage (survives tab suspension)
        const localStorageCached = loadFromLocalStorage(source);
        if (localStorageCached && (Date.now() - localStorageCached.timestamp) < CACHE_TTL_MS) {
          console.log(`[useSupabaseClinics] ✅ Restored from localStorage for '${source}' - tab suspension recovery`);
          setClinics(localStorageCached.data);
          // Restore to memory cache as well
          CLINICS_CACHE[cacheKey] = localStorageCached;
          setLoading(false);
          setError(null);
          fetchInProgressRef.current = false;
          hasInitialDataRef.current = true;
          
          // OPTIMIZATION: Background refresh if data is >30 min old
          const ageMinutes = (Date.now() - localStorageCached.timestamp) / (60 * 1000);
          if (ageMinutes > 30) {
            console.log(`[useSupabaseClinics] 🔄 Data is ${ageMinutes.toFixed(0)} min old, triggering background refresh`);
            // Continue to network fetch below (non-blocking)
          } else {
            return; // Data is fresh enough, skip network fetch
          }
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
        
        // Store in memory cache
        CLINICS_CACHE[cacheKey] = { data: transformedClinics, timestamp: Date.now() };
        
        // MOBILE FIX: Store in localStorage to survive tab suspension
        saveToLocalStorage(source, transformedClinics);
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
        const staleMemoryCache = CLINICS_CACHE[cacheKey];
        const staleLocalStorageCache = loadFromLocalStorage(source);
        
        // Priority 1: Keep currently displayed clinics (don't clear state on background refresh failures)
        if (clinics.length > 0) {
          console.warn('⚠️ Fetch failed, but keeping currently displayed clinics to prevent UI from going blank');
          setError(null); // Don't show error if we already have data displayed
        }
        // Priority 2: Use stale memory cache if available
        else if (staleMemoryCache && staleMemoryCache.data.length > 0) {
          console.warn('⚠️ Fetch failed, using stale memory cache from', new Date(staleMemoryCache.timestamp).toISOString());
          setClinics(staleMemoryCache.data);
          setError(null);
        }
        // Priority 3: MOBILE FIX - Use localStorage even if expired (better than nothing)
        else if (staleLocalStorageCache && staleLocalStorageCache.data.length > 0) {
          const ageHours = (Date.now() - staleLocalStorageCache.timestamp) / (60 * 60 * 1000);
          console.warn(`⚠️ Fetch failed, using localStorage backup (${ageHours.toFixed(1)}h old)`);
          setClinics(staleLocalStorageCache.data);
          // Show staleness warning to user
          setError('Showing cached clinic data. Please check your internet connection to see latest updates.');
        }
        // Priority 4: Only show error if we have no data at all
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