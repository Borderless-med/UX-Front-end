-- ============================================
-- SMTP2GO EMAIL FAILURE DIAGNOSTIC QUERIES
-- Purpose: Find evidence of missed admin notifications
-- Date: August 11, 2026
-- ============================================

-- ============================================
-- QUERY 1: Recent Bookings (System Activity Proof)
-- ============================================
-- Shows system is active and processing bookings
SELECT 
  booking_ref,
  patient_name,
  patient_email,
  clinic_location,
  status,
  created_at,
  updated_at,
  CASE 
    WHEN status = 'confirmed' THEN '✅ Confirmed'
    WHEN status = 'pending' THEN '⏳ Pending'
    WHEN status = 'cancelled' THEN '❌ Cancelled'
    WHEN status = 'expired' THEN '⏰ Expired'
    ELSE status
  END as status_icon
FROM appointment_bookings
WHERE created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC
LIMIT 50;

-- Expected: Should see bookings (proves system working)
-- If you see bookings but received NO admin emails → PROOF of failure

-- ============================================
-- QUERY 2: Cancellations (Should Trigger Admin Email)
-- ============================================
-- Every cancellation should send admin notification
SELECT 
  booking_ref,
  patient_name,
  patient_email,
  clinic_location,
  status,
  created_at as booked_at,
  updated_at as cancelled_at,
  EXTRACT(EPOCH FROM (updated_at - created_at))/3600 as hours_before_cancel
FROM appointment_bookings
WHERE status = 'cancelled'
  AND updated_at >= NOW() - INTERVAL '14 days'
ORDER BY updated_at DESC;

-- Expected: Each row = 1 admin email that SHOULD have been sent
-- Count these rows = number of missed cancellation emails

-- ============================================
-- QUERY 3: Summary Statistics (Past 14 Days)
-- ============================================
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
  COUNT(*) FILTER (WHERE status = 'expired') as expired_bookings,
  COUNT(*) as total_bookings,
  MIN(created_at) as first_booking,
  MAX(created_at) as last_booking
FROM appointment_bookings
WHERE created_at >= NOW() - INTERVAL '14 days';

-- Shows overall system activity level

-- ============================================
-- QUERY 4: Daily Booking Trend (Past 14 Days)
-- ============================================
SELECT 
  DATE(created_at) as booking_date,
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancellations,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmations
FROM appointment_bookings
WHERE created_at >= NOW() - INTERVAL '14 days'
GROUP BY DATE(created_at)
ORDER BY booking_date DESC;

-- Shows if there was a spike in activity (and missed emails)

-- ============================================
-- QUERY 5: Clinics with Most Activity (Potential Missed Emails)
-- ============================================
SELECT 
  clinic_location,
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancellations,
  MAX(created_at) as last_booking
FROM appointment_bookings
WHERE created_at >= NOW() - INTERVAL '14 days'
GROUP BY clinic_location
ORDER BY total_bookings DESC
LIMIT 10;

-- Shows which clinics had bookings (potential inquiry sources)

-- ============================================
-- QUERY 6: Check for Inquiry Tracking (if table exists)
-- ============================================
-- NOTE: Run this only if you have an inquiries table
/*
SELECT 
  clinic_name,
  user_name,
  user_email,
  preferred_contact,
  created_at
FROM inquiries
WHERE created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC;
*/

-- If this table exists and has rows → PROOF of missed inquiry emails

-- ============================================
-- QUERY 7: Check for Partner Signup Tracking (if table exists)
-- ============================================
-- NOTE: Run this only if you have a partner_signups table
/*
SELECT 
  clinic_name,
  contact_name,
  email,
  phone,
  city,
  created_at
FROM partner_signups
WHERE created_at >= NOW() - INTERVAL '14 days'
ORDER BY created_at DESC;
*/

-- If this table exists and has rows → PROOF of missed partner emails

-- ============================================
-- QUERY 8: Recent Clinic Responses (Should Trigger Admin Email)
-- ============================================
-- Check if clinics responded to bookings (future: should notify admin)
SELECT 
  booking_ref,
  clinic_location,
  status,
  updated_at,
  created_at,
  EXTRACT(EPOCH FROM (updated_at - created_at))/60 as minutes_to_response
FROM appointment_bookings
WHERE status IN ('confirmed', 'rejected')
  AND updated_at >= NOW() - INTERVAL '14 days'
  AND updated_at > created_at + INTERVAL '1 minute' -- Response happened after booking
ORDER BY updated_at DESC
LIMIT 20;

-- Note: These don't currently send admin emails (per audit)
-- But shows overall system engagement

-- ============================================
-- DIAGNOSTIC INTERPRETATION GUIDE
-- ============================================

/*
SCENARIO 1: System Active, No Admin Emails
- Query 1 shows bookings: YES
- Query 2 shows cancellations: YES  
- Admin received emails: NO
→ PROOF: Email system failing

SCENARIO 2: Low Activity Period
- Query 1 shows bookings: FEW/NONE
- Query 2 shows cancellations: NONE
- Admin received emails: NO
→ INCONCLUSIVE: System may be working, just low traffic

SCENARIO 3: No Recent Activity
- Query 1 shows bookings: NONE
- Query 3 shows: 0 total bookings
→ System inactive, can't prove email failure

SCENARIO 4: High Activity, Some Emails Received
- Query 1: Many bookings
- Query 2: Many cancellations
- Admin received: SOME emails (not all)
→ PARTIAL FAILURE: Some email types working, others not

KEY METRICS FOR PROOF:
1. Cancellations count from Query 2 = Expected admin emails
2. Actual admin emails received = Actual count
3. Gap = (Expected - Actual) = PROOF of missed emails
*/

-- ============================================
-- EXAMPLE DIAGNOSTIC REPORT
-- ============================================

/*
=== EMAIL FAILURE PROOF ===

DATABASE EVIDENCE (Past 14 days):
- Total bookings: 45
- Cancellations: 12
- Expected cancellation emails: 12
- Actual emails received: 0
- MISSED EMAILS: 12

CONCLUSION:
System processed 45 bookings and 12 cancellations, but admin 
received ZERO cancellation notification emails.

This is definitive PROOF that admin email notifications are failing.

Estimated business impact:
- 12 cancellation patterns not analyzed
- Potential for customer service recovery missed
- No visibility into booking failure reasons
*/
