
-- Remove duplicate clinic entries from the database
-- This removes 3 specific duplicate clinics identified by their IDs

DELETE FROM public.clinics_data 
WHERE id IN (
  44, -- JDT Dental Centre (duplicate of ID 9 - JDT Dental)
  42, -- Lou Dental Centre Johor Bahru (duplicate of ID 101 - Lou Dental Centre) 
  62  -- Permas Dental Surgery (duplicate of ID 34 - Permas Jaya Dental Clinic)
);
