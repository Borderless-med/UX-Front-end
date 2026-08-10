-- ============================================
-- PRODUCTION MIGRATION: Dual-Path OTP System
-- Date: August 10, 2026
-- Purpose: Support both WhatsApp and Email OTP delivery
-- ============================================

BEGIN;

-- ============================================
-- PART 1: Create New OTP Verifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL, -- Can be email or phone number
  code VARCHAR(6) NOT NULL,
  booking_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER NOT NULL DEFAULT 0
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_otp_identifier ON public.otp_verifications(identifier);
CREATE INDEX IF NOT EXISTS idx_otp_code ON public.otp_verifications(code);
CREATE INDEX IF NOT EXISTS idx_otp_booking_hash ON public.otp_verifications(booking_hash);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON public.otp_verifications(expires_at);

-- Enable Row Level Security
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow insert for anyone (needed for OTP generation)
CREATE POLICY "Anyone can request OTP" 
ON public.otp_verifications 
FOR INSERT 
WITH CHECK (true);

-- Allow select/update for service role (backend verification)
CREATE POLICY "Service role can verify OTP" 
ON public.otp_verifications 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- PART 2: Add Communication Preference to Bookings
-- ============================================
DO $$ 
BEGIN
  -- Add communication_preference column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointment_bookings' 
    AND column_name = 'communication_preference'
  ) THEN
    ALTER TABLE public.appointment_bookings
    ADD COLUMN communication_preference VARCHAR(20) NOT NULL DEFAULT 'both' 
    CHECK (communication_preference IN ('both', 'email_only'));
  END IF;
END $$;

-- ============================================
-- PART 3: Auto-cleanup Function for Old OTPs
-- ============================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_verifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete OTPs expired more than 1 hour ago
  DELETE FROM public.otp_verifications
  WHERE expires_at < now() - INTERVAL '1 hour';
END;
$$;

COMMIT;

-- ============================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================
-- DROP TABLE IF EXISTS public.otp_verifications CASCADE;
-- ALTER TABLE public.appointment_bookings DROP COLUMN IF EXISTS communication_preference;
-- DROP FUNCTION IF EXISTS public.cleanup_expired_otp_verifications();
