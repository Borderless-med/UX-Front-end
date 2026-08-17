-- Check if the trigger and function exist and are enabled

-- 1. Check if the function exists
SELECT 
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'handle_new_user';

-- 2. Check if the trigger exists and is enabled
SELECT 
  tgname AS trigger_name,
  tgenabled AS enabled,
  pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 3. Check the user_profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 4. Check if there are any users in auth.users without profiles
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  au.raw_user_meta_data->>'full_name' AS metadata_name,
  au.raw_user_meta_data->>'user_category' AS metadata_category,
  CASE WHEN up.id IS NULL THEN 'MISSING' ELSE 'EXISTS' END AS profile_status
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE au.created_at >= NOW() - INTERVAL '2 hours'
ORDER BY au.created_at DESC;

-- 5. Manually create profile for the test user if missing
-- UNCOMMENT AND RUN THIS IF PROFILE IS MISSING:
/*
INSERT INTO public.user_profiles (id, full_name, purpose_of_use, user_category, email_domain)
SELECT 
  id,
  COALESCE(raw_user_meta_data ->> 'full_name', 'User'),
  COALESCE(raw_user_meta_data ->> 'purpose_of_use', 'General use'),
  COALESCE((raw_user_meta_data ->> 'user_category')::user_category, 'patient'),
  SPLIT_PART(email, '@', 2)
FROM auth.users
WHERE email = 'lawwaibee@gmail.com'
ON CONFLICT (id) DO NOTHING;
*/
