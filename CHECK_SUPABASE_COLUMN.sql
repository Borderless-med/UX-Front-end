-- Check if is_verified_partner column exists and has correct data
SELECT 
  id,
  name,
  is_verified_partner,
  country
FROM sg_clinics
WHERE name LIKE '%Elite%' OR name LIKE '%Dental Trendz%'
ORDER BY name;

-- Check RLS policies on sg_clinics table that might block the column
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'sg_clinics';

-- Check if anon role has SELECT permission on is_verified_partner column
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.column_privileges
WHERE table_name = 'sg_clinics' 
  AND column_name = 'is_verified_partner';
