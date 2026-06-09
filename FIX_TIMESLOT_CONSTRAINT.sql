-- ============================================
-- FIX: Drop time_slot check constraint to allow specific times
-- Issue: Constraint only allows "Morning/Afternoon/Evening" but users 
--        need to book specific times like "09:00", "14:00" for better planning.
-- Date: June 9, 2026
-- CRITICAL: Run this in Supabase SQL Editor NOW
-- ============================================

-- Step 1: Check current constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'appointment_bookings'::regclass
  AND conname LIKE '%time_slot%';

-- Step 2: Drop the restrictive constraint
ALTER TABLE appointment_bookings 
DROP CONSTRAINT IF EXISTS appointment_bookings_time_slot_check;

-- Step 3: Verify constraint is gone
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'appointment_bookings'::regclass
  AND conname LIKE '%time_slot%';

-- Expected result: 0 rows (constraint removed)

-- ============================================
-- RESULT: time_slot column now accepts ANY text value:
-- - "09:00", "14:30", "16:00" (specific times) ✅
-- - "Morning", "Afternoon", "Evening" (categories) ✅
-- - Any other format if needed ✅
-- ============================================
