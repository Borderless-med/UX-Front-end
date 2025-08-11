-- CRITICAL SECURITY FIXES: Enable RLS and Update Functions

-- Phase 1: Enable RLS on publicly exposed tables
ALTER TABLE public.clinics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Clinic  Detail" ENABLE ROW LEVEL SECURITY;

-- Phase 2: Update database functions with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, purpose_of_use, user_category, email_domain)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data ->> 'purpose_of_use', 'General use'),
    COALESCE((NEW.raw_user_meta_data ->> 'user_category')::public.user_category, 'patient'),
    SPLIT_PART(NEW.email, '@', 2)
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_tables()
 RETURNS TABLE(table_name text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  select table_name
    from information_schema.tables
   where table_schema = 'public'
     and table_type = 'BASE TABLE'
  order by table_name;
$function$;

CREATE OR REPLACE FUNCTION public.get_table_columns(p_table_name text)
 RETURNS TABLE(column_name text, data_type text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  select column_name, data_type
    from information_schema.columns
   where table_schema = 'public'
     and table_name = p_table_name
   order by ordinal_position;
$function$;

CREATE OR REPLACE FUNCTION public.audit_data_access(p_user_id uuid, p_data_type text, p_clinic_id text DEFAULT NULL::text, p_practitioner_name text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.has_valid_consent(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.log_consent(p_user_id uuid, p_consent_type text, p_consent_status boolean, p_ip_address text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text, p_consent_details jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- Phase 3: Update clinic_claims RLS policies for better access control
DROP POLICY IF EXISTS "Users can view all claims" ON public.clinic_claims;

CREATE POLICY "Admin and submitters can view claims" 
ON public.clinic_claims 
FOR SELECT 
USING (
  ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
  ((auth.jwt() ->> 'email'::text) = contact_email)
);

-- Phase 4: Add more restrictive policies for clinic data access
DROP POLICY IF EXISTS "Allow public read access to clinics data" ON public.clinics_data;

CREATE POLICY "Authenticated users can read clinic data" 
ON public.clinics_data 
FOR SELECT 
USING (auth.role() = 'authenticated');