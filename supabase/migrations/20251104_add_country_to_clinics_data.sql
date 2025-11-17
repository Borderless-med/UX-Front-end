-- Add a country column to distinguish Singapore vs Malaysia clinics
-- Recommended values: 'SG' for Singapore, 'MY' for Malaysia

ALTER TABLE IF EXISTS public.clinics_data
ADD COLUMN IF NOT EXISTS country text CHECK (country IN ('SG','MY'));

-- Optional: default to 'MY' for existing rows if you know current set is Malaysia-only
-- UPDATE public.clinics_data SET country = 'MY' WHERE country IS NULL;

-- Optional index to speed up filtering by country
CREATE INDEX IF NOT EXISTS clinics_country_idx ON public.clinics_data (country);
