-- ============================================
-- TEST CRON JOBS: Create test bookings
-- ============================================

-- TEST 1: Create booking that will expire in 25 minutes (for Urgent Nudge test)
INSERT INTO public.appointment_bookings (
  patient_name,
  email,
  whatsapp,
  treatment_type,
  preferred_date,
  time_slot,
  clinic_location,
  consent_given,
  booking_ref,
  status,
  clinic_id,
  expires_at,
  communication_preference
) VALUES (
  'TEST URGENT NUDGE',
  'gohseowping@gmail.com',
  '+6582229202',
  'General Checkup',
  CURRENT_DATE + INTERVAL '2 days',
  '10:00 AM - 11:00 AM',
  'TEST CLINIC - DO NOT BOOK',
  true,
  'APT-TEST-NUDGE-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'pending',
  222,
  NOW() + INTERVAL '25 minutes', -- Expires in 25 min → Urgent nudge will trigger
  'both'
);

-- TEST 2: Create booking that expired 10 minutes ago (for Check Expired test)
INSERT INTO public.appointment_bookings (
  patient_name,
  email,
  whatsapp,
  treatment_type,
  preferred_date,
  time_slot,
  clinic_location,
  consent_given,
  booking_ref,
  status,
  clinic_id,
  expires_at,
  communication_preference
) VALUES (
  'TEST EXPIRED BOOKING',
  'gohseowping@gmail.com',
  '+6582229202',
  'General Checkup',
  CURRENT_DATE + INTERVAL '2 days',
  '2:00 PM - 3:00 PM',
  'TEST CLINIC - DO NOT BOOK',
  true,
  'APT-TEST-EXPIRED-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'pending',
  222,
  NOW() - INTERVAL '10 minutes', -- Already expired → Check expired will mark it
  'both'
);

-- TEST 3: Create booking for tomorrow (for 24h Reminder test)
-- Note: This will trigger reminder ~24h before appointment
INSERT INTO public.appointment_bookings (
  patient_name,
  email,
  whatsapp,
  treatment_type,
  preferred_date,
  time_slot,
  clinic_location,
  consent_given,
  booking_ref,
  status,
  clinic_id,
  expires_at,
  communication_preference
) VALUES (
  'TEST 24H REMINDER',
  'gohseowping@gmail.com',
  '+6582229202',
  'General Checkup',
  CURRENT_DATE + INTERVAL '1 day', -- Tomorrow
  '10:00 AM - 11:00 AM',
  'TEST CLINIC - DO NOT BOOK',
  true,
  'APT-TEST-REMINDER-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'confirmed', -- Must be confirmed to get reminder
  222,
  NOW() + INTERVAL '3 hours',
  'both'
);

-- ============================================
-- Query to check test bookings created
-- ============================================
SELECT 
  booking_ref,
  patient_name,
  status,
  expires_at,
  (expires_at - NOW()) as time_until_expiry,
  preferred_date,
  time_slot
FROM public.appointment_bookings
WHERE patient_name LIKE 'TEST%'
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- CLEANUP: Delete test bookings after testing
-- ============================================
-- DELETE FROM public.appointment_bookings WHERE patient_name LIKE 'TEST%';
