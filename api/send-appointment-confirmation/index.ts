// ============================================
// ORACHOPE.ORG - APPOINTMENT BOOKING API
// UPDATED: June 10, 2026 (SLA Business Hours Fix)
// ============================================

import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../services/notification-service.js';

/**
 * SLA Calculator: 3 Business Hours (9 AM - 5 PM, Mon-Fri SG Time)
 */
function calculateBusinessExpiry(startDate: Date): Date {
  const SLA_MINUTES = 180; // 3 hours
  const WORK_START_HOUR = 9;
  const WORK_END_HOUR = 17;

  let expiryDate = new Date(startDate);

  // 1. Handle Before Hours: If booked before 9am SG (+8), start clock at 9am today
  if (expiryDate.getUTCHours() + 8 < WORK_START_HOUR) {
    expiryDate.setUTCHours(WORK_START_HOUR - 8, 0, 0, 0);
  }

  // 2. Handle After Hours/Weekends: Move to 9am next business day
  while (
    expiryDate.getUTCHours() + 8 >= WORK_END_HOUR || 
    expiryDate.getUTCDay() === 0 || // Sunday
    expiryDate.getUTCDay() === 6    // Saturday
  ) {
    expiryDate.setUTCDate(expiryDate.getUTCDate() + 1);
    expiryDate.setUTCHours(WORK_START_HOUR - 8, 0, 0, 0);
  }

  // 3. Add the 3 hours
  expiryDate.setMinutes(expiryDate.getMinutes() + SLA_MINUTES);

  // 4. Handle Carry-over: If adding 3h pushes past 5pm, move leftover to next morning
  const currentHourSG = expiryDate.getUTCHours() + 8;
  if (currentHourSG > WORK_END_HOUR || (currentHourSG === WORK_END_HOUR && expiryDate.getUTCMinutes() > 0)) {
    const extraMinutes = (currentHourSG - WORK_END_HOUR) * 60 + expiryDate.getUTCMinutes();
    
    // Move to next business day
    expiryDate.setUTCDate(expiryDate.getUTCDate() + 1);
    while (expiryDate.getUTCDay() === 0 || expiryDate.getUTCDay() === 6) {
      expiryDate.setUTCDate(expiryDate.getUTCDate() + 1);
    }
    
    // Set to 9am + the leftover minutes
    expiryDate.setUTCHours(WORK_START_HOUR - 8, extraMinutes, 0, 0);
  }

  return expiryDate;
}

class OraHopeEmailService {
  private username: string;
  constructor(config: { username: string }) { this.username = config.username; }

  async sendMail(options: { from: string; to: string; subject: string; html: string }) {
    try {
      const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
      if (smtp2goApiKey) {
        const response = await fetch("https://api.smtp2go.com/v3/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: smtp2goApiKey,
            to: [options.to],
            sender: this.username,
            subject: options.subject,
            html_body: options.html,
          }),
        });
        if (response.ok) return { success: true };
      }
      return { success: true };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }
}

interface AppointmentBookingRequest {
  patient_name: string; email: string; whatsapp: string;
  treatment_type: string; preferred_date: string; time_slot: string;
  clinic_location: string; consent_given: boolean; create_account?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type, x-environment");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const SMTP_USER = process.env.SMTP_USER!;
    const bookingData: AppointmentBookingRequest = req.body;
    
    // --- CLINIC LOOKUP ---
    let clinicEmail: string | null = null;
    let clinicWhatsApp: string | null = null;
    let clinicId: number | null = null;

    const { data: jbClinics } = await supabase.from('clinics_data').select('id, contact_email, whatsapp_number').ilike('name', bookingData.clinic_location).limit(1);
    if (jbClinics?.[0]) {
      clinicId = jbClinics[0].id;
      clinicEmail = jbClinics[0].contact_email;
      clinicWhatsApp = jbClinics[0].whatsapp_number;
    } else {
      const { data: sgClinics } = await supabase.from('sg_clinics').select('id, contact_email, whatsapp_number').ilike('name', bookingData.clinic_location).limit(1);
      if (sgClinics?.[0]) {
        clinicId = sgClinics[0].id;
        clinicEmail = sgClinics[0].contact_email;
        clinicWhatsApp = sgClinics[0].whatsapp_number;
      }
    }

    // --- GENERATE REF ---
    const { data: bookingRef } = await supabase.rpc('generate_booking_ref');

    // --- AUTH / USER CREATION ---
    let userCreated = false;
    let isNewUser = false;
    let passwordSetupLink: string | null = null;

