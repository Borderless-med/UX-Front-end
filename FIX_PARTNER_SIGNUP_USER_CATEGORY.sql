-- Fix for partner signup error: "type user_category does not exist"
-- Issue: Trigger function has empty search_path, can't find the enum type
-- Solution: Fully qualify the type as public.user_category

BEGIN;

-- Drop and recreate the trigger function with proper schema qualification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
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
$$;

-- Verify the function was created successfully
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

COMMIT;

-- Test: This should now show the function exists with correct search_path
SELECT 
    routine_name, 
    routine_type,
    security_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
