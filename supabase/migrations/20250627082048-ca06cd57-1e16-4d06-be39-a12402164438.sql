
-- Add new columns to clinics_data table for Google Review URL and Operating Hours
ALTER TABLE public.clinics_data 
ADD COLUMN google_review_url TEXT,
ADD COLUMN operating_hours TEXT;

-- Update all clinics with the Google Review URLs and Operating Hours from your Excel data
UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=2673503449435418180', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 4:30 PM
Sunday: 9:00 AM – 4:30 PM', distance = 5.3 WHERE name = 'Klinik Pergigian Pearl';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=720933746042190860', operating_hours = 'Monday: 9:00 AM – 1:30 PM, 2:30 – 9:00 PM
Tuesday: 9:00 AM – 1:30 PM, 2:30 – 9:00 PM
Wednesday: 9:00 AM – 1:30 PM, 2:30 – 9:00 PM
Thursday: 9:00 AM – 1:30 PM, 2:30 – 9:00 PM
Friday: 9:00 AM – 1:30 PM, 2:30 – 9:00 PM
Saturday: 9:00 AM – 1:30 PM, 2:30 – 9:00 PM
Sunday: 9:00 AM – 1:30 PM, 2:30 – 9:00 PM', distance = 23.3 WHERE name = 'Klinik Pergigian U.n.i Dental Pasir Gudang';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=5239144016543289799', operating_hours = 'Monday: 9:30 AM – 1:00 PM, 2:00 – 6:00 PM
Tuesday: 9:30 AM – 1:00 PM, 2:00 – 6:00 PM
Wednesday: 9:30 AM – 1:00 PM, 2:00 – 6:00 PM
Thursday: 9:30 AM – 1:00 PM, 2:00 – 6:00 PM
Friday: 9:30 AM – 1:00 PM, 2:00 – 6:00 PM
Saturday: 9:30 AM – 1:00 PM, 2:00 – 6:00 PM
Sunday: 9:30 AM – 1:00 PM, 2:00 – 6:00 PM', distance = 31.3 WHERE name = 'Southern Dental (Braces)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=429889719382033698', operating_hours = 'Monday: 10:00 AM – 7:00 PM
Tuesday: Closed
Wednesday: 10:00 AM – 7:00 PM
Thursday: 10:00 AM – 7:00 PM
Friday: 10:00 AM – 7:00 PM
Saturday: 10:00 AM – 7:00 PM
Sunday: 10:00 AM – 7:00 PM', distance = 13.3 WHERE name = 'Klinik Pergigian Dr Cheong';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=8522840435263002072', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 9:00 PM', distance = 16.2 WHERE name = 'Medini Dental Bukit Indah';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16144805727357384004', operating_hours = 'Monday: 10:00 AM – 10:00 PM
Tuesday: 10:00 AM – 10:00 PM
Wednesday: 10:00 AM – 10:00 PM
Thursday: 10:00 AM – 10:00 PM
Friday: 10:00 AM – 10:00 PM
Saturday: 10:00 AM – 10:00 PM
Sunday: 10:00 AM – 10:00 PM', distance = 2.4 WHERE name = 'Puteri Dental Clinic JB';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=13623622391358104636', operating_hours = 'Monday: 9:00 AM – 8:30 PM
Tuesday: 9:00 AM – 8:30 PM
Wednesday: 9:00 AM – 8:30 PM
Thursday: 9:00 AM – 8:30 PM
Friday: 9:00 AM – 8:30 PM
Saturday: 9:00 AM – 8:30 PM
Sunday: 9:00 AM – 5:00 PM', distance = 6.6 WHERE name = 'Sentosa Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16769568466044768769', operating_hours = 'Monday: 10:00 AM – 1:00 PM, 2:00 – 5:00 PM, 6:00 – 8:00 PM
Tuesday: 10:00 AM – 1:00 PM, 2:00 – 5:00 PM, 6:00 – 8:00 PM
Wednesday: 10:00 AM – 1:00 PM, 2:00 – 5:00 PM, 6:00 – 8:00 PM
Thursday: 10:00 AM – 1:00 PM, 2:00 – 5:00 PM, 6:00 – 8:00 PM
Friday: 10:00 AM – 1:00 PM, 2:00 – 5:00 PM, 6:00 – 8:00 PM
Saturday: 10:00 AM – 1:00 PM, 2:00 – 5:00 PM, 6:00 – 8:00 PM
Sunday: 10:00 AM – 1:00 PM, 2:00 – 5:00 PM, 6:00 – 8:00 PM', distance = 13.6 WHERE name = 'Anna Dental Molek';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=17263135761623812847', operating_hours = 'Monday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Tuesday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM
Wednesday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Thursday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Friday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM
Saturday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM
Sunday: 9:00 AM – 1:00 PM, 2:00 – 9:00 PM', distance = 16.0 WHERE name = 'Habib Dental Bandar DatoOnn';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=1881298825636464900', operating_hours = 'Monday: 10:00 AM – 8:00 PM
Tuesday: 10:00 AM – 8:00 PM
Wednesday: 10:00 AM – 8:00 PM
Thursday: 10:00 AM – 8:00 PM
Friday: 10:00 AM – 8:00 PM
Saturday: 10:00 AM – 8:00 PM
Sunday: 10:00 AM – 8:00 PM', distance = 14.4 WHERE name = 'Deluxe Dental Mount Austin';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16854051091138756769', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 10.3 WHERE name = 'Klinik Pergigian Uda';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15877838824271398595', operating_hours = 'Monday: 9:30 AM – 6:30 PM
Tuesday: 9:30 AM – 6:30 PM
Wednesday: 9:30 AM – 6:30 PM
Thursday: 9:30 AM – 6:30 PM
Friday: 9:30 AM – 6:30 PM
Saturday: 9:30 AM – 5:00 PM
Sunday: 9:30 AM – 5:00 PM', distance = 20.2 WHERE name = 'Kamil Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=10577975297362253005', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 9:00 PM
Sunday: 9:00 AM – 9:00 PM', distance = 4.1 WHERE name = 'Smile Heritage Cosmetic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=435090805987871869', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 15.5 WHERE name = 'Adda Braces & Invisalign';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=2690740842031169187', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 9:00 PM
Sunday: 9:00 AM – 9:00 PM', distance = 3.3 WHERE name = 'Klinik Pergigian Ang Invisalign';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15777925116289151521', operating_hours = 'Monday: 9:30 AM – 6:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:30 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: Closed
Saturday: 9:30 AM – 6:00 PM
Sunday: 9:30 AM – 6:00 PM', distance = 15.5 WHERE name = 'Aura Dental Adda Heights';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16581037056131336187', operating_hours = 'Monday: 9:00 AM – 7:00 PM
Tuesday: 9:00 AM – 7:00 PM
Wednesday: 9:00 AM – 7:00 PM
Thursday: 9:00 AM – 7:00 PM
Friday: 9:00 AM – 7:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 17.8 WHERE name = 'T Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=18178217412255164367', operating_hours = 'Monday: 9:30 AM – 6:00 PM
Tuesday: 9:30 AM – 6:00 PM
Wednesday: 9:30 AM – 6:00 PM
Thursday: 9:30 AM – 6:00 PM
Friday: 9:30 AM – 6:00 PM
Saturday: 9:30 AM – 6:00 PM
Sunday: 9:30 AM – 6:00 PM', distance = 21.4 WHERE name = 'Dental Pavilion Skudai';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14160750161543681087', operating_hours = 'Monday: 9:00 AM – 7:00 PM
Tuesday: 9:00 AM – 7:00 PM
Wednesday: 9:00 AM – 7:00 PM
Thursday: 9:00 AM – 7:00 PM
Friday: 9:00 AM – 7:00 PM
Saturday: 9:00 AM – 7:00 PM
Sunday: 9:00 AM – 7:00 PM', distance = 15.0 WHERE name = 'Li Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=13703879498531519494', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 9:00 PM
Sunday: 9:00 AM – 9:00 PM', distance = 6.6 WHERE name = 'Klinik Pergigian Azura Larkin';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15901806296755673078', operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 24.9 WHERE name = 'Onin Dental Gelang Patah';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=4919046755854342033', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 9:00 PM
Sunday: 9:00 AM – 9:00 PM', distance = 26.2 WHERE name = 'Nusantara Dental Care';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=4293925954104799880', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 9:00 PM', distance = 25.2 WHERE name = 'Klinik Pergigian Sapphire';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=8798043733489853093', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 9:00 PM
Sunday: 9:00 AM – 9:00 PM', distance = 3.7 WHERE name = 'Asiaa Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=12249182116352788326', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: Closed', distance = 12.9 WHERE name = 'Amim Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=11070329897207595849', operating_hours = 'Monday: 10:00 AM – 7:00 PM
Tuesday: 10:00 AM – 7:00 PM
Wednesday: 10:00 AM – 7:00 PM
Thursday: 10:00 AM – 7:00 PM
Friday: 10:00 AM – 7:00 PM
Saturday: 10:00 AM – 7:00 PM
Sunday: 10:00 AM – 7:00 PM', distance = 3.2 WHERE name = 'KSL Dental Centre';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=18178217412255164367', operating_hours = 'Monday: 9:30 AM – 6:00 PM
Tuesday: 9:30 AM – 6:00 PM
Wednesday: 9:30 AM – 6:00 PM
Thursday: 9:30 AM – 6:00 PM
Friday: 9:30 AM – 6:00 PM
Saturday: 9:30 AM – 6:00 PM
Sunday: 9:30 AM – 6:00 PM', distance = 21.4 WHERE name = 'Taman Universiti Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=12423803699624929649', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 16.3 WHERE name = 'Setia Tropika Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=435090805987871869', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 15.5 WHERE name = 'Adda Heights Dental Studio';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=5560883341102566729', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 14.8 WHERE name = 'Bandar Putra Dental Care';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=2042026188670007417', operating_hours = 'Monday: 10:00 AM – 6:00 PM
Tuesday: 10:00 AM – 6:00 PM
Wednesday: 10:00 AM – 8:00 PM
Thursday: 10:00 AM – 6:00 PM
Friday: 10:00 AM – 6:00 PM
Saturday: 10:00 AM – 5:30 PM
Sunday: 10:00 AM – 1:30 PM', distance = 17.2 WHERE name = 'Taman Nusa Bestari Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=7337522685703137903', operating_hours = 'Monday: 10:00 AM – 7:00 PM
Tuesday: 10:00 AM – 7:00 PM
Wednesday: 10:00 AM – 7:00 PM
Thursday: 10:00 AM – 7:00 PM
Friday: 10:00 AM – 7:00 PM
Saturday: 10:00 AM – 7:00 PM
Sunday: 10:00 AM – 7:00 PM', distance = 15.8 WHERE name = 'Mount Austin Dental Hub';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=7177491048829168038', operating_hours = 'Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: Closed
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 10.0 WHERE name = 'Taman Damansara Aliff Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=18321187913354788035', operating_hours = 'Monday: 9:30 AM – 6:30 PM
Tuesday: 9:30 AM – 6:30 PM
Wednesday: 9:30 AM – 6:30 PM
Thursday: 9:30 AM – 6:30 PM
Friday: 9:30 AM – 6:30 PM
Saturday: 9:30 AM – 6:30 PM
Sunday: 9:30 AM – 6:30 PM', distance = 23.7 WHERE name = 'Kota Masai Dental Care';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16618526832478576939', operating_hours = 'Monday: 9:30 AM – 1:00 PM, 2:00 – 7:00 PM, 7:30 – 9:30 PM
Tuesday: 9:30 AM – 1:00 PM, 2:00 – 7:00 PM, 7:30 – 9:30 PM
Wednesday: 9:30 AM – 1:00 PM, 2:00 – 7:00 PM, 7:30 – 9:30 PM
Thursday: 9:30 AM – 1:00 PM, 2:00 – 7:00 PM, 7:30 – 9:30 PM
Friday: 9:30 AM – 1:00 PM, 3:00 – 7:00 PM, 7:30 – 9:30 PM
Saturday: 9:30 AM – 1:00 PM, 2:00 – 7:00 PM, 7:30 – 9:30 PM
Sunday: Closed', distance = 23.4 WHERE name = 'Taman Scientex Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=547691171940944432', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 2.6 WHERE name = 'E&E Dental Clinic JB';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=8908892840428550461', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 5.8 WHERE name = 'ProDental Specialists Group';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=694072760172838351', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 9:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 5.7 WHERE name = 'Summer Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=12927386016416553246', operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 12.9 WHERE name = 'White Dental Johor Bahru';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=8312769651954827777', operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: Closed', distance = 15.3 WHERE name = 'Lou Dental Centre Johor Bahru';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14899184527781132216', operating_hours = 'Monday: 10:00 AM – 6:00 PM
Tuesday: 10:00 AM – 6:00 PM
Wednesday: 10:00 AM – 6:00 PM
Thursday: 10:00 AM – 6:00 PM
Friday: 10:00 AM – 7:00 PM
Saturday: 10:00 AM – 7:00 PM
Sunday: 10:00 AM – 7:00 PM', distance = 15.7 WHERE name = 'ABC Dental Centre';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15016415399891852760', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 3.0 WHERE name = 'JDT Dental Centre';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=12211742216816496008', operating_hours = 'Monday: 9:00 AM – 5:30 PM
Tuesday: 9:00 AM – 5:30 PM
Wednesday: 9:00 AM – 5:30 PM
Thursday: 9:00 AM – 5:30 PM
Friday: 9:00 AM – 5:30 PM
Saturday: 9:00 AM – 5:30 PM
Sunday: 9:00 AM – 5:30 PM', distance = 14.3 WHERE name = 'The Smile Dental Lounge';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=12346781514620815678', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 6.8 WHERE name = 'Klinik Pergigian Dental Eclipse';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=11165210311857550893', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 13.3 WHERE name = 'Q&M Dental (Taman Molek)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=10726996711639728187', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 13.9 WHERE name = 'Q&M Dental (Mount Austin)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=6863643998478710644', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 16.2 WHERE name = 'Q&M Dental (Bukit Indah)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=9356213124005400500', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM
Thursday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM
Sunday: 9:00 AM – 1:00 PM, 2:00 – 6:00 PM', distance = 9.0 WHERE name = 'Q&M Dental (Permas Jaya)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=6388780460771315187', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: Closed
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 17.5 WHERE name = 'Q&M Dental (Skudai)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=1252135330300852426', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 16.0 WHERE name = 'Q&M Dental (Masai)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=17921183364875840375', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 6.6 WHERE name = 'Q&M Dental (Sentosa)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16062049835142115871', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 17.2 WHERE name = 'Q&M Dental (Ulu Tiram)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=17653564060754926197', operating_hours = 'Monday: 10:00 AM – 6:00 PM
Tuesday: 10:00 AM – 6:00 PM
Wednesday: 10:00 AM – 6:00 PM
Thursday: 10:00 AM – 6:00 PM
Friday: 10:00 AM – 6:00 PM
Saturday: 10:00 AM – 5:30 PM
Sunday: Closed', distance = 15.8 WHERE name = 'Tiew Dental (Bukit Indah)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=5776004367269207339', operating_hours = 'Monday: 9:00 AM – 5:30 PM
Tuesday: Closed
Wednesday: Closed
Thursday: 9:00 AM – 5:30 PM
Friday: 9:00 AM – 5:30 PM
Saturday: 9:00 AM – 5:30 PM
Sunday: 9:00 AM – 5:30 PM', distance = 2.6 WHERE name = 'Hong Specialist Orthodontic Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=6273360394568645281', operating_hours = 'Monday: 9:00 AM – 7:00 PM
Tuesday: 9:00 AM – 7:00 PM
Wednesday: 9:00 AM – 7:00 PM
Thursday: 9:00 AM – 7:00 PM
Friday: 9:00 AM – 7:00 PM
Saturday: 9:00 AM – 7:00 PM
Sunday: 9:00 AM – 7:00 PM', distance = 12.7 WHERE name = 'MyDental House';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15453346905577762688', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 13.9 WHERE name = 'Austin Dental Group (Mount Austin)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=11292413789382478727', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 15.7 WHERE name = 'Gaya Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=11961390954451520313', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 14.8 WHERE name = 'JJ Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=8440365233737862429', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 3.9 WHERE name = 'Kebun Teh Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=13477879340503489613', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 8.4 WHERE name = 'Permas Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14072917331272623689', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 15.7 WHERE name = 'Setia Indah Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14043445110981463122', operating_hours = 'Monday: 9:30 AM – 7:30 PM
Tuesday: 9:30 AM – 7:30 PM
Wednesday: 9:30 AM – 7:30 PM
Thursday: 9:30 AM – 7:30 PM
Friday: 9:30 AM – 7:30 PM
Saturday: 9:30 AM – 7:30 PM
Sunday: 9:30 AM – 7:30 PM', distance = 17.3 WHERE name = 'Care Plus Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=5327178545715982386', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 19.1 WHERE name = 'Klinik Pergigian Rini Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=17078436075379257775', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 18.8 WHERE name = 'A.O.B Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=4861859429328202516', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 15.3 WHERE name = 'L&L Dental Clinic (Sutera Utama)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15877838824271398595', operating_hours = 'Monday: 9:30 AM – 6:30 PM
Tuesday: 9:30 AM – 6:30 PM
Wednesday: 9:30 AM – 6:30 PM
Thursday: 9:30 AM – 6:30 PM
Friday: 9:30 AM – 6:30 PM
Saturday: 9:30 AM – 5:00 PM
Sunday: 9:30 AM – 5:00 PM', distance = 20.2 WHERE name = 'CK Dental (Mutiara Rini)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=506386418537909199', operating_hours = 'Monday: 9:30 AM – 6:30 PM
Tuesday: 9:30 AM – 6:30 PM
Wednesday: 9:30 AM – 6:30 PM
Thursday: 9:30 AM – 6:30 PM
Friday: 9:30 AM – 6:30 PM
Saturday: 9:30 AM – 5:00 PM
Sunday: 9:30 AM – 5:00 PM', distance = 15.9 WHERE name = 'CK Dental (Mount Austin)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=18103807183348796357', operating_hours = 'Monday: 9:30 AM – 6:30 PM
Tuesday: 9:30 AM – 6:30 PM
Wednesday: 9:30 AM – 6:30 PM
Thursday: 9:30 AM – 6:30 PM
Friday: 9:30 AM – 6:30 PM
Saturday: 9:30 AM – 5:00 PM
Sunday: 9:30 AM – 5:00 PM', distance = 3.2 WHERE name = 'CK Dental (Taman Abad)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=1190099430341982989', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 9.2 WHERE name = 'Klinik Pergigian Pure Care';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15543037204340464255', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: Closed
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 16.3 WHERE name = 'Klinik Pergigian Amim Bandar Seri Alam';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=7626089100965420313', operating_hours = 'Monday: 8:00 AM – 1:00 PM, 2:00 – 5:00 PM
Tuesday: 8:00 AM – 1:00 PM, 2:00 – 5:00 PM
Wednesday: 8:00 AM – 1:00 PM, 2:00 – 5:00 PM
Thursday: 8:00 AM – 1:00 PM, 2:00 – 5:00 PM
Friday: 8:00 AM – 12:15 PM, 2:45 – 5:00 PM
Saturday: Closed
Sunday: Closed', distance = 17.9 WHERE name = 'Klinik Pergigian Masai';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=13477879340503489613', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 8.4 WHERE name = 'Klinik Pergigian Permas';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=5032305950335586321', operating_hours = 'Monday: 9:30 AM – 5:00 PM
Tuesday: 9:30 AM – 5:00 PM
Wednesday: 9:30 AM – 5:00 PM
Thursday: 9:30 AM – 5:00 PM
Friday: 9:30 AM – 5:00 PM
Saturday: 9:30 AM – 5:00 PM
Sunday: Closed', distance = 4.9 WHERE name = 'Lim Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=8420244766579832891', operating_hours = 'Monday: 9:30 AM – 6:00 PM
Tuesday: 9:30 AM – 6:00 PM
Wednesday: 9:30 AM – 6:00 PM
Thursday: 9:30 AM – 6:00 PM
Friday: 9:30 AM – 6:00 PM
Saturday: 9:30 AM – 6:00 PM
Sunday: 9:30 AM – 6:00 PM', distance = 14.0 WHERE name = 'Klinik Pergigian Dentalwise Care';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=13383502105702590552', operating_hours = 'Monday: 9:00 AM – 7:00 PM
Tuesday: 9:00 AM – 7:00 PM
Wednesday: 9:00 AM – 7:00 PM
Thursday: 9:00 AM – 7:00 PM
Friday: 9:00 AM – 7:00 PM
Saturday: 9:00 AM – 7:00 PM
Sunday: 9:00 AM – 7:00 PM', distance = 33.6 WHERE name = 'Toothland Dental Kulai';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16797303364786576172', operating_hours = 'Monday: 9:00 AM – 5:30 PM
Tuesday: 9:00 AM – 5:30 PM
Wednesday: 9:00 AM – 5:30 PM
Thursday: 9:00 AM – 5:30 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 1:00 PM', distance = 34.3 WHERE name = 'Klinik Pergigian Haslinda Sdn. Bhd.';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=1606169179070229808', operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: Closed', distance = 6.6 WHERE name = 'Ding Dental Surgery';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15412404255104073390', operating_hours = 'Monday: 9:00 AM – 1:00 PM, 2:00 – 5:00 PM, 5:30 – 10:00 PM
Tuesday: 9:00 AM – 1:00 PM, 2:00 – 5:00 PM, 5:30 – 10:00 PM
Wednesday: 9:00 AM – 1:00 PM, 2:00 – 5:00 PM, 5:30 – 10:00 PM
Thursday: 9:00 AM – 1:00 PM, 2:00 – 5:00 PM, 5:30 – 10:00 PM
Friday: 9:00 AM – 1:00 PM, 2:00 – 5:00 PM
Saturday: 9:00 AM – 1:00 PM, 2:00 – 5:00 PM
Sunday: 9:00 AM – 1:00 PM, 2:00 – 5:00 PM', distance = 33.3 WHERE name = 'Klinik Pergigian Aura Bandar Putra';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=9152403475532365106', operating_hours = 'Monday: 10:00 AM – 9:00 PM
Tuesday: 10:00 AM – 9:00 PM
Wednesday: 10:00 AM – 9:00 PM
Thursday: 10:00 AM – 9:00 PM
Friday: 11:00 AM – 6:00 PM
Saturday: 11:00 AM – 6:00 PM
Sunday: 10:00 AM – 9:00 PM', distance = 37.0 WHERE name = 'Klinik Pergigian Dental Legacy Kulai';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=4774874562123259741', operating_hours = 'Monday: Closed
Tuesday: 9:30 AM – 5:30 PM
Wednesday: 9:30 AM – 5:30 PM
Thursday: 9:30 AM – 5:30 PM
Friday: 9:30 AM – 5:30 PM
Saturday: 9:30 AM – 5:30 PM
Sunday: 9:30 AM – 5:30 PM', distance = 34.9 WHERE name = 'Klinik Pergigian Aspire Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=18337535439693460265', operating_hours = 'Monday: 9:00 AM – 5:30 PM
Tuesday: 9:00 AM – 5:30 PM
Wednesday: 9:00 AM – 5:30 PM
Thursday: 9:00 AM – 5:30 PM
Friday: 9:00 AM – 5:30 PM
Saturday: Closed
Sunday: 9:00 AM – 5:30 PM', distance = 21.7 WHERE name = 'Klinik Pergigian Dr Zubaidah';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14677245558370002019', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 16.1 WHERE name = 'Klinik Pergigian Lifestyle Dental';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=9552424042226769848', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 16.6 WHERE name = 'Klinik Pergigian One Smile';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=6397377160595014088', operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 20.9 WHERE name = 'Klinik Pergigian Asia Ulu Tiram';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=603395055511559727', operating_hours = 'Monday: 9:00 AM – 1:00 PM, 2:30 – 5:30 PM
Tuesday: 9:00 AM – 1:00 PM, 2:30 – 5:30 PM
Wednesday: 9:00 AM – 1:00 PM, 2:30 – 5:30 PM
Thursday: 9:00 AM – 1:00 PM, 2:30 – 5:30 PM
Friday: 9:00 AM – 1:00 PM
Saturday: Closed
Sunday: 9:00 AM – 1:00 PM, 2:30 – 5:30 PM', distance = 35.5 WHERE name = 'Klinik Pergigian AR';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=5268488294963876940', operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 1:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: Closed', distance = 2.4 WHERE name = 'Klinik (Pusat) Doktor Gigi Yang';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14251314870078446768', operating_hours = 'Monday: 9:00 AM – 1:00 PM, 2:30 – 6:00 PM
Tuesday: 9:00 AM – 1:00 PM, 2:30 – 6:00 PM
Wednesday: 9:00 AM – 1:00 PM, 2:30 – 6:00 PM
Thursday: 9:00 AM – 1:00 PM, 2:30 – 6:00 PM
Friday: 9:00 AM – 1:00 PM, 2:30 – 6:00 PM
Saturday: 9:00 AM – 1:00 PM, 2:30 – 6:00 PM
Sunday: 9:00 AM – 1:00 PM, 2:30 – 6:00 PM', distance = 50.8 WHERE name = 'Klinik Pergigian Izzah';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14043445110981463122', operating_hours = 'Monday: 9:30 AM – 7:30 PM
Tuesday: 9:30 AM – 7:30 PM
Wednesday: 9:30 AM – 7:30 PM
Thursday: 9:30 AM – 7:30 PM
Friday: 9:30 AM – 7:30 PM
Saturday: 9:30 AM – 7:30 PM
Sunday: 9:30 AM – 7:30 PM', distance = 17.3 WHERE name = 'A-Plus Dental Clinic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=6180521638852876915', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 12:00 – 9:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 123.1 WHERE name = 'Klinik Pergigian Atlas Batu Pahat';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=17163672297431646981', operating_hours = 'Monday: 8:00 AM – 12:30 PM, 2:00 – 4:30 PM
Tuesday: 8:00 AM – 12:30 PM, 2:00 – 4:30 PM
Wednesday: 8:00 AM – 12:30 PM, 2:00 – 4:30 PM
Thursday: 8:00 AM – 12:30 PM, 2:00 – 4:30 PM
Friday: 8:00 AM – 12:00 PM, 2:45 – 4:30 PM
Saturday: 8:00 AM – 12:30 PM, 2:00 – 4:30 PM
Sunday: 8:00 AM – 12:30 PM, 2:00 – 4:30 PM', distance = 4.9 WHERE name = 'Klinik Pergigian Austraria';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=15413526692806760192', operating_hours = 'Monday: 9:00 AM – 10:00 PM
Tuesday: 9:00 AM – 10:00 PM
Wednesday: 9:00 AM – 10:00 PM
Thursday: 9:00 AM – 10:00 PM
Friday: 9:00 AM – 10:00 PM
Saturday: 9:00 AM – 10:00 PM
Sunday: 9:00 AM – 10:00 PM', distance = 343.1 WHERE name = 'Klinik Pergigian Kencana';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=6902638890621229695', operating_hours = 'Monday: 10:30 AM – 6:30 PM
Tuesday: 10:30 AM – 6:30 PM
Wednesday: 10:30 AM – 6:30 PM
Thursday: 10:30 AM – 6:30 PM
Friday: 10:30 AM – 6:30 PM
Saturday: 10:30 AM – 6:00 PM
Sunday: Closed', distance = 32.9 WHERE name = 'Klinik Pergigian Tiew Dental (Kulai Branch)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=9603443325405459845', operating_hours = 'Monday: 9:30 AM – 9:00 PM
Tuesday: 9:30 AM – 9:00 PM
Wednesday: 9:30 AM – 9:00 PM
Thursday: 9:30 AM – 9:00 PM
Friday: 9:30 AM – 6:00 PM
Saturday: 9:30 AM – 6:00 PM
Sunday: 9:30 AM – 6:00 PM', distance = 10.4 WHERE name = 'Klinik Pergigian Gaura';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=10261902863029191767', operating_hours = 'Monday: 10:00 AM – 7:00 PM
Tuesday: 10:00 AM – 7:00 PM
Wednesday: 10:00 AM – 7:00 PM
Thursday: 10:00 AM – 7:00 PM
Friday: 10:00 AM – 7:00 PM
Saturday: 10:00 AM – 7:00 PM
Sunday: 10:00 AM – 7:00 PM', distance = 21.9 WHERE name = 'Alpha Dental Eco Botanic';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=14784680574411291326', operating_hours = 'Monday: 9:30 AM – 6:00 PM
Tuesday: 9:30 AM – 6:00 PM
Wednesday: 9:30 AM – 6:00 PM
Thursday: 9:30 AM – 6:00 PM
Friday: 9:30 AM – 6:00 PM
Saturday: 9:30 AM – 6:00 PM
Sunday: 9:30 AM – 6:00 PM', distance = 16.1 WHERE name = 'Horizon Dental Clinic Bukit Indah';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=8633288438460231378', operating_hours = 'Monday: 9:30 AM – 6:00 PM
Tuesday: 9:30 AM – 6:00 PM
Wednesday: 9:30 AM – 6:00 PM
Thursday: Closed
Friday: 9:30 AM – 6:00 PM
Saturday: 9:30 AM – 6:00 PM
Sunday: 9:30 AM – 6:00 PM', distance = 23.1 WHERE name = 'Sunny Dental Horizon Hills';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=6243456155085721010', operating_hours = 'Monday: 10:00 AM – 7:00 PM
Tuesday: 10:00 AM – 7:00 PM
Wednesday: 10:00 AM – 7:00 PM
Thursday: 10:00 AM – 7:00 PM
Friday: 10:00 AM – 7:00 PM
Saturday: 10:00 AM – 7:00 PM
Sunday: 10:00 AM – 7:00 PM', distance = 21.8 WHERE name = 'Smileage Dental Clinic Dr. Tan SY';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=2690317227738602579', operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM', distance = 2.4 WHERE name = 'Koh Dental Clinic - Century Garden';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=4260674776705309805', operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM', distance = 32.4 WHERE name = 'Klinik Pergigian Smile (Kulai)';

UPDATE public.clinics_data SET google_review_url = 'https://maps.google.com/?cid=16528964818842728950', operating_hours = 'Monday: 9:00 AM – 7:30 PM
Tuesday: 9:00 AM – 7:30 PM
Wednesday: 9:00 AM – 7:30 PM
Thursday: 9:00 AM – 7:30 PM
Friday: Closed
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 7:30 PM', distance = 28.1 WHERE name = 'DoveDent Dental (Bandar Baru Kangkar Pulai, JB)';

UPDATE public.clinics_data SET operating_hours = 'Not Listed', distance = 36.3 WHERE name = 'Klinik Pergigian Penawar Temenggong Kulai';
