
-- Clear existing clinic data and import real 101 clinics data
DELETE FROM public.clinics_data;

-- Reset the sequence to start from 1
ALTER SEQUENCE clinics_data_id_seq RESTART WITH 1;

-- Insert all 101 real clinics from user's data
INSERT INTO public.clinics_data (
  name, address, dentist, rating, reviews, distance, sentiment, mda_license, 
  credentials, township, website_url,
  tooth_filling, root_canal, dental_crown, dental_implant, teeth_whitening, 
  braces, wisdom_tooth, gum_treatment, composite_veneers, porcelain_veneers,
  dental_bonding, inlays_onlays, enamel_shaping, gingivectomy, bone_grafting,
  sinus_lift, frenectomy, tmj_treatment, sleep_apnea_appliances, 
  crown_lengthening, oral_cancer_screening, alveoplasty
) VALUES 
-- Preserve existing authentic data for Klinik Pergigian Pearl
('Klinik Pergigian Pearl', '20, Jalan Rebana, Taman Kebun Teh, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', 'Dr. Lim Wei Jing', 4.9, 367, null, null, 'MDC-2023-JHR-045', 'BDS (UM), MSc Oral Surgery', 'Taman Kebun Teh', 'https://medinidentalgroup.com/klinik-pergigian-pearl-johor-bahru/', true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian U.n.i Dental Pasir Gudang', '11B Jalan Belatuk 2 Taman Scientex Pasir Gudang, Taman Scientex, 81700 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 34, null, null, null, null, 'Pasir Gudang', 'https://uni-dental-pasir-gudang.localo.site/?utm_source=google_profile&utm_campaign=localo&utm_medium=mainlink', true, false, true, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Southern Dental (Braces)', '31 Jalan Pulai Mutiara, 4/4, Persiaran Taman Pulai Mutiara, 81300 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 117, null, null, null, null, 'Skudai', 'https://kpsouthern.my/', true, true, true, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Dr Cheong', '58, Ground Floor, Jalan Molek 2/1, Taman Molek, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.7, 90, null, null, null, null, 'Taman Molek', 'http://www.drcheongdental.com/', true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Medini Dental Bukit Indah', '91, Jalan Indah 15/2, Taman Bukit Indah, 79100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 229, null, null, null, null, 'Taman Bukit Indah', 'http://www.facebook.com/medinidentalbukitindah', true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Puteri Dental Clinic JB', 'G-168, 1, Jalan Tanjung Puteri, Tanjung Puteri, 80300 Johor Bahru, Johor, Malaysia', null, 4.7, 309, null, null, null, null, 'Tanjung Puteri', null, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Sentosa Dental Clinic', '43A, Jalan Sulam, Taman Sentosa, 80150 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 584, null, null, null, null, 'Taman Sentosa', 'https://www.facebook.com/sentosadentalsurgeryjb', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Anna Dental Molek', '65, Jalan Molek 3/10, Taman Molek, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.6, 158, null, null, null, null, 'Taman Molek', 'https://annadentalclinic.com.my/', true, true, true, true, true, true, true, false, true, true, true, false, false, true, false, false, true, false, false, false, false, false),

('JDT Dental', '41B, Jalan Kuning 2, Taman Pelangi, 80400 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 1542, null, null, null, null, 'Taman Pelangi', 'https://www.jdtdental.com.my/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Habib Dental Bandar DatoOnn', 'No. 17 (Ground Floor, Jln Perjiranan 4/6, Bandar Dato Onn, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 390, null, null, null, null, 'Bandar Dato Onn', 'https://instagram.com/habibdental_hd?igshid=OGQ5ZDc2ODk2ZA==', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Deluxe Dental Mount Austin', '31, Jalan Mutiara Emas 10/2, Taman Mount Austin, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 226, null, null, null, null, 'Taman Mount Austin', 'https://deluxedental.com.my/', true, false, true, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Uda', '29-01, Jalan Padi Ria, Bandar Baru Uda, 81200 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.6, 215, null, null, null, null, 'Bandar Baru Uda', 'https://www.medinidentalgroup.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Kamil Dental Clinic', '5 & 7, Jalan Pendekar 15, Taman Ungku Tun Aminah, 81300 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 797, null, null, null, null, 'Taman Ungku Tun Aminah', 'https://www.facebook.com/tdentaljb', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Smile Heritage Cosmetic', 'Pusat Perdagangan, No 3, Jalan Kebun Teh 1, Taman Kebun Teh, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.8, 257, null, null, null, null, 'Taman Kebun Teh', 'https://smileheritage.com.my/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Adda Braces & Invisalign', 'Ground Floor, 108&110, Jalan Adda 7, Adda Heights, 81100 Johor Bahru, Johor, Malaysia', null, 4.9, 1065, null, null, null, null, 'Adda Heights', 'http://www.addadental.com/', true, true, true, true, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Ang Invisalign', '38 A, Jalan Wong Ah Fook, Bandar Johor Bahru, 80000 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.8, 606, null, null, null, null, 'Bandar Johor Bahru', 'https://www.toothland.com.my/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Aura Dental Adda Heights', 'Tingkat 1, 92-01, Jalan Adda 7, Adda Heights, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 528, null, null, null, null, 'Adda Heights', null, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('T Dental Clinic', '5 & 7, Jalan Pendekar 15, Taman Ungku Tun Aminah, 81300 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 797, null, null, null, null, 'Taman Ungku Tun Aminah', 'https://www.facebook.com/tdentaljb', true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Dental Pavilion Skudai', 'No 1-01, Jalan Pendidikan 8, Taman Universiti, Skudai, Taman Universiti, 81300 Johor Bahru, Johor, Malaysia', null, 4.8, 267, null, null, null, null, 'Taman Universiti', 'https://www.facebook.com/dentalpavilion/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Li Dental Clinic', '20-01, Jalan Bestari 2/2, Taman Nusa Bestari, 81300 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.8, 62, null, null, null, null, 'Taman Nusa Bestari', 'https://gigichun.com/find-us/gigichun-jb/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Azura Larkin', '11, jalan dataran larkin 3, Taman, Dataran Larkin 2, Larkin, 80350 Johor Bahru, Johor, Malaysia', null, 3.9, 93, null, null, null, null, 'Larkin', 'https://www.facebook.com/klinikpergigianazura/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Onin Dental Gelang Patah', '79, Jalan Suria 2, Pusat Komersial Suria, 79200 Gelang Patah, Johor Darul Ta''zim, Malaysia', null, 5.0, 177, null, null, null, null, 'Gelang Patah', null, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Nusantara Dental Care', 'No 27-02(First Floor), Jalan Nusaria 11/1 Taman Nusantara, 81550, Iskandar Puteri, Johor Gelang Patah, Taman Nusantara, 81550 Johor, Johor Darul Ta''zim, Malaysia', null, 4.8, 133, null, null, null, null, 'Taman Nusantara', null, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Sapphire', '11B, Jln Ekoperniagaan 7, Taman Kota Masai, 81700 Pasir Gudang, Johor Darul Ta''zim, Malaysia', null, 5.0, 370, null, null, null, null, 'Taman Kota Masai', 'https://klinikgigipasirgudang.com/', true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false),

('Asiaa Dental Clinic', '113A, Jalan Perisai, Taman Sri Tebrau, 80050 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 292, null, null, null, null, 'Taman Sri Tebrau', 'https://www.asiaadental.com.my/', true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Amim Dental Surgery', 'No. 1-01 Tingkat, 1, Jalan Aliff Harmoni 4, Taman Damansara Aliff, 81200 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 166, null, null, null, null, 'Taman Damansara Aliff', 'https://www.amimdentaldamansaraaliff.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('KSL Dental Centre', 'Lots G-43 & L2-100, KSL City Mall, 33, Jalan Seladang, Taman Abad, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.8, 157, null, null, null, null, 'Taman Abad', 'https://www.facebook.com/alphadentalksl/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Taman Universiti Dental', 'No 1-01, Jalan Pendidikan 8, Taman Universiti, Skudai, Taman Universiti, 81300 Johor Bahru, Johor, Malaysia', null, 4.8, 267, null, null, null, null, 'Taman Universiti', 'https://www.facebook.com/dentalpavilion/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Setia Tropika Dental', 'No. 35-01, Livistonia Square, Jalan Setia Tropika 1/30, Taman Setia Tropika, 81200 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 299, null, null, null, null, 'Taman Setia Tropika', 'https://www.qcaredentalclinic.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Adda Heights Dental Studio', 'Ground Floor, 108&110, Jalan Adda 7, Adda Heights, 81100 Johor Bahru, Johor, Malaysia', null, 4.9, 1065, null, null, null, null, 'Adda Heights', 'http://www.addadental.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Bandar Putra Dental Care', 'NO 8&10 (GF, Jalan Perjiranan 2, Bandar Dato Onn, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 276, null, null, null, null, 'Bandar Dato Onn', 'https://dentallegacybdo.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Taman Nusa Bestari Dental', '3-01, Jalan Bestari 1/5, Taman Nusa Bestari 2, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 4.8, 183, null, null, null, null, 'Taman Nusa Bestari', 'http://www.tiewdental.com/?utm_source=GBP&utm_medium=GBP&utm_campaign=GBP', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Mount Austin Dental Hub', '12-G, Jalan Austin Heights 8/9, Taman Mount Austin, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 527, null, null, null, null, 'Taman Mount Austin', 'https://www.facebook.com/AlphaDental.MountAustin', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Permas Jaya Dental Clinic', '7, Jalan Permas 10/2, Bandar Baru Permas Jaya, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.9, 646, null, null, null, null, 'Bandar Baru Permas Jaya', 'http://www.austindentalgroup.com.my/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Taman Damansara Aliff Dental', 'No. 1-01 Tingkat, 1, Jalan Aliff Harmoni 4, Taman Damansara Aliff, 81200 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 166, null, null, null, null, 'Taman Damansara Aliff', 'https://www.amimdentaldamansaraaliff.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Kota Masai Dental Care', '53-A, Jalan Betik 1, Taman Kota Masai, 81700 Pasir Gudang, Johor Darul Ta''zim, Malaysia', null, 4.9, 169, null, null, null, null, 'Taman Kota Masai', null, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Taman Scientex Dental', '16A, Jln Belatuk 5, Taman Scientex, 81700 Pasir Gudang, Johor Darul Ta''zim, Malaysia', null, 5.0, 188, null, null, null, null, 'Taman Scientex', 'http://www.facebook.com/klinikpergigianrazi', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('E&E Dental Clinic JB', '76, Jalan Harimau Tarum, Taman Abad, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 508, null, null, null, null, 'Taman Abad', 'http://www.eedentalclinic.com.my/', true, true, true, true, true, true, true, true, true, true, true, false, false, true, false, false, true, false, false, false, false, false),

('ProDental Specialists Group', 'No.01-01, 01-02, Block H, Komersial Southkey Mozek, Persiaran Southkey 1, Kota Southkey, 80150 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.8, 147, null, null, null, null, 'Kota Southkey', 'https://prodentalspecialistsgroup.com/', true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Summer Dental Clinic', 'No 01-08, Block F, Komersil SouthKey Mozek, Persiaran Southkey 1, Kota Southkey, 80150 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 305, null, null, null, null, 'Kota Southkey', 'https://summerdental.my/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('White Dental Johor Bahru', '42, Jalan Camar 1, Taman Perling, 81200 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 268, null, null, null, null, 'Taman Perling', 'https://instagram.com/whitedentaljb?igshid=OGQ5ZDc2ODk2ZA==', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Lou Dental Centre Johor Bahru', '103,103A & 103B, Jalan Sutera Tanjung 8/2, Taman Sutera Utama, 81300 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.6, 142, null, null, null, null, 'Taman Sutera Utama', 'http://www.loudental.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('ABC Dental Centre', '133, Jln Adda 3/1, Adda Heights, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 124, null, null, null, null, 'Adda Heights', 'http://www.abcdentalcenter.com.my/', true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false),

('JDT Dental Centre', '41B, Jalan Kuning 2, Taman Pelangi, 80400 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 1542, null, null, null, null, 'Taman Pelangi', 'https://www.jdtdental.com.my/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('The Smile Dental Lounge', '69, Jalan Mutiara Emas 2A, Taman Mount Austin, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 157, null, null, null, null, 'Taman Mount Austin', 'http://www.smiledentallounge.com/', true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Dental Eclipse', 'No 10, 01, Jalan Dataran Larkin 6, Larkin, 80350 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 193, null, null, null, null, 'Larkin', 'http://dentaleclipse.com/', true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Taman Molek)', '43, Jalan Molek 1/29, Taman Molek, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 432, null, null, null, null, 'Taman Molek', 'http://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Mount Austin)', '29, Jalan Mutiara Emas 10/19, Taman Mount Austin, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.7, 185, null, null, null, null, 'Taman Mount Austin', 'http://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Bukit Indah)', 'No. 12A, 1st floor, Jalan Indah 15/3, Taman Bukit Indah, 79100 Iskandar Puteri, Johor Darul Ta''zim, Malaysia', null, 4.9, 83, null, null, null, null, 'Taman Bukit Indah', 'http://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Permas Jaya)', '9-01, Jalan Permas 10/1, Bandar Baru Permas Jaya, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.7, 77, null, null, null, null, 'Bandar Baru Permas Jaya', 'http://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Skudai)', '21, Jalan Pendekar 9, Taman Ungku Tun Aminah, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 4.9, 279, null, null, null, null, 'Taman Ungku Tun Aminah', 'http://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Masai)', '81, Jalan Bina 1, Bandar Baru Seri Alam, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.5, 62, null, null, null, null, 'Bandar Baru Seri Alam', 'https://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Sentosa)', '3A (1st Floor, Jalan Sutera, Taman Sentosa, 80150 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 125, null, null, null, null, 'Taman Sentosa', 'http://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Q&M Dental (Ulu Tiram)', '17, Jalan Cantik 6, Taman Pelangi Indah, 81800 Ulu Tiram, Johor Darul Ta''zim, Malaysia', null, 4.9, 114, null, null, null, null, 'Ulu Tiram', 'https://www.qandm.com.my/', true, true, true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Tiew Dental (Bukit Indah)', 'C3, 0427, Jalan Indah 15, Taman Bukit Indah, 81200 Iskandar Puteri, Johor Darul Ta''zim, Malaysia', null, 4.9, 326, null, null, null, null, 'Taman Bukit Indah', 'http://www.tiewdental.com/?utm_source=GBP&utm_medium=GBP&utm_campaign=GBP', true, true, false, true, true, false, true, true, false, true, false, false, false, false, false, false, false, true, true, false, false, false),

('Hong Specialist Orthodontic Clinic', '72a, Jalan Harimau Tarum, Taman Century, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 367, null, null, null, null, 'Taman Century', 'https://www.facebook.com/hongspecialistortho/', false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('MyDental House', '1-01, Jln Sagu 31, Taman Daya, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.6, 120, null, null, null, null, 'Taman Daya', 'https://mydentalhouse.setmore.com/', true, true, true, true, true, true, true, true, true, false, true, false, false, false, true, false, true, false, false, false, false, false),

('Austin Dental Group (Mount Austin)', '33G, 01, Jalan Mutiara Emas 10/19, Taman Mount Austin, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 1085, null, null, null, null, 'Taman Mount Austin', 'https://austindentalgroup.com.my/', true, true, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Gaya Dental Surgery', '12, Jalan Gaya 1, Taman Gaya, 81800 Ulu Tiram, Johor Darul Ta''zim, Malaysia', null, 4.9, 760, null, null, null, null, 'Taman Gaya', 'http://www.austindentalgroup.com.my/', true, true, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('JJ Dental Surgery', 'NO. 114, Jalan Dedap 13, Taman Johor Jaya, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.7, 162, null, null, null, null, 'Taman Johor Jaya', 'http://www.austindentalgroup.com.my/', true, true, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Kebun Teh Dental Surgery', 'Pusat Perdagangan, 30, Jalan Kebun Teh 1, Kebun Teh, 80350 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 175, null, null, null, null, 'Kebun Teh', 'http://www.austindentalgroup.com.my/', true, true, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Permas Dental Surgery', '7, Jalan Permas 10/2, Bandar Baru Permas Jaya, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.9, 646, null, null, null, null, 'Bandar Baru Permas Jaya', 'http://www.austindentalgroup.com.my/', true, true, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Setia Indah Dental Surgery', 'No. 3G, Jalan Setia Indah 3/8, Taman Setia Indah, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 305, null, null, null, null, 'Taman Setia Indah', 'http://www.austindentalgroup.com.my/', true, true, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Care Plus Dental Clinic', '26A, Jalan Jati 1, Taman Nusa Bestari Jaya, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 5.0, 285, null, null, null, null, 'Taman Nusa Bestari Jaya', 'https://www.careplusdentaljb.com/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Rini Dental', '19, Jalan Utama 34, Mutiara Rini, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 5.0, 72, null, null, null, null, 'Mutiara Rini', 'https://www.rinidental.com/', false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('A.O.B Dental', '67, Jalan Impian Emas 5/1, Taman Impian Emas, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 5.0, 222, null, null, null, null, 'Taman Impian Emas', 'https://www.aobdental.com.my/', true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('L&L Dental Clinic (Sutera Utama)', '15, Jalan Sutera Tanjung 8/2, Taman Sutera Utama, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 4.7, 100, null, null, null, null, 'Taman Sutera Utama', 'http://www.lldentalclinic.com/', true, false, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('CK Dental (Mutiara Rini)', '45A 2, Jln Mutiara 1/2, Mutiara Rini, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 4.9, 776, null, null, null, null, 'Mutiara Rini', 'https://www.facebook.com/ckdentaljb/', true, true, true, true, true, true, true, true, false, true, false, false, false, false, true, false, false, false, false, false, false, false),

('CK Dental (Mount Austin)', '32, Jalan Austin Heights 8/9, Taman Mount Austin, 81100 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 381, null, null, null, null, 'Taman Mount Austin', 'https://www.facebook.com/ckdentaljb/', true, true, true, true, true, true, true, true, false, true, false, false, false, false, true, false, false, false, false, false, false, false),

('CK Dental (Taman Abad)', '320, Jalan Dato Sulaiman, Taman Abad, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 5.0, 294, null, null, null, null, 'Taman Abad', 'https://www.facebook.com/ckdentaljb/', true, true, true, true, true, true, true, true, false, true, false, false, false, false, true, false, false, false, false, false, false, false),

('Klinik Pergigian Pure Care', '53, GROUND FLOOR, Jalan Permas 10/1, Bandar Baru Permas Jaya, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.9, 79, null, null, null, null, 'Bandar Baru Permas Jaya', 'https://www.facebook.com/PCDental81750', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Amim Bandar Seri Alam', '4 ground floor, Jalan Suria 2, Bandar Baru Seri Alam, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.3, 17, null, null, null, null, 'Bandar Baru Seri Alam', null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Masai', 'Jalan Sekolah, Bandar Seri Alam, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.2, 42, null, null, null, null, 'Bandar Seri Alam', null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Permas', '7, Jalan Permas 10/2, Bandar Baru Permas Jaya, 81750 Masai, Johor Darul Ta''zim, Malaysia', null, 4.9, 646, null, null, null, null, 'Bandar Baru Permas Jaya', 'http://www.austindentalgroup.com.my/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Lim Dental Surgery', 'F27, Holiday Plaza, Jalan Dato Sulaiman, Century Garden, 80250 Johor Bahru, Johor, Malaysia', null, 3.7, 26, null, null, null, null, 'Century Garden', null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Dentalwise Care', 'No 47, Tingkat Bawah, Jln Undan 15, Taman Perling, 81200 Skudai, Johor Darul Ta''zim, Malaysia', null, 5.0, 54, null, null, null, null, 'Taman Perling', 'http://www.dentalwisecare.com/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Toothland Dental Kulai', 'NO.24, JALAN RAYA TAMAN KULAI BESAR, Kulai Besar, 81000 Kulai, Johor Darul Ta''zim, Malaysia', null, 4.9, 122, null, null, null, null, 'Kulai Besar', 'https://www.toothland.com.my/', false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Haslinda Sdn. Bhd.', '142 A, Jalan Susur Kulai 3, Taman Kulai Besar, 81000 Kulai, Johor Darul Ta''zim, Malaysia', null, 4.6, 15, null, null, null, null, 'Taman Kulai Besar', 'https://www.haslindadental.com.my/', true, true, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Ding Dental Surgery', 'No. 41, A, Jalan Sulam, Taman Sentosa, 80150 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 3.0, 2, null, null, null, null, 'Taman Sentosa', 'https://www.dentalclinicclosetome.my/place/ding-dental-surgery-johor-bahru', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Aura Bandar Putra', '5008 a tingkat, 1, Jalan Kenari, Bandar Putra Kulai, 81000 Kulai, Johor Darul Ta''zim, Malaysia', null, 4.9, 751, null, null, null, null, 'Bandar Putra Kulai', 'https://m.facebook.com/pages/Klinik-Pergigian-Aura/285430835175714', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Dental Legacy Kulai', 'No 126, Pusat Komersial Indah, Jln Kiambang 14, Indahpura, 81000 Kulai, Johor, Malaysia', null, 4.9, 177, null, null, null, null, 'Indahpura', 'https://linktr.ee/dentallegacykulai', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Aspire Dental', 'No.3C, 1st Floor, Jalan Ismail, Taman Kulai, 81000 Kulai, Johor Darul Ta''zim, Malaysia', null, 5.0, 122, null, null, null, null, 'Taman Kulai', null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Dr Zubaidah', '49-01, Jalan Ledang 25, Taman Bukit Tiram, 81800 Ulu Tiram, Johor Darul Ta''zim, Malaysia', null, 4.7, 19, null, null, null, null, 'Taman Bukit Tiram', 'https://m.facebook.com/pages/Klinik-Pergigian-Dr-Zubaidah/115093279155073', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Lifestyle Dental', '34 & 36, Ground Floor, Jalan Gaya 28, Taman Gaya, 81800 Ulu Tiram, Johor Darul Ta''zim, Malaysia', null, 4.8, 132, null, null, null, null, 'Taman Gaya', 'https://www.facebook.com/lifestyledentalgaya/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian One Smile', '3, Jalan Tanjong 1, Taman Desa Cemerlang, 81800 Ulu Tiram, Johor Darul Ta''zim, Malaysia', null, 4.9, 207, null, null, null, null, 'Taman Desa Cemerlang', 'https://www.facebook.com/profile.php?id=100087638123670&mibextid=ZbWKwL', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Asia Ulu Tiram', 'No.65A, Jalan Rambutan, Taman Tiram Baru, 81800 Ulu Tiram, Johor Darul Ta''zim, Malaysia', null, 4.9, 109, null, null, null, null, 'Taman Tiram Baru', 'https://www.asiadentalsurgeryulutiram.com/', true, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian AR', 'SH42, Tingkat 1, Jalan Besar, Pekan Nanas, 81500 Pekan Nanas, Johor, Malaysia', null, 3.8, 16, null, null, null, null, 'Pekan Nanas', null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik (Pusat) Doktor Gigi Yang', '34-A, Jalan Harimau Tarum, Taman Century, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.8, 16, null, null, null, null, 'Taman Century', 'https://www.dentalclinicclosetome.my/place/yang-dental-surgery-johor-bahru', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Izzah', '1, Jalan Emas 3, Pusat Perniagaan Kota Emas, 82000 Pontian, Johor Darul Ta''zim, Malaysia', null, 4.8, 129, null, null, null, null, 'Pontian', null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('A-Plus Dental Clinic', '26A, Jalan Jati 1, Taman Nusa Bestari Jaya, 81300 Skudai, Johor Darul Ta''zim, Malaysia', null, 5.0, 285, null, null, null, null, 'Taman Nusa Bestari Jaya', 'https://www.careplusdentaljb.com/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Atlas Batu Pahat', '1, Jalan Susur Perdana Tengah, Taman Bukit Perdana 2, 83000 Batu Pahat, Johor Darul Ta''zim, Malaysia', null, 5.0, 136, null, null, null, null, 'Batu Pahat', 'https://linktr.ee/atlasdental.bp', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Austraria', '65, Jalan Trus, Bandar Johor Bahru, 80000 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 3.7, 68, null, null, null, null, 'Bandar Johor Bahru', null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Kencana', '46, Jalan Tengku Ampuan Zabedah A 9/A, Seksyen 9, 40000 Shah Alam, Selangor, Malaysia', null, 4.9, 579, null, null, null, null, 'Shah Alam', 'https://kencanadental.com/', true, true, false, true, true, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false),

('Klinik Pergigian Tiew Dental (Kulai Branch)', 'No.222 (Ground Floor, Kenanga, Jalan Kenanga 29/2, Bandar Indahpura, 81000 Kulai, Johor Darul Ta''zim, Malaysia', null, 4.9, 90, null, null, null, null, 'Bandar Indahpura', 'http://www.tiewdental.com/?utm_source=GBP&utm_medium=GBP&utm_campaign=GBP', true, true, false, true, true, false, true, true, false, false, false, false, false, false, false, false, false, true, true, false, false, false),

('Klinik Pergigian Gaura', 'No.20 (Aras Bawah, JLN ALIFF 3, Taman Damansara Aliff, 81200 Johor Bahru, Johor, Malaysia', null, 5.0, 518, null, null, null, null, 'Taman Damansara Aliff', 'https://klinikpergigiangaura.com/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Alpha Dental Eco Botanic', '34GF, Jln Eko Botani 3/3, Taman Eko Botani, 79100 Iskandar Puteri, Johor Darul Ta''zim, Malaysia', null, 5.0, 408, null, null, null, null, 'Taman Eko Botani', 'https://www.facebook.com/alphadentalecobotanic', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Horizon Dental Clinic Bukit Indah', '73-A, Jalan Indah 15/2, Taman Bukit Indah, 79100 Iskandar Puteri, Johor Darul Ta''zim, Malaysia', null, 4.9, 69, null, null, null, null, 'Taman Bukit Indah', 'https://www.horizondental.com.my/', false, false, false, true, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Sunny Dental Horizon Hills', '19, Jalan Horizon Perdana 4, Horizon Hills, 79100 Iskandar Puteri, Johor Darul Ta''zim, Malaysia', null, 5.0, 123, null, null, null, null, 'Horizon Hills', 'https://www.sunnydental.com.my/', true, true, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Smileage Dental Clinic Dr. Tan SY', '47, Jalan Eko Botani 3/7, Taman Eko Botani, 79100 Iskandar Puteri, Johor Darul Ta''zim, Malaysia', null, 5.0, 117, null, null, null, null, 'Taman Eko Botani', 'http://smileagedental.com/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Koh Dental Clinic - Century Garden', '45, Jalan Harimau Tarum, Century Garden, 80250 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.9, 512, null, null, null, null, 'Century Garden', 'http://www.kohdental.com.my/', false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),

('Lou Dental Centre', '103,103A & 103B, Jalan Sutera Tanjung 8/2, Taman Sutera Utama, 81300 Johor Bahru, Johor Darul Ta''zim, Malaysia', null, 4.6, 142, null, null, null, null, 'Taman Sutera Utama', 'http://www.loudental.com/', true, true, true, true, true, true, true, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false);
