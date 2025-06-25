
-- Add WhatsApp consent and double opt-in columns to waitlist_signups table
ALTER TABLE public.waitlist_signups 
ADD COLUMN whatsapp_consent BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN consent_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN double_optin_confirmed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN confirmation_token TEXT,
ADD COLUMN confirmation_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index on confirmation_token for faster lookups
CREATE INDEX idx_waitlist_signups_confirmation_token ON public.waitlist_signups(confirmation_token);

-- Update RLS policy to allow updates for confirmation (users confirming their opt-in)
CREATE POLICY "Allow confirmation token updates" 
  ON public.waitlist_signups 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);
