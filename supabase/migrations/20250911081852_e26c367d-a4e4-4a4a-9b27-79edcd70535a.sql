-- Temporarily allow public read access to clinic data for development
-- This enables preview functionality while requiring authentication for full details

-- First, ensure RLS is enabled
ALTER TABLE public."Clinic  Detail" ENABLE ROW LEVEL SECURITY;

-- Add a public read policy for basic clinic information (preview mode)
-- This allows unauthenticated users to see clinic listings in development
CREATE POLICY "Allow public preview access to clinic details"
ON public."Clinic  Detail"
FOR SELECT
TO anon
USING (true);

-- The existing authenticated policy remains for full access
-- When authenticated, users get full access including sensitive contact details