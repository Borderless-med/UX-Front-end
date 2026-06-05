-- Admin users allowed to access internal operational dashboards.
-- Populate this table manually after deployment with authenticated user IDs.

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
