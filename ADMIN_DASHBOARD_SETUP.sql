-- OraChope Pulse admin dashboard setup
-- Run this in the Supabase SQL Editor before using /admin/dashboard

BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

COMMIT;

-- After the table exists, add your admin account.
-- Replace the email below with the account you use to sign in to OraChope.
INSERT INTO public.admin_users (user_id, email)
SELECT id, email
FROM auth.users
WHERE email = 'your-admin-email@example.com'
ON CONFLICT (user_id) DO UPDATE
SET email = EXCLUDED.email;

-- Verify setup
SELECT *
FROM public.admin_users;