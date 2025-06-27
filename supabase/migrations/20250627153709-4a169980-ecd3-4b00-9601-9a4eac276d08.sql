
-- Remove Klinik Pergigian Izzah as it exceeds 50km from Johor CIQ
DELETE FROM public.clinics_data 
WHERE id = 89;

-- Verify the deletion worked by checking if the record still exists
SELECT COUNT(*) as remaining_records 
FROM public.clinics_data 
WHERE name LIKE '%Izzah%';
