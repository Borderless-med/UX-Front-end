-- Create table for WhatsApp OTP verification
-- Stores temporary OTPs sent to users before booking confirmation
CREATE TABLE IF NOT EXISTS public.booking_otp_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  booking_hash TEXT NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  attempts INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.booking_otp_verification ENABLE ROW LEVEL SECURITY;

-- Allow insert for anyone (needed for OTP generation)
CREATE POLICY "Anyone can request OTP" 
ON public.booking_otp_verification 
FOR INSERT 
WITH CHECK (true);

-- Allow select/update only for service role (backend verification)
CREATE POLICY "Service role can verify OTP" 
ON public.booking_otp_verification 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_booking_otp_hash ON public.booking_otp_verification(booking_hash);
CREATE INDEX idx_booking_otp_whatsapp ON public.booking_otp_verification(whatsapp);
CREATE INDEX idx_booking_otp_expires ON public.booking_otp_verification(expires_at);

-- Auto-cleanup function: Delete expired OTPs older than 1 hour
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.booking_otp_verification
  WHERE expires_at < now() - INTERVAL '1 hour';
END;
$$;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-otps', '*/30 * * * *', 'SELECT public.cleanup_expired_otps()');

COMMENT ON TABLE public.booking_otp_verification IS 'Stores temporary OTP codes for WhatsApp verification during booking process';
COMMENT ON COLUMN public.booking_otp_verification.booking_hash IS 'Unique hash to link OTP request with booking submission';
COMMENT ON COLUMN public.booking_otp_verification.otp_code IS '6-digit verification code sent to user via WhatsApp';
COMMENT ON COLUMN public.booking_otp_verification.expires_at IS 'OTP expiry time (5 minutes from creation)';
COMMENT ON COLUMN public.booking_otp_verification.attempts IS 'Number of verification attempts (max 3)';
