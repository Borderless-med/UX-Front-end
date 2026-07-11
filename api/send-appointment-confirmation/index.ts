import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../services/notification-service.js';
import { calculateBusinessHoursExpiry, formatExpiryTime } from '../../utils/business-hours.js';
import { formatSingaporeDate } from '../../utils/sg-time.js';

// ========================================
// BOT PROTECTION: IP Rate Limiting
// ========================================
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_BOOKINGS_PER_IP = 2;

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  if (record.count >= MAX_BOOKINGS_PER_IP) {
    return { 
      allowed: false, 
      message: `Rate limit exceeded. Maximum ${MAX_BOOKINGS_PER_IP} bookings per hour allowed.` 
    };
  }

  record.count++;
  return { allowed: true };
}

// ========================================
// BOT PROTECTION: Turnstile Verification
// ========================================
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
  
  console.log('🔐 Turnstile Config:', {
    secretConfigured: !!TURNSTILE_SECRET,
    secretLength: TURNSTILE_SECRET ? TURNSTILE_SECRET.length : 0
  });
  
  if (!TURNSTILE_SECRET) {
    console.error('❌ TURNSTILE_SECRET_KEY not configured - BLOCKING');
    return false;
  }

  if (!token) {
    console.warn('❌ No Turnstile token provided');
    return false;
  }

  try {
    console.log('🔍 Calling Cloudflare siteverify...');
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });

    const data = await response.json();
    console.log('✅ Cloudflare Response:', {
      success: data.success,
      hostname: data.hostname,
      errors: data['error-codes'] || []
    });
    
    return data.success === true;
  } catch (error) {
    console.error('❌ Turnstile API error:', error);
    return false;
  }
}

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
  turnstile_token?: string;
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
    // ========================================
    // BOT PROTECTION: Get client IP
    // ========================================
    const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
                     (req.headers['x-real-ip'] as string) || 
                     req.socket.remoteAddress || 
                     'unknown';
    console.log('📍 Request from IP:', clientIP);

    // ========================================
    // BOT PROTECTION: Check rate limit
    // ========================================
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
      return res.status(429).json({ 
        error: rateLimitCheck.message,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const SMTP_USER = process.env.SMTP_USER!;
    const bookingData: AppointmentBookingRequest = req.body;
    
    // ========================================
    // BOT PROTECTION: Verify Turnstile token
    // ========================================
    console.log('🛡️ Starting bot protection checks...');
    
    if (!bookingData.turnstile_token) {
      console.error(`❌ BLOCKED: No Turnstile token from IP: ${clientIP}`);
      return res.status(403).json({ 
        error: 'Security verification required. Please refresh and try again.',
        code: 'TURNSTILE_MISSING'
      });
    }

    const isValidToken = await verifyTurnstileToken(bookingData.turnstile_token, clientIP);
    if (!isValidToken) {
      console.error(`❌ BLOCKED: Invalid Turnstile token from IP: ${clientIP}`);
      return res.status(403).json({ 
        error: 'Security verification failed. Please refresh and try again.',
        code: 'TURNSTILE_FAILED'
      });
    }
    
    console.log('✅ Bot protection passed - processing booking');
    
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
    const preferredDateDisplay = formatSingaporeDate(bookingData.preferred_date);

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

    // Send patient receipt via WhatsApp using approved template
    const patientNotificationService = new NotificationService({
      supabaseUrl,
      supabaseKey: supabaseServiceKey,
      whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
      smtpUser: SMTP_USER,
    });

    await patientNotificationService.send('booking_request_received',
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

    // Send detailed patient confirmation email using proper template
    const emailNotificationService = new NotificationService({ supabaseUrl, supabaseKey: supabaseServiceKey, smtpUser: SMTP_USER });
    await emailNotificationService.send('booking_confirmation_patient', 
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

      const clinicNotificationService = new NotificationService({
        supabaseUrl,
        supabaseKey: supabaseServiceKey,
        whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
        smtpUser: SMTP_USER,
      });
      await clinicNotificationService.send('booking_alert_clinic', 
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
          confirm_url: confirmUrl, 
          reject_url: rejectUrl, 
          alternatives_url: alternativesUrl
        },
        ['email', 'whatsapp']
      );
      console.log('✅ Clinic notification sent (email + WhatsApp if configured)');
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

