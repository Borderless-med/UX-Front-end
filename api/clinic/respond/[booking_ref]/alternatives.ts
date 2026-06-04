// ============================================
// CLINIC RESPONSE: OFFER ALTERNATIVE SLOTS
// URL: /api/clinic/respond/[booking_ref]/alternatives?token=xxx
// Shows form for alternative slots, extends expiry, notifies patient
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
              <p style="color: #6b7280; margin-bottom: 20px;">The original slot isn't available? Suggest 3-5 alternative times for the patient.</p>
              
              <div class="detail">
                <strong>Reference:</strong> ${booking_ref}<br>
                <strong>Patient:</strong> ${booking.patient_name}<br>
                <strong>Treatment:</strong> ${booking.treatment_type}<br>
                <strong>Requested:</strong> ${new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at ${booking.time_slot}
              </div>

              <div class="note">
                💡 <strong>Tip:</strong> Offering alternatives extends the booking expiry by <strong>60 minutes</strong>. The patient will receive an email to choose their preferred slot.
              </div>

              <form method="POST" id="alternativesForm">
                <div id="slotsContainer">
                  <div class="slot-group">
                    <h3>Alternative Slot 1</h3>
                    <div class="input-row">
                      <input type="date" name="slot_date_1" required min="${new Date().toISOString().split('T')[0]}">
                      <input type="time" name="slot_time_1" required step="900" value="09:00">
                    </div>
                  </div>

                  <div class="slot-group">
                    <h3>Alternative Slot 2</h3>
                    <div class="input-row">
                      <input type="date" name="slot_date_2" required min="${new Date().toISOString().split('T')[0]}">
                      <input type="time" name="slot_time_2" required step="900" value="14:00">
                    </div>
                  </div>

                  <div class="slot-group">
                    <h3>Alternative Slot 3</h3>
                    <div class="input-row">
                      <input type="date" name="slot_date_3" required min="${new Date().toISOString().split('T')[0]}">
                      <input type="time" name="slot_time_3" required step="900" value="16:00">
                    </div>
                  </div>
                </div>

                <button type="button" class="add-slot-btn" id="addSlotBtn">+ Add Another Slot (Optional)</button>

                <button type="submit">Send Alternatives to Patient</button>
              </form>
            </div>

            <script>
              let slotCount = 3;
              const maxSlots = 5;
              
              document.getElementById('addSlotBtn').addEventListener('click', function() {
                if (slotCount >= maxSlots) {
                  alert('Maximum 5 alternative slots allowed');
                  return;
                }
                
                slotCount++;
                const container = document.getElementById('slotsContainer');
                const slotDiv = document.createElement('div');
                slotDiv.className = 'slot-group';
                slotDiv.innerHTML = \`
                  <h3>Alternative Slot \${slotCount} <button type="button" class="remove-btn" onclick="this.parentElement.parentElement.remove()">Remove</button></h3>
                  <div class="input-row">
                    <input type="date" name="slot_date_\${slotCount}" required min="${new Date().toISOString().split('T')[0]}">
                    <input type="time" name="slot_time_\${slotCount}" required step="900" value="10:00">
                  </div>
                \`;
                container.appendChild(slotDiv);
                
                if (slotCount >= maxSlots) {
                  this.style.display = 'none';
                }
              });

              document.getElementById('alternativesForm').addEventListener('submit', function(e) {
                const formData = new FormData(this);
                let hasAtLeastThree = false;
                let validSlots = 0;
                
                for (let i = 1; i <= slotCount; i++) {
                  const date = formData.get('slot_date_' + i);
                  const time = formData.get('slot_time_' + i);
                  if (date && time) validSlots++;
                }
                
                if (validSlots < 3) {
                  e.preventDefault();
                  alert('Please provide at least 3 alternative time slots.');
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
      
      // Extract alternative slots from form data
      const alternatives: Array<{date: string, time: string}> = [];
      for (let i = 1; i <= 5; i++) {
        const date = body[`slot_date_${i}`];
        const time = body[`slot_time_${i}`];
        if (date && time) {
          alternatives.push({ date, time });
        }
      }

      if (alternatives.length < 3) {
        return res.status(400).send(`
          <html>
            <head><title>Insufficient Alternatives</title></head>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
              <h1 style="color: #dc2626;">❌ Insufficient Alternatives</h1>
              <p>You must provide at least 3 alternative time slots.</p>
              <button onclick="history.back()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">Go Back</button>
            </body>
          </html>
        `);
      }

      // Format alternatives for email display
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
        const notificationService = new NotificationService({
          supabaseUrl,
          supabaseKey,
          whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
          smtpUser: process.env.SMTP_USER!,
        });

        const notificationResults = await notificationService.send(
          'alternatives_offered',
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
            clinic_country: 'Malaysia',
            original_date: new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            original_time: booking.time_slot,
            alternative_slots: alternativesText,
            confirm_url: `https://orachope.org/booking/choose-alternative?ref=${booking_ref}`,
            reject_url: `https://orachope.org/booking/decline-alternatives?ref=${booking_ref}`,
          },
          ['email', 'whatsapp']
        );

        await notificationService.logNotification(
          booking_ref as string,
          'alternatives_offered',
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

  } catch (error) {
    console.error('ALTERNATIVES ENDPOINT ERROR:', error);
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
