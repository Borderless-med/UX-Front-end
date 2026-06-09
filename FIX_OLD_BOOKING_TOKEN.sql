-- FIX OLD BOOKING: Add missing clinic_response_token and expires_at
-- This is needed for APT-2026-000012 which was created before the fix

-- Step 1: Check current state of booking
SELECT 
  booking_ref,
  status,
  clinic_response_token,
  expires_at,
  created_at,
  clinic_location
FROM appointment_bookings
WHERE booking_ref = 'APT-2026-000012';

-- Step 2: Update the booking with proper token and expiry
-- Token from email: ea0da30261c0434615f9963bb0310fee
UPDATE appointment_bookings
SET 
  clinic_response_token = 'ea0da30261c0434615f9963bb0310fee',
  expires_at = NOW() + INTERVAL '3 hours'
WHERE booking_ref = 'APT-2026-000012';

-- Step 3: Verify the update
SELECT 
  booking_ref,
  status,
  clinic_response_token,
  expires_at,
  created_at
FROM appointment_bookings
WHERE booking_ref = 'APT-2026-000012';

-- Expected result:
-- booking_ref: APT-2026-000012
-- clinic_response_token: ea0da30261c0434615f9963bb0310fee
-- expires_at: 3 hours from now
-- status: pending
