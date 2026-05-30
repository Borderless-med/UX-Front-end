-- =================================================================
-- CLEANUP: Remove obsolete "Clinic  Detail" table
-- Created: 2026-05-26
-- Reason: Empty duplicate of partner_applications table
-- Risk: ZERO - table has 0 rows and no foreign key dependencies
-- =================================================================

-- Drop the obsolete table with spaces in name
DROP TABLE IF EXISTS public."Clinic  Detail";

-- Verification query (run after to confirm deletion)
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_name = 'Clinic  Detail' AND table_schema = 'public';
-- Expected result: 0 rows (table no longer exists)

-- =================================================================
-- MIGRATION COMPLETE
-- Cleanup reduces schema from 22 tables to 21 tables
-- =================================================================