    if (bookingData.create_account) {
      const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
        email: bookingData.email,
        email_confirm: true,
        user_metadata: { full_name: bookingData.patient_name, whatsapp: bookingData.whatsapp },
      });
      if (!userError) {
        userCreated = true;
        isNewUser = true;
        const { data: linkData } = await supabase.auth.admin.generateLink({
          type: 'recovery', email: bookingData.email, options: { redirectTo: 'https://orachope.org/create-password' }
        });
        passwordSetupLink = linkData?.properties?.action_link || null;
      } else if (userError.message.includes('already')) {
        userCreated = true;
      }
    }

    // --- CALCULATE SMART SLA EXPIRY ---
    const expiresAt = calculateBusinessExpiry(new Date());
    const formattedExpiryTime = expiresAt.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: true });

    // --- SAVE BOOKING ---
    const { create_account, ...bookingDataForDb } = bookingData;
    const { data: appointment } = await supabase
      .from('appointment_bookings')
      .insert({ 
        ...bookingDataForDb, 
        booking_ref: bookingRef, 
        status: 'pending',
        clinic_id: clinicId,
        expires_at: expiresAt.toISOString() // Set SLA here
      })
      .select().single();

    // --- TOKENS FOR BUTTONS ---
    const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
    const responseToken = crypto.createHmac('sha256', HMAC_SECRET).update(`${bookingRef}|${clinicId || bookingData.clinic_location}`).digest('hex').slice(0, 32);
    await supabase.from('appointment_bookings').update({ clinic_response_token: responseToken }).eq('booking_ref', bookingRef);

    const CANCEL_SECRET = process.env.CANCEL_SECRET || 'dev-cancel-secret';
    const cancelToken = crypto.createHmac('sha256', CANCEL_SECRET).update(`${bookingRef}|${bookingData.email}`).digest('hex').slice(0, 32);
    const cancelLink = `https://www.orachope.org/api/cancel-appointment?ref=${encodeURIComponent(bookingRef)}&email=${encodeURIComponent(bookingData.email)}&token=${cancelToken}`;

    const baseUrl = 'https://orachope.org/api/clinic/respond';
    const confirmUrl = `${baseUrl}/${bookingRef}?action=confirm&token=${responseToken}`;
    const rejectUrl = `${baseUrl}/${bookingRef}?action=reject&token=${responseToken}`;
    const alternativesUrl = `${baseUrl}/${bookingRef}?action=alternatives&token=${responseToken}`;

    const formattedDate = new Date(bookingData.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // --- SEND PATIENT EMAIL (Preserving your original design) ---
    const emailService = new OraHopeEmailService({ username: SMTP_USER });
    await emailService.sendMail({
      from: `SG-JB Dental <${SMTP_USER}>`,
      to: bookingData.email,
      subject: `Booking Request Received - ${bookingRef}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Booking Requested!</h1>
            <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your request will expire at ${formattedExpiryTime} if the clinic doesn't respond.</p>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #2563eb; margin: 0 0 10px; font-size: 20px;">Reference: ${bookingRef}</h2>
            </div>
            <p><strong>Patient:</strong> ${bookingData.patient_name}</p>
            <p><strong>Treatment:</strong> ${bookingData.treatment_type}</p>
            <p><strong>Date/Time:</strong> ${formattedDate} (${bookingData.time_slot})</p>
            <p><strong>Clinic:</strong> ${bookingData.clinic_location}</p>
            <div style="background:#fef3c7;padding:15px;border-radius:6px;margin:20px 0;">
              <strong>⚠️ Important:</strong> This is a request. We will contact you via WhatsApp to confirm.
            </div>
            ${userCreated && isNewUser && passwordSetupLink ? `<a href="${passwordSetupLink}" style="display:block;background:#22c55e;color:white;padding:12px;text-decoration:none;border-radius:5px;text-align:center;font-weight:bold;">Set Your Password</a>` : ''}
            <div style="margin-top:24px;padding:16px;border:1px solid #e5e7eb;border-radius:6px;text-align:center;">
              <a href="${cancelLink}" style="color:#ef4444;text-decoration:none;font-weight:600;">Cancel This Booking</a>
            </div>
          </div>
        </div>`
    });

    // --- SEND CLINIC EMAIL (Using NotificationService for Buttons) ---
    if (clinicEmail) {
      const notificationService = new NotificationService({ supabaseUrl, supabaseKey: supabaseServiceKey, smtpUser: SMTP_USER });
      const clinicResults = await notificationService.send('booking_alert_clinic', 
        { name: bookingData.clinic_location, email: clinicEmail, whatsapp: clinicWhatsApp || undefined },
        {
          clinic_name: bookingData.clinic_location, booking_ref: bookingRef, patient_name: bookingData.patient_name,
          treatment_type: bookingData.treatment_type, formatted_date: formattedDate, time_slot: bookingData.time_slot,
          expires_at: formattedExpiryTime, confirm_url: confirmUrl, reject_url: rejectUrl, alternatives_url: alternativesUrl
        },
        ['email']
      );
      await notificationService.logNotification(bookingRef, 'booking_alert_clinic', clinicResults);
    }

    res.status(200).json({ success: true, booking_ref: bookingRef });

  } catch (error: any) {
    console.error("Critical error:", error);
    res.status(500).json({ error: error.message });
  }
}
