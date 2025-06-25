
-- Create enum for user categories as per PDPA guidelines
CREATE TYPE public.user_category AS ENUM (
  'patient',
  'healthcare_professional', 
  'clinic_admin',
  'approved_partner'
);

-- Create user profiles table with PDPA-required fields
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  organization TEXT,
  purpose_of_use TEXT NOT NULL,
  user_category user_category NOT NULL DEFAULT 'patient',
  email_domain TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consent logs table for PDPA accountability
CREATE TABLE public.consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'initial_registration', 'data_access', 'opt_out'
  consent_status BOOLEAN NOT NULL,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  consent_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opt-out requests table
CREATE TABLE public.opt_out_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processed', 'rejected'
  processed_date TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create data access audit table
CREATE TABLE public.data_access_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  accessed_data_type TEXT NOT NULL, -- 'practitioner_details', 'mdc_numbers'
  clinic_id TEXT,
  practitioner_name TEXT,
  access_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opt_out_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_audit ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for consent_logs
CREATE POLICY "Users can view own consent logs" ON public.consent_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert consent logs" ON public.consent_logs
  FOR INSERT WITH CHECK (true);

-- RLS policies for opt_out_requests
CREATE POLICY "Users can view own opt-out requests" ON public.opt_out_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create opt-out requests" ON public.opt_out_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for data_access_audit
CREATE POLICY "System can insert audit logs" ON public.data_access_audit
  FOR INSERT WITH CHECK (true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, purpose_of_use, user_category, email_domain)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data ->> 'purpose_of_use', 'General use'),
    COALESCE((NEW.raw_user_meta_data ->> 'user_category')::user_category, 'patient'),
    SPLIT_PART(NEW.email, '@', 2)
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log consent
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

-- Function to check if user has valid consent
CREATE OR REPLACE FUNCTION public.has_valid_consent(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to audit data access
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

-- Create indexes for performance
CREATE INDEX idx_user_profiles_category ON public.user_profiles(user_category);
CREATE INDEX idx_user_profiles_email_domain ON public.user_profiles(email_domain);
CREATE INDEX idx_consent_logs_user_type ON public.consent_logs(user_id, consent_type);
CREATE INDEX idx_data_access_audit_user_timestamp ON public.data_access_audit(user_id, access_timestamp);
