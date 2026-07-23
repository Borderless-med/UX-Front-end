-- ============================================================================
-- ACTIVATE SINGAPORE VERIFIED PARTNER CLINIC
-- ============================================================================
-- Purpose: Enable verified partner badge for a Singapore clinic
-- 
-- This script sets is_verified_partner = TRUE for sg_clinics table
-- (After migration, both tables now use 'is_verified_partner' consistently)
-- ============================================================================

BEGIN;

-- EXAMPLE: Activate a Singapore clinic as verified partner
-- Replace 'CLINIC_NAME_HERE' with the actual clinic name from sg_clinics

UPDATE sg_clinics
SET is_verified_partner = TRUE
WHERE name = 'CLINIC_NAME_HERE'  -- ← Replace with actual clinic name
  AND is_verified_partner = FALSE;

-- Verify the activation
SELECT 
  name,
  address,
  country,
  is_verified_partner,
  rating,
  reviews
FROM sg_clinics
WHERE is_verified_partner = TRUE
ORDER BY name;

COMMIT;

-- ============================================================================
-- INSTRUCTIONS:
-- 1. Replace 'CLINIC_NAME_HERE' with actual Singapore clinic name
-- 2. Run this script in Supabase SQL Editor
-- 3. Verify the clinic now shows the 3-row CTA layout on the website
-- ============================================================================
