-- Debug script to check failing bookings
-- Run this in Supabase SQL Editor

SELECT 
    booking_ref,
    status,
    patient_name,
    email,
    clinic_id,
    clinic_location,
    preferred_date,
    time_slot,
    admin_notes,
    created_at,
    updated_at,
    clinic_responded_at,
    confirmed_at,
    expires_at
FROM appointment_bookings
WHERE booking_ref IN ('APT-2026-000026', 'APT-2026-000027', 'APT-2026-000028')
ORDER BY created_at DESC;

-- Check the admin_notes structure
SELECT 
    booking_ref,
    admin_notes::text as admin_notes_text,
    length(admin_notes::text) as notes_length,
    pg_typeof(admin_notes) as notes_type
FROM appointment_bookings
WHERE booking_ref IN ('APT-2026-000026', 'APT-2026-000027', 'APT-2026-000028');

-- Check if there are any constraints on the table
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'appointment_bookings'::regclass;
