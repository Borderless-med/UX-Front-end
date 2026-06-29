// ============================================
// CLINIC UNIFIED RESPONSE ENDPOINT
// URL: /api/clinic/respond/[booking_ref]?action={confirm|reject|alternatives}&token=xxx
// Routes to appropriate handler based on 'action' query parameter
// Consolidates: confirm.ts, reject.ts, alternatives.ts (reduces serverless functions)
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../../../services/notification-service.js';
import crypto from 'crypto';

// ============================================
// SHARED UTILITIES
// ============================================

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

// ============================================
// CONFIRM HANDLER
// ============================================

async function handleConfirm(
  req: VercelRequest,
  res: VercelResponse,
  booking: any,
  booking_ref: string,
  supabase: any,
  clinicDetails: any
): Promise<any> {
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
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
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
    const cancelUrl = `https://orachope.org/api/cancel-appointment?ref=${encodeURIComponent(booking_ref as string)}&email=${encodeURIComponent(booking.email)}&token=${cancelToken}`;

    const googleMapsUrl = clinicDetails?.address 
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicDetails.address + ', ' + (clinicDetails.township || ''))}`
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
        clinic_name: clinicDetails?.name || booking.clinic_location,
        clinic_address: clinicDetails?.address || '',
        clinic_city: clinicDetails?.township || 'Johor Bahru',
        clinic_state: 'Johor',
        clinic_postcode: '',
        clinic_country: 'Malaysia',
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
}

// ============================================
// REJECT HANDLER
// ============================================

async function handleReject(
  req: VercelRequest,
  res: VercelResponse,
  booking: any,
  booking_ref: string,
  token: string,
  supabase: any,
  clinicDetails: any
): Promise<any> {
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
                <button type="button" class="alternatives-btn" onclick="window.location.href='?action=alternatives&token=${token}'">
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
      const supabaseUrl = process.env.SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      
      const notificationService = new NotificationService({
        supabaseUrl,
        supabaseKey,
        whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
        smtpUser: process.env.SMTP_USER!,
      });

      // Use booking_expired template (suitable for rejection scenario)
      const notificationResults = await notificationService.send(
        'booking_rejected',
        {
          name: booking.patient_name,
          email: booking.email,
        },
        {
          patient_name: booking.patient_name,
          booking_ref: booking_ref as string,
          clinic_name: clinicDetails?.name || booking.clinic_location,
          clinic_address: clinicDetails?.address || '',
          clinic_city: clinicDetails?.township || '',
          clinic_state: 'Johor',
          clinic_country: 'Malaysia',
          treatment_type: booking.treatment_type,
          formatted_date: new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time_slot: booking.time_slot,
          rejection_reason: reason,
        },
        ['email']
      );

      await notificationService.logNotification(
        booking_ref as string,
        'booking_rejected',
        notificationResults
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
}

// ============================================
// ALTERNATIVES HANDLER
// ============================================

async function handleAlternatives(
  req: VercelRequest,
  res: VercelResponse,
  booking: any,
  booking_ref: string,
  supabase: any,
  clinicDetails: any
): Promise<any> {
  // Check booking status
  if (booking.status === 'confirmed') {
    return res.status(200).send(`
      <html>
        <head><title>Already Confirmed</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #22c55e;">✅ Already Confirmed</h1>
          <p>This booking was already confirmed for the original time slot.</p>
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
          <p>This booking expired. Too late to offer alternatives.</p>
        </body>
      </html>
    `);
  }

  if (booking.status !== 'pending') {
    return res.status(400).send(`
      <html>
        <head><title>Cannot Offer Alternatives</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Cannot Offer Alternatives</h1>
          <p>Booking status: <strong>${booking.status}</strong></p>
        </body>
      </html>
    `);
  }

  // If GET request, show alternatives form
  if (req.method === 'GET') {
    return res.status(200).send(`
      <html>
        <head>
          <title>Offer Alternative Slots</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              background: #fef9e7; 
              margin: 0;
            }
            .container { 
              background: white; 
              padding: 30px; 
              border-radius: 12px; 
              max-width: 700px; 
              margin: 20px auto; 
              box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            }
            h1 { color: #f59e0b; margin-bottom: 10px; }
            .detail { 
              background: #f8fafc; 
              padding: 15px; 
              margin: 20px 0; 
              border-radius: 6px; 
            }
            .detail strong { color: #475569; display: inline-block; width: 140px; }
            .slot-group { 
              border: 2px solid #fbbf24; 
              border-radius: 8px; 
              padding: 15px; 
              margin: 15px 0; 
              background: #fffbeb;
            }
            .slot-group h3 { 
              margin: 0 0 12px 0; 
              color: #f59e0b; 
              font-size: 16px; 
            }
            .input-row { 
              display: flex; 
              gap: 10px; 
              margin-bottom: 10px; 
            }
            input[type="date"], input[type="time"] { 
              flex: 1;
              padding: 10px; 
              border: 2px solid #e5e7eb; 
              border-radius: 6px; 
              font-size: 14px;
            }
            input:focus { 
              outline: none; 
              border-color: #f59e0b; 
            }
            .add-slot-btn {
              background: #10b981;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              margin-top: 10px;
            }
            .add-slot-btn:hover {
              background: #059669;
            }
            button[type="submit"] { 
              width: 100%;
              padding: 16px; 
              background: #f59e0b; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              font-size: 16px; 
              font-weight: 600; 
              cursor: pointer; 
              margin-top: 20px;
            }
            button[type="submit"]:hover { 
              background: #d97706; 
            }
            .note { 
              color: #6b7280; 
              font-size: 14px; 
              margin: 15px 0; 
              padding: 12px;
              background: #f0f9ff;
              border-left: 4px solid #3b82f6;
              border-radius: 4px;
            }
            .remove-btn {
              background: #dc2626;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📅 Offer Alternative Time Slots</h1>
            <p style="color: #6b7280; margin-bottom: 20px;">The original slot isn't available? Suggest 3 alternative times for the patient.</p>
            
            <div class="detail">
              <strong>Reference:</strong> ${booking_ref}<br>
              <strong>Patient:</strong> ${booking.patient_name}<br>
              <strong>Treatment:</strong> ${booking.treatment_type}<br>
              <strong>Requested:</strong> ${new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at ${booking.time_slot}
            </div>

            <div class="note">
              💡 <strong>Tip:</strong> Offering alternatives extends the booking expiry by <strong>60 minutes</strong>. The patient will receive a WhatsApp message to choose their preferred slot.
            </div>

            <form method="POST" id="alternativesForm">
              <div id="slotsContainer">
                <div class="slot-group">
                  <h3>Alternative Slot 1 <span style="color: #dc2626;">*Required</span></h3>
                  <div class="input-row">
                    <input type="date" name="slot_date_1" required min="${new Date().toISOString().split('T')[0]}">
                    <input type="time" name="slot_time_1" required step="900" value="09:00">
                  </div>
                </div>

                <div class="slot-group">
                  <h3>Alternative Slot 2 <span style="color: #6b7280; font-style: italic;">(Optional)</span></h3>
                  <div class="input-row">
                    <input type="date" name="slot_date_2" min="${new Date().toISOString().split('T')[0]}">
                    <input type="time" name="slot_time_2" step="900" value="14:00">
                  </div>
                </div>

                <div class="slot-group">
                  <h3>Alternative Slot 3 <span style="color: #6b7280; font-style: italic;">(Optional)</span></h3>
                  <div class="input-row">
                    <input type="date" name="slot_date_3" min="${new Date().toISOString().split('T')[0]}">
                    <input type="time" name="slot_time_3" step="900" value="16:00">
                  </div>
                </div>
              </div>

              <button type="submit">Send Alternatives to Patient</button>
            </form>
          </div>

          <script>
            document.getElementById('alternativesForm').addEventListener('submit', function(e) {
              const formData = new FormData(this);
              let validSlots = 0;
              
              for (let i = 1; i <= 3; i++) {
                const date = formData.get('slot_date_' + i);
                const time = formData.get('slot_time_' + i);
                if (date && time) validSlots++;
              }
              
              if (validSlots < 1) {
                e.preventDefault();
                alert('Please provide at least 1 alternative time slot.');
                return false;
              }
              
              if (validSlots > 3) {
                e.preventDefault();
                alert('You can provide maximum 3 alternative time slots.');
                return false;
              }
            });
          </script>
        </body>
      </html>
    `);
  }

  // If POST request, process alternatives
  if (req.method === 'POST') {
    const body = req.body;
    
    // Extract alternative slots from form data (exactly 3 slots)
    const alternatives: Array<{date: string, time: string}> = [];
    for (let i = 1; i <= 3; i++) {
      const date = body[`slot_date_${i}`];
      const time = body[`slot_time_${i}`];
      if (date && time) {
        alternatives.push({ date, time });
      }
    }

    if (alternatives.length < 1) {
      return res.status(400).send(`
        <html>
          <head><title>Insufficient Alternatives</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Insufficient Alternatives</h1>
            <p>You must provide at least 1 alternative time slot.</p>
            <button onclick="history.back()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">Go Back</button>
          </body>
        </html>
      `);
    }

    if (alternatives.length > 3) {
      return res.status(400).send(`
        <html>
          <head><title>Too Many Alternatives</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Too Many Alternatives</h1>
            <p>You can provide maximum 3 alternative time slots.</p>
            <button onclick="history.back()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">Go Back</button>
          </body>
        </html>
      `);
    }

    // Format alternatives for email display with clickable buttons
    const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
    const alternativesHtml = alternatives.map((slot, idx) => {
      const dateObj = new Date(slot.date + 'T' + slot.time);
      const formattedDate = dateObj.toLocaleDateString('en-SG', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      // Generate HMAC token for this specific slot
      const slotToken = crypto
        .createHmac('sha256', HMAC_SECRET)
        .update(`${booking_ref}|patient|${idx}`)
        .digest('hex')
        .slice(0, 32);
      
      const acceptUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orachope.org'}/api/patient/booking-response?action=accept&ref=${booking_ref}&slot=${idx}&token=${slotToken}`;
      
      return `
        <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0;">
          <div style="color: #1f2937; font-weight: 600; margin-bottom: 8px;">Option ${idx + 1}</div>
          <div style="color: #374151; font-size: 15px; margin-bottom: 12px;">
            📅 ${formattedDate}<br>
            🕐 ${slot.time}
          </div>
          <a href="${acceptUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">✅ Choose This Slot</a>
        </div>
      `;
    }).join('');

    // Plain text version for WhatsApp
    const alternativesText = alternatives.map((slot, idx) => {
      const dateObj = new Date(slot.date + 'T' + slot.time);
      return `Option ${idx + 1}: ${dateObj.toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${slot.time}`;
    }).join('\n');

    // Calculate new expiry (current time + 60 minutes)
    const newExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Update booking with retry logic
    try {
      await retryOperation(async () => {
        const { error: updateError } = await supabase
          .from('appointment_bookings')
          .update({
            expires_at: newExpiry.toISOString(),
            clinic_responded_at: new Date().toISOString(),
            admin_notes: JSON.stringify({
              alternatives_offered: alternatives,
              original_request: {
                date: booking.preferred_date,
                time: booking.time_slot,
              },
              offered_at: new Date().toISOString(),
            }),
            updated_at: new Date().toISOString(),
          })
          .eq('booking_ref', booking_ref)
          .eq('status', 'pending');

        if (updateError) throw updateError;
      });
    } catch (error) {
      await sendAdminAlert(
        'Alternatives Offer Failed',
        `Failed to record alternatives for booking ${booking_ref} after 3 retries`,
        { booking_ref, alternatives, error: error instanceof Error ? error.message : 'Unknown' }
      );

      return res.status(500).send(`
        <html>
          <head><title>System Error</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">⚠️ System Error</h1>
            <p>Failed to save alternatives. Our team has been notified.</p>
            <p>Contact: contact@orachope.org | Reference: <strong>${booking_ref}</strong></p>
          </body>
        </html>
      `);
    }

    // Send alternatives notification to patient
    try {
      const supabaseUrl = process.env.SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      
      const notificationService = new NotificationService({
        supabaseUrl,
        supabaseKey,
        whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
        smtpUser: process.env.SMTP_USER!,
      });

      // Select correct WhatsApp template based on slot count
      let whatsappTemplateName: 'alternatives_offered_1slot' | 'alternatives_offered_2slot' | 'alternatives_offered_3slot';
      if (alternatives.length === 1) {
        whatsappTemplateName = 'alternatives_offered_1slot';
      } else if (alternatives.length === 2) {
        whatsappTemplateName = 'alternatives_offered_2slot';
      } else {
        whatsappTemplateName = 'alternatives_offered_3slot';
      }

      // Prepare notification data
      const notificationData: any = {
        patient_name: booking.patient_name,
        booking_ref: booking_ref as string,
        clinic_name: clinicDetails?.name || booking.clinic_location,
        clinic_address: clinicDetails?.address || '',
        clinic_city: clinicDetails?.city || '',
        clinic_state: clinicDetails?.state || '',
        clinic_country: clinicDetails?.country || 'Malaysia',
        original_date: new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        original_time: booking.time_slot,
        alternative_slots: alternativesHtml, // HTML buttons for email
        alternative_slots_text: alternativesText, // Plain text for WhatsApp
        reject_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orachope.org'}/api/patient/booking-response?action=decline&ref=${booking_ref}`,
      };

      // Add slot-specific button texts and URLs for WhatsApp
      alternatives.forEach((slot, idx) => {
        const dateObj = new Date(slot.date + 'T' + slot.time);
        const buttonText = dateObj.toLocaleString('en-SG', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).replace(',', ''); // e.g., "Fri 13 Jun 10:00 AM"
        
        // Generate accept URL for this slot (index-based token matches booking-response verifier)
        const slotToken = crypto
          .createHmac('sha256', HMAC_SECRET)
          .update(`${booking_ref}|patient|${idx}`)
          .digest('hex');
        const acceptUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://orachope.org'}/api/patient/booking-response?action=accept&ref=${booking_ref}&slot=${idx}&token=${slotToken.slice(0, 32)}`;
        const slotDetails = `${dateObj.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' })}, ${slot.time}`;

        notificationData[`slot${idx + 1}_button_text`] = `📅 ${buttonText}`;
        notificationData[`slot${idx + 1}_details`] = slotDetails;
        notificationData[`slot${idx + 1}_url`] = acceptUrl;
      });

      const notificationResults = await notificationService.send(
        whatsappTemplateName,
        {
          name: booking.patient_name,
          email: booking.email,
          whatsapp: booking.whatsapp,
        },
        notificationData,
        ['email', 'whatsapp']
      );

      await notificationService.logNotification(
        booking_ref as string,
        whatsappTemplateName,
        notificationResults
      );

    } catch (error) {
      console.error('Failed to send alternatives notification:', error);
      // Continue anyway - alternatives are saved in database
    }

    // Success page
    return res.status(200).send(`
      <html>
        <head>
          <title>Alternatives Sent</title>
          <style>
            body { font-family: Arial; padding: 40px; text-align: center; background: #f0fdf4; }
            .container { background: white; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #16a34a; margin-bottom: 20px; }
            .detail { background: #f8fafc; padding: 15px; margin: 20px 0; border-radius: 6px; text-align: left; }
            .slots { background: #fffbeb; padding: 15px; margin: 20px 0; border-radius: 6px; border: 2px solid #fbbf24; text-align: left; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Alternatives Sent!</h1>
            <p style="font-size: 18px; color: #374151;">The patient will receive your alternative time slots.</p>
            
            <div class="detail">
              <strong>Reference:</strong> ${booking_ref}<br>
              <strong>Patient:</strong> ${booking.patient_name}<br>
              <strong>Extended Expiry:</strong> ${newExpiry.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })} (+60 minutes)
            </div>

            <div class="slots">
              <strong>Your Alternative Slots:</strong><br>
              ${alternatives.map((slot, idx) => {
                const dateObj = new Date(slot.date + 'T' + slot.time);
                return `${idx + 1}. ${dateObj.toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' })} at ${slot.time}`;
              }).join('<br>')}
            </div>
            
            <p style="color: #6b7280; margin-top: 30px;">Patient notified via WhatsApp and email.</p>
            <p style="color: #16a34a; font-weight: 600;">You can close this window.</p>
          </div>
        </body>
      </html>
    `);
  }
}

// ============================================
// NEUTRAL CHOICE HANDLER
// ============================================

async function handleChoice(
  req: VercelRequest,
  res: VercelResponse,
  booking: any,
  booking_ref: string,
  token: string,
  clinicDetails: any
): Promise<any> {
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
          <h1 style="color: #dc2626;">⏰ Booking Expired</h1>
          <p>This booking expired due to no response within 3 hours.</p>
          <p><strong>Reference:</strong> ${booking_ref}</p>
        </body>
      </html>
    `);
  }

  if (booking.status !== 'pending') {
    return res.status(400).send(`
      <html>
        <head><title>Booking Unavailable</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Booking Unavailable</h1>
          <p>This booking has status: <strong>${booking.status}</strong></p>
        </body>
      </html>
    `);
  }

  const confirmUrl = `?action=confirm&token=${encodeURIComponent(token)}`;
  const rejectUrl = `?action=reject&token=${encodeURIComponent(token)}`;
  const alternativesUrl = `?action=alternatives&token=${encodeURIComponent(token)}`;

  return res.status(200).send(`
    <html>
      <head>
        <title>Clinic Response</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
            margin: 0;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 16px;
            max-width: 640px;
            margin: 24px auto;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
            border: 1px solid #e2e8f0;
          }
          h1 { color: #0f172a; margin-bottom: 8px; }
          .subtitle { color: #475569; margin-bottom: 20px; line-height: 1.5; }
          .detail {
            background: #f8fafc;
            padding: 16px;
            margin: 20px 0;
            border-radius: 10px;
            text-align: left;
            border: 1px solid #e2e8f0;
          }
          .detail strong { color: #334155; display: inline-block; width: 130px; }
          .button-group { display: grid; gap: 12px; margin-top: 24px; }
          a.button {
            display: block;
            padding: 14px 18px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            text-align: center;
          }
          .confirm { background: #059669; color: white; }
          .reject { background: #dc2626; color: white; }
          .alternatives { background: #2563eb; color: white; }
          .note { color: #64748b; font-size: 14px; margin-top: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Clinic Response</h1>
          <p class="subtitle">Choose how you want to handle this booking request. This page is the WhatsApp entry point and keeps your decision explicit.</p>

          <div class="detail">
            <strong>Reference:</strong> ${booking_ref}<br>
            <strong>Patient:</strong> ${booking.patient_name}<br>
            <strong>Treatment:</strong> ${booking.treatment_type}<br>
            <strong>Date:</strong> ${new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
            <strong>Time:</strong> ${booking.time_slot}<br>
            <strong>Clinic:</strong> ${clinicDetails?.name || booking.clinic_location}
          </div>

          <div class="button-group">
            <a class="button confirm" href="${confirmUrl}">Confirm Appointment</a>
            <a class="button reject" href="${rejectUrl}">Reject Booking</a>
            <a class="button alternatives" href="${alternativesUrl}">Offer Alternatives</a>
          </div>

          <p class="note">You can use any of these actions without changing the email flow.</p>
        </div>
      </body>
    </html>
  `);
}

