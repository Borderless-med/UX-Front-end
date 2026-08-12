-- ============================================
-- SIMPLIFIED TEST FOR URGENT NUDGE
-- Uses existing "TEST CLINIC - DO NOT BOOK" with your email
-- ============================================

-- Step 1: Get the clinic_id for TEST CLINIC
SELECT id, name, contact_email, whatsapp_number
FROM clinics_data
WHERE name ILIKE '%TEST CLINIC%DO NOT BOOK%';

-- Copy the `id` from result above (e.g., 123)

-- ============================================
-- Step 2: Insert test booking (UPDATE clinic_id!)
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
  clinic_id,  -- ⚠️ Use the id from Step 1
  status,
  expires_at,
  created_at,
  updated_at,
  clinic_responded_at,
  notifications_sent
)
VALUES (
  'APT-TEST-NUDGE-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS'),
  'Test Patient - Urgent Nudge Test',
  'gohseowping@gmail.com',
  '+6582229202',
  'Dental Cleaning',
  CURRENT_DATE + 2,
  '14:00',
  'TEST CLINIC - DO NOT BOOK',
  123,  -- ⚠️ CHANGE THIS to the id from Step 1
  'pending',
  NOW() + INTERVAL '35 minutes',
  NOW(),
  NOW(),
  NULL,
  '[]'::jsonb
);

-- ============================================
-- Step 3: Verify booking created
-- ============================================

SELECT 
  booking_ref,
  status,
  ROUND(EXTRACT(EPOCH FROM (expires_at - NOW())) / 60) as minutes_until_expiry,
  clinic_responded_at,
  notifications_sent
FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%'
ORDER BY created_at DESC
LIMIT 1;

-- Expected: minutes_until_expiry ≈ 35

-- ============================================
-- Step 4: Trigger cron via GitHub Actions
-- ============================================

-- 1. Go to: https://github.com/gohseowping/sg-smile-saver/actions
-- 2. Click: "Send Urgent Nudges" (left sidebar)
-- 3. Click: "Run workflow" button (top right)
-- 4. Select: main branch
-- 5. Click: "Run workflow" (green button)

-- ============================================
-- Step 5: Expected Results
-- ============================================

-- YOU WILL RECEIVE 2 EMAILS:

-- Email 1: Clinic Urgent Nudge (to your email as clinic)
-- FROM: noreply@orachope.org
-- TO: your email (clinic email)
-- SUBJECT: ⚠️ Urgent: Booking Request Expiring Soon
-- CONTAINS: Response buttons (Confirm/Reject/Alternative), booking details

-- Email 2: Admin Notification (to contact@orachope.org)
-- FROM: noreply@orachope.org  
-- TO: contact@orachope.org
-- SUBJECT: ⚠️ ADMIN: Booking Expiring Soon - APT-TEST-NUDGE-xxx
-- CONTAINS: Minutes remaining, booking details, HTML table

-- ============================================
-- Step 6: Check notifications were logged
-- ============================================

SELECT 
  booking_ref,
  notifications_sent
FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%'
ORDER BY created_at DESC
LIMIT 1;

-- Expected: notifications_sent contains entry with:
-- {"type": "urgent_clinic_nudge", "status": "sent", "timestamp": "..."}

-- ============================================
-- Step 7: Cleanup
-- ============================================

DELETE FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';

-- Verify:
SELECT COUNT(*) FROM appointment_bookings
WHERE booking_ref LIKE 'APT-TEST-NUDGE-%';
-- Expected: 0
