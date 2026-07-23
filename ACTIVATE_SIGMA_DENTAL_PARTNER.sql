-- ============================================================================
-- ACTIVATE SIGMA DENTAL AS VERIFIED PARTNER
-- ============================================================================
-- Purpose: Approve Sigma Dental's partner application and enable verified badge
-- 
-- This script:
-- 1. Links partner application to clinics_data record
-- 2. Sets application status to 'active'
-- 3. Enables 'is_verified_partner' flag for badge display
-- ============================================================================

BEGIN;

-- STEP 1: Link partner application to clinic record
-- (Find Sigma Dental in clinics_data and link it)

UPDATE partner_applications pa
SET clinic_id = cd.id
FROM clinics_data cd
WHERE pa.clinic_name = 'Sigma Dental'
  AND cd.name = 'Sigma Dental'
  AND pa.clinic_id IS NULL;

-- STEP 2: Activate the partner application

UPDATE partner_applications
SET 
  status = 'active',
  verified_at = NOW()
WHERE clinic_name = 'Sigma Dental'
  AND status = 'pending';

-- STEP 3: Enable verified partner badge in clinics_data

UPDATE clinics_data
SET is_verified_partner = TRUE
WHERE name = 'Sigma Dental'
  AND is_verified_partner = FALSE;

-- STEP 4: Verify the activation

SELECT 
  'Partner Application Status' as check_type,
  pa.clinic_name,
  pa.clinic_id,
  pa.status,
  pa.verified_at,
  cd.name as clinic_db_name,
  cd.is_verified_partner
FROM partner_applications pa
LEFT JOIN clinics_data cd ON pa.clinic_id = cd.id
WHERE pa.clinic_name = 'Sigma Dental';

COMMIT;

-- ============================================================================
-- EXPECTED RESULT:
-- - clinic_id: Should show the ID from clinics_data
-- - status: 'active'
-- - verified_at: Current timestamp
-- - is_verified_partner: TRUE
-- 
-- After running this, Sigma Dental will show the "✅ Verified Partner" badge
-- ============================================================================
