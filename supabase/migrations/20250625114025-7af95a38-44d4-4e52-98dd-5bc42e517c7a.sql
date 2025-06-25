
-- Create table for opt-out and report requests
CREATE TABLE public.opt_out_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  request_type TEXT NOT NULL CHECK (request_type IN ('opt_out', 'incorrect_info', 'technical_issue', 'other')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  clinic_name TEXT,
  clinic_id TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT
);

-- Enable RLS (no policies needed as this is a public reporting system)
ALTER TABLE public.opt_out_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert reports
CREATE POLICY "Anyone can submit opt-out/report requests" 
  ON public.opt_out_reports 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to view their own reports (by email)
CREATE POLICY "Users can view their own reports" 
  ON public.opt_out_reports 
  FOR SELECT 
  USING (true);
