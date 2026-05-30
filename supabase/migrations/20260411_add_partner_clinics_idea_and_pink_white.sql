-- Emergency addition of two new partner clinics
-- Created: April 11, 2026
-- Purpose: Add Idea Dental and Pink & White Dental so partners can complete signup form

-- Clinic 1: Idea Dental
INSERT INTO public.clinics_data (
  name,
  address,
  dentist,
  rating,
  reviews,
  distance,
  sentiment,
  mda_license,
  credentials,
  country,
  township,
  website_url,
  google_review_url,
  operating_hours,
  -- Common treatments (set to true - partner can update later)
  tooth_filling,
  root_canal,
  dental_crown,
  dental_implant,
  teeth_whitening,
  braces,
  wisdom_tooth,
  gum_treatment,
  composite_veneers,
  porcelain_veneers
) VALUES (
  'Idea Dental',
  '77, Jalan Mutiara, Taman Mutiara Rini, 81300 Skudai, Johor',
  'Dr. Samuel Khoo',
  4.5,  -- Placeholder - update with actual Google rating
  50,   -- Placeholder - update with actual review count
  NULL, -- Distance calculated by system
  NULL, -- Sentiment calculated by system
  'PENDING', -- Update with actual MDA license once verified
  'Registered Dentist',
  'MY',
  'Taman Mutiara Rini',
  'N/A', -- Update with actual website if available
  '',    -- Update with Google Maps CID link if available
  'Mon-Sat 9:00 AM - 6:00 PM', -- Placeholder - update with actual hours
  -- Treatment flags (defaults to common services)
  true,  -- tooth_filling
  true,  -- root_canal
  true,  -- dental_crown
  true,  -- dental_implant
  true,  -- teeth_whitening
  true,  -- braces
  true,  -- wisdom_tooth
  true,  -- gum_treatment
  true,  -- composite_veneers
  true   -- porcelain_veneers
);

-- Clinic 2: Pink and White Dental
INSERT INTO public.clinics_data (
  name,
  address,
  dentist,
  rating,
  reviews,
  distance,
  sentiment,
  mda_license,
  credentials,
  country,
  township,
  website_url,
  google_review_url,
  operating_hours,
  -- Common treatments (set to true - partner can update later)
  tooth_filling,
  root_canal,
  dental_crown,
  dental_implant,
  teeth_whitening,
  braces,
  wisdom_tooth,
  gum_treatment,
  composite_veneers,
  porcelain_veneers
) VALUES (
  'Pink and White Dental',
  'Jalan Tebrau, Johor Bahru, Johor', -- Update with exact address once available
  'Dr. Jolene Lai',
  4.5,  -- Placeholder - update with actual Google rating
  50,   -- Placeholder - update with actual review count
  NULL, -- Distance calculated by system
  NULL, -- Sentiment calculated by system
  'PENDING', -- Update with actual MDA license once verified
  'Registered Dentist',
  'MY',
  'Johor Bahru Central', -- Update with specific township if known
  'N/A', -- Update with actual website if available
  '',    -- Update with Google Maps CID link if available
  'Mon-Sat 9:00 AM - 6:00 PM', -- Placeholder - update with actual hours
  -- Treatment flags (defaults to common services)
  true,  -- tooth_filling
  true,  -- root_canal
  true,  -- dental_crown
  true,  -- dental_implant
  true,  -- teeth_whitening
  true,  -- braces
  true,  -- wisdom_tooth
  true,  -- gum_treatment
  true,  -- composite_veneers
  true   -- porcelain_veneers
);

-- Verify insertion
SELECT id, name, address, dentist, country, township, created_at
FROM public.clinics_data
WHERE name IN ('Idea Dental', 'Pink and White Dental')
ORDER BY created_at DESC;
