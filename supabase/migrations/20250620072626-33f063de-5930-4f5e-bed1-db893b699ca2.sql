
-- Create the partner applications table to store clinic signup data
CREATE TABLE IF NOT EXISTS public.partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  registration_number TEXT,
  services TEXT,
  experience TEXT,
  why_join TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for basic security
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for public form submissions)
CREATE POLICY "Allow public partner applications" 
ON public.partner_applications 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Create a policy for reading applications (you might want to restrict this later)
CREATE POLICY "Allow reading partner applications" 
ON public.partner_applications 
FOR SELECT 
TO authenticated 
USING (true);
