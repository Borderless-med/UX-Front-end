-- ============================================
-- FIX: Drop time_slot check constraint to allow specific times
-- Issue: Constraint only allows "Morning/Afternoon/Evening" but alternatives 
--        feature needs to store specific times like "09:00", "14:00", etc.
-- Date: June 9, 2026
-- ============================================

-- Check current constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'appointment_bookings'::regclass
  AND conname LIKE '%time_slot%';

-- Drop the constraint to allow any time format
ALTER TABLE appointment_bookings 
DROP CONSTRAINT IF EXISTS appointment_bookings_time_slot_check;

-- Verify constraint is gone
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'appointment_bookings'::regclass
  AND conname LIKE '%time_slot%';

-- Alternative: If you want to keep some validation, add a more flexible constraint
-- ALTER TABLE appointment_bookings 
-- ADD CONSTRAINT appointment_bookings_time_slot_flexible
-- CHECK (
--   time_slot IN ('Morning', 'Afternoon', 'Evening') OR 
--   time_slot ~ '^\d{2}:\d{2}$'  -- Allows HH:MM format
-- );
