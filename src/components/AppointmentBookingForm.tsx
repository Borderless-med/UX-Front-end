import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Calendar, Phone, MapPin, Clock, User, Mail, Stethoscope, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { restInvokeFunction } from '@/utils/restClient';
import { treatmentOptions, type TreatmentType } from '@/data/treatmentOptions';
import { commonTownships } from '@/components/clinic/utils/clinicConstants';
import { isDateDisabled } from '@/data/singaporeHolidays';
import { useSupabaseClinics } from '@/hooks/useSupabaseClinics';
import { toast } from 'sonner';

interface FormData {
  patient_name: string;
  email: string;
  whatsapp: string;
  country_code: string;
  treatment_type: TreatmentType | '';
  preferred_clinic: string;
  preferred_date: Date | undefined;
  time_slot: string;
  clinic_location: string;
  consent_given: boolean;
  create_account: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const AppointmentBookingForm = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Fetch clinic data
  const { clinics, loading: clinicsLoading, error: clinicsError } = useSupabaseClinics();
  
  const [formData, setFormData] = useState<FormData>({
    patient_name: '',
    email: '',
    whatsapp: '',
    country_code: '+65',
    treatment_type: '',
    preferred_clinic: '',
    preferred_date: undefined,
    time_slot: '',
    clinic_location: '',
    consent_given: false,
    create_account: true, // Pre-checked for convenience
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [emailsSent, setEmailsSent] = useState<boolean>(false);
  const [userCreated, setUserCreated] = useState<boolean>(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Time slot options
  const timeSlots = [
    { value: 'Morning', label: 'Morning (9AM - 12PM)' },
    { value: 'Afternoon', label: 'Afternoon (1PM - 5PM)' },
    { value: 'Evening', label: 'Evening (6PM - 9PM)' },
  ];

  // Country codes for WhatsApp
  const countryCodes = [
    { value: '+65', label: '+65 (Singapore)' },
    { value: '+60', label: '+60 (Malaysia)' },
  ];

  // Function to format clinic name from URL parameter
  const formatClinicName = (rawName: string): string => {
    console.log('🔍 formatClinicName - Raw input:', rawName);
    
    if (!rawName) {
      console.log('❌ formatClinicName - Empty input');
      return '';
    }
    
    // First decode URL encoding (handles %20, etc.)
    let decoded = decodeURIComponent(rawName);
    console.log('📝 formatClinicName - After URL decode:', decoded);
    
    // Replace + with spaces and handle various space encodings
    let formatted = decoded.replace(/\+/g, ' ').replace(/%20/g, ' ').trim();
    console.log('🔧 formatClinicName - After space replacement:', formatted);
    
    // Convert to title case
    formatted = formatted
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 0) // Remove empty strings from double spaces
      .map(word => {
        // Handle special cases
        const upperCaseWords = ['JB', 'TMJ', 'UI', 'UX'];
        if (upperCaseWords.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }
        // Capitalize first letter of each word
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    
    console.log('✅ formatClinicName - Final result:', formatted);
    return formatted;
  };

  // Function to map AI treatment values to form values
  const mapTreatmentValue = (aiValue: string): TreatmentType | '' => {
    if (!aiValue) return '';
    
    const normalizedValue = aiValue.toLowerCase().trim();
    console.log('=== TREATMENT MAPPING DEBUG ===');
    console.log('Original AI value:', aiValue);
    console.log('Normalized value:', normalizedValue);
    
    // Direct matches - include consultation mappings and crown variations
    const directMatches: Record<string, TreatmentType> = {
      // Basic treatments
      'tooth_filling': 'Tooth Filling',
      'filling': 'Tooth Filling',
      'dental_filling': 'Tooth Filling',
      'root_canal': 'Root Canal',
      
      // Crown treatments - many variations
      'crown': 'Dental Crown',
      'dental_crown': 'Dental Crown',
      'tooth_crown': 'Dental Crown',
      'crown treatment': 'Dental Crown',
      'crowns': 'Dental Crown',
      'dental crown treatment': 'Dental Crown',
      
      // Other treatments
      'dental_implant': 'Dental Implant',
      'implant': 'Dental Implant',
      'teeth_whitening': 'Teeth Whitening',
      'whitening': 'Teeth Whitening',
      'orthodontic_braces': 'Orthodontic Braces',
      'braces': 'Orthodontic Braces',
      'wisdom_tooth_extraction': 'Wisdom Tooth Extraction',
      'wisdom_tooth': 'Wisdom Tooth Extraction',
      'composite_veneers': 'Composite Veneers',
      'veneers': 'Composite Veneers',
      'porcelain_veneers': 'Porcelain Veneers',
      'dental_bonding': 'Dental Bonding',
      'bonding': 'Dental Bonding',
      'tmj_treatment': 'TMJ Treatment',
      
      // Consultation mappings - AI backend incorrectly maps crown requests to consultation
      'consultation': 'Dental Crown', // Default consultation to crown since that's what user likely wanted
      'a consultation': 'Dental Crown', // This is the specific issue - AI says "a consultation" for crown
      'dental consultation': 'Dental Crown',
      'general consultation': 'Tooth Filling' // General fallback
    };
    
    // Try exact match first
    if (treatmentOptions.includes(aiValue as TreatmentType)) {
      console.log('Exact match found:', aiValue);
      return aiValue as TreatmentType;
    }
    
    // Try direct mapping
    const mapped = directMatches[normalizedValue];
    console.log('Mapped result:', mapped || 'No mapping found');
    
    return mapped || '';
  };

  // Function to map clinic names to township values  
  const mapClinicToTownship = (clinicName: string): string => {
    const normalizedClinic = clinicName.toLowerCase();
    
    // Find exact match in townships
    for (const township of commonTownships) {
      if (normalizedClinic.includes(township.toLowerCase())) {
        return township;
      }
    }
    
    // Fuzzy matching for common clinic name patterns
    const mappings: Record<string, string> = {
      'adda heights': 'Adda Heights',
      'austin heights': 'Austin Heights', 
      'kempas': 'Kempas',
      'kulai': 'Kulai',
      'danga bay': 'Danga Bay',
      'bukit indah': 'Bukit Indah',
      'permas jaya': 'Permas Jaya',
      'taman molek': 'Taman Molek',
      'skudai': 'Skudai'
    };
    
    for (const [pattern, township] of Object.entries(mappings)) {
      if (normalizedClinic.includes(pattern)) {
        return township;
      }
    }
    
    return '';
  };

  // Parse URL parameters and pre-fill form
  useEffect(() => {
    console.log('=== FORM COMPONENT LOADED ===');
    console.log('Current URL:', window.location.href);
    console.log('Search params object:', Object.fromEntries(searchParams.entries()));
    
    const name = searchParams.get('name');
    const email = searchParams.get('email'); 
    const phone = searchParams.get('phone');
    const treatment = searchParams.get('treatment');
    const clinic = searchParams.get('clinic');
    
    console.log('=== RAW URL PARAMETERS ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Treatment (raw):', treatment);
    console.log('Clinic (raw):', clinic);
    
    if (name || email || phone || treatment || clinic) {
      const newFormData: Partial<FormData> = {};
      
      if (name) {
        newFormData.patient_name = decodeURIComponent(name);
      }
      
      if (email) {
        newFormData.email = decodeURIComponent(email);
      }
      
      if (phone) {
        const cleanPhone = decodeURIComponent(phone);
        // Extract country code and phone number
        if (cleanPhone.startsWith('+60')) {
          newFormData.country_code = '+60';
          newFormData.whatsapp = cleanPhone.replace(/^\+60\s*/, '').replace(/[-\s]/g, '');
        } else if (cleanPhone.startsWith('+65')) {
          newFormData.country_code = '+65';
          newFormData.whatsapp = cleanPhone.replace(/^\+65\s*/, '').replace(/[-\s]/g, '');
        } else {
          // Default to +65 for Singapore
          newFormData.country_code = '+65';
          newFormData.whatsapp = cleanPhone.replace(/[-\s]/g, '');
        }
      }
      
      if (treatment) {
        const mappedTreatment = mapTreatmentValue(decodeURIComponent(treatment));
        if (mappedTreatment) {
          newFormData.treatment_type = mappedTreatment;
        }
      }
      
      if (clinic) {
        const decodedClinic = decodeURIComponent(clinic);
        // Format the clinic name for proper display
        const formattedClinic = formatClinicName(decodedClinic);
        newFormData.preferred_clinic = formattedClinic;
        
        // Don't auto-populate clinic_location when clinic is pre-filled
        // This maintains mutual exclusivity - user must choose one or the other
      }
      
      console.log('=== MAPPED FORM DATA ===');
      console.log('Mapped data:', newFormData);
      console.log('Will show preferred clinic field?', !!newFormData.preferred_clinic);
      console.log('Treatment type mapped to:', newFormData.treatment_type);
      
      setFormData(prev => ({ ...prev, ...newFormData }));
      
      // Auto-scroll to the form fields specifically
      setTimeout(() => {
        const formElement = document.getElementById('appointment-form') || 
                           document.querySelector('form') ||
                           document.getElementById('booking');
        if (formElement) {
          formElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 1000);
      
      // Show success message about pre-filled data
      setTimeout(() => {
        toast.success('Form pre-filled with your information!');
      }, 1000);
    }
  }, [searchParams]);

  // Calculate completion percentage
  useEffect(() => {
    const requiredFields = [
      'patient_name', 'email', 'whatsapp', 'treatment_type',
      'preferred_date', 'time_slot', 'consent_given'
    ];
    
    // Add either preferred_clinic OR clinic_location (mutually exclusive)
    const fieldsToCheck = [...requiredFields];
    if (formData.preferred_clinic || formData.clinic_location) {
      fieldsToCheck.push(formData.preferred_clinic ? 'preferred_clinic' : 'clinic_location');
    } else {
      // Neither is filled, so count clinic_location as the field to be completed
      fieldsToCheck.push('clinic_location');
    }
    
    let completedFields = 0;
    fieldsToCheck.forEach(field => {
      if (field === 'preferred_date') {
        if (formData.preferred_date) completedFields++;
      } else if (field === 'consent_given') {
        if (formData.consent_given) completedFields++;
      } else if (formData[field as keyof FormData]) {
        completedFields++;
      }
    });
    
    setCompletionPercentage((completedFields / fieldsToCheck.length) * 100);
  }, [formData]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\d{8,12}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'Please enter a valid phone number';
    }

    if (!formData.treatment_type) {
      newErrors.treatment_type = 'Please select a treatment type';
    }

    // Mutual exclusivity: Either preferred_clinic OR clinic_location is required, not both
    if (!formData.preferred_clinic && !formData.clinic_location) {
      newErrors.clinic_location = 'Please select either a specific clinic or a general location';
    }

    if (!formData.preferred_date) {
      newErrors.preferred_date = 'Please select your preferred appointment date';
    }

    if (!formData.time_slot) {
      newErrors.time_slot = 'Please select a preferred time slot';
    }

    if (!formData.consent_given) {
      newErrors.consent_given = 'PDPA consent is required to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    
    // Handle mutual exclusivity between preferred_clinic and clinic_location
    if (field === 'preferred_clinic' && value) {
      // When clinic is selected, auto-populate location and clear clinic_location
      const mappedLocation = mapClinicToTownship(value);
      newFormData.clinic_location = '';
      console.log('Clinic selected:', value, 'Mapped location:', mappedLocation);
    } else if (field === 'clinic_location' && value) {
      // When location is selected, clear preferred_clinic
      newFormData.preferred_clinic = '';
      console.log('Location selected:', value);
    }
    
    setFormData(newFormData);
    
    // Clear relevant errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear mutual exclusivity errors
    if ((field === 'preferred_clinic' || field === 'clinic_location') && value) {
      setErrors(prev => ({ 
        ...prev, 
        preferred_clinic: '', 
        clinic_location: '' 
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare submission data
      const submissionData = {
        patient_name: formData.patient_name.trim(),
        email: formData.email.trim(),
        whatsapp: `${formData.country_code} ${formData.whatsapp.trim()}`,
        treatment_type: formData.treatment_type,
        preferred_date: formData.preferred_date!.toISOString().split('T')[0],
        time_slot: formData.time_slot,
        clinic_location: formData.preferred_clinic || formData.clinic_location,
        consent_given: formData.consent_given,
        create_account: formData.create_account,
      };

      console.log('Submitting appointment booking:', submissionData);

      // Call the edge function using REST client
      const data = await restInvokeFunction('send-appointment-confirmation', {
        body: submissionData,
      }, {
        timeout: 15000,
        retries: 1
      });

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to book appointment');
      }

      console.log('Appointment booked successfully:', data);
      setBookingReference(data.booking_ref);
      setEmailsSent(Boolean(data.emails_sent));
      setUserCreated(Boolean(data.user_created));
      setIsSubmitted(true);
      
      // Show success message
      const accountMessage = data.user_created ? ' Your account has been created!' : '';
      toast.success(
        data.emails_sent
          ? `Appointment booked successfully! Check your email for confirmation.${accountMessage}`
          : `Appointment booked successfully! We will contact you via WhatsApp shortly.${accountMessage}`
      );

    } catch (error: any) {
      console.error('Appointment booking error:', error);
      toast.error(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Request Received!
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 mb-2">Your Booking Reference</p>
                <p className="text-xl font-mono font-bold text-blue-900">{bookingReference}</p>
              </div>
              
              <div className="text-left bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Next Steps</h4>
                    <p className="text-sm text-amber-700">
                      Our team will contact you within 24 hours via WhatsApp to confirm your appointment 
                      and provide travel guidance for your trip to JB.
                    </p>
                  </div>
                </div>
              </div>
              
              {emailsSent ? (
                <p className="text-gray-600 mb-6">
                  A confirmation email has been sent to <strong>{formData.email}</strong> with all the details.
                </p>
              ) : (
                <div className="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Your booking was received, but the confirmation email could not be sent yet. We will contact you via WhatsApp to confirm. You will still receive an email once available.
                    </p>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-primary hover:bg-primary/90"
              >
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Book Your Dental Appointment
            </CardTitle>
            <p className="text-gray-600">
              Schedule your visit to JB for affordable, quality dental care
            </p>
            
            {/* Progress indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Form Progress</span>
                <span>{Math.round(completionPercentage)}% Complete</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form id="appointment-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Name */}
              <div className="space-y-2">
                <Label htmlFor="patient_name" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Patient Name *</span>
                </Label>
                <Input
                  id="patient_name"
                  placeholder="Enter your full name"
                  value={formData.patient_name}
                  onChange={(e) => handleInputChange('patient_name', e.target.value)}
                  className={cn(
                    "h-12 text-base",
                    errors.patient_name && "border-red-500"
                  )}
                />
                {errors.patient_name && (
                  <p className="text-sm text-red-600">{errors.patient_name}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address *</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn(
                    "h-12 text-base",
                    errors.email && "border-red-500"
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Number *</span>
                </Label>
                <div className="flex space-x-2">
                  <Select value={formData.country_code} onValueChange={(value) => handleInputChange('country_code', value)}>
                    <SelectTrigger className="w-36 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="whatsapp"
                    placeholder="12345678"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className={cn(
                      "flex-1 h-12 text-base",
                      errors.whatsapp && "border-red-500"
                    )}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-sm text-red-600">{errors.whatsapp}</p>
                )}
              </div>

               {/* Treatment Type */}
               <div className="space-y-2">
                 <Label htmlFor="treatment_type" className="flex items-center space-x-2">
                   <Stethoscope className="w-4 h-4" />
                   <span>Treatment Type *</span>
                 </Label>
                 <Select value={formData.treatment_type} onValueChange={(value) => handleInputChange('treatment_type', value)}>
                   <SelectTrigger className={cn(
                     "h-12 text-base",
                     errors.treatment_type && "border-red-500"
                   )}>
                     <SelectValue placeholder="Select your treatment" />
                   </SelectTrigger>
                   <SelectContent>
                     {treatmentOptions.map((treatment) => (
                       <SelectItem key={treatment} value={treatment}>
                         {treatment}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 {errors.treatment_type && (
                   <p className="text-sm text-red-600">{errors.treatment_type}</p>
                 )}
               </div>

              {/* Clinic Selection - Always visible */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Preferred Clinic {!formData.clinic_location ? '*' : ''}</span>
                </Label>
                
                {/* Mutual exclusivity helper text */}
                {!formData.preferred_clinic && !formData.clinic_location && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 Choose either a specific clinic OR select a general location below (not both)
                  </p>
                )}
                
                {formData.preferred_clinic ? (
                  // Read-only field when pre-filled from URL or clinic is selected
                  <div className="relative">
                    <Input
                      value={formData.preferred_clinic}
                      disabled
                      className="h-12 text-base bg-green-50 border-green-200 text-green-800 font-medium pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ✓ {formData.preferred_clinic === 'Any clinic' ? 'We will recommend the best clinic match' : 'Selected by AI assistant based on your preferences'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('preferred_clinic', '')}
                      className="mt-2 text-xs h-8"
                    >
                      Clear selection & choose location instead
                    </Button>
                  </div>
                ) : (
                  // Dropdown selection when no clinic specified
                  <>
                    {clinicsError && (
                      <div className="text-sm text-red-600 mb-2">
                        Error loading clinics. Please try refreshing the page.
                      </div>
                    )}
                    <Select 
                      value={formData.preferred_clinic} 
                      onValueChange={(value) => handleInputChange('preferred_clinic', value)}
                      disabled={clinicsLoading || !!formData.clinic_location}
                    >
                      <SelectTrigger className={cn(
                        "h-12 text-base",
                        errors.preferred_clinic && "border-red-500",
                        formData.clinic_location && "bg-gray-50 cursor-not-allowed"
                      )}>
                        <SelectValue placeholder={
                          formData.clinic_location 
                            ? "Disabled - location selected below" 
                            : clinicsLoading 
                              ? "Loading clinics..." 
                              : "Select a specific clinic"
                        } />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50 max-h-64 overflow-y-auto">
                        <SelectItem value="Any clinic">Any clinic (we'll recommend the best match)</SelectItem>
                        {!clinicsLoading && clinics.length > 0 && (
                          clinics
                            .slice() // Create a copy to avoid mutating original array
                            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
                            .map((clinic) => (
                              <SelectItem key={clinic.id} value={clinic.name}>
                                {clinic.name}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.preferred_clinic && (
                      <p className="text-sm text-red-600">{errors.preferred_clinic}</p>
                    )}
                    {formData.clinic_location && (
                      <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                        ⚠️ This field is disabled because you selected a location below. Clear the location to select a specific clinic.
                      </p>
                    )}
                    {!formData.clinic_location && (
                      <p className="text-xs text-gray-500">
                        {clinicsLoading 
                          ? "Loading clinic options..." 
                          : `Choose from ${clinics.length} available clinics or select a general location below`
                        }
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Preferred Date */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Preferred Appointment Date *</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 text-base justify-start text-left font-normal",
                        !formData.preferred_date && "text-muted-foreground",
                        errors.preferred_date && "border-red-500"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.preferred_date ? format(formData.preferred_date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.preferred_date}
                      onSelect={(date) => handleInputChange('preferred_date', date)}
                      disabled={isDateDisabled}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.preferred_date && (
                  <p className="text-sm text-red-600">{errors.preferred_date}</p>
                )}
                <p className="text-xs text-gray-500">
                  Available: Weekdays only, excluding public holidays, within next 30 days
                </p>
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Preferred Time Slot *</span>
                </Label>
                <Select value={formData.time_slot} onValueChange={(value) => handleInputChange('time_slot', value)}>
                  <SelectTrigger className={cn(
                    "h-12 text-base",
                    errors.time_slot && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time_slot && (
                  <p className="text-sm text-red-600">{errors.time_slot}</p>
                )}
              </div>

              {/* Clinic Location */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Preferred Clinic Location (JB) {!formData.preferred_clinic ? '*' : ''}</span>
                </Label>
                
                <Select 
                  value={formData.clinic_location} 
                  onValueChange={(value) => handleInputChange('clinic_location', value)}
                  disabled={!!formData.preferred_clinic}
                >
                  <SelectTrigger className={cn(
                    "h-12 text-base",
                    errors.clinic_location && "border-red-500",
                    formData.preferred_clinic && "bg-gray-50 cursor-not-allowed"
                  )}>
                    <SelectValue placeholder={
                      formData.preferred_clinic 
                        ? "Disabled - specific clinic selected above" 
                        : "Select JB area/township"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {commonTownships.slice(0, 20).map((township) => (
                      <SelectItem key={township} value={township}>
                        {township}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {errors.clinic_location && (
                  <p className="text-sm text-red-600">{errors.clinic_location}</p>
                )}
                
                {formData.preferred_clinic ? (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                      ⚠️ This field is disabled because you selected a specific clinic above. Clear the clinic selection to choose a general location.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('preferred_clinic', '')}
                      className="text-xs h-8"
                    >
                      Clear clinic selection & choose location
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Choose a general area in JB, and we'll find the best clinics in that location
                  </p>
                )}
              </div>

              {/* PDPA Consent */}
              <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={formData.consent_given}
                    onCheckedChange={(checked) => handleInputChange('consent_given', checked)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor="consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-red-800"
                    >
                      PDPA Consent Required *
                    </Label>
                    <p className="text-xs text-red-700 text-justify">
                      I consent to the collection, use and disclosure of my personal data for appointment booking, 
                      treatment coordination, and communication purposes. By providing my WhatsApp number, I agree 
                      to receive appointment confirmations and travel guidance via WhatsApp.{' '}
                      <a href="/privacy-policy" target="_blank" className="text-red-600 hover:text-red-800 underline">
                        Read our Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
                {errors.consent_given && (
                  <p className="text-sm text-red-600">{errors.consent_given}</p>
                )}
              </div>

              {/* Account Creation */}
              <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="create-account"
                    checked={formData.create_account}
                    onCheckedChange={(checked) => handleInputChange('create_account', checked)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor="create-account"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-800"
                    >
                      Create Account (Recommended) 🚀
                    </Label>
                    <p className="text-xs text-blue-700 text-justify">
                      <strong>Get more benefits:</strong> Access our AI chatbot for instant dental advice, easy rebooking for future treatments, 
                      exclusive promotions, and faster checkout. We'll create a secure account using your email above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || completionPercentage < 100}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Booking Your Appointment...</span>
                  </div>
                ) : (
                  'Book My Appointment'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AppointmentBookingForm;