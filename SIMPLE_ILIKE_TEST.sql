-- SIMPLE TEST: Does ILIKE work?

-- Test 1: Try exact ILIKE query that the code uses
SELECT 
  name,
  contact_email,
  whatsapp_number
FROM clinics_data
WHERE name ILIKE 'TEST CLINIC - DO NOT BOOK';

-- Test 2: Check what the booking has
SELECT 
  booking_ref,
  clinic_location,
  '"' || clinic_location || '"' as with_quotes,
  created_at
FROM appointment_bookings
WHERE booking_ref = 'APT-2026-000009';

-- Test 3: Try the join with ILIKE (exactly what the code does)
SELECT 
  b.booking_ref,
  b.clinic_location as booking_name,
  c.name as db_name,
  c.contact_email
FROM appointment_bookings b
LEFT JOIN clinics_data c ON c.name ILIKE b.clinic_location
WHERE b.booking_ref = 'APT-2026-000009';

-- Test 4: Check for hidden characters (ASCII codes)
SELECT 
  booking_ref,
  clinic_location,
  LENGTH(clinic_location) as length,
  ASCII(SUBSTRING(clinic_location, 1, 1)) as first_char_ascii,
  ASCII(SUBSTRING(clinic_location, LENGTH(clinic_location), 1)) as last_char_ascii
FROM appointment_bookings
WHERE booking_ref = 'APT-2026-000009';

-- Test 5: Compare with database clinic
SELECT 
  name,
  LENGTH(name) as length,
  ASCII(SUBSTRING(name, 1, 1)) as first_char_ascii,
  ASCII(SUBSTRING(name, LENGTH(name), 1)) as last_char_ascii  
FROM clinics_data
WHERE id = 223;
