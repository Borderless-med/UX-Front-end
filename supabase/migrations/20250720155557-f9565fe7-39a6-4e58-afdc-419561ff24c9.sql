
-- Remove T Dental Clinic (ID: 18)
DELETE FROM public.clinics_data WHERE id = 18;

-- Remove Permas Jaya Dental Clinic (ID: 34) 
DELETE FROM public.clinics_data WHERE id = 34;

-- Verify the deletions
SELECT id, name, address FROM public.clinics_data WHERE id IN (18, 34);
