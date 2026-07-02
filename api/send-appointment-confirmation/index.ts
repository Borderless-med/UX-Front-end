import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../services/notification-service.js';
import { calculateBusinessHoursExpiry, formatExpiryTime } from '../../utils/business-hours.js';
import { formatSingaporeDate } from '../../utils/sg-time.js';

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

function isValidDateOnly(dateOnly: string): boolean {
  const match = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function normalizePreferredDate(raw: unknown): { normalized?: string; error?: string } {
  if (typeof raw !== 'string') {
    return { error: 'preferred_date must be a string in YYYY-MM-DD format' };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { error: 'preferred_date is required' };
  }

  // Strict backend contract: date-only string to avoid timezone drift.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return { error: `preferred_date must be date-only (YYYY-MM-DD). Received: ${trimmed}` };
  }

  if (!isValidDateOnly(trimmed)) {
    return { error: `preferred_date is not a valid calendar date: ${trimmed}` };
  }

  return { normalized: trimmed };
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
    const bookingDataRaw: AppointmentBookingRequest = req.body;
    const normalizedDateResult = normalizePreferredDate(bookingDataRaw?.preferred_date);

    console.log('📥 Booking request received:', {
      request_id: req.headers['x-vercel-id'] || null,
      user_agent: req.headers['user-agent'] || null,
      preferred_date_raw: bookingDataRaw?.preferred_date,
      preferred_date_normalized: normalizedDateResult.normalized || null,
      preferred_date_error: normalizedDateResult.error || null,
      time_slot: bookingDataRaw?.time_slot || null,
      clinic_location: bookingDataRaw?.clinic_location || null,
    });

    if (normalizedDateResult.error || !normalizedDateResult.normalized) {
      return res.status(400).json({
        error: normalizedDateResult.error || 'Invalid preferred_date',
      });
    }

    const bookingData: AppointmentBookingRequest = {
      ...bookingDataRaw,
      preferred_date: normalizedDateResult.normalized,
    };
    const preferredDateDisplay = formatSingaporeDate(bookingData.preferred_date);
    
    let clinicEmail: string | null = null;
    let clinicWhatsApp: string | null = null;
    let clinicId: number | null = null;
    let clinicDetails: any = null;
    
    // Search BOTH clinic tables (JB and SG) with safe column selection
    console.log('🔍 Looking up clinic:', bookingData.clinic_location);
    
    const { data: jbClinics, error: jbError } = await supabase
      .from('clinics_data')
      .select('id, contact_email, whatsapp_number, name, address')
      .ilike('name', bookingData.clinic_location)
      .limit(1);
    
    console.log('JB clinics result:', jbClinics, 'Error:', jbError);
    
    const { data: sgClinics, error: sgError } = await supabase
      .from('sg_clinics')
      .select('id, contact_email, whatsapp_number, name, address')
      .ilike('name', bookingData.clinic_location)
      .limit(1);
    
    console.log('SG clinics result:', sgClinics, 'Error:', sgError);
    
    // Use whichever table found a match
    const matchedClinic = jbClinics?.[0] || sgClinics?.[0];
    if (matchedClinic) {
      clinicId = matchedClinic.id;
      clinicEmail = matchedClinic.contact_email;
      clinicWhatsApp = matchedClinic.whatsapp_number || null;
      clinicDetails = matchedClinic;
      console.log('✅ Clinic found - ID:', clinicId, 'Email:', clinicEmail, 'WhatsApp:', clinicWhatsApp);
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

    // Send patient receipt via email and WhatsApp using the approved template set.
    const notificationService = new NotificationService({
      supabaseUrl,
      supabaseKey: supabaseServiceKey,
      whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
      smtpUser: SMTP_USER,
    });
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
        formatted_date: preferredDateDisplay,
        time_slot: bookingData.time_slot
      },
      ['email']
    );

    await notificationService.send('booking_request_received',
      { name: bookingData.patient_name, whatsapp: bookingData.whatsapp },
      {
        booking_ref: bookingRef,
        patient_name: bookingData.patient_name,
        clinic_name: clinicDetails?.name || bookingData.clinic_location,
        clinic_address: clinicDetails?.address || '',
        treatment_type: bookingData.treatment_type,
        requested_date: preferredDateDisplay,
        time_slot: bookingData.time_slot,
        travel_guide_url: 'https://orachope.org/travel-guide',
      },
      ['whatsapp']
    );

    console.log('📧 Checking clinic email:', clinicEmail ? `Found: ${clinicEmail}` : '❌ NULL - clinic email block will be skipped');
    
    if (clinicEmail) {
      console.log('📨 Sending clinic notification email to:', clinicEmail);
      const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
      const responseToken = crypto.createHmac('sha256', HMAC_SECRET).update(`${bookingRef}|${clinicId || bookingData.clinic_location}`).digest('hex').slice(0, 32);

      // Build clinic response URLs
      const baseUrl = 'https://orachope.org/api/clinic/respond';
      const responseUrl = `${baseUrl}/${bookingRef}?token=${responseToken}`;
      const confirmUrl = `${baseUrl}/${bookingRef}?action=confirm&token=${responseToken}`;
      const rejectUrl = `${baseUrl}/${bookingRef}?action=reject&token=${responseToken}`;
      const alternativesUrl = `${baseUrl}/${bookingRef}?action=alternatives&token=${responseToken}`;

      const notificationService = new NotificationService({
        supabaseUrl,
        supabaseKey: supabaseServiceKey,
        whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
        smtpUser: SMTP_USER,
      });
      await notificationService.send('booking_alert_clinic', 
        { name: bookingData.clinic_location, email: clinicEmail, whatsapp: clinicWhatsApp || undefined },
        { 
          clinic_name: bookingData.clinic_location, 
          booking_ref: bookingRef, 
          patient_name: bookingData.patient_name,
          patient_whatsapp: bookingData.whatsapp,
          patient_email: bookingData.email,
          treatment_type: bookingData.treatment_type, 
          formatted_date: preferredDateDisplay, 
          time_slot: bookingData.time_slot, 
          expires_at: formatExpiryTime(expiresAt), 
          clinic_response_url: responseUrl,
          confirm_url: confirmUrl, 
          reject_url: rejectUrl, 
          alternatives_url: alternativesUrl
        },
        ['email', 'whatsapp']
      );
      console.log('✅ Clinic initial alert sent (email + WhatsApp if configured)');
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
