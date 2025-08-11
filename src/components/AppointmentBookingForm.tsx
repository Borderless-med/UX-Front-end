import React, { useState, useEffect } from 'react';
import { Calendar, Phone, MapPin, Clock, User, Mail, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { treatmentOptions, type TreatmentType } from '@/data/treatmentOptions';
import { commonTownships } from '@/components/clinic/utils/clinicConstants';
import { isDateDisabled } from '@/data/singaporeHolidays';
import { toast } from 'sonner';

interface FormData {
  patient_name: string;
  email: string;
  whatsapp: string;
  country_code: string;
  treatment_type: TreatmentType | '';
  preferred_date: Date | undefined;
  time_slot: string;
  clinic_location: string;
  consent_given: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const AppointmentBookingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    patient_name: '',
    email: '',
    whatsapp: '',
    country_code: '+65',
    treatment_type: '',
    preferred_date: undefined,
    time_slot: '',
    clinic_location: '',
    consent_given: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
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

  // Calculate completion percentage
  useEffect(() => {
    const requiredFields = [
      'patient_name', 'email', 'whatsapp', 'treatment_type', 
      'preferred_date', 'time_slot', 'clinic_location', 'consent_given'
    ];
    
    let completedFields = 0;
    requiredFields.forEach(field => {
      if (field === 'preferred_date') {
        if (formData.preferred_date) completedFields++;
      } else if (field === 'consent_given') {
        if (formData.consent_given) completedFields++;
      } else if (formData[field as keyof FormData]) {
        completedFields++;
      }
    });
    
    setCompletionPercentage((completedFields / requiredFields.length) * 100);
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

    if (!formData.preferred_date) {
      newErrors.preferred_date = 'Please select your preferred appointment date';
    }

    if (!formData.time_slot) {
      newErrors.time_slot = 'Please select a preferred time slot';
    }

    if (!formData.clinic_location) {
      newErrors.clinic_location = 'Please select a clinic location';
    }

    if (!formData.consent_given) {
      newErrors.consent_given = 'PDPA consent is required to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
        clinic_location: formData.clinic_location,
        consent_given: formData.consent_given,
      };

      console.log('Submitting appointment booking:', submissionData);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('send-appointment-confirmation', {
        body: submissionData,
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to book appointment');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to book appointment');
      }

      console.log('Appointment booked successfully:', data);
      setBookingReference(data.booking_ref);
      setIsSubmitted(true);
      toast.success('Appointment booked successfully! Check your email for confirmation.');

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
                Appointment Booked Successfully!
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
              
              <p className="text-gray-600 mb-6">
                A confirmation email has been sent to <strong>{formData.email}</strong> with all the details.
              </p>
              
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <span>Preferred Clinic Location (JB) *</span>
                </Label>
                <Select value={formData.clinic_location} onValueChange={(value) => handleInputChange('clinic_location', value)}>
                  <SelectTrigger className={cn(
                    "h-12 text-base",
                    errors.clinic_location && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select JB area" />
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
              </div>

              {/* PDPA Consent */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={formData.consent_given}
                    onCheckedChange={(checked) => handleInputChange('consent_given', checked)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      PDPA Consent Required *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      I consent to the collection, use and disclosure of my personal data for appointment booking, 
                      treatment coordination, and communication purposes. By providing my WhatsApp number, I agree 
                      to receive appointment confirmations and travel guidance via WhatsApp.{' '}
                      <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                        Read our Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
                {errors.consent_given && (
                  <p className="text-sm text-red-600">{errors.consent_given}</p>
                )}
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