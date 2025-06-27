
-- Remove the two clinics that are too far from Johor CIQ
DELETE FROM public.clinics_data 
WHERE id IN (91, 93);

-- Verify the deletion worked by checking if the records still exist
SELECT COUNT(*) as remaining_records 
FROM public.clinics_data 
WHERE name LIKE '%Atlas Batu Pahat%' OR name LIKE '%Kencana%';
