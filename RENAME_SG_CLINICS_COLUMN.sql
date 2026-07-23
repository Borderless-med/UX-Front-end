-- ============================================
-- RENAME sg_clinics.is_verified → is_verified_partner
-- ============================================
-- Purpose: Standardize column naming across both tables
--   - clinics_data (JB) uses: is_verified_partner ✅
--   - sg_clinics (SG) uses: is_verified → needs rename
--
-- After this migration, both tables will use: is_verified_partner
-- This allows simplified code without fallback checks.
-- ============================================

-- Step 1: Rename the column
ALTER TABLE public.sg_clinics 
  RENAME COLUMN is_verified TO is_verified_partner;

-- Step 2: Verify the rename succeeded
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'sg_clinics'
  AND column_name = 'is_verified_partner';

-- Step 3: Show current verified partners (should return data if rename succeeded)
SELECT id, name, is_verified_partner
FROM public.sg_clinics
WHERE is_verified_partner = true
ORDER BY name;

-- ============================================
-- ROLLBACK (if needed):
-- ALTER TABLE public.sg_clinics 
--   RENAME COLUMN is_verified_partner TO is_verified;
-- ============================================
