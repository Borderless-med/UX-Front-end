import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../services/notification-service.js';

// --- Email Service Class ---
class OraHopeEmailService {
  private username: string;

  constructor(config: { username: string }) {
    this.username = config.username;
  }

  async sendMail(options: { from: string; to: string; subject: string; html: string }) {
    try {
      const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
      const smtp2goPayload = {
        api_key: smtp2goApiKey,
        to: [options.to],
        sender: this.username,
        subject: options.subject,
        html_body: options.html,
      };
      
      if (smtp2goApiKey) {
        const response = await fetch("https://api.smtp2go.com/v3/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(smtp2goPayload),
        });
        if (response.ok) return { success: true };
      }
      
      const brevoApiKey = process.env.BREVO_API_KEY;
      if (brevoApiKey) {
         const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            sender: { email: this.username, name: "SG-JB Dental" },
            to: [{ email: options.to }],
            subject: options.subject,
            htmlContent: options.html,
          }),
        });
        if (brevoResponse.ok) return { success: true };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
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
    
    const { data: jbClinics } = await supabase
      .from('clinics_data')
      .select('id, contact_email')
      .ilike('name', bookingData.clinic_location)
      .limit(1);
    
    if (jbClinics?.[0]) {
      clinicId = jbClinics[0].id;
      clinicEmail = jbClinics[0].contact_email;
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

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);
    await supabase
      .from('appointment_bookings')
      .update({ expires_at: expiresAt.toISOString() })
      .eq('booking_ref', bookingRef);

    const emailService = new OraHopeEmailService({ username: SMTP_USER });
    
    await emailService.sendMail({
      from: `SG-JB Dental <${SMTP_USER}>`,
      to: bookingData.email,
      subject: `Booking Request Received - ${bookingRef}`,
      html: `<h1>Booking Requested</h1><p>Reference: ${bookingRef}</p>`
    });

    if (clinicEmail) {
      const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
      const responseToken = crypto.createHmac('sha256', HMAC_SECRET).update(`${bookingRef}|${clinicId || bookingData.clinic_location}`).digest('hex').slice(0, 32);
      await supabase.from('appointment_bookings').update({ clinic_response_token: responseToken }).eq('booking_ref', bookingRef);

      // Build clinic response URLs
      const baseUrl = 'https://orachope.org/api/clinic/respond';
      const confirmUrl = `${baseUrl}/${bookingRef}?action=confirm&token=${responseToken}`;
      const rejectUrl = `${baseUrl}/${bookingRef}?action=reject&token=${responseToken}`;
      const alternativesUrl = `${baseUrl}/${bookingRef}?action=alternatives&token=${responseToken}`;

      const notificationService = new NotificationService({ supabaseUrl, supabaseKey: supabaseServiceKey, smtpUser: SMTP_USER });
      await notificationService.send('booking_alert_clinic', 
        { name: bookingData.clinic_location, email: clinicEmail },
        { 
          clinic_name: bookingData.clinic_location, booking_ref: bookingRef, patient_name: bookingData.patient_name,
          treatment_type: bookingData.treatment_type, formatted_date: bookingData.preferred_date, time_slot: bookingData.time_slot, 
          expires_at: expiresAt.toLocaleTimeString(), confirm_url: confirmUrl, reject_url: rejectUrl, alternatives_url: alternativesUrl
        },
        ['email']
      );
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
