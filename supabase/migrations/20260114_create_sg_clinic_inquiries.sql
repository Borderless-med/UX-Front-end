-- Create table for SG clinic inquiries
CREATE TABLE IF NOT EXISTS public.sg_clinic_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id INT,
  clinic_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_whatsapp TEXT,
  inquiry_message TEXT NOT NULL,
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'whatsapp', 'either')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  response_notes TEXT
);

-- Create index for faster queries
CREATE INDEX idx_sg_inquiries_status ON public.sg_clinic_inquiries(status);
CREATE INDEX idx_sg_inquiries_created ON public.sg_clinic_inquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.sg_clinic_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert inquiries
CREATE POLICY "Allow anonymous inquiry submission" 
  ON public.sg_clinic_inquiries
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all inquiries
CREATE POLICY "Allow authenticated users to view inquiries"
  ON public.sg_clinic_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update inquiries
CREATE POLICY "Allow authenticated users to update inquiries"
  ON public.sg_clinic_inquiries
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE public.sg_clinic_inquiries IS 'Stores user inquiries for Singapore clinics with contact preferences';
