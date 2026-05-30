-- ============================================
-- PRODUCTION MIGRATION: Upgrade appointment_bookings for WhatsApp Booking System
-- Date: May 28, 2026
-- Author: OraChope Team
-- Risk Level: LOW (0 existing rows, safe additions only)
-- Estimated Time: 5 seconds
-- Reversible: Yes (rollback script at bottom)
-- ============================================

-- IMPORTANT: Run test script first (20260528_TEST_create_bookings_copy.sql)

BEGIN;

-- ============================================
-- PART 1: Add New Columns
-- ============================================

ALTER TABLE appointment_bookings

-- Clinic relationship (replaces clinic_location TEXT)
ADD COLUMN IF NOT EXISTS clinic_id INT,

-- Booking workflow timing
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS clinic_responded_at TIMESTAMPTZ,

-- Rejection handling
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,

-- Notifications tracking (JSONB for flexible logging)
ADD COLUMN IF NOT EXISTS notifications_sent JSONB DEFAULT '[]',

-- Reminder tracking
ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT FALSE,

-- Admin intervention notes
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- ============================================
-- PART 2: Update Status Constraint
-- ============================================

-- Drop old constraint (only has: pending, confirmed, cancelled, completed)
ALTER TABLE appointment_bookings 
DROP CONSTRAINT IF EXISTS appointment_bookings_status_check;

-- Add new constraint (includes: rejected, expired)
ALTER TABLE appointment_bookings
ADD CONSTRAINT appointment_bookings_status_check CHECK (
  status IN ('pending', 'confirmed', 'rejected', 'expired', 'cancelled', 'completed')
);

-- ============================================
-- PART 3: Add Foreign Key Constraint
-- ============================================

-- Ensures clinic_id always points to valid clinic in clinics_data
ALTER TABLE appointment_bookings
ADD CONSTRAINT fk_booking_clinic 
FOREIGN KEY (clinic_id) 
REFERENCES clinics_data(id)
ON DELETE RESTRICT;  -- Prevent deleting clinics that have bookings

-- ============================================
-- PART 4: Create Performance Indexes
-- ============================================

-- Index on clinic_id (for queries like "show all bookings for clinic X")
CREATE INDEX IF NOT EXISTS idx_bookings_clinic_id 
ON appointment_bookings(clinic_id);

-- Index on expires_at (for finding expiring bookings)
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at 
ON appointment_bookings(expires_at) 
WHERE status = 'pending';  -- Partial index (only pending bookings)

-- GIN index on JSONB (for querying notifications)
CREATE INDEX IF NOT EXISTS idx_bookings_notifications 
ON appointment_bookings USING GIN (notifications_sent);

-- Index on clinic_responded_at (for performance metrics)
CREATE INDEX IF NOT EXISTS idx_bookings_responded_at 
ON appointment_bookings(clinic_responded_at)
WHERE clinic_responded_at IS NOT NULL;

-- ============================================
-- PART 5: Set Default Values for Future Bookings
-- ============================================

-- Auto-calculate expires_at when booking created (trigger)
CREATE OR REPLACE FUNCTION set_booking_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Set expiry to 2 hours after creation if status is 'pending'
  IF NEW.status = 'pending' AND NEW.expires_at IS NULL THEN
    NEW.expires_at := NEW.created_at + INTERVAL '2 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_booking_expiry_trigger ON appointment_bookings;
CREATE TRIGGER set_booking_expiry_trigger
BEFORE INSERT ON appointment_bookings
FOR EACH ROW
EXECUTE FUNCTION set_booking_expiry();

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- Run these after migration to confirm success
-- ============================================

-- 1. Check row count (should be 0 currently)
SELECT COUNT(*) AS total_bookings FROM appointment_bookings;

-- 2. Check new columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'appointment_bookings' 
  AND column_name IN (
    'clinic_id', 
    'expires_at', 
    'clinic_responded_at',
    'rejection_reason',
    'notifications_sent', 
    'reminder_24h_sent',
    'admin_notes'
  )
ORDER BY column_name;

-- 3. Check indexes created
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'appointment_bookings'
  AND indexname LIKE 'idx_bookings_%'
ORDER BY indexname;

-- 4. Check foreign key constraint exists
SELECT
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'appointment_bookings' 
  AND tc.constraint_type = 'FOREIGN KEY';

-- 5. Check status constraint updated
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'appointment_bookings_status_check';

-- 6. Test insert (should work with new columns)
/*
INSERT INTO appointment_bookings (
  patient_name,
  email,
  whatsapp,
  treatment_type,
  preferred_date,
  time_slot,
  clinic_id,  -- NEW: use INT instead of clinic_location TEXT
  consent_given,
  status
) VALUES (
  'Test Patient',
  'test@example.com',
  '+65 9123 4567',
  'Dental Checkup',
  CURRENT_DATE + INTERVAL '7 days',
  'Morning',
  1,  -- Must be valid clinic_id from clinics_data
  true,
  'pending'
);

-- Verify expiry auto-set (should be created_at + 2 hours)
SELECT 
  booking_ref,
  created_at,
  expires_at,
  expires_at - created_at AS time_until_expiry
FROM appointment_bookings 
WHERE patient_name = 'Test Patient';

-- Delete test booking
DELETE FROM appointment_bookings WHERE patient_name = 'Test Patient';
*/

-- ============================================
-- ROLLBACK SCRIPT
-- If migration fails, run this to undo changes
-- ============================================

/*
BEGIN;

-- Remove trigger
DROP TRIGGER IF EXISTS set_booking_expiry_trigger ON appointment_bookings;
DROP FUNCTION IF EXISTS set_booking_expiry();

-- Remove indexes
DROP INDEX IF EXISTS idx_bookings_clinic_id;
DROP INDEX IF EXISTS idx_bookings_expires_at;
DROP INDEX IF EXISTS idx_bookings_notifications;
DROP INDEX IF EXISTS idx_bookings_responded_at;

-- Remove foreign key
ALTER TABLE appointment_bookings
DROP CONSTRAINT IF EXISTS fk_booking_clinic;

-- Remove new columns
ALTER TABLE appointment_bookings
DROP COLUMN IF EXISTS clinic_id,
DROP COLUMN IF EXISTS expires_at,
DROP COLUMN IF EXISTS clinic_responded_at,
DROP COLUMN IF EXISTS rejection_reason,
DROP COLUMN IF EXISTS notifications_sent,
DROP COLUMN IF EXISTS reminder_24h_sent,
DROP COLUMN IF EXISTS admin_notes;

-- Restore old status constraint
ALTER TABLE appointment_bookings 
DROP CONSTRAINT IF EXISTS appointment_bookings_status_check;

ALTER TABLE appointment_bookings
ADD CONSTRAINT appointment_bookings_status_check CHECK (
  status IN ('pending', 'confirmed', 'cancelled', 'completed')
);

COMMIT;
*/

-- ============================================
-- POST-MIGRATION NOTES
-- ============================================

-- IMPORTANT: clinic_location (TEXT) column still exists as backup
-- You can drop it later after confirming clinic_id works well:
-- ALTER TABLE appointment_bookings DROP COLUMN clinic_location;

-- NEXT STEPS:
-- 1. Update booking form to use clinic_id instead of clinic_location
-- 2. Build WhatsApp notification system
-- 3. Create cron job for expiry checks (every 15 minutes)
-- 4. Create cron job for 24h reminders (daily at 8 AM)
