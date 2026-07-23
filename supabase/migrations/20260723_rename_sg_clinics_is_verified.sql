-- ============================================================================
-- RENAME sg_clinics.is_verified to is_verified_partner
-- ============================================================================
-- Purpose: Standardize column naming across clinics_data and sg_clinics tables
-- 
-- Before: clinics_data.is_verified_partner, sg_clinics.is_verified (inconsistent)
-- After:  clinics_data.is_verified_partner, sg_clinics.is_verified_partner (consistent)
-- ============================================================================

BEGIN;

-- Rename column to match clinics_data table structure
ALTER TABLE public.sg_clinics
RENAME COLUMN is_verified TO is_verified_partner;

-- Verify the change
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'sg_clinics' 
  AND column_name = 'is_verified_partner';

COMMIT;

-- ============================================================================
-- RESULT: Column renamed successfully
-- Now both tables use the same column name: is_verified_partner
-- Frontend code can use single property mapping without fallback logic
-- ============================================================================
