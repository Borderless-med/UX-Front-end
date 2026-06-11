import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../services/notification-service.js';
import { calculateBusinessHoursExpiry, formatExpiryTime } from '../../utils/business-hours.js';

interface AppointmentBookingRequest {
  patient_name: string;
  email: string;
  whatsapp: string;
  treatment_type: string;
  preferred_date: string;
  time_slot: string;
  clinic_location: string;
  consent_given: boolean;
  create_account?: boolean;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type, x-environment");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const SMTP_USER = process.env.SMTP_USER!;
    const bookingData: AppointmentBookingRequest = req.body;
    
    let clinicEmail: string | null = null;
    let clinicId: number | null = null;
    let clinicDetails: any = null;
    
    // Search BOTH clinic tables (JB and SG) with safe column selection
    console.log('🔍 Looking up clinic:', bookingData.clinic_location);
    
    const { data: jbClinics, error: jbError } = await supabase
      .from('clinics_data')
      .select('id, contact_email, name, address')
      .ilike('name', bookingData.clinic_location)
      .limit(1);
    
    console.log('JB clinics result:', jbClinics, 'Error:', jbError);
    
    const { data: sgClinics, error: sgError } = await supabase
      .from('sg_clinics')
      .select('id, contact_email, name, address')
      .ilike('name', bookingData.clinic_location)
      .limit(1);
    
    console.log('SG clinics result:', sgClinics, 'Error:', sgError);
    
    // Use whichever table found a match
    const matchedClinic = jbClinics?.[0] || sgClinics?.[0];
    if (matchedClinic) {
      clinicId = matchedClinic.id;
      clinicEmail = matchedClinic.contact_email;
      clinicDetails = matchedClinic;
      console.log('✅ Clinic found - ID:', clinicId, 'Email:', clinicEmail);
    } else {
      console.log('❌ NO CLINIC MATCH FOUND');
    }

    const { data: bookingRef } = await supabase.rpc('generate_booking_ref');

    if (bookingData.create_account) {
      await supabase.auth.admin.createUser({
        email: bookingData.email,
        email_confirm: true,
        user_metadata: {
          full_name: bookingData.patient_name,
          whatsapp: bookingData.whatsapp,
        },
      });
    }

    const { create_account, ...bookingDataForDb } = bookingData;
    const { data: appointment } = await supabase
      .from('appointment_bookings')
      .insert({ 
        ...bookingDataForDb, 
        booking_ref: bookingRef, 
        status: 'pending',
        clinic_id: clinicId
      })
      .select().single();

    // Calculate expiry using business hours (10 AM - 6 PM daily, including weekends)
    const expiresAt = calculateBusinessHoursExpiry(new Date(), 3);
    await supabase
      .from('appointment_bookings')
      .update({ expires_at: expiresAt.toISOString() })
      .eq('booking_ref', bookingRef);

    // Send detailed patient confirmation email using proper template
    const notificationService = new NotificationService({ supabaseUrl, supabaseKey: supabaseServiceKey, smtpUser: SMTP_USER });
    await notificationService.send('booking_confirmation_patient', 
      { name: bookingData.patient_name, email: bookingData.email },
      { 
        booking_ref: bookingRef,
        patient_name: bookingData.patient_name,
        patient_whatsapp: bookingData.whatsapp,
        clinic_name: clinicDetails?.name || bookingData.clinic_location,
        clinic_address: clinicDetails?.address || '',
        clinic_city: '',
        clinic_state: '',
        clinic_postcode: '',
        clinic_country: 'Malaysia',
        treatment_type: bookingData.treatment_type,
        formatted_date: bookingData.preferred_date,
        time_slot: bookingData.time_slot
      },
      ['email']
    );

    console.log('📧 Checking clinic email:', clinicEmail ? `Found: ${clinicEmail}` : '❌ NULL - clinic email block will be skipped');
    
    if (clinicEmail) {
      console.log('📨 Sending clinic notification email to:', clinicEmail);
      const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
      const responseToken = crypto.createHmac('sha256', HMAC_SECRET).update(`${bookingRef}|${clinicId || bookingData.clinic_location}`).digest('hex').slice(0, 32);

      // Build clinic response URLs
      const baseUrl = 'https://orachope.org/api/clinic/respond';
      const confirmUrl = `${baseUrl}/${bookingRef}?action=confirm&token=${responseToken}`;
      const rejectUrl = `${baseUrl}/${bookingRef}?action=reject&token=${responseToken}`;
      const alternativesUrl = `${baseUrl}/${bookingRef}?action=alternatives&token=${responseToken}`;

      const notificationService = new NotificationService({ supabaseUrl, supabaseKey: supabaseServiceKey, smtpUser: SMTP_USER });
      await notificationService.send('booking_alert_clinic', 
        { name: bookingData.clinic_location, email: clinicEmail },
        { 
          clinic_name: bookingData.clinic_location, 
          booking_ref: bookingRef, 
          patient_name: bookingData.patient_name,
          patient_whatsapp: bookingData.whatsapp,
          patient_email: bookingData.email,
          treatment_type: bookingData.treatment_type, 
          formatted_date: bookingData.preferred_date, 
          time_slot: bookingData.time_slot, 
          expires_at: formatExpiryTime(expiresAt), 
          confirm_url: confirmUrl, 
          reject_url: rejectUrl, 
          alternatives_url: alternativesUrl
        },
        ['email']
      );
      console.log('✅ Clinic email sent successfully');
    }

    res.status(200).json({ 
      success: true, 
      booking_ref: bookingRef,
      appointment_id: appointment?.id,
      emails_sent: true,
      message: "Confirmed"
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
