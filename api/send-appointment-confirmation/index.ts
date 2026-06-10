import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../services/notification-service.js';

// SLA Calculator: 3 Business Hours (9 AM - 5 PM, Mon-Fri SG Time)
function calculateBusinessExpiry(startDate: Date): Date {
  const SLA_MINUTES = 180;
  const WORK_START_HOUR = 9;
  const WORK_END_HOUR = 17;
  let expiryDate = new Date(startDate);
  let currentHourSG = expiryDate.getUTCHours() + 8;
  if (currentHourSG < WORK_START_HOUR) {
    expiryDate.setUTCHours(WORK_START_HOUR - 8, 0, 0, 0);
  }
  while (
    (expiryDate.getUTCHours() + 8) >= WORK_END_HOUR || 
    expiryDate.getUTCDay() === 0 || 
    expiryDate.getUTCDay() === 6
  ) {
    expiryDate.setUTCDate(expiryDate.getUTCDate() + 1);
    expiryDate.setUTCHours(WORK_START_HOUR - 8, 0, 0, 0);
  }
  expiryDate.setMinutes(expiryDate.getMinutes() + SLA_MINUTES);
  currentHourSG = expiryDate.getUTCHours() + 8;
  if (currentHourSG > WORK_END_HOUR || (currentHourSG === WORK_END_HOUR && expiryDate.getUTCMinutes() > 0)) {
    const extraMinutes = (currentHourSG - WORK_END_HOUR) * 60 + expiryDate.getUTCMinutes();
    expiryDate.setUTCDate(expiryDate.getUTCDate() + 1);
    while (expiryDate.getUTCDay() === 0 || expiryDate.getUTCDay() === 6) {
      expiryDate.setUTCDate(expiryDate.getUTCDate() + 1);
    }
    expiryDate.setUTCHours(WORK_START_HOUR - 8, extraMinutes, 0, 0);
  }
  return expiryDate;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type, x-environment");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const SMTP_USER = process.env.SMTP_USER!;
    const bookingData = req.body;
    let emailsSent = false;

    // 1. Clinic Lookup
    const { data: jbClinics } = await supabase.from('clinics_data').select('id, contact_email, whatsapp_number').ilike('name', bookingData.clinic_location).limit(1);
    const clinicId = jbClinics?.[0]?.id || null;
    const clinicEmail = jbClinics?.[0]?.contact_email || null;

    // 2. SLA & Reference
    const { data: bookingRef } = await supabase.rpc('generate_booking_ref');
    const expiresAt = calculateBusinessExpiry(new Date());
    const formattedExpiryTime = expiresAt.toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedDate = new Date(bookingData.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // 3. Save to DB
    const { create_account, ...dbData } = bookingData;
    await supabase.from('appointment_bookings').insert({ 
      ...dbData, booking_ref: bookingRef, status: 'pending', clinic_id: clinicId, expires_at: expiresAt.toISOString() 
    });

    // 4. Send Emails (Using raw fetch for patient to avoid template errors)
    const smtp2goApiKey = process.env.SMTP2GO_API_KEY;

    // --- PATIENT NOTIFICATION ---
    const patientHtml = `<div style="font-family:Arial;padding:20px;"><h1>Booking Requested!</h1><p>Ref: ${bookingRef}</p><p>Clinic: ${bookingData.clinic_location}</p><p>Expires: ${formattedExpiryTime} (Singapore Time)</p></div>`;
    
    await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: smtp2goApiKey, to: [bookingData.email], sender: SMTP_USER, subject: `Booking Requested - ${bookingRef}`, html_body: patientHtml }),
    });

    // --- CLINIC NOTIFICATION (Using existing valid template) ---
    if (clinicEmail) {
      const notificationService = new NotificationService({ supabaseUrl: process.env.SUPABASE_URL!, supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!, smtpUser: SMTP_USER });
      const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
      const token = crypto.createHmac('sha256', HMAC_SECRET).update(`${bookingRef}|${clinicId || bookingData.clinic_location}`).digest('hex').slice(0, 32);
      const baseUrl = 'https://orachope.org/api/clinic/respond';

      await notificationService.send('booking_alert_clinic', 
        { name: bookingData.clinic_location, email: clinicEmail },
        { 
          clinic_name: bookingData.clinic_location, booking_ref: bookingRef, patient_name: bookingData.patient_name,
          patient_email: bookingData.email, patient_whatsapp: bookingData.whatsapp,
          treatment_type: bookingData.treatment_type, formatted_date: formattedDate, time_slot: bookingData.time_slot, 
          expires_at: formattedExpiryTime, 
          confirm_url: `${baseUrl}/${bookingRef}?action=confirm&token=${token}`,
          reject_url: `${baseUrl}/${bookingRef}?action=reject&token=${token}`,
          alternatives_url: `${baseUrl}/${bookingRef}?action=alternatives&token=${token}`
        },
        ['email']
      );
    }
    
    emailsSent = true;

    // 5. Final Response
    res.status(200).json({ 
      success: true, 
      booking_ref: bookingRef,
      emails_sent: emailsSent,
      message: "Confirmed!" 
    });

  } catch (error: any) {
    console.error("Critical error in handler:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
