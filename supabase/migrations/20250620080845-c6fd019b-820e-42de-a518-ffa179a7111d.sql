
-- Create a table for waitlist signups
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - making it public since this is a waitlist signup
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can sign up for waitlist" 
  ON public.waitlist_signups 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading (for admin purposes)
CREATE POLICY "Allow read access to waitlist signups" 
  ON public.waitlist_signups 
  FOR SELECT 
  USING (true);
