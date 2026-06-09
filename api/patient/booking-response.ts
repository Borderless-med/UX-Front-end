// ============================================
// COMBINED PATIENT RESPONSE ENDPOINT
// Handles both accept alternative slot and decline alternatives actions
// URL: /api/patient/booking-response?action=accept&ref=APT-xxx&slot=0&token=xxx
// URL: /api/patient/booking-response?action=decline&ref=APT-xxx&token=xxx
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../services/notification-service.js';
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

// Handler for accepting alternative slot
async function handleAcceptAlternative(
  req: VercelRequest,
  res: VercelResponse
) {
  const { ref, slot, token } = req.query;

  // Validate parameters
  if (!ref || !slot || !token) {
    return res.status(400).send(`
      <html>
        <head><title>Missing Parameters</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Invalid Request</h1>
          <p>Missing booking reference, slot selection, or security token.</p>
        </body>
      </html>
    `);
  }

  const slotIndex = parseInt(slot as string);
  if (isNaN(slotIndex) || slotIndex < 0 || slotIndex > 4) {
    return res.status(400).send(`
      <html>
        <head><title>Invalid Slot</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Invalid Slot Selection</h1>
          <p>Slot index must be between 0 and 4.</p>
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
    .select('*')
    .eq('booking_ref', ref)
    .single();

  if (fetchError || !booking) {
    return res.status(404).send(`
      <html>
        <head><title>Booking Not Found</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Booking Not Found</h1>
          <p>Reference: ${ref}</p>
          <p style="color: #6b7280; margin-top: 20px;">This booking may have expired or been cancelled.</p>
        </body>
      </html>
    `);
  }

  // Verify HMAC token
  const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
  const expectedToken = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${ref}|patient|${slotIndex}`)
    .digest('hex')
    .slice(0, 32);

  if (token !== expectedToken) {
    return res.status(403).send(`
      <html>
        <head><title>Invalid Token</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Invalid Security Token</h1>
          <p>This link may have expired or been tampered with.</p>
          <p style="color: #6b7280; margin-top: 20px;">Please request a new booking or contact support.</p>
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
          <p>This appointment has already been confirmed.</p>
          <p style="color: #374151; margin-top: 20px;">
            <strong>Booking Reference:</strong> ${booking.booking_ref}<br>
            <strong>Clinic:</strong> ${booking.clinic_location}
          </p>
        </body>
      </html>
    `);
  }

  if (booking.status === 'expired' || booking.status === 'cancelled') {
    return res.status(410).send(`
      <html>
        <head><title>Booking ${booking.status === 'expired' ? 'Expired' : 'Cancelled'}</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">${booking.status === 'expired' ? '⏰ Booking Expired' : '❌ Booking Cancelled'}</h1>
          <p>This booking is no longer active.</p>
          <p style="color: #6b7280; margin-top: 20px;">Please submit a new booking request on OraChope.org</p>
        </body>
      </html>
    `);
  }

  // Extract alternatives from admin_notes
  let alternatives: Array<{date: string, time: string}> = [];
  try {
    const adminNotes = typeof booking.admin_notes === 'string' 
      ? JSON.parse(booking.admin_notes) 
      : booking.admin_notes;
    
    alternatives = adminNotes?.alternatives_offered || [];
    
    if (!alternatives || alternatives.length === 0) {
      throw new Error('No alternatives found in booking');
    }
  } catch (error) {
    console.error('Failed to parse alternatives:', error);
    await sendAdminAlert(
      'Alternative Acceptance Failed',
      `No alternatives found for booking ${ref}`,
      { booking_ref: ref, admin_notes: booking.admin_notes, error: error instanceof Error ? error.message : 'Unknown' }
    );

    return res.status(500).send(`
      <html>
        <head><title>System Error</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">⚠️ System Error</h1>
          <p>No alternative time slots found for this booking.</p>
          <p style="color: #6b7280; margin-top: 20px;">Reference: <strong>${ref}</strong></p>
          <p style="color: #6b7280;">Please contact: contact@orachope.org</p>
        </body>
      </html>
    `);
  }

  // Validate slot index
  if (slotIndex >= alternatives.length) {
    return res.status(400).send(`
      <html>
        <head><title>Invalid Slot</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Invalid Slot Selection</h1>
          <p>The selected time slot is not available.</p>
        </body>
      </html>
    `);
  }

  // Get the chosen alternative
  const chosenSlot = alternatives[slotIndex];
  const newDate = chosenSlot.date;
  const newTime = chosenSlot.time;

  // Fetch clinic details for notification
  const { data: clinic } = await supabase
    .from('clinics_data')
    .select('name, email, address, city, state, country')
    .eq('id', booking.clinic_id)
    .single();

  const clinicName = clinic?.name || booking.clinic_location;
  const clinicEmail = clinic?.email || booking.clinic_email;

  // Update booking with retry logic
  try {
    await retryOperation(async () => {
      const { error: updateError } = await supabase
        .from('appointment_bookings')
        .update({
          preferred_date: newDate,
          time_slot: newTime,
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          admin_notes: JSON.stringify({
            ...(typeof booking.admin_notes === 'string' ? JSON.parse(booking.admin_notes) : booking.admin_notes),
            alternative_chosen: {
              slot_index: slotIndex,
              date: newDate,
              time: newTime,
              chosen_at: new Date().toISOString(),
            },
          }),
          updated_at: new Date().toISOString(),
        })
        .eq('booking_ref', ref)
        .in('status', ['pending', 'alternatives_offered']);

      if (updateError) throw updateError;
    });
  } catch (error) {
    console.error('Failed to update booking:', error);
    await sendAdminAlert(
      'Alternative Acceptance Failed',
      `Failed to confirm alternative for booking ${ref} after 3 retries`,
      { booking_ref: ref, slot_index: slotIndex, error: error instanceof Error ? error.message : 'Unknown' }
    );

    return res.status(500).send(`
      <html>
        <head><title>System Error</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">⚠️ System Error</h1>
          <p>Failed to confirm your appointment. Our team has been notified.</p>
          <p style="color: #6b7280; margin-top: 20px;">Reference: <strong>${ref}</strong></p>
          <p style="color: #6b7280;">Contact: contact@orachope.org</p>
        </body>
      </html>
    `);
  }

  // Format date and time for display
  const appointmentDate = new Date(newDate + 'T' + newTime);
  const formattedDate = appointmentDate.toLocaleDateString('en-SG', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Send confirmation notifications
  try {
    const notificationService = new NotificationService({
      supabaseUrl,
      supabaseKey,
      whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
      smtpUser: process.env.SMTP_USER!,
    });

    // Notify patient
    const patientResults = await notificationService.send(
      'confirmed',
      {
        name: booking.patient_name,
        email: booking.email,
        whatsapp: booking.whatsapp,
      },
      {
        patient_name: booking.patient_name,
        booking_ref: ref as string,
        clinic_name: clinicName,
        clinic_address: clinic?.address || '',
        clinic_city: clinic?.city || '',
        clinic_state: clinic?.state || '',
        clinic_country: clinic?.country || 'Malaysia',
        appointment_date: formattedDate,
        appointment_time: newTime,
        treatment_type: booking.treatment_type,
      },
      ['email', 'whatsapp']
    );

    // Notify clinic
    if (clinicEmail) {
      const clinicResults = await notificationService.send(
        'clinic_booking_confirmed',
        {
          name: clinicName,
          email: clinicEmail,
        },
        {
          clinic_name: clinicName,
          patient_name: booking.patient_name,
          patient_email: booking.email,
          patient_whatsapp: booking.whatsapp,
          booking_ref: ref as string,
          appointment_date: formattedDate,
          appointment_time: newTime,
          treatment_type: booking.treatment_type,
        },
        ['email']
      );

      await notificationService.logNotification(
        ref as string,
        'alternative_accepted',
        [...patientResults, ...clinicResults]
      );
    } else {
      await notificationService.logNotification(
        ref as string,
        'alternative_accepted',
        patientResults
      );
    }
  } catch (error) {
    console.error('Failed to send confirmation notifications:', error);
    // Continue anyway - booking is confirmed in database
  }

  // Success page
  return res.status(200).send(`
    <html>
      <head>
        <title>Appointment Confirmed!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f0fdf4; 
            margin: 0;
          }
          .container { 
            background: white; 
            padding: 40px; 
            border-radius: 12px; 
            max-width: 600px; 
            margin: 20px auto; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            text-align: center;
          }
          h1 { 
            color: #16a34a; 
            margin-bottom: 20px; 
            font-size: 32px;
          }
          .checkmark {
            font-size: 64px;
            color: #16a34a;
            margin: 20px 0;
          }
          .detail { 
            background: #f8fafc; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 8px; 
            text-align: left;
            border-left: 4px solid #16a34a;
          }
          .detail strong { 
            color: #475569; 
            display: inline-block; 
            min-width: 150px; 
          }
          .detail-row {
            margin: 10px 0;
            line-height: 1.6;
          }
          .highlight {
            background: #dcfce7;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 18px;
            font-weight: 600;
            color: #15803d;
          }
          .note {
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
            padding: 15px;
            background: #fef3c7;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="checkmark">✅</div>
          <h1>Appointment Confirmed!</h1>
          <p style="font-size: 18px; color: #374151; margin-bottom: 30px;">
            Thank you for choosing your preferred time slot. Your appointment is now confirmed.
          </p>
          
          <div class="highlight">
            ${formattedDate}<br>
            ${newTime}
          </div>

          <div class="detail">
            <div class="detail-row"><strong>Booking Reference:</strong> ${ref}</div>
            <div class="detail-row"><strong>Patient Name:</strong> ${booking.patient_name}</div>
            <div class="detail-row"><strong>Clinic:</strong> ${clinicName}</div>
            <div class="detail-row"><strong>Treatment:</strong> ${booking.treatment_type}</div>
            ${clinic?.address ? `<div class="detail-row"><strong>Address:</strong> ${clinic.address}, ${clinic.city || ''}</div>` : ''}
          </div>

          <div class="note">
            📧 <strong>Confirmation sent!</strong><br>
            We've emailed confirmation details to <strong>${booking.email}</strong>
            ${booking.whatsapp ? ` and sent a WhatsApp message to <strong>${booking.whatsapp}</strong>` : ''}.
          </div>

          <p style="color: #16a34a; font-weight: 600; margin-top: 40px; font-size: 16px;">
            See you at your appointment! 🦷
          </p>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
            © 2026 OraChope.org - Your Dental Care Partner
          </p>
        </div>
      </body>
    </html>
  `);
}

// Handler for declining alternatives
async function handleDeclineAlternatives(
  req: VercelRequest,
  res: VercelResponse
) {
  const { ref, token } = req.query;

  if (!ref) {
    return res.status(400).send(`
      <html>
        <head><title>Missing Reference</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Invalid Request</h1>
          <p>Missing booking reference.</p>
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
    .select('*')
    .eq('booking_ref', ref)
    .single();

  if (fetchError || !booking) {
    return res.status(404).send(`
      <html>
        <head><title>Booking Not Found</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">❌ Booking Not Found</h1>
          <p>Reference: ${ref}</p>
        </body>
      </html>
    `);
  }

  // Optional: Verify HMAC token if provided
  if (token) {
    const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
    const expectedToken = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(`${ref}|patient|decline`)
      .digest('hex')
      .slice(0, 32);

    if (token !== expectedToken) {
      console.warn('Invalid token for decline-alternatives, proceeding anyway');
    }
  }

  // Update booking status to cancelled (patient declined alternatives)
  const { error: updateError } = await supabase
    .from('appointment_bookings')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
      admin_notes: JSON.stringify({
        ...(typeof booking.admin_notes === 'string' ? JSON.parse(booking.admin_notes) : booking.admin_notes || {}),
        patient_declined_alternatives: {
          declined_at: new Date().toISOString(),
          reason: 'Patient chose to find other clinic instead of accepting alternatives',
        },
      }),
    })
    .eq('booking_ref', ref);

  if (updateError) {
    console.error('Failed to update booking:', updateError);
  }

  // Redirect to clinic search with treatment pre-filled
  const treatmentType = encodeURIComponent(booking.treatment_type || 'General Dentistry');
  const redirectUrl = `https://orachope.org/clinics?treatment=${treatmentType}&search=true`;

  return res.status(302).redirect(redirectUrl);
}

// Main handler - routes based on action parameter
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { action } = req.query;

    if (action === 'accept') {
      return await handleAcceptAlternative(req, res);
    } else if (action === 'decline') {
      return await handleDeclineAlternatives(req, res);
    } else {
      return res.status(400).send(`
        <html>
          <head><title>Invalid Action</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1 style="color: #dc2626;">❌ Invalid Action</h1>
            <p>Action must be either 'accept' or 'decline'.</p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('BOOKING RESPONSE ENDPOINT ERROR:', error);
    
    await sendAdminAlert(
      'Booking Response Error',
      'Unexpected error in booking-response endpoint',
      { 
        query: req.query,
        error: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
      }
    );

    return res.status(500).send(`
      <html>
        <head><title>System Error</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">⚠️ System Error</h1>
          <p>An unexpected error occurred. Our team has been notified.</p>
          <p style="color: #6b7280; margin-top: 20px;">Contact: contact@orachope.org</p>
        </body>
      </html>
    `);
  }
}
