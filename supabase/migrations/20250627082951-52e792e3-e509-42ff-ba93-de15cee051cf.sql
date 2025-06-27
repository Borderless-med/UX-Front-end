
-- Fix clinic data mismatches by updating records that were missed due to name differences
-- First, let's update the clinics that have slightly different names in the database

-- Update JDT Dental Centre (was missing from original updates)
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=15016415399891852760',
  operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM',
  distance = 3.0
WHERE name LIKE '%JDT%' AND (google_review_url IS NULL OR distance IS NULL);

-- Update any remaining Q&M Dental locations that might have been missed
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=11165210311857550893',
  operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM'
WHERE name LIKE '%Q&M%' AND google_review_url IS NULL;

-- Update Habib Dental locations
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=17263135761623812847',
  operating_hours = 'Monday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Tuesday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM
Wednesday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Thursday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Friday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Saturday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM
Sunday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM',
  distance = 16.0
WHERE name LIKE '%Habib%' AND google_review_url IS NULL;

-- Handle any remaining NULL values with default data
UPDATE public.clinics_data SET 
  operating_hours = 'Operating hours not available'
WHERE operating_hours IS NULL;

-- Set default distances for any remaining NULL distance values
UPDATE public.clinics_data SET 
  distance = 0.0
WHERE distance IS NULL;

-- Set a default Google review URL indicator for clinics without one
UPDATE public.clinics_data SET 
  google_review_url = ''
WHERE google_review_url IS NULL;

-- Now let's update specific clinics that we can identify with more targeted names

-- Update Austin Dental Group locations
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=15453346905577762688',
  operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM',
  distance = 13.9
WHERE name LIKE '%Austin%' AND distance = 0.0;

-- Update CK Dental locations
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=15877838824271398595',
  operating_hours = 'Monday: 9:30 AM – 6:30 PM
Tuesday: 9:30 AM – 6:30 PM
Wednesday: 9:30 AM – 6:30 PM
Thursday: 9:30 AM – 6:30 PM
Friday: 9:30 AM – 6:30 PM
Saturday: 9:30 AM – 5:00 PM
Sunday: 9:30 AM – 5:00 PM',
  distance = 20.2
WHERE name LIKE '%CK%' AND distance = 0.0;

-- Update Tiew Dental locations
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=17653564060754926197',
  operating_hours = 'Monday: 10:00 AM – 6:00 PM
Tuesday: 10:00 AM – 6:00 PM
Wednesday: 10:00 AM – 6:00 PM
Thursday: 10:00 AM – 6:00 PM
Friday: 10:00 AM – 6:00 PM
Saturday: 10:00 AM – 5:30 PM
Sunday: Closed',
  distance = 15.8
WHERE name LIKE '%Tiew%' AND distance = 0.0;
