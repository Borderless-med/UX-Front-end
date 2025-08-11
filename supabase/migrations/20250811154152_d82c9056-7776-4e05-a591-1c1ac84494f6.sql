-- Create appointment_bookings table for dental appointment booking system
CREATE TABLE public.appointment_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('Morning', 'Afternoon', 'Evening')),
  clinic_location TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  booking_ref TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.appointment_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for appointment bookings
CREATE POLICY "Anyone can submit appointment bookings" 
ON public.appointment_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view own bookings by email" 
ON public.appointment_bookings 
FOR SELECT 
USING (((auth.jwt() ->> 'email'::text) = email) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_appointment_bookings_updated_at
BEFORE UPDATE ON public.appointment_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create booking reference counter table
CREATE TABLE public.booking_ref_counter (
  year INTEGER PRIMARY KEY,
  counter INTEGER NOT NULL DEFAULT 0
);

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_year INTEGER;
  next_counter INTEGER;
  booking_ref TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM now());
  
  -- Insert or update counter for current year
  INSERT INTO public.booking_ref_counter (year, counter)
  VALUES (current_year, 1)
  ON CONFLICT (year)
  DO UPDATE SET counter = booking_ref_counter.counter + 1;
  
  -- Get the updated counter
  SELECT counter INTO next_counter
  FROM public.booking_ref_counter
  WHERE year = current_year;
  
  -- Format as APT-YYYY-######
  booking_ref := 'APT-' || current_year || '-' || LPAD(next_counter::TEXT, 6, '0');
  
  RETURN booking_ref;
END;
$$;