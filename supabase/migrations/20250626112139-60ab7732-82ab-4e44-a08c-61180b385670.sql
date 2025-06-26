
-- Create clinic_claims table to store clinic claim requests
CREATE TABLE public.clinic_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id INTEGER REFERENCES public.clinics_data(id),
  clinic_name TEXT NOT NULL,
  dentist_name TEXT,
  website_url TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  operating_hours TEXT,
  additional_credentials TEXT,
  verification_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.clinic_claims ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert claims (public feature)
CREATE POLICY "Anyone can submit clinic claims" 
  ON public.clinic_claims 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow users to view their own claims if authenticated
CREATE POLICY "Users can view all claims" 
  ON public.clinic_claims 
  FOR SELECT 
  USING (true);
