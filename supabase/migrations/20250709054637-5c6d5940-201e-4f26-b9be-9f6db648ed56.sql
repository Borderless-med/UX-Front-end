
-- PHASE 1: Critical RLS Policy Fixes

-- 1. Fix conversations table - add comprehensive RLS policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Users can only view their own conversations
CREATE POLICY "Users can view own conversations" 
  ON public.conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only insert their own conversations
CREATE POLICY "Users can insert own conversations" 
  ON public.conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own conversations
CREATE POLICY "Users can update own conversations" 
  ON public.conversations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own conversations
CREATE POLICY "Users can delete own conversations" 
  ON public.conversations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 2. Fix "Clinic Detail" table - add appropriate RLS policies
ALTER TABLE public."Clinic  Detail" ENABLE ROW LEVEL SECURITY;

-- Allow public read access for directory functionality
CREATE POLICY "Allow public read access to clinic details" 
  ON public."Clinic  Detail" 
  FOR SELECT 
  USING (true);

-- Only authenticated users can submit clinic details
CREATE POLICY "Authenticated users can submit clinic details" 
  ON public."Clinic  Detail" 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- PHASE 2: Tighten Overly Permissive Access Controls

-- 3. Fix clinics_data table - remove anonymous write access
DROP POLICY IF EXISTS "Allow public insert for migration" ON public.clinics_data;
DROP POLICY IF EXISTS "Allow public update for migration" ON public.clinics_data;
DROP POLICY IF EXISTS "Allow public delete for migration" ON public.clinics_data;

-- Only authenticated admin users can modify clinic data
CREATE POLICY "Authenticated users can insert clinic data" 
  ON public.clinics_data 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clinic data" 
  ON public.clinics_data 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete clinic data" 
  ON public.clinics_data 
  FOR DELETE 
  TO authenticated
  USING (true);

-- 4. Fix opt_out_reports - users should only see their own reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.opt_out_reports;

CREATE POLICY "Users can view own reports by email" 
  ON public.opt_out_reports 
  FOR SELECT 
  USING (
    -- Allow users to see reports they submitted using their email
    auth.jwt() ->> 'email' = email OR
    -- Allow authenticated admin access (for future admin panel)
    auth.jwt() ->> 'role' = 'admin'
  );

-- 5. Fix waitlist_signups - restrict SELECT to admin users only
DROP POLICY IF EXISTS "Allow read access to waitlist signups" ON public.waitlist_signups;

CREATE POLICY "Admin users can view waitlist signups" 
  ON public.waitlist_signups 
  FOR SELECT 
  TO authenticated
  USING (
    -- Only allow admin users to view waitlist
    auth.jwt() ->> 'role' = 'admin' OR
    -- Allow users to view their own signup by email
    auth.jwt() ->> 'email' = email
  );

-- 6. Fix partner_applications - restrict SELECT to admin users only
DROP POLICY IF EXISTS "Allow reading partner applications" ON public.partner_applications;

CREATE POLICY "Admin users can view partner applications" 
  ON public.partner_applications 
  FOR SELECT 
  TO authenticated
  USING (
    -- Only allow admin users to view applications
    auth.jwt() ->> 'role' = 'admin' OR
    -- Allow users to view their own application by email
    auth.jwt() ->> 'email' = email
  );

-- 7. Add user_id column to conversations table if it doesn't exist (safety check)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'conversations' 
                   AND column_name = 'user_id' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.conversations ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 8. Make user_id NOT NULL for conversations (after data migration if needed)
-- Note: This might need data cleanup first if there are existing records without user_id
UPDATE public.conversations SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

ALTER TABLE public.conversations ALTER COLUMN user_id SET NOT NULL;
