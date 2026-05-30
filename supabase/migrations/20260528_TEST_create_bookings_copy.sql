-- ============================================
-- TEST SCRIPT: Create Copy of appointment_bookings
-- Purpose: Practice migration on a copy first
-- Risk: ZERO (creates new table, doesn't touch original)
-- Date: May 28, 2026
-- ============================================

-- Step 1: Create exact copy of appointment_bookings structure
CREATE TABLE IF NOT EXISTS appointment_bookings_test (LIKE appointment_bookings INCLUDING ALL);

-- Step 2: Copy all data (currently 0 rows, but safe for future)
INSERT INTO appointment_bookings_test 
SELECT * FROM appointment_bookings;

-- Step 3: Verify copy created
SELECT 
  'Original table' AS table_name,
  COUNT(*) AS row_count 
FROM appointment_bookings
UNION ALL
SELECT 
  'Test copy' AS table_name,
  COUNT(*) AS row_count 
FROM appointment_bookings_test;

-- ============================================
-- Now run the migration on appointment_bookings_test
-- If it works, run on real appointment_bookings
-- ============================================

-- MIGRATION TEST (run on copy):
BEGIN;

ALTER TABLE appointment_bookings_test
ADD COLUMN IF NOT EXISTS clinic_id INT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS clinic_responded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS notifications_sent JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update status constraint
ALTER TABLE appointment_bookings_test 
DROP CONSTRAINT IF EXISTS appointment_bookings_status_check;

ALTER TABLE appointment_bookings_test
ADD CONSTRAINT appointment_bookings_test_status_check CHECK (
  status IN ('pending', 'confirmed', 'rejected', 'expired', 'cancelled', 'completed')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_test_clinic_id ON appointment_bookings_test(clinic_id);
CREATE INDEX IF NOT EXISTS idx_bookings_test_expires_at ON appointment_bookings_test(expires_at);
CREATE INDEX IF NOT EXISTS idx_bookings_test_notifications ON appointment_bookings_test USING GIN (notifications_sent);

-- Add foreign key constraint
ALTER TABLE appointment_bookings_test
ADD CONSTRAINT fk_clinic_test 
FOREIGN KEY (clinic_id) 
REFERENCES clinics_data(id)
ON DELETE RESTRICT;  -- Prevent deleting clinics that have bookings

COMMIT;

-- ============================================
-- VERIFICATION (check test table)
-- ============================================

-- Check new columns added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'appointment_bookings_test' 
  AND column_name IN ('clinic_id', 'expires_at', 'notifications_sent', 'rejection_reason')
ORDER BY column_name;

-- Check indexes created
SELECT indexname FROM pg_indexes 
WHERE tablename = 'appointment_bookings_test'
ORDER BY indexname;

-- Check constraint exists
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'appointment_bookings_test'
ORDER BY constraint_name;

-- ============================================
-- CLEANUP (delete test table when done)
-- ============================================

/*
DROP TABLE IF EXISTS appointment_bookings_test CASCADE;
*/
