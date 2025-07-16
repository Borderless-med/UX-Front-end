-- Phase 1: Enable RLS on Critical Tables (Fix from previous failed migration)
-- Enable RLS on conversations table (CRITICAL - contains user messages)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on embeddings table
ALTER TABLE public.embeddings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for embeddings table (allow public read access for AI functionality)
CREATE POLICY "Allow public read access to embeddings" 
  ON public.embeddings 
  FOR SELECT 
  USING (true);

-- Phase 2: Fix Function Security - Add SET search_path = '' to all functions
-- Fix audit_data_access function
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

-- Fix get_table_columns function
CREATE OR REPLACE FUNCTION public.get_table_columns(p_table_name text)
RETURNS TABLE(column_name text, data_type text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  select column_name, data_type
    from information_schema.columns
   where table_schema = 'public'
     and table_name = p_table_name
   order by ordinal_position;
$$;

-- Fix get_tables function
CREATE OR REPLACE FUNCTION public.get_tables()
RETURNS TABLE(table_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  select table_name
    from information_schema.tables
   where table_schema = 'public'
     and table_type = 'BASE TABLE'
  order by table_name;
$$;

-- Fix has_valid_consent function
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

-- Fix log_consent function
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

-- Fix match_clinics function (Use extensions.vector for consistency)
CREATE OR REPLACE FUNCTION public.match_clinics(
  query_embedding extensions.vector,
  p_township text,
  match_count integer
)
RETURNS TABLE(
  id integer,
  name text,
  address text,
  township text,
  rating numeric,
  reviews integer,
  tooth_filling boolean,
  root_canal boolean,
  dental_crown boolean,
  dental_implant boolean,
  teeth_whitening boolean,
  braces boolean,
  composite_veneers boolean,
  similarity double precision
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cd.id,
    cd.name,
    cd.address,
    cd.township,
    cd.rating,
    cd.reviews,
    cd.tooth_filling,
    cd.root_canal,
    cd.dental_crown,
    cd.dental_implant,
    cd.teeth_whitening,
    cd.braces,
    cd.composite_veneers,
    1 - (cd.embedding <=> query_embedding) as similarity
  FROM
    public.clinics_data cd
  WHERE
    cd.township ILIKE ('%' || p_township || '%')
  ORDER BY
    cd.embedding <=> query_embedding
  LIMIT
    match_count;
END;
$$;

-- Fix match_documents function (Use extensions.vector for consistency)
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding extensions.vector,
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