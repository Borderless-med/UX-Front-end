import { useState } from 'react';
import { Building2, Shield, Star, Clock, MapPin, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const ClinicsSection = () => {
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [minReviews, setMinReviews] = useState(0);
  const [credentialFilter, setCredentialFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Updated clinic data from the new spreadsheet
  const clinics = [
    {
      id: 1,
      name: 'Klinik Pergigian Pearl',
      address: '20 Jalan Rebana, Taman Kebun Teh',
      dentist: 'Dr. Lim Wei Jing (BDS UM)',
      rating: 4.9,
      reviews: 224,
      distance: 3.8,
      sentiment: 96,
      mdaLicense: 'MDC-2023-JHR-045',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 2,
      name: 'Klinik Pergigian U.n.i Dental Pasir Gudang',
      address: '11B Jln Belatuk 2, Taman Scientex',
      dentist: 'Not available',
      rating: 5.0,
      reviews: 0,
      distance: 17.3,
      sentiment: 85,
      mdaLicense: 'Pending',
      credentials: 'MDC Pending',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 3,
      name: 'Southern Dental (Braces)',
      address: '31 Jln Pulai Mutiara 4/4',
      dentist: 'Dr See Yi Ping (BDS, MFDS RCS UK)',
      rating: 5.0,
      reviews: 0,
      distance: 3.5,
      sentiment: 85,
      mdaLicense: 'MDC-2021-JHR-112',
      credentials: 'MDC Registered; BDS; MFDS RCS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 4,
      name: 'Klinik Pergigian Dr Cheong',
      address: '58 Jln Molek 2/1',
      dentist: 'Dr. Cheong Ah Meng (DDS Indonesia)',
      rating: 4.7,
      reviews: 0,
      distance: 8.4,
      sentiment: 79.9,
      mdaLicense: 'MDC-2019-JHR-087',
      credentials: 'MDC Registered; DDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 5,
      name: 'Medini Dental Bukit Indah',
      address: '31 Jln Indah 15/2',
      dentist: 'Dr Sukhveer Singh (BDS Manipal)',
      rating: 4.9,
      reviews: 224,
      distance: 1,
      sentiment: 96,
      mdaLicense: 'MDC-2022-JHR-033',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 6,
      name: 'Puteri Dental Clinic JB',
      address: '163 1 Jln Tanjung Puteri',
      dentist: 'Not available',
      rating: 4.7,
      reviews: 304,
      distance: 1,
      sentiment: 92.1,
      mdaLicense: 'MDC-2021-JHR-156',
      credentials: 'MDC Registered; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 7,
      name: 'Sentosa Dental Clinic',
      address: '43A Jln Sulam, Taman Sentosa',
      dentist: 'Dr. Wong Li Yen (BDS IMU)',
      rating: 4.9,
      reviews: 573,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2024-JHR-009',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 8,
      name: 'Anna Dental Molek',
      address: '65 Jln Molek 3/10',
      dentist: 'Dr Sri Vithya Muthu (BDS AIMST)',
      rating: 4.6,
      reviews: 157,
      distance: 8.4,
      sentiment: 87.4,
      mdaLicense: 'MDC-2023-JHR-078',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 9,
      name: 'JDT Dental',
      address: '41B Jln Kuning 2',
      dentist: 'Dr. Kaushalya (Oxford University)',
      rating: 0,
      reviews: 0,
      distance: 1,
      sentiment: 0,
      mdaLicense: 'Expired 2024',
      credentials: 'MDC Expired; Oxford Graduate',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 10,
      name: 'Habib Dental Bandar DatoOnn',
      address: '17 Jln Perjiranan 46',
      dentist: 'Dr. Habib Rahman (BDS UI)',
      rating: 5.0,
      reviews: 378,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2022-JHR-141',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 11,
      name: 'Deluxe Dental Mount Austin',
      address: '31 Jln Mutiara Emas 102',
      dentist: 'Dr. Tan Mei Ling (BDS Malaya)',
      rating: 5.0,
      reviews: 892,
      distance: 10.4,
      sentiment: 100,
      mdaLicense: 'MDC-2024-JHR-055',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 12,
      name: 'Klinik Pergigian Uda',
      address: '29-01 Jln Padi Ria, Bandar Baru Uda',
      dentist: 'Not available',
      rating: 4.6,
      reviews: 215,
      distance: 1,
      sentiment: 90.2,
      mdaLicense: 'MDC-2021-JHR-189',
      credentials: 'MDC Registered; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 13,
      name: 'Kamil Dental Clinic',
      address: '60 Jln Persiaran Susur Larkin',
      dentist: 'Dr. Kamal Nasir (BDS UiTM)',
      rating: 5.0,
      reviews: 482,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2023-JHR-066',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 14,
      name: 'Smile Heritage Cosmetic',
      address: 'Pusat Perdagangan Jln Kebun Teh 4',
      dentist: 'Dr. Rajesh Kumar (BDS)',
      rating: 4.8,
      reviews: 251,
      distance: 3.4,
      sentiment: 94.1,
      mdaLicense: 'MDC-2022-JHR-122',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 15,
      name: 'Adda Braces & Invisalign',
      address: '108-110 Jln Adda 7',
      dentist: 'Dr. Sarah Ho (DDS Sydney)',
      rating: 4.9,
      reviews: 1062,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2024-JHR-011',
      credentials: 'MDC Registered; DDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 16,
      name: 'Klinik Pergigian Ang Invisalign',
      address: '61 Jln Perisai, Taman Sri Tebrau',
      dentist: 'Dr. Ang Wei Ming (Cert. Invisalign Pro)',
      rating: 5.0,
      reviews: 2858,
      distance: 1,
      sentiment: 100,
      mdaLicense: 'MDC-2021-JHR-204',
      credentials: 'MDC Registered; Invisalign Certified; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 17,
      name: 'Aura Dental Adda Heights',
      address: '92-01 Jln Adda 7',
      dentist: 'Dr. Hafiz Yusoff (BDS UKM)',
      rating: 5.0,
      reviews: 489,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2023-JHR-097',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 18,
      name: 'T Dental Clinic',
      address: '5-7 Jln Pendekar 15',
      dentist: 'Dr. Teo Li Wen (BDS Singapore)',
      rating: 4.9,
      reviews: 743,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2022-JHR-133',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 19,
      name: 'Dental Pavilion Skudai',
      address: 'No 1-01 Jln Pendidikan 8',
      dentist: 'Dr. Ahmad Faisal (BDS USM)',
      rating: 4.8,
      reviews: 189,
      distance: 1,
      sentiment: 91.2,
      mdaLicense: 'MDC-2023-JHR-088',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 20,
      name: 'Li Dental Clinic',
      address: '20-01 Jln Bestari 22',
      dentist: 'Dr. Li Chang Wei (BDS Taiwan)',
      rating: 4.8,
      reviews: 302,
      distance: 1,
      sentiment: 94.1,
      mdaLicense: 'MDC-2021-JHR-177',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 21,
      name: 'Klinik Pergigian Azura Larkin',
      address: 'Ground Floor 60 Jln Persiaran Susur Larkin',
      dentist: 'Not available',
      rating: 5.0,
      reviews: 415,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2024-JHR-022',
      credentials: 'MDC Registered; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 22,
      name: 'Onin Dental Gelang Patah',
      address: '12-02 Jln Nusaria 117',
      dentist: 'Dr. Nurul Aisyah (BDS UM)',
      rating: 5.0,
      reviews: 247,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2023-JHR-155',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 23,
      name: 'Nusantara Dental Care',
      address: '15-02 1st Floor Jln Nusaria 111',
      dentist: 'Dr. Kumaravel (MDS Ortho)',
      rating: 5.0,
      reviews: 1775,
      distance: 1,
      sentiment: 100,
      mdaLicense: 'MDC-2023-JHR-199',
      credentials: 'MDC Registered; MDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 24,
      name: 'Klinik Pergigian Sapphire',
      address: '11B Jln Ekoperniagaan 7',
      dentist: 'Dr. Amirah Zainal (BDS UKM)',
      rating: 5.0,
      reviews: 322,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2024-JHR-044',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 25,
      name: 'Asiaa Dental Clinic',
      address: '113A Jln Perisai, Taman Sri Tebrau',
      dentist: 'Dr. Chen Lee Ming (BDS Hong Kong)',
      rating: 5.0,
      reviews: 252,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2022-JHR-166',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 26,
      name: 'Amim Dental Surgery',
      address: 'No 27-02 First Floor Jln Nusaria 111',
      dentist: 'Dr. Amir Hamzah (BDS UM)',
      rating: 4.8,
      reviews: 119,
      distance: 1,
      sentiment: 91.2,
      mdaLicense: 'MDC-2021-JHR-211',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 27,
      name: 'KSL Dental Centre',
      address: '5-01 Jln Tampoi Susur 1',
      dentist: 'Dr. Lim Jia Hui (BDS IMU)',
      rating: 4.9,
      reviews: 639,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2023-JHR-077',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 28,
      name: 'Taman Universiti Dental',
      address: '1-01 Jln Aliff Harmoni 4',
      dentist: 'Dr. Ng Pei Ling (BDS Singapore)',
      rating: 5.0,
      reviews: 159,
      distance: 15.7,
      sentiment: 95,
      mdaLicense: 'MDC-2024-JHR-031',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 29,
      name: 'Setia Tropika Dental',
      address: '38 Jln Setia Tropika 124',
      dentist: 'Dr. Wong Chee Meng (BDS Malaya)',
      rating: 5.0,
      reviews: 477,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2022-JHR-144',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 30,
      name: 'Adda Heights Dental Studio',
      address: '5008A Tingkat 1 Lorong Adda 7',
      dentist: 'Dr. Tan Wei Jie (BDS UKM)',
      rating: 4.9,
      reviews: 731,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2023-JHR-102',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 31,
      name: 'Bandar Putra Dental Care',
      address: '4547 Jln Iris 23',
      dentist: 'Dr. Jessica Lim (BDS Singapore)',
      rating: 5.0,
      reviews: 482,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2024-JHR-018',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 32,
      name: 'Taman Nusa Bestari Dental',
      address: '56-58 Jln Serangkai 18',
      dentist: 'Dr. Rajiv Menon (BDS India)',
      rating: 4.9,
      reviews: 264,
      distance: 1,
      sentiment: 96,
      mdaLicense: 'MDC-2021-JHR-233',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 33,
      name: 'Mount Austin Dental Hub',
      address: '31 Jln Mutiara Emas 102',
      dentist: 'Dr. Lee Xin Yi (BDS Taiwan)',
      rating: 5.0,
      reviews: 892,
      distance: 10.4,
      sentiment: 100,
      mdaLicense: 'MDC-2023-JHR-121',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 34,
      name: 'Permas Jaya Dental Clinic',
      address: '76 Jln Harimau Tarum',
      dentist: 'Dr. Ahmad Zaki (BDS UiTM)',
      rating: 4.9,
      reviews: 497,
      distance: 1,
      sentiment: 96,
      mdaLicense: 'MDC-2022-JHR-157',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 35,
      name: 'Taman Damansara Aliff Dental',
      address: 'No 20 Aras Bawah Jln Aliff 3',
      dentist: 'Dr. Siti Nurhaliza (BDS UM)',
      rating: 5.0,
      reviews: 513,
      distance: 1,
      sentiment: 100,
      mdaLicense: 'MDC-2024-JHR-029',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 36,
      name: 'Kota Masai Dental Care',
      address: '11B Jln Ekoperniagaan 7',
      dentist: 'Dr. Priya Devi (BDS Manipal)',
      rating: 5.0,
      reviews: 322,
      distance: 1,
      sentiment: 98,
      mdaLicense: 'MDC-2021-JHR-248',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 37,
      name: 'Taman Scientex Dental',
      address: '11B Jln Belatuk 2',
      dentist: 'Dr. Brian Tan (BDS Singapore)',
      rating: 5.0,
      reviews: 415,
      distance: 17.3,
      sentiment: 98,
      mdaLicense: 'MDC-2023-JHR-136',
      credentials: 'MDC Registered; BDS; Likely MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 38,
      name: 'Klinik Pergigian Gaura',
      address: 'No.20 (Aras Bawah), Jalan Aliff 3, Taman Damansara Aliff, 81200 Johor Bahru',
      dentist: 'Dr. Siti Nur Hajjar (BDS UM)',
      rating: 5.0,
      reviews: 460,
      distance: 4.2,
      sentiment: 98,
      mdaLicense: 'MDC-2022-JHR-344',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 39,
      name: 'E&E Dental Clinic JB',
      address: '76, Jalan Harimau Tarum, Taman Abad, 80250 Johor Bahru',
      dentist: 'Dr. Edmund Ooi (BDS UM), Dr. Eewin Goi (BDS IMU)',
      rating: 5.0,
      reviews: 120,
      distance: 2.5,
      sentiment: 95,
      mdaLicense: 'MDC-2023-JHR-455',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 40,
      name: 'ProDental Specialists Group',
      address: 'No.01-01, 01-02, Block H, Komersial Southkey Mozek, Persiaran Southkey 1, Kota Southkey',
      dentist: 'Dr. Ahmad Faisal (BDS USM), Dr. Raj Kumar (Ortho Specialist)',
      rating: 4.9,
      reviews: 310,
      distance: 5,
      sentiment: 96,
      mdaLicense: 'MDC-2023-JHR-122',
      credentials: 'MDC Registered; BDS; Specialist Qualified',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 41,
      name: 'Summer Dental Clinic',
      address: 'No 01-08, Block F, Komersil SouthKey Mozek, Persiaran Southkey 1, Kota Southkey',
      dentist: 'Dr. Sarah Lim (BDS IMU)',
      rating: 4.8,
      reviews: 85,
      distance: 5.2,
      sentiment: 91.2,
      mdaLicense: 'MDC-2024-JHR-067',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 42,
      name: 'White Dental Johor Bahru',
      address: '42, Jalan Camar 1, Taman Perling, 81200 Johor Bahru',
      dentist: 'Dr. Wong Wei Ming (BDS UKM)',
      rating: 4.7,
      reviews: 145,
      distance: 3.8,
      sentiment: 90.2,
      mdaLicense: 'MDC-2023-JHR-288',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 43,
      name: 'Lou Dental Centre Johor Bahru',
      address: '103,103A & 103B, Jalan Sutera Tanjung 8/2, Taman Sutera Utama',
      dentist: 'Dr. Lou Chee Keong (BDS Malaya), Dr. Teh Wei Lin (MDS Ortho)',
      rating: 4.9,
      reviews: 890,
      distance: 8.5,
      sentiment: 98,
      mdaLicense: 'MDC-1984-JHR-001',
      credentials: 'MDC Registered; BDS; MDS; Established 1984',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 44,
      name: 'ABC Dental Centre',
      address: 'Modern dental clinic based in Johor Bahru specializing in advanced diagnostics',
      dentist: 'Dr. Lim Boon Huat (BDS Singapore)',
      rating: 4.8,
      reviews: 125,
      distance: 6.2,
      sentiment: 91.2,
      mdaLicense: 'MDC-2022-JHR-399',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 45,
      name: 'JDT Dental Centre',
      address: '41B Jalan Kuning 2, Taman Pelangi, 80400 Johor Bahru',
      dentist: 'Dr. Presha Kumari (BDS India)',
      rating: 4.8,
      reviews: 75,
      distance: 4.8,
      sentiment: 91.2,
      mdaLicense: 'MDC-2023-JHR-456',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 46,
      name: 'The Smile Dental Lounge',
      address: 'Mount Austin area, near Ikea Tebrau and Aeon Tebrau City',
      dentist: 'Dr. Chen Wei Jie (BDS Taiwan)',
      rating: 4.9,
      reviews: 180,
      distance: 10.5,
      sentiment: 96,
      mdaLicense: 'MDC-2024-JHR-123',
      credentials: 'MDC Registered; BDS; Invisalign Certified',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 47,
      name: 'Klinik Pergigian Dental Eclipse',
      address: 'Larkin area, Johor Bahru',
      dentist: 'Dr. Ahmad Syafiq (BDS UiTM)',
      rating: 4.9,
      reviews: 95,
      distance: 6.8,
      sentiment: 96,
      mdaLicense: 'MDC-2023-JHR-567',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 48,
      name: 'Toothland Dental Kulai',
      address: 'No.24, Jalan Raya Taman Kulai Besar, Kulai Besar, 81000 Kulai, Johor',
      dentist: 'Dr. Tan Chee Wai (BDS UM)',
      rating: 4.8,
      reviews: 156,
      distance: 22.5,
      sentiment: 91.2,
      mdaLicense: 'MDC-2023-JHR-678',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 49,
      name: 'Tiew Dental Johor Kulai Branch',
      address: 'No. 222(Ground Floor), Jalan Kenanga 29/2, Indahpura Kenanga, 81000 Indahpura',
      dentist: 'Dr. Say Tian Hui (BDS Malaya), Dr. Ang Chia Min (BDS IMU)',
      rating: 4.9,
      reviews: 285,
      distance: 18.5,
      sentiment: 96,
      mdaLicense: 'MDC-2022-JHR-789',
      credentials: 'MDC Registered; Part of Tiew Dental Group',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 50,
      name: 'Klinik Pergigian Haslinda Sdn. Bhd.',
      address: 'Jalan Sri Putra 1, 14, Kulai, Malaysia',
      dentist: 'Dr. Haslinda Ahmad (BDS UKM)',
      rating: 4.7,
      reviews: 98,
      distance: 20.8,
      sentiment: 90.2,
      mdaLicense: 'MDC-2021-JHR-890',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 51,
      name: 'Klinik Pergigian Atlas Batu Pahat',
      address: '1, Jalan Susur Perdana Tengah, Taman Bukit Perdana 2, Batu Pahat',
      dentist: 'Dr. Eddy Fazry (DDS, ICCDE, Invisalign Certified)',
      rating: 4.9,
      reviews: 165,
      distance: 95.2,
      sentiment: 96,
      mdaLicense: 'MDC-2023-JHR-991',
      credentials: 'MDC Registered; DDS; Invisalign Provider',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: true,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 52,
      name: 'Klinik Pergigian Austraria',
      address: '37-3 Jalan Rahmat, Batu Pahat, 83000, Johor',
      dentist: 'Dr. Ahmad Zulkifli (BDS USM)',
      rating: 4.6,
      reviews: 78,
      distance: 98.5,
      sentiment: 87.4,
      mdaLicense: 'MDC-2022-JHR-992',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    },
    {
      id: 53,
      name: 'Klinik Pergigian Kencana',
      address: '19 & 19A, Jalan Kencana 1A/1 Bandar Pura Kencana Sri Gading, Batu Pahat',
      dentist: 'Dr. Siti Khadijah (BDS UiTM)',
      rating: 4.8,
      reviews: 92,
      distance: 102.3,
      sentiment: 91.2,
      mdaLicense: 'MDC-2023-JHR-993',
      credentials: 'MDC Registered; BDS; MDA Member',
      treatments: {
        toothFilling: true,
        rootCanal: true,
        dentalCrown: true,
        dentalImplant: false,
        teethWhitening: true,
        braces: true,
        wisdomTooth: true,
        gumTreatment: true
      }
    }
  ];

  const treatments = [
    'All Treatments', 'Tooth Filling', 'Root Canal', 'Dental Crown', 'Dental Implant', 
    'Teeth Whitening', 'Braces (Metal)', 'Wisdom Tooth Removal', 'Gum Treatment'
  ];

  // Filter clinics based on selected criteria
  const filteredClinics = clinics.filter(clinic => {
    // Treatment filter
    const matchesTreatment = !selectedTreatment || selectedTreatment === 'All Treatments' || 
                            (selectedTreatment === 'Tooth Filling' && clinic.treatments.toothFilling) ||
                            (selectedTreatment === 'Root Canal' && clinic.treatments.rootCanal) ||
                            (selectedTreatment === 'Dental Crown' && clinic.treatments.dentalCrown) ||
                            (selectedTreatment === 'Dental Implant' && clinic.treatments.dentalImplant) ||
                            (selectedTreatment === 'Teeth Whitening' && clinic.treatments.teethWhitening) ||
                            (selectedTreatment === 'Braces (Metal)' && clinic.treatments.braces) ||
                            (selectedTreatment === 'Wisdom Tooth Removal' && clinic.treatments.wisdomTooth) ||
                            (selectedTreatment === 'Gum Treatment' && clinic.treatments.gumTreatment);

    // Rating filter
    const matchesRating = !selectedRating || clinic.rating >= parseFloat(selectedRating);
    
    // Distance filter
    const matchesDistance = clinic.distance <= maxDistance;
    
    // Sentiment filter
    const matchesSentiment = !sentimentFilter || 
                           (sentimentFilter === 'excellent' && clinic.sentiment >= 95) ||
                           (sentimentFilter === 'good' && clinic.sentiment >= 85 && clinic.sentiment < 95) ||
                           (sentimentFilter === 'average' && clinic.sentiment >= 70 && clinic.sentiment < 85) ||
                           (sentimentFilter === 'all');
    
    // Reviews filter
    const matchesReviews = clinic.reviews >= minReviews;
    
    // Credential filter
    const matchesCredentials = !credentialFilter || 
                              (credentialFilter === 'mdc-registered' && clinic.mdaLicense.includes('MDC-')) ||
                              (credentialFilter === 'specialist' && (clinic.credentials.includes('MDS') || clinic.credentials.includes('Specialist'))) ||
                              (credentialFilter === 'all');

    // Updated Location filter to match distance options
    const matchesLocation = !locationFilter || 
                           (locationFilter === 'all') ||
                           (locationFilter === '0-2km' && clinic.distance <= 2) ||
                           (locationFilter === '2-5km' && clinic.distance > 2 && clinic.distance <= 5) ||
                           (locationFilter === '5-10km' && clinic.distance > 5 && clinic.distance <= 10) ||
                           (locationFilter === '10-15km' && clinic.distance > 10 && clinic.distance <= 15) ||
                           (locationFilter === '15km+' && clinic.distance > 15) ||
                           (locationFilter === 'causeway-area' && clinic.distance <= 3) ||
                           (locationFilter === 'city-center' && clinic.distance <= 8) ||
                           (locationFilter === 'taman-sentosa' && clinic.address.toLowerCase().includes('sentosa')) ||
                           (locationFilter === 'skudai' && clinic.address.toLowerCase().includes('skudai'));

    return matchesTreatment && matchesRating && matchesDistance && matchesSentiment && 
           matchesReviews && matchesCredentials && matchesLocation;
  });

  const getSentimentIcon = (score: number) => {
    if (score >= 95) return '😊';
    if (score >= 85) return '😐';
    if (score >= 70) return '😔';
    return '😟';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Good';
    if (score >= 70) return 'Average';
    return 'Below Average';
  };

  const getCredentialStatus = (license: string) => {
    if (license.includes('Expired')) return 'Expired';
    if (license.includes('Pending')) return 'Pending';
    if (license.includes('MDC-')) return 'Verified';
    return 'Unknown';
  };

  const resetFilters = () => {
    setSelectedTreatment('');
    setSelectedRating('');
    setMaxDistance(50);
    setSentimentFilter('');
    setMinReviews(0);
    setCredentialFilter('');
    setLocationFilter('');
  };

  return (
    <section id="clinics" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            Find Your Perfect Clinic
          </h2>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Filter and compare 53 verified dental clinics across Johor to find the best match for your needs
          </p>
        </div>

        {/* Advanced Filters */}
        <Card className="mb-8 bg-light-card border-blue-light">
          <CardHeader>
            <CardTitle className="text-blue-dark text-xl">Filter Clinics</CardTitle>
            <CardDescription className="text-neutral-gray">
              Customize your search criteria to find the perfect clinic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1: Treatment Type and User Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-dark mb-2 block">Treatment Type</Label>
                <Select onValueChange={setSelectedTreatment} value={selectedTreatment}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="All Treatments" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light">
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment} value={treatment} className="text-blue-dark">
                        {treatment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-blue-dark mb-2 block">Minimum Rating</Label>
                <Select onValueChange={setSelectedRating} value={selectedRating}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light">
                    <SelectItem value="4.9" className="text-blue-dark">4.9+ Stars</SelectItem>
                    <SelectItem value="4.8" className="text-blue-dark">4.8+ Stars</SelectItem>
                    <SelectItem value="4.7" className="text-blue-dark">4.7+ Stars</SelectItem>
                    <SelectItem value="4.5" className="text-blue-dark">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0" className="text-blue-dark">4.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Professional Credentials and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-dark mb-2 block">Professional Credentials</Label>
                <Select onValueChange={setCredentialFilter} value={credentialFilter}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="All Credentials" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light">
                    <SelectItem value="all" className="text-blue-dark">All Credentials</SelectItem>
                    <SelectItem value="mdc-registered" className="text-blue-dark">MDC Registered</SelectItem>
                    <SelectItem value="specialist" className="text-blue-dark">Specialist (MDS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-blue-dark mb-2 block">Location Preference</Label>
                <Select onValueChange={setLocationFilter} value={locationFilter}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="Distance from CIQ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light">
                    <SelectItem value="all" className="text-blue-dark">Any Distance</SelectItem>
                    <SelectItem value="0-2km" className="text-blue-dark">Within 2km from CIQ</SelectItem>
                    <SelectItem value="2-5km" className="text-blue-dark">2-5km from CIQ</SelectItem>
                    <SelectItem value="5-10km" className="text-blue-dark">5-10km from CIQ</SelectItem>
                    <SelectItem value="10-15km" className="text-blue-dark">10-15km from CIQ</SelectItem>
                    <SelectItem value="15km+" className="text-blue-dark">15km+ from CIQ</SelectItem>
                    <SelectItem value="causeway-area" className="text-blue-dark">Near Causeway Bridge</SelectItem>
                    <SelectItem value="city-center" className="text-blue-dark">JB City Center</SelectItem>
                    <SelectItem value="taman-sentosa" className="text-blue-dark">Taman Sentosa Area</SelectItem>
                    <SelectItem value="skudai" className="text-blue-dark">Skudai Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Distance and AI Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-dark mb-4 block">
                  Max Distance from CIQ: {maxDistance} km
                </Label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={(value) => setMaxDistance(value[0])}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-blue-dark mb-2 block">AI Sentiment Analysis</Label>
                <Select onValueChange={setSentimentFilter} value={sentimentFilter}>
                  <SelectTrigger className="bg-white border-blue-light text-blue-dark">
                    <SelectValue placeholder="All Sentiments" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-light">
                    <SelectItem value="all" className="text-blue-dark">All Sentiments</SelectItem>
                    <SelectItem value="excellent" className="text-blue-dark">😊 Excellent (95%+)</SelectItem>
                    <SelectItem value="good" className="text-blue-dark">😐 Good (85-95%)</SelectItem>
                    <SelectItem value="average" className="text-blue-dark">😔 Average (70-85%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Number of Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-dark mb-4 block">
                  Minimum Reviews: {minReviews}
                </Label>
                <Slider
                  value={[minReviews]}
                  onValueChange={(value) => setMinReviews(value[0])}
                  max={1000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={resetFilters}
                  variant="outline" 
                  className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white w-full"
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-neutral-gray">
            Found <span className="text-blue-primary font-semibold">{filteredClinics.length}</span> clinics matching your criteria
          </p>
        </div>

        {/* Clinic Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <Card key={clinic.id} className="bg-white border-blue-light hover:border-blue-primary transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-blue-dark text-lg flex items-center gap-2">
                    {clinic.name}
                    {getCredentialStatus(clinic.mdaLicense) === 'Verified' && 
                      <Shield className="h-4 w-4 text-success-green" />}
                  </CardTitle>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-blue-dark font-semibold">{clinic.rating || 'N/A'}</span>
                    <span className="text-neutral-gray">({clinic.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-neutral-gray" />
                    <span className="text-neutral-gray">{clinic.distance} km from CIQ</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-neutral-gray" />
                    <span className="text-neutral-gray">
                      Sentiment: {getSentimentIcon(clinic.sentiment)} {clinic.sentiment}% ({getSentimentLabel(clinic.sentiment)})
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-neutral-gray text-sm">Dentist:</p>
                    <p className="text-blue-dark text-sm">{clinic.dentist}</p>
                  </div>
                  
                  <div>
                    <p className="text-neutral-gray text-sm">Address:</p>
                    <p className="text-neutral-gray text-sm">{clinic.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-neutral-gray text-sm">MDA License:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-gray text-sm">{clinic.mdaLicense}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          getCredentialStatus(clinic.mdaLicense) === 'Verified' 
                            ? 'border-success-green text-success-green' 
                            : getCredentialStatus(clinic.mdaLicense) === 'Pending'
                            ? 'border-yellow-500 text-yellow-500'
                            : 'border-red-500 text-red-500'
                        }`}
                      >
                        {getCredentialStatus(clinic.mdaLicense)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-neutral-gray text-sm">Available Treatments:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {clinic.treatments.dentalImplant && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Implants</Badge>}
                      {clinic.treatments.braces && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Braces</Badge>}
                      {clinic.treatments.rootCanal && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Root Canal</Badge>}
                      {clinic.treatments.teethWhitening && <Badge variant="outline" className="border-blue-light text-blue-primary text-xs">Whitening</Badge>}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-blue-primary hover:bg-blue-dark text-white"
                      onClick={() => {
                        const element = document.getElementById('waitlist');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="border-blue-light text-blue-primary hover:bg-blue-light">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredClinics.length === 0 && (
          <Card className="bg-light-card border-blue-light text-center py-12">
            <CardContent>
              <p className="text-blue-dark text-lg mb-4">No clinics match your current criteria</p>
              <p className="text-neutral-gray mb-6">Try adjusting your filters to see more results</p>
              <Button 
                onClick={resetFilters}
                variant="outline" 
                className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white"
              >
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ClinicsSection;
