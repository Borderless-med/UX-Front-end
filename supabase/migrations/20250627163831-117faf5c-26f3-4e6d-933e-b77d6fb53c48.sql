
-- Insert new clinic data with proper transformations
INSERT INTO public.clinics_data (
  name, address, rating, reviews, distance, website_url, google_review_url, operating_hours,
  township, dentist, mda_license, credentials, sentiment,
  tooth_filling, root_canal, dental_crown, dental_implant, teeth_whitening, 
  braces, wisdom_tooth, gum_treatment, composite_veneers, porcelain_veneers,
  dental_bonding, inlays_onlays, enamel_shaping, gingivectomy, bone_grafting,
  sinus_lift, frenectomy, tmj_treatment, sleep_apnea_appliances, 
  crown_lengthening, oral_cancer_screening, alveoplasty
) VALUES 
-- Alpha Dental Centre Taman Molek
(
  'Alpha Dental Centre Taman Molek',
  '64, Jalan Molek 2/2, Taman Molek, 81100 Johor Bahru, Johor',
  4.9, 240, 13.1,
  'https://www.facebook.com/Alpha-Dental-Molek-106171527843209',
  'https://maps.google.com/?cid=132737477072894112',
  'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: Closed
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM',
  'Taman Molek',
  'Dr. Alpha Dental Team',
  'MDC Registration Pending',
  'General Dentistry Practice',
  85,
  true, true, true, true, true, true, true, true, true, true,
  false, false, false, false, false, false, false, true, true, false, false, false
),
-- Snow Dental Taman Molek
(
  'Snow Dental Taman Molek',
  '48, Jalan Molek 2/2, Taman Molek, 81100 Johor Bahru, Johor',
  4.9, 37, 13.1,
  'https://www.snowdental.my/',
  'https://maps.google.com/?cid=14150573645462135212',
  'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: Closed
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM',
  'Taman Molek',
  'Dr. Snow Dental Team',
  'MDC Registration Pending',
  'Modern Dental Practice',
  88,
  true, true, true, true, true, true, true, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false
),
-- Klinik Pergigian Medini Taman Molek
(
  'Klinik Pergigian Medini Taman Molek',
  '84-01, Jalan Molek 2/2, Taman Molek, 81100 Johor Bahru, Johor',
  4.8, 193, 13.2,
  'https://www.medinidentalgroup.com/',
  'https://maps.google.com/?cid=10088510944007526561',
  'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: Closed
Saturday: 9:00 AM – 5:00 PM
Sunday: 9:00 AM – 5:00 PM',
  'Taman Molek',
  'Dr. Medini Dental Group',
  'MDC Registration Verified',
  'Comprehensive Dental Care',
  90,
  true, true, true, true, true, true, true, true, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false
),
-- Taman U Dental Surgery
(
  'Taman U Dental Surgery Sdn. Bhd.',
  '26A, Jalan Kebudayaan 1, Taman Universiti, 81300 Skudai, Johor',
  2.0, 15, 21.6,
  'N/A',
  'https://maps.google.com/?cid=16246574193914417083',
  'Monday: 9:00 AM – 8:00 PM
Tuesday: 9:00 AM – 8:00 PM
Wednesday: 9:00 AM – 8:00 PM
Thursday: 9:00 AM – 8:00 PM
Friday: 9:00 AM – 8:00 PM
Saturday: 9:00 AM – 8:00 PM
Sunday: 9:00 AM – 8:00 PM',
  'Taman Universiti',
  'Dr. Taman U Dental Team',
  'MDC Registration Pending',
  'University Area Practice',
  60,
  true, true, true, true, true, true, true, true, true, true,
  false, false, false, false, true, false, false, false, false, false, false, false
),
-- T-Care Dental Clinic
(
  'T-Care Dental Clinic Mutiara Mas Skudai',
  '27, Jln Mutiara 1/2, Mutiara Rini, 81300 Skudai, Johor',
  5.0, 200, 20.2,
  'https://www.facebook.com/tcaredentalclinic.skudaijb/',
  'https://maps.google.com/?cid=8113752475160656572',
  'Monday: 9:30 AM – 6:30 PM
Tuesday: 9:30 AM – 6:30 PM
Wednesday: 9:30 AM – 6:30 PM
Thursday: Closed
Friday: 9:30 AM – 6:30 PM
Saturday: 9:30 AM – 6:30 PM
Sunday: 9:30 AM – 6:30 PM',
  'Mutiara Rini',
  'Dr. T-Care Team',
  'MDC Registration Verified',
  'Family Dental Care',
  95,
  true, true, true, true, true, true, true, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false
),
-- Klinik Pergigian Tiew
(
  'Klinik Pergigian Tiew Mutiara Mas',
  '21A, Jln Mutiara 1/2, Mutiara Rini, 81300 Skudai, Johor',
  4.9, 165, 20.1,
  'http://www.tiewdental.com/?utm_source=GBP&utm_medium=GBP&utm_campaign=GBP',
  'https://maps.google.com/?cid=904504826185320648',
  'Monday: 10:00 AM – 6:00 PM
Tuesday: 10:00 AM – 6:00 PM
Wednesday: 10:00 AM – 6:00 PM
Thursday: 10:00 AM – 6:00 PM
Friday: 10:00 AM – 6:00 PM
Saturday: 10:00 AM – 5:30 PM
Sunday: 10:00 AM – 1:30 PM',
  'Mutiara Rini',
  'Dr. Tiew',
  'MDC Registration Verified',
  'Established Dental Practice',
  92,
  true, true, true, true, true, true, true, true, true, true,
  false, false, false, false, false, false, false, true, true, false, false, false
),
-- SEPA Dental Clinic
(
  'SEPA Dental Clinic (Sutera Utama)',
  '41, Jalan Sutera Tanjung 8/3, Taman Sutera Utama, 81300 Skudai, Johor',
  5.0, 293, 15.5,
  'https://www.sepadental.com.my/',
  'https://maps.google.com/?cid=5754628115604815686',
  'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM',
  'Taman Sutera Utama',
  'Dr. SEPA Team',
  'MDC Registration Verified',
  'Premium Dental Services',
  98,
  true, true, true, true, true, true, true, true, true, true,
  false, false, false, false, false, false, false, false, false, true, false, false
),
-- SG Dental Clinic JB
(
  'SG Dental Clinic JB',
  '24, Jalan Perang, Taman Pelangi, 80400 Johor Bahru, Johor',
  4.8, 198, 3.3,
  'http://www.sgdentalsurgery.com/',
  'https://maps.google.com/?cid=14255922782523909654',
  'Monday: 8:30 AM – 6:00 PM
Tuesday: 8:30 AM – 6:00 PM
Wednesday: 8:30 AM – 6:00 PM
Thursday: 8:30 AM – 6:00 PM
Friday: 8:30 AM – 6:00 PM
Saturday: 8:30 AM – 6:00 PM
Sunday: 8:30 AM – 6:00 PM',
  'Taman Pelangi',
  'Dr. SG Dental Team',
  'MDC Registration Verified',
  'Comprehensive Dental Surgery',
  89,
  true, true, true, true, true, true, true, true, true, true,
  false, false, false, true, true, false, false, false, false, true, false, false
),
-- JDental Specialists
(
  'JDental Specialists',
  '71, Jalan Harimau Tarum, Taman Abad, 80250 Johor Bahru, Johor',
  4.9, 187, 2.6,
  'http://jdentalspecialists.com/',
  'https://maps.google.com/?cid=3884333950440262314',
  'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: Closed',
  'Taman Abad',
  'Dr. JDental Specialists Team',
  'MDC Registration Verified',
  'Specialist Dental Services',
  94,
  true, true, true, true, false, true, true, true, false, false,
  false, false, false, true, true, false, false, false, false, true, false, false
);

-- Verify the insertion by counting the new records
SELECT COUNT(*) as total_clinics FROM public.clinics_data;

-- Show a sample of the newly inserted clinics
SELECT name, rating, reviews, township, distance 
FROM public.clinics_data 
WHERE name IN ('Alpha Dental Centre Taman Molek', 'Snow Dental Taman Molek', 'JDental Specialists')
ORDER BY distance;
