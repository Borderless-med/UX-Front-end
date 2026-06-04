// ============================================
// CLINIC RESPONSE: REJECT APPOINTMENT
// URL: /api/clinic/respond/[booking_ref]/reject?token=xxx
// Shows form for rejection reason, updates database, notifies patient
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../../services/notification-service.js';
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

    // Fetch booking (removed clinics_data JOIN - not needed and causes failures)
    const { data: booking, error: fetchError } = await supabase
      .from('appointment_bookings')
      .select('*')
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

    // Fetch clinic details for patient notification (only if clinic_id exists)
    let clinicDetails = null;
    if (booking.clinic_id) {
      const { data: clinic } = await supabase
        .from('clinics_data')
        .select('name, address, township')
        .eq('id', booking.clinic_id)
        .single();
      clinicDetails = clinic;
    }

    // Verify HMAC token
    const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
    // Try to get clinic_id from booking, otherwise use clinic_location
    const clinicIdentifier = booking.clinic_id || booking.clinic_location;
    const expectedToken = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(`${booking_ref}|${clinicIdentifier}`)
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

    // Check if already rejected
    if (booking.status === 'rejected') {
      return res.status(200).send(`
        <html>
          <head><title>Already Rejected</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #6b7280;">Already Rejected</h1>
            <p>This booking was already rejected earlier.</p>
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
            <h1 style="color: #dc2626;">⏰ Booking Expired</h1>
            <p>This booking expired due to no response within 3 hours.</p>
          </body>
        </html>
      `);
    }

    if (booking.status !== 'pending') {
      return res.status(400).send(`
        <html>
          <head><title>Cannot Reject</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Cannot Reject</h1>
            <p>This booking has status: <strong>${booking.status}</strong></p>
            <p>Only pending bookings can be rejected.</p>
          </body>
        </html>
      `);
    }

    // If GET request, show rejection form
    if (req.method === 'GET') {
      return res.status(200).send(`
        <html>
          <head>
            <title>Reject Appointment</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                background: #fef2f2; 
                margin: 0;
              }
              .container { 
                background: white; 
                padding: 30px; 
                border-radius: 12px; 
                max-width: 600px; 
                margin: 20px auto; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
              }
              h1 { color: #dc2626; margin-bottom: 10px; }
              .detail { 
                background: #f8fafc; 
                padding: 15px; 
                margin: 20px 0; 
                border-radius: 6px; 
                text-align: left; 
              }
              .detail strong { color: #475569; display: inline-block; width: 120px; }
              label { 
                display: block; 
                margin: 20px 0 8px; 
                font-weight: 600; 
                color: #374151; 
              }
              textarea { 
                width: 100%; 
                padding: 12px; 
                border: 2px solid #e5e7eb; 
                border-radius: 6px; 
                font-family: Arial; 
                font-size: 14px;
                box-sizing: border-box;
                min-height: 100px;
              }
              textarea:focus { 
                outline: none; 
                border-color: #dc2626; 
              }
              .button-group { 
                margin-top: 30px; 
                display: flex; 
                gap: 10px; 
              }
              button { 
                flex: 1;
                padding: 14px 24px; 
                border: none; 
                border-radius: 6px; 
                font-size: 16px; 
                font-weight: 600; 
                cursor: pointer; 
                transition: all 0.2s;
              }
              .reject-btn { 
                background: #dc2626; 
                color: white; 
              }
              .reject-btn:hover { 
                background: #b91c1c; 
              }
              .alternatives-btn { 
                background: #f59e0b; 
                color: white; 
              }
              .alternatives-btn:hover { 
                background: #d97706; 
              }
              .note { 
                color: #6b7280; 
                font-size: 14px; 
                margin-top: 10px; 
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Reject Appointment</h1>
              <p style="color: #6b7280; margin-bottom: 20px;">You're about to reject this booking request.</p>
              
              <div class="detail">
                <strong>Reference:</strong> ${booking_ref}<br>
                <strong>Patient:</strong> ${booking.patient_name}<br>
                <strong>Treatment:</strong> ${booking.treatment_type}<br>
                <strong>Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                <strong>Time:</strong> ${booking.time_slot}
              </div>

              <form method="POST">
                <label for="reason">Why are you rejecting? (Optional)</label>
                <textarea 
                  id="reason" 
                  name="reason" 
                  placeholder="e.g., Fully booked, Equipment unavailable, Not our specialty..."
                  maxlength="500"
                ></textarea>
                <p class="note">💡 Tip: If you have alternative time slots, click "Offer Alternatives" instead!</p>

                <div class="button-group">
                  <button type="submit" class="reject-btn">Confirm Rejection</button>
                  <button type="button" class="alternatives-btn" onclick="window.location.href='../alternatives?token=${token}'">
                    Offer Alternatives
                  </button>
                </div>
              </form>
            </div>
          </body>
        </html>
      `);
    }

    // If POST request, process rejection
    if (req.method === 'POST') {
      const body = req.body;
      const reason = body?.reason || 'No reason provided';

      // Update booking with retry logic
      try {
        await retryOperation(async () => {
          const { error: updateError } = await supabase
            .from('appointment_bookings')
            .update({
              status: 'rejected',
              rejection_reason: reason,
              clinic_responded_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('booking_ref', booking_ref)
            .eq('status', 'pending');

          if (updateError) throw updateError;
        });
      } catch (error) {
        await sendAdminAlert(
          'Booking Rejection Failed',
          `Failed to reject booking ${booking_ref} after 3 retries`,
          { booking_ref, error: error instanceof Error ? error.message : 'Unknown' }
        );

        return res.status(500).send(`
          <html>
            <head><title>System Error</title></head>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
              <h1 style="color: #dc2626;">⚠️ System Error</h1>
              <p>Failed to process rejection. Our team has been notified.</p>
              <p>Contact: contact@orachope.org | Reference: <strong>${booking_ref}</strong></p>
            </body>
          </html>
        `);
      }

      // Send rejection notification to patient (simple email - no alternatives offered)
      try {
        const notificationService = new NotificationService({
          supabaseUrl,
          supabaseKey,
          whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
          smtpUser: process.env.SMTP_USER!,
        });

        // Send simple rejection email (Template 4 without alternatives)
        await notificationService.sendEmail(
          {
            name: booking.patient_name,
            email: booking.email,
          },
          'Booking Request Declined - OraChope',
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Booking Request Declined</h2>
              <p>Dear ${booking.patient_name},</p>
              
              <p>Unfortunately, <strong>${clinicDetails?.name || booking.clinic_location}</strong> is unable to accommodate your requested appointment:</p>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <strong>Reference:</strong> ${booking_ref}<br>
                <strong>Treatment:</strong> ${booking.treatment_type}<br>
                <strong>Requested Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                <strong>Time:</strong> ${booking.time_slot}
                ${reason !== 'No reason provided' ? `<br><strong>Reason:</strong> ${reason}` : ''}
              </div>

              <p><strong>What's next?</strong></p>
              <ul>
                <li>Browse other clinics in JB: <a href="https://orachope.org/clinics?treatment=${encodeURIComponent(booking.treatment_type)}">View Options</a></li>
                <li>Need help? WhatsApp us: <a href="https://wa.me/6588104928">+65 8810 4928</a></li>
              </ul>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                We're sorry this didn't work out. We'll help you find another great clinic!
              </p>

              <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                The OraChope Team
              </p>
            </div>
          `
        );

        await notificationService.logNotification(
          booking_ref as string,
          'booking_rejected',
          [{ channel: 'email', success: true }]
        );

      } catch (error) {
        console.error('Failed to send rejection notification:', error);
        // Continue anyway - booking is rejected in database
      }

      // Success page
      return res.status(200).send(`
        <html>
          <head>
            <title>Booking Rejected</title>
            <style>
              body { font-family: Arial; padding: 40px; text-align: center; background: #f8fafc; }
              .container { background: white; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              h1 { color: #6b7280; margin-bottom: 20px; }
              .detail { background: #f8fafc; padding: 15px; margin: 20px 0; border-radius: 6px; text-align: left; }
              .detail strong { color: #475569; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✓ Booking Rejected</h1>
              <p style="font-size: 18px; color: #374151;">The booking has been declined.</p>
              
              <div class="detail">
                <strong>Reference:</strong> ${booking_ref}<br>
                <strong>Patient:</strong> ${booking.patient_name}<br>
                <strong>Treatment:</strong> ${booking.treatment_type}<br>
                ${reason !== 'No reason provided' ? `<strong>Reason:</strong> ${reason}<br>` : ''}
              </div>
              
              <p style="color: #6b7280; margin-top: 30px;">The patient has been notified via email.</p>
              <p style="color: #6b7280; font-weight: 600;">You can close this window.</p>
            </div>
          </body>
        </html>
      `);
    }

  } catch (error) {
    console.error('REJECT ENDPOINT ERROR:', error);
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
