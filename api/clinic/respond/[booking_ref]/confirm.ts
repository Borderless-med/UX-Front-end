// ============================================
// CLINIC RESPONSE: CONFIRM APPOINTMENT
// URL: /api/clinic/respond/[booking_ref]/confirm?token=xxx
// Auto-updates database and notifies patient
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../../services/notification-service';
import crypto from 'crypto';

// Retry logic for database updates
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      lastError = error as Error;
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  
  throw lastError;
}

// Send admin alert email
async function sendAdminAlert(
  subject: string,
  message: string,
  details: any
): Promise<void> {
  const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
  if (!smtp2goApiKey) return;

  try {
    await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: smtp2goApiKey,
        to: ['contact@orachope.org'],
        sender: process.env.SMTP_USER,
        subject: `🚨 ADMIN ALERT: ${subject}`,
        html_body: `
          <h2>${message}</h2>
          <pre>${JSON.stringify(details, null, 2)}</pre>
        `,
      }),
    });
  } catch (error) {
    console.error('Failed to send admin alert:', error);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { booking_ref } = req.query;
    const { token } = req.query;

    if (!booking_ref || !token) {
      return res.status(400).send(`
        <html>
          <head><title>Missing Parameters</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Invalid Request</h1>
            <p>Missing booking reference or token.</p>
          </body>
        </html>
      `);
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch booking
    const { data: booking, error: fetchError } = await supabase
      .from('appointment_bookings')
      .select(`
        *,
        clinics_data (
          id,
          name,
          address,
          city,
          state,
          postcode,
          country
        )
      `)
      .eq('booking_ref', booking_ref)
      .single();

    if (fetchError || !booking) {
      return res.status(404).send(`
        <html>
          <head><title>Booking Not Found</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Booking Not Found</h1>
            <p>Reference: ${booking_ref}</p>
          </body>
        </html>
      `);
    }

    // Verify HMAC token
    const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
    const clinic = booking.clinics_data || {};
    const expectedToken = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(`${booking_ref}|${clinic.id || booking.clinic_location}`)
      .digest('hex')
      .slice(0, 32);

    if (token !== expectedToken) {
      return res.status(403).send(`
        <html>
          <head><title>Invalid Token</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Invalid Security Token</h1>
            <p>This link may have expired or been tampered with.</p>
          </body>
        </html>
      `);
    }

    // Check if booking can be confirmed
    if (booking.status === 'confirmed') {
      return res.status(200).send(`
        <html>
          <head><title>Already Confirmed</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #22c55e;">✅ Already Confirmed</h1>
            <p>This booking was already confirmed earlier.</p>
            <p><strong>Reference:</strong> ${booking_ref}</p>
          </body>
        </html>
      `);
    }

    if (booking.status === 'expired') {
      return res.status(410).send(`
        <html>
          <head><title>Booking Expired</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">⏰ Too Late - Booking Expired</h1>
            <p>This booking expired due to no response within 3 hours.</p>
            <p><strong>Reference:</strong> ${booking_ref}</p>
            <p style="color: #6b7280; margin-top: 20px;">Contact contact@orachope.org for assistance.</p>
          </body>
        </html>
      `);
    }

    if (booking.status !== 'pending') {
      return res.status(400).send(`
        <html>
          <head><title>Cannot Confirm</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Cannot Confirm</h1>
            <p>This booking has status: <strong>${booking.status}</strong></p>
            <p>Only pending bookings can be confirmed.</p>
          </body>
        </html>
      `);
    }

    // Update booking with retry logic
    try {
      await retryOperation(async () => {
        const { error: updateError } = await supabase
          .from('appointment_bookings')
          .update({
            status: 'confirmed',
            clinic_responded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('booking_ref', booking_ref)
          .eq('status', 'pending'); // Optimistic locking

        if (updateError) throw updateError;
      });
    } catch (error) {
      // Auto-retry failed - send admin alert
      await sendAdminAlert(
        'Booking Confirmation Failed',
        `Failed to confirm booking ${booking_ref} after 3 retries`,
        { booking_ref, error: error instanceof Error ? error.message : 'Unknown' }
      );

      return res.status(500).send(`
        <html>
          <head><title>System Error</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">⚠️ System Error</h1>
            <p>Failed to confirm booking. Our team has been notified.</p>
            <p>Please contact contact@orachope.org with reference: <strong>${booking_ref}</strong></p>
          </body>
        </html>
      `);
    }

    // Send confirmation notification to patient
    try {
      const notificationService = new NotificationService({
        supabaseUrl,
        supabaseKey,
        whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
        smtpUser: process.env.SMTP_USER!,
      });

      // Generate cancel URL
      const CANCEL_SECRET = process.env.CANCEL_SECRET || 'dev-cancel-secret';
      const cancelToken = crypto
        .createHmac('sha256', CANCEL_SECRET)
        .update(`${booking_ref}|${booking.email}`)
        .digest('hex')
        .slice(0, 32);
      const cancelUrl = `https://orachope.org/api/cancel-appointment?ref=${encodeURIComponent(booking_ref)}&email=${encodeURIComponent(booking.email)}&token=${cancelToken}`;

      const googleMapsUrl = clinic.address 
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address + ', ' + clinic.city)}`
        : 'https://orachope.org/travel-guide';

      const notificationResults = await notificationService.send(
        'appointment_confirmed',
        {
          name: booking.patient_name,
          email: booking.email,
          whatsapp: booking.whatsapp,
        },
        {
          patient_name: booking.patient_name,
          booking_ref: booking_ref as string,
          clinic_name: clinic.name || booking.clinic_location,
          clinic_address: clinic.address || '',
          clinic_city: clinic.city || '',
          clinic_state: clinic.state || '',
          clinic_postcode: clinic.postcode || '',
          clinic_country: clinic.country || 'Malaysia',
          formatted_date: new Date(booking.preferred_date).toLocaleDateString('en-SG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time_slot: booking.time_slot,
          travel_guide_url: 'https://orachope.org/travel-guide',
          google_maps_url: googleMapsUrl,
          cancel_url: cancelUrl,
        },
        ['email', 'whatsapp']
      );

      await notificationService.logNotification(
        booking_ref as string,
        'appointment_confirmed',
        notificationResults
      );

    } catch (error) {
      console.error('Failed to send confirmation notification:', error);
      // Continue anyway - booking is confirmed in database
    }

    // Success page
    return res.status(200).send(`
      <html>
        <head>
          <title>Appointment Confirmed</title>
          <style>
            body { font-family: Arial; padding: 40px; text-align: center; background: #f0fdf4; }
            .container { background: white; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #16a34a; margin-bottom: 20px; }
            .detail { background: #f8fafc; padding: 15px; margin: 20px 0; border-radius: 6px; text-align: left; }
            .detail strong { color: #475569; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Appointment Confirmed!</h1>
            <p style="font-size: 18px; color: #374151;">Thank you for confirming this booking.</p>
            
            <div class="detail">
              <strong>Reference:</strong> ${booking_ref}<br>
              <strong>Patient:</strong> ${booking.patient_name}<br>
              <strong>Treatment:</strong> ${booking.treatment_type}<br>
              <strong>Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
              <strong>Time:</strong> ${booking.time_slot}
            </div>
            
            <p style="color: #6b7280; margin-top: 30px;">The patient has been notified via WhatsApp and email.</p>
            <p style="color: #16a34a; font-weight: 600;">You can close this window.</p>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('CONFIRM ENDPOINT ERROR:', error);
    return res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ System Error</h1>
          <p>An unexpected error occurred. Please contact support.</p>
        </body>
      </html>
    `);
  }
}
