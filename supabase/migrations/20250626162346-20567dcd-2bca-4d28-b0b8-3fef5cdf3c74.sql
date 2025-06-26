
-- Add 3 replacement clinics to restore clinic count
INSERT INTO public.clinics_data (
  name, address, dentist, rating, reviews, distance, sentiment, mda_license, 
  credentials, township, website_url,
  tooth_filling, root_canal, dental_crown, dental_implant, teeth_whitening, 
  braces, wisdom_tooth, gum_treatment, composite_veneers, porcelain_veneers,
  dental_bonding, inlays_onlays, enamel_shaping, gingivectomy, bone_grafting,
  sinus_lift, frenectomy, tmj_treatment, sleep_apnea_appliances, 
  crown_lengthening, oral_cancer_screening, alveoplasty
) VALUES 
-- Clinic 1: Klinik Pergigian Smile (Kulai)
(
  'Klinik Pergigian Smile (Kulai)',
  '8A, Jalan Kenanga 29/1, Taman Indahpura, 81000 Kulai, Johor Darul Ta''zim, Malaysia',
  'To be verified',
  3.7, 38, 15.2, 75,
  'Pending verification',
  'To be verified',
  'Kulai',
  'https://m.facebook.com/KulaiSMILEDentalSurgery/',
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false,
  false, false, false, false, false, false, false
),
-- Clinic 2: DoveDent Dental (Bandar Baru Kangkar Pulai, JB)
(
  'DoveDent Dental (Bandar Baru Kangkar Pulai, JB)',
  '4-01, Jalan Pulai Makmur 5/1, Bandar Baru Kangkar Pulai, 81300 Skudai, Johor Darul Ta''zim, Malaysia',
  'To be verified',
  4.9, 102, 12.8, 88,
  'Pending verification',
  'To be verified',
  'Skudai',
  'https://www.dovedentdentaljb.com/',
  true, false, false, false, true, true, false, false,
  true, true, false, false, false, false, false,
  false, false, false, false, false, false, false
),
-- Clinic 3: Klinik Pergigian Penawar Temenggong Kulai
(
  'Klinik Pergigian Penawar Temenggong Kulai',
  '5804 11, Jalan Siantan, Bandar Indahpura, 81000 Kulai, Johor Darul Ta''zim, Malaysia',
  'To be verified',
  4.7, 7, 16.5, 78,
  'Pending verification',
  'To be verified',
  'Kulai',
  'https://www.facebook.com/pergigianpenawarkulai',
  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false,
  false, false, false, false, false, false, false
);
