-- Check for pending users (email not confirmed)
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '⏳ PENDING (Email not confirmed)'
    ELSE '✅ CONFIRMED'
  END as status
FROM auth.users
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- If you see users with email_confirmed_at = NULL, they're waiting for email confirmation!
