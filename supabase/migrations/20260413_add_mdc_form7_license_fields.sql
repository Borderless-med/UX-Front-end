-- Migration: Add MDC and Form 7 license fields to partner_applications table
-- Date: 2026-04-13
-- Purpose: Replace vague registration_number with specific verifiable license fields

-- Rename existing registration_number column to clinic_license
ALTER TABLE public.partner_applications 
RENAME COLUMN registration_number TO clinic_license;

-- Add new MDC registration number column
ALTER TABLE public.partner_applications 
ADD COLUMN IF NOT EXISTS mdc_registration_number TEXT;

-- Add market analysis AI feature column
ALTER TABLE public.partner_applications
ADD COLUMN IF NOT EXISTS market_analysis_interest BOOLEAN DEFAULT FALSE;

-- Add freeform "other AI features" text field
ALTER TABLE public.partner_applications
ADD COLUMN IF NOT EXISTS other_ai_features TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.partner_applications.clinic_license IS 'Clinic License - Ministry of Health Form 7 (e.g., JHR/DC/2023/0045) - displayed at clinic reception';
COMMENT ON COLUMN public.partner_applications.mdc_registration_number IS 'Malaysian Dental Council registration number (e.g., DEN/12345) - verifiable at mdc.org.my';
COMMENT ON COLUMN public.partner_applications.market_analysis_interest IS 'Interest in AI-powered market analysis features';
COMMENT ON COLUMN public.partner_applications.other_ai_features IS 'Freeform text for other AI feature requests';

-- Note: experience and why_join columns remain but are deprecated for new applications
-- They are kept for historical data only
