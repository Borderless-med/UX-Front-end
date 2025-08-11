-- Fix security issues from the previous migration

-- Enable RLS on booking_ref_counter table
ALTER TABLE public.booking_ref_counter ENABLE ROW LEVEL SECURITY;

-- Create policies for booking_ref_counter (admin only access)
CREATE POLICY "Only system can access booking ref counter" 
ON public.booking_ref_counter 
FOR ALL 
USING (false);

-- Fix the update_updated_at_column function to have secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;