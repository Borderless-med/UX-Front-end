-- DEBUG: Check booking and clinic data mismatch

-- 1. Check what clinic_location was saved in the booking (with length and encoding)
SELECT 
  booking_ref,
  clinic_location,
  LENGTH(clinic_location) as name_length,
  OCTET_LENGTH(clinic_location) as byte_length,
  patient_name,
  email,
  created_at
FROM appointment_bookings
WHERE booking_ref IN ('APT-2026-000007', 'APT-2026-000008', 'APT-2026-000009')
ORDER BY created_at DESC;

-- 2. Check the exact clinic name in database (with length)
SELECT 
  id,
  name,
  LENGTH(name) as name_length,
  OCTET_LENGTH(name) as byte_length,
  contact_email,
  whatsapp_number,
  address
FROM clinics_data
WHERE id = 223;

-- 3. Try to match them with different comparison methods
SELECT 
  b.booking_ref,
  b.clinic_location AS booking_clinic_name,
  c.name AS database_clinic_name,
  c.contact_email,
  CASE 
    WHEN b.clinic_location = c.name THEN 'EXACT MATCH (=) ✓'
    WHEN b.clinic_location ILIKE c.name THEN 'ILIKE MATCH ✓'
    WHEN LOWER(TRIM(b.clinic_location)) = LOWER(TRIM(c.name)) THEN 'TRIMMED MATCH ✓'
    ELSE 'NO MATCH ✗'
  END AS match_status,
  LENGTH(b.clinic_location) as booking_length,
  LENGTH(c.name) as db_length
FROM appointment_bookings b
LEFT JOIN clinics_data c ON c.name ILIKE b.clinic_location
WHERE b.booking_ref = 'APT-2026-000009';

-- 4. Try to find ANY clinic with similar name (wildcard search)
SELECT 
  id,
  name,
  contact_email,
  CASE 
    WHEN name ILIKE '%TEST%CLINIC%' THEN 'CONTAINS TEST CLINIC'
    ELSE 'NO MATCH'
  END AS pattern_match
FROM clinics_data
WHERE name ILIKE '%TEST%CLINIC%';

-- 5. Check all clinic names to see what we have
SELECT 
  id,
  name,
  contact_email,
  LENGTH(name) as name_length
FROM clinics_data
ORDER BY id DESC
LIMIT 10;
