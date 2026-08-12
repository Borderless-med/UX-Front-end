-- ============================================
-- TEST URGENT NUDGE CRON JOB
-- Creates a booking that expires in 35 minutes
-- This will trigger urgent_clinic_nudge email to clinic AND admin
-- ============================================

-- Step 1: Get a real clinic ID from your database
-- Run this first to see available clinics:
SELECT id, name, contact_email, whatsapp_number 
FROM clinics_data 
WHERE contact_email IS NOT NULL 
LIMIT 5;

-- OR for Singapore clinics:
SELECT id, name, contact_email, whatsapp_number 
FROM sg_clinics 
WHERE contact_email IS NOT NULL 
LIMIT 5;

-- ============================================
-- Step 2: Insert test booking (UPDATE clinic_id below!)
-- ============================================

INSERT INTO appointment_bookings (
  booking_ref,
  patient_name,
  email,
  whatsapp,
  treatment_type,
  preferred_date,
  time_slot,
  clinic_location,
  clinic_id,  -- IMPORTANT: Use a real clinic_id from Step 1
  status,
  expires_at,
  created_at,
  updated_at,
  clinic_responded_at,
  notifications_sent
)
VALUES (
  'APT-TEST-NUDGE-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'),  -- Unique ref with timestamp
  'Test Patient - Urgent Nudge',
  'gohseowping@gmail.com',  -- Your email to verify notifications
  '+6582229202',
  'Dental Cleaning',
  (CURRENT_DATE + INTERVAL '2 days'),  -- Appointment 2 days from now
  '14:00',
  'TEST CLINIC - DO NOT BOOK',
  1,  -- ⚠️ CHANGE THIS to a real clinic_id from Step 1
  'pending',
  NOW() + INTERVAL '35 minutes',  -- Expires in 35 min (within 30-45 min window)
  NOW(),
  NOW(),
  NULL,  -- No clinic response yet (required for nudge)
  '[]'::jsonb  -- Empty array - hasn't been nudged yet
);

-- ============================================
-- Step 3: Verify the booking was created
-- ============================================

SELECT 
  booking_ref,
  patient_name,
  clinic_location,
  status,
  created_at,
  expires_at,
  EXTRACT(EPOCH FROM (expires_at - NOW())) / 60 as minutes_until_expiry,
  clinic_responded_at,
  notifications_sent
FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%'
ORDER BY created_at DESC
LIMIT 1;

-- Expected result: minutes_until_expiry should be ~35

-- ============================================
-- Step 4: Trigger the cron job manually
-- ============================================

-- Option A: Use GitHub Actions workflow_dispatch
-- Go to: https://github.com/gohseowping/sg-smile-saver/actions
-- Click: "Send Urgent Nudges" workflow
-- Click: "Run workflow" button
-- Select branch: main
-- Click: "Run workflow"

-- Option B: Call the endpoint directly (if you have the CRON_SECRET)
-- POST https://orachope.org/api/cron/send-urgent-nudges
-- Header: X-Cron-Secret: <your-cron-secret>

-- ============================================
-- Step 5: Expected Results
-- ============================================

-- After cron runs, you should receive 2 emails:

-- Email 1: Clinic receives urgent nudge
-- TO: clinic's contact_email
-- SUBJECT: ⚠️ Urgent: Booking Request Expiring Soon
-- Contains: Response buttons, booking details, expiry time

-- Email 2: Admin notification
-- TO: contact@orachope.org
-- SUBJECT: ⚠️ ADMIN: Booking Expiring Soon - APT-TEST-NUDGE-xxx
-- Contains: Booking details, minutes remaining, HTML table format

-- ============================================
-- Step 6: Verify emails were sent
-- ============================================

-- Check the notifications_sent array was updated:
SELECT 
  booking_ref,
  notifications_sent
FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%'
ORDER BY created_at DESC
LIMIT 1;

-- Expected: notifications_sent should contain entry with type: "urgent_clinic_nudge"

-- ============================================
-- Step 7: Cleanup (AFTER testing)
-- ============================================

-- Delete the test booking:
DELETE FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';

-- Verify deletion:
SELECT COUNT(*) 
FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';
-- Expected: 0

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If cron doesn't pick up the booking, check:

-- 1. Status must be 'pending':
SELECT booking_ref, status FROM appointment_bookings 
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';

-- 2. Must not have clinic_responded_at:
SELECT booking_ref, clinic_responded_at FROM appointment_bookings 
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';

-- 3. Must be in 30-45 min window:
SELECT 
  booking_ref,
  expires_at,
  EXTRACT(EPOCH FROM (expires_at - NOW())) / 60 as minutes_until_expiry
FROM appointment_bookings 
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';

-- 4. Must not have been nudged yet:
SELECT 
  booking_ref,
  notifications_sent
FROM appointment_bookings 
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';
-- Should NOT contain type: "urgent_clinic_nudge"

-- 5. Check Vercel logs for errors:
-- Go to: https://vercel.com/gohseowpings-projects/sg-smile-saver/logs
-- Filter: send-urgent-nudges

-- ============================================
-- ALTERNATIVE: Test with existing booking
-- ============================================

-- If you have an existing pending booking, update it:
UPDATE appointment_bookings
SET 
  expires_at = NOW() + INTERVAL '35 minutes',
  clinic_responded_at = NULL,
  notifications_sent = '[]'::jsonb
WHERE booking_ref = 'APT-2026-000103'  -- Use real booking ref
AND status = 'pending';

-- ============================================
-- NOTES
-- ============================================

-- Cron schedule: Runs every 15 minutes
-- Window: 30-45 minutes before expiry
-- Prevents duplicate: Checks notifications_sent array
-- Admin notification: Sends to contact@orachope.org
-- Clinic notification: Sends to clinic's contact_email + WhatsApp

-- Free tier limits:
-- SMTP2GO: 1,000 emails/month
-- Each nudge sends 2 emails (clinic + admin)
