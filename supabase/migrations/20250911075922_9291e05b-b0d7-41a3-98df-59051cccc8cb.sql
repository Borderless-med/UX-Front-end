-- Secure Clinic  Detail table by requiring authentication for SELECT
-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public."Clinic  Detail" ENABLE ROW LEVEL SECURITY;

-- Remove existing public read policy
DROP POLICY IF EXISTS "Allow public read access to clinic details" ON public."Clinic  Detail";

-- Create authenticated-only read policy
CREATE POLICY "Authenticated users can view clinic details"
ON public."Clinic  Detail"
FOR SELECT
TO authenticated
USING (true);
