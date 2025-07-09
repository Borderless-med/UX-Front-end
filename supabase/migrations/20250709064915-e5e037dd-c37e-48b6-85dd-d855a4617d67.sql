
-- FINAL MIGRATION: Complete fix for all Supabase function security warnings
-- This migration ensures all functions have proper SECURITY DEFINER and SET search_path settings

-- Step 1: Drop and recreate match_documents function to ensure clean security configuration
DROP FUNCTION IF EXISTS public.match_documents(vector, double precision, integer);

CREATE FUNCTION public.match_documents(
  query_embedding vector,
  match_threshold double precision,
  match_count integer
)
RETURNS TABLE(
  id bigint,
  text_content text,
  similarity double precision,
  metadata jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    cd.id,
    -- Build descriptive text from actual columns
    cd.name
      || ' – Address: ' || COALESCE(cd.address, 'N/A')
      || ' – Township: ' || COALESCE(cd.township, 'N/A')
      || ' – Rating: ' || COALESCE(cd.rating::text, 'N/A')
      || ' – Distance: ' || COALESCE(cd.distance::text, 'N/A')
      AS text_content,
    1 - (cd.embedding <=> query_embedding) AS similarity,
    to_jsonb(cd) - 'embedding' AS metadata
  FROM public.clinics_data AS cd
  WHERE 1 - (cd.embedding <=> query_embedding) > match_threshold
  ORDER BY cd.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Step 2: Explicitly set security configuration for all other functions using ALTER FUNCTION
ALTER FUNCTION public.log_consent(UUID, TEXT, BOOLEAN, TEXT, TEXT, JSONB) SECURITY DEFINER;
ALTER FUNCTION public.log_consent(UUID, TEXT, BOOLEAN, TEXT, TEXT, JSONB) SET search_path = '';

ALTER FUNCTION public.has_valid_consent(UUID) SECURITY DEFINER;
ALTER FUNCTION public.has_valid_consent(UUID) SET search_path = '';

ALTER FUNCTION public.audit_data_access(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) SECURITY DEFINER;
ALTER FUNCTION public.audit_data_access(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) SET search_path = '';

-- Step 3: Verify all functions are properly configured by updating them one more time
CREATE OR REPLACE FUNCTION public.log_consent(
  p_user_id UUID,
  p_consent_type TEXT,
  p_consent_status BOOLEAN,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_consent_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  consent_id UUID;
BEGIN
  INSERT INTO public.consent_logs (
    user_id, consent_type, consent_status, ip_address, user_agent, consent_details
  ) VALUES (
    p_user_id, p_consent_type, p_consent_status, p_ip_address, p_user_agent, p_consent_details
  ) RETURNING id INTO consent_id;
  
  RETURN consent_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_valid_consent(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  has_consent BOOLEAN := FALSE;
  opt_out_exists BOOLEAN := FALSE;
BEGIN
  -- Check if user has opted out
  SELECT EXISTS(
    SELECT 1 FROM public.opt_out_requests 
    WHERE user_id = p_user_id AND status = 'processed'
  ) INTO opt_out_exists;
  
  IF opt_out_exists THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user has given initial consent
  SELECT EXISTS(
    SELECT 1 FROM public.consent_logs 
    WHERE user_id = p_user_id 
    AND consent_type = 'initial_registration' 
    AND consent_status = TRUE
  ) INTO has_consent;
  
  RETURN has_consent;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_data_access(
  p_user_id UUID,
  p_data_type TEXT,
  p_clinic_id TEXT DEFAULT NULL,
  p_practitioner_name TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.data_access_audit (
    user_id, accessed_data_type, clinic_id, practitioner_name, 
    ip_address, user_agent
  ) VALUES (
    p_user_id, p_data_type, p_clinic_id, p_practitioner_name,
    p_ip_address, p_user_agent
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;
