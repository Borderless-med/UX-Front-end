
-- Update Permas Jaya Dental Clinic with Google review URL and operating hours
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=13477879340503489613',
  operating_hours = 'Monday: 9:00 AM – 6:00 PM
Tuesday: 9:00 AM – 6:00 PM
Wednesday: 9:00 AM – 6:00 PM
Thursday: 9:00 AM – 6:00 PM
Friday: 9:00 AM – 6:00 PM
Saturday: 9:00 AM – 6:00 PM
Sunday: 9:00 AM – 6:00 PM',
  rating = 4.9,
  reviews = 646,
  website_url = 'http://www.austindentalgroup.com.my/'
WHERE name LIKE '%Permas Jaya%';

-- Update Lou Dental Centre with Google review URL and operating hours
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=8312769651954827777',
  operating_hours = 'Monday: 9:00 AM – 5:00 PM
Tuesday: 9:00 AM – 5:00 PM
Wednesday: 9:00 AM – 5:00 PM
Thursday: 9:00 AM – 5:00 PM
Friday: 9:00 AM – 5:00 PM
Saturday: 9:00 AM – 5:00 PM
Sunday: Closed',
  rating = 4.6,
  reviews = 142,
  website_url = 'http://www.loudental.com/'
WHERE name LIKE '%Lou Dental%';

-- Update Klinik Pergigian Penawar Temenggong Kulai with Google review URL
UPDATE public.clinics_data SET 
  google_review_url = 'https://maps.google.com/?cid=2648667195453865960',
  operating_hours = 'Operating hours not available',
  rating = 4.7,
  reviews = 7,
  website_url = 'https://www.facebook.com/pergigianpenawarkulai'
WHERE name LIKE '%Penawar Temenggong%';