// ============================================
// MAIN HANDLER - ROUTER
// ============================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { booking_ref, action, token } = req.query;

    // Validate required parameters
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

    if (action && !['confirm', 'reject', 'alternatives'].includes(action as string)) {
      return res.status(400).send(`
        <html>
          <head><title>Invalid Action</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Invalid Action</h1>
            <p>Action must be: confirm, reject, or alternatives</p>
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

    // Fetch clinic details for notifications (search by ID first, then by name)
    let clinicDetails: any = null;
    
    // Search by clinic_id first (if exists)
    if (booking.clinic_id) {
      const { data: jbClinic } = await supabase
        .from('clinics_data')
        .select('id, name, contact_email, address, township')
        .eq('id', booking.clinic_id)
        .single();
      
      const { data: sgClinic } = await supabase
        .from('sg_clinics')
        .select('id, name, contact_email, address, township')
        .eq('id', booking.clinic_id)
        .single();
      
      clinicDetails = jbClinic || sgClinic;
    }
    
    // Fallback: Search by name in BOTH tables
    if (!clinicDetails && booking.clinic_location) {
      const { data: jbClinics } = await supabase
        .from('clinics_data')
        .select('id, name, contact_email, address, township')
        .ilike('name', booking.clinic_location)
        .limit(1);
      
      const { data: sgClinics } = await supabase
        .from('sg_clinics')
        .select('id, name, contact_email, address, township')
        .ilike('name', booking.clinic_location)
        .limit(1);
      
      clinicDetails = jbClinics?.[0] || sgClinics?.[0];
    }
    
    console.log('📍 Clinic lookup result:', { 
      clinic_id: booking.clinic_id, 
      clinic_location: booking.clinic_location,
      found: !!clinicDetails,
      clinic_name: clinicDetails?.name 
    });

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

    if (!action) {
      return await handleChoice(req, res, booking, booking_ref as string, token as string, clinicDetails);
    }

    // Route to appropriate handler based on action
    switch (action) {
      case 'confirm':
        return await handleConfirm(req, res, booking, booking_ref as string, supabase, clinicDetails);
      
      case 'reject':
        return await handleReject(req, res, booking, booking_ref as string, token as string, supabase, clinicDetails);
      
      case 'alternatives':
        return await handleAlternatives(req, res, booking, booking_ref as string, supabase, clinicDetails);
      
      default:
        return res.status(400).send(`
          <html>
            <head><title>Unknown Action</title></head>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
              <h1 style="color: #dc2626;">❌ Unknown Action</h1>
            </body>
          </html>
        `);
    }

  } catch (error) {
    console.error('CLINIC RESPONSE ENDPOINT ERROR:', error);
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
