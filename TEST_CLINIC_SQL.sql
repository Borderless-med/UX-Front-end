-- ============================================
-- TEST CLINIC CREATION
-- Date: June 1, 2026
-- Purpose: Create test clinic for booking system testing
-- DELETE AFTER TEST COMPLETION
-- ============================================

-- STEP 1: Create test clinic
INSERT INTO clinics_data (
  name,
  address,
  contact_email,
  whatsapp_number
) VALUES (
  'TEST CLINIC - DO NOT BOOK',
  '123 Test Street, Johor Bahru',
  'gohseowping@gmail.com',
  '+6582229202'
)
RETURNING id, name, contact_email;

-- ============================================
-- STEP 4: Verify database entry (run after booking created)
-- ============================================
SELECT 
  booking_ref,
  status,
  clinic_id,
  patient_name,
  patient_email,
  treatment_type,
  preferred_date,
  preferred_time,
  expires_at,
  notifications_sent,
  created_at
FROM appointment_bookings
WHERE patient_email = 'gohseowping@gmail.com'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- STEP 5: Verify status after clicking Confirm button
-- ============================================
SELECT 
  booking_ref,
  status,
  clinic_responded_at,
  notifications_sent
FROM appointment_bookings
WHERE patient_email = 'gohseowping@gmail.com'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- STEP 7: Verify auto-expiry (if testing 2nd booking)
-- ============================================
SELECT 
  booking_ref,
  status,
  expires_at,
  notifications_sent
FROM appointment_bookings
WHERE patient_email = 'gohseowping@gmail.com'
  AND status = 'expired'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- CLEANUP: Delete test data after test completion
-- ============================================

-- Delete test bookings
DELETE FROM appointment_bookings
WHERE patient_email = 'gohseowping@gmail.com';

-- Delete test clinic
DELETE FROM clinics_data
WHERE name = 'TEST CLINIC - DO NOT BOOK';

-- Verify cleanup (should return 0 rows)
SELECT * FROM appointment_bookings WHERE patient_email = 'gohseowping@gmail.com';
SELECT * FROM clinics_data WHERE name = 'TEST CLINIC - DO NOT BOOK';
