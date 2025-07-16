-- Add missing security settings to existing vector functions
-- This approach preserves the existing function logic while adding required security settings

-- Fix match_clinics function security settings
ALTER FUNCTION public.match_clinics(extensions.vector, text, integer) 
SECURITY DEFINER;

-- Fix match_documents function security settings  
ALTER FUNCTION public.match_documents(extensions.vector, double precision, integer) 
SECURITY DEFINER;