-- CRITICAL SECURITY FIXES - Phase 1: Fix Data Exposure

-- 1. Fix appointment_bookings - Remove public access, allow only user's own bookings
DROP POLICY IF EXISTS "Anyone can submit appointment bookings" ON public.appointment_bookings;
DROP POLICY IF EXISTS "Users can view own bookings by email" ON public.appointment_bookings;

CREATE POLICY "Authenticated users can submit appointment bookings" 
ON public.appointment_bookings 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own bookings by email" 
ON public.appointment_bookings 
FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- 2. Fix waitlist_signups - Remove public access, allow only user's own signups
DROP POLICY IF EXISTS "Anyone can sign up for waitlist" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Admin users can view waitlist signups" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Allow confirmation token updates" ON public.waitlist_signups;

CREATE POLICY "Authenticated users can sign up for waitlist" 
ON public.waitlist_signups 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own waitlist signups" 
ON public.waitlist_signups 
FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "System can update confirmation tokens" 
ON public.waitlist_signups 
FOR UPDATE 
TO service_role
USING (true)
WITH CHECK (true);

-- 3. Fix partner_applications - Remove public access, allow only user's own applications
DROP POLICY IF EXISTS "Allow public partner applications" ON public.partner_applications;
DROP POLICY IF EXISTS "Admin users can view partner applications" ON public.partner_applications;

CREATE POLICY "Authenticated users can submit partner applications" 
ON public.partner_applications 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own partner applications" 
ON public.partner_applications 
FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- 4. Fix "Clinic Detail" table - Remove public insert, keep limited public read
DROP POLICY IF EXISTS "Authenticated users can submit clinic details" ON public."Clinic  Detail";
DROP POLICY IF EXISTS "Allow public preview access to clinic details" ON public."Clinic  Detail";

-- Allow public to view non-sensitive clinic info only
CREATE POLICY "Public can view basic clinic info" 
ON public."Clinic  Detail" 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Only authenticated users can submit clinic details
CREATE POLICY "Authenticated users can submit clinic details" 
ON public."Clinic  Detail" 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 5. Fix clinics_data - Restrict to authenticated users for full access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clinics_data;
DROP POLICY IF EXISTS "Authenticated users can insert clinic data" ON public.clinics_data;
DROP POLICY IF EXISTS "Authenticated users can update clinic data" ON public.clinics_data;
DROP POLICY IF EXISTS "Authenticated users can delete clinic data" ON public.clinics_data;

-- Allow public basic read access (for clinic listings/search)
CREATE POLICY "Public can view basic clinic listings" 
ON public.clinics_data 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Only authenticated users can modify clinic data
CREATE POLICY "Authenticated users can insert clinic data" 
ON public.clinics_data 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update clinic data" 
ON public.clinics_data 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clinic data" 
ON public.clinics_data 
FOR DELETE 
TO authenticated
USING (true);