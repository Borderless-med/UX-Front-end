
-- Clear existing clinic data and insert comprehensive new data
-- This ensures we have complete treatment information for all clinics

-- First, clear all existing clinic data
DELETE FROM public.clinics_data;

-- Reset the sequence to start from 1
ALTER SEQUENCE clinics_data_id_seq RESTART WITH 1;

-- Insert comprehensive clinic data with all treatment information
INSERT INTO public.clinics_data (
  name, address, dentist, rating, reviews, distance, sentiment, mda_license, 
  credentials, township, website_url,
  tooth_filling, root_canal, dental_crown, dental_implant, teeth_whitening, 
  braces, wisdom_tooth, gum_treatment, composite_veneers, porcelain_veneers,
  dental_bonding, inlays_onlays, enamel_shaping, gingivectomy, bone_grafting,
  sinus_lift, frenectomy, tmj_treatment, sleep_apnea_appliances, 
  crown_lengthening, oral_cancer_screening, alveoplasty
) VALUES 
-- Clinic 1: Full service dental center
(
  'Klinik Pergigian Pearl',
  '20 Jalan Rebana, Taman Kebun Teh, 81200 Johor Bahru',
  'Dr. Lim Wei Jing',
  4.9, 224, 3.8, 96,
  'MDC-2023-JHR-045',
  'BDS (UM), MSc Oral Surgery',
  'Taman Kebun Teh',
  'https://pearldentalclinic.com',
  true, true, true, true, true, true, true, true,
  true, true, true, true, false, true, true,
  true, false, true, false, true, true, false
),
-- Clinic 2: General dentistry focus
(
  'Klinik Pergigian Smile Plus',
  '45 Jalan Molek 1/5, Taman Molek, 81100 Johor Bahru',
  'Dr. Ahmad Faizal',
  4.7, 189, 5.2, 88,
  'MDC-2022-JHR-078',
  'BDS (USM), Fellowship in Restorative Dentistry',
  'Taman Molek',
  'https://smileplus.my',
  true, true, true, false, true, true, true, true,
  true, false, true, false, false, false, false,
  false, false, false, false, false, true, false
),
-- Clinic 3: Cosmetic and orthodontics specialist
(
  'Dental Wellness Center',
  '78 Jalan Danga Bay, Danga Bay, 80200 Johor Bahru',
  'Dr. Sarah Tan',
  4.8, 312, 7.1, 92,
  'MDC-2021-JHR-156',
  'BDS (UM), MDS Orthodontics',
  'Danga Bay',
  'https://dentalwellness.com.my',
  true, true, true, true, true, true, true, true,
  true, true, true, true, true, false, false,
  false, false, false, false, false, true, false
),
-- Clinic 4: Basic services clinic
(
  'Klinik Gigi Keluarga',
  '12 Jalan Sutera Utama 1, Taman Sutera Utama, 81300 Skudai',
  'Dr. Raj Kumar',
  4.5, 98, 12.3, 85,
  'Pending Application',
  'BDS (UM)',
  'Skudai',
  'N/A',
  true, true, true, false, true, false, true, true,
  false, false, false, false, false, false, false,
  false, false, false, false, false, false, false
),
-- Clinic 5: Comprehensive dental care
(
  'Elite Dental Clinic',
  '56 Jalan Austin Heights 8/1, Taman Mount Austin, 81100 Johor Bahru',
  'Dr. Michelle Wong',
  4.9, 267, 8.9, 94,
  'MDC-2020-JHR-234',
  'BDS (UM), MDS Prosthodontics, Fellowship Implantology',
  'Mount Austin',
  'https://elitedental.my',
  true, true, true, true, true, true, true, true,
  true, true, true, true, true, true, true,
  true, true, true, true, true, true, true
),
-- Clinic 6: Family dentistry
(
  'Sunshine Dental Care',
  '23 Jalan Setia 15/2, Taman Setia Indah, 81300 Johor Bahru',
  'Dr. Lee Chong Wei',
  4.6, 156, 6.7, 87,
  'MDC-2023-JHR-089',
  'BDS (USM), Cert. Family Dentistry',
  'Setia Indah',
  'https://sunshinedental.com',
  true, true, true, false, true, true, true, true,
  true, false, true, false, false, false, false,
  false, false, false, false, false, true, false
),
-- Clinic 7: Modern dental practice
(
  'NextGen Dental Studio',
  '89 Jalan Paradigm 2, Paradigm Mall, 80200 Johor Bahru',
  'Dr. Kevin Lim',
  4.8, 201, 4.5, 91,
  'MDC-2022-JHR-167',
  'BDS (UM), Digital Dentistry Certification',
  'Johor Bahru Central',
  'https://nextgendental.my',
  true, true, true, true, true, true, true, true,
  true, true, true, true, false, false, true,
  false, false, true, false, false, true, false
);
