
-- Create enhanced clinics table with all the data from your Excel file
CREATE TABLE public.clinics_data (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  dentist TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  distance DECIMAL(4,1),
  sentiment DECIMAL(4,1),
  mda_license TEXT,
  credentials TEXT,
  township TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Treatment fields (boolean for each service)
  tooth_filling BOOLEAN DEFAULT false,
  root_canal BOOLEAN DEFAULT false,
  dental_crown BOOLEAN DEFAULT false,
  dental_implant BOOLEAN DEFAULT false,
  teeth_whitening BOOLEAN DEFAULT false,
  braces BOOLEAN DEFAULT false,
  wisdom_tooth BOOLEAN DEFAULT false,
  gum_treatment BOOLEAN DEFAULT false,
  composite_veneers BOOLEAN DEFAULT false,
  porcelain_veneers BOOLEAN DEFAULT false,
  dental_bonding BOOLEAN DEFAULT false,
  inlays_onlays BOOLEAN DEFAULT false,
  enamel_shaping BOOLEAN DEFAULT false,
  gingivectomy BOOLEAN DEFAULT false,
  bone_grafting BOOLEAN DEFAULT false,
  sinus_lift BOOLEAN DEFAULT false,
  frenectomy BOOLEAN DEFAULT false,
  tmj_treatment BOOLEAN DEFAULT false,
  sleep_apnea_appliances BOOLEAN DEFAULT false,
  crown_lengthening BOOLEAN DEFAULT false,
  oral_cancer_screening BOOLEAN DEFAULT false,
  alveoplasty BOOLEAN DEFAULT false
);

-- Enable RLS for data security
ALTER TABLE public.clinics_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (since this is public clinic directory data)
CREATE POLICY "Allow public read access to clinics data" 
  ON public.clinics_data 
  FOR SELECT 
  USING (true);

-- Create index for common queries
CREATE INDEX idx_clinics_data_township ON public.clinics_data(township);
CREATE INDEX idx_clinics_data_rating ON public.clinics_data(rating DESC);
CREATE INDEX idx_clinics_data_distance ON public.clinics_data(distance);

-- Insert sample data (you can replace this with your full Excel data)
INSERT INTO public.clinics_data (
  name, address, dentist, rating, reviews, distance, sentiment, mda_license, 
  credentials, township, website_url,
  tooth_filling, root_canal, dental_crown, dental_implant, teeth_whitening, 
  braces, wisdom_tooth, gum_treatment, composite_veneers, porcelain_veneers,
  dental_bonding, inlays_onlays, enamel_shaping, gingivectomy, bone_grafting,
  sinus_lift, frenectomy, tmj_treatment, sleep_apnea_appliances, 
  crown_lengthening, oral_cancer_screening, alveoplasty
) VALUES 
(
  'Klinik Pergigian Pearl',
  '20 Jalan Rebana, Taman Kebun Teh',
  'Dr. Lim Wei Jing (BDS UM)',
  4.9, 224, 3.8, 96,
  'MDC-2023-JHR-045',
  'MDC Registered; BDS; Likely MDA Member',
  'Taman Kebun Teh',
  'https://example-pearl-dental.com',
  true, true, true, true, true, true, true, true,
  false, false, false, false, false, false, false,
  false, false, false, false, false, false, false
);
