// ============================================
// COMBINED PATIENT RESPONSE ENDPOINT
// Handles both accept alternative slot and decline alternatives actions
// URL: /api/patient/booking-response?action=accept&ref=APT-xxx&slot=0&token=xxx
// URL: /api/patient/booking-response?action=decline&ref=APT-xxx&token=xxx
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NotificationService } from '../../services/notification-service.js';
import crypto from 'crypto';
import { formatSingaporeDate } from '../../utils/sg-time.js';

function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

function parseStuffedQuery(rawToken?: string): URLSearchParams | null {
  if (!rawToken) {
    return null;
  }

  const candidate = rawToken.startsWith('?') ? rawToken.slice(1) : rawToken;
  const decodedCandidate = (() => {
    try {
      return decodeURIComponent(candidate);
    } catch {
      return candidate;
    }
  })();

  if ((!candidate.includes('=') && !candidate.includes('&')) && (!decodedCandidate.includes('=') && !decodedCandidate.includes('&'))) {
    return null;
  }

  return new URLSearchParams(decodedCandidate);
}

function getNormalizedParams(query: VercelRequest['query']) {
  let action = firstQueryValue(query.action);
  let ref = firstQueryValue(query.ref);
  let slot = firstQueryValue(query.slot);
  let token = firstQueryValue(query.token);

  const stuffed = parseStuffedQuery(token);
  if (stuffed) {
    action = action || stuffed.get('action') || undefined;
    ref = ref || stuffed.get('ref') || undefined;
    slot = slot || stuffed.get('slot') || undefined;
    token = stuffed.get('token') || token;
  }

  return { action, ref, slot, token };
}

// Retry logic for database updates
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any = null;  // Changed from Error to any to capture all error types
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`❌ Retry attempt ${attempt}/${maxRetries} failed:`, error);
      console.error(`Error type: ${typeof error}, constructor: ${error?.constructor?.name}`);
      lastError = error;
      if (attempt < maxRetries) {
        const waitTime = attempt * 1000;
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error(`❌ All ${maxRetries} retry attempts failed. Throwing last error.`);
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
  const { ref, slot, token } = getNormalizedParams(req.query);

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

  const slotValue = decodeURIComponent(slot as string);
  let slotIndex = -1;

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
  if (/^\d+$/.test(slotValue)) {
    slotIndex = parseInt(slotValue, 10);
  } else {
    slotIndex = alternatives.findIndex((candidate) => `${candidate.date}T${candidate.time}` === slotValue);
  }

  if (slotIndex < 0 || slotIndex >= alternatives.length) {
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

  // Verify HMAC token (supports both legacy index-based and datetime-based links)
  const HMAC_SECRET = process.env.HMAC_SECRET || 'dev-secret';
  const chosenSlotForToken = alternatives[slotIndex];
  const chosenSlotData = `${chosenSlotForToken.date}T${chosenSlotForToken.time}`;

  const expectedIndexToken = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${ref}|patient|${slotIndex}`)
    .digest('hex')
    .slice(0, 32);

  const expectedDatetimeToken = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${ref}:${chosenSlotData}:accept`)
    .digest('hex');

  const validToken =
    token === expectedIndexToken ||
    token === expectedDatetimeToken ||
    token === expectedDatetimeToken.slice(0, 32);

  if (!validToken) {
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

  // Get the chosen alternative
  const chosenSlot = alternatives[slotIndex];
  
  if (!chosenSlot || !chosenSlot.date || !chosenSlot.time) {
    console.error('❌ Invalid slot data:', chosenSlot);
    await sendAdminAlert(
      'Invalid Alternative Slot Data',
      `Slot ${slotIndex} has missing date/time`,
      { booking_ref: ref, slot_index: slotIndex, slot_data: chosenSlot, all_alternatives: alternatives }
    );
    return res.status(500).send(`
      <html>
        <head><title>Invalid Slot Data</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">⚠️ Invalid Slot Data</h1>
          <p>The selected time slot has incomplete information.</p>
          <p style="color: #6b7280; margin-top: 20px;">Reference: <strong>${ref}</strong></p>
          <p style="color: #6b7280;">Contact: contact@orachope.org</p>
        </body>
      </html>
    `);
  }
  
  const newDate = chosenSlot.date;
  const newTime = chosenSlot.time;

  console.log('📅 Chosen slot:', { slot_index: slotIndex, date: newDate, time: newTime });

  // Fetch clinic details for notification (search by ID first, then by name)
  let clinic: any = null;
  
  // Search by clinic_id first (if exists)
  if (booking.clinic_id) {
    const { data: jbClinic } = await supabase
      .from('clinics_data')
      .select('id, name, contact_email, whatsapp_number, address, township')
      .eq('id', booking.clinic_id)
      .single();
    
    const { data: sgClinic } = await supabase
      .from('sg_clinics')
      .select('id, name, contact_email, whatsapp_number, address, township')
      .eq('id', booking.clinic_id)
      .single();
    
    clinic = jbClinic || sgClinic;
  }
  
  // Fallback: Search by name in BOTH tables
  if (!clinic && booking.clinic_location) {
    const { data: jbClinics } = await supabase
      .from('clinics_data')
      .select('id, name, contact_email, whatsapp_number, address, township')
      .ilike('name', booking.clinic_location)
      .limit(1);
    
    const { data: sgClinics } = await supabase
      .from('sg_clinics')
      .select('id, name, contact_email, whatsapp_number, address, township')
      .ilike('name', booking.clinic_location)
      .limit(1);
    
    clinic = jbClinics?.[0] || sgClinics?.[0];
  }
  
  console.log('📍 Clinic lookup result:', { 
    clinic_id: booking.clinic_id, 
    clinic_location: booking.clinic_location,
    found: !!clinic,
    clinic_name: clinic?.name 
  });

  const clinicName = clinic?.name || booking.clinic_location;
  const clinicEmail = clinic?.contact_email || booking.clinic_email;

  // Parse existing admin_notes safely
  let existingNotes: any = {};
  try {
    if (booking.admin_notes) {
      const parsed = typeof booking.admin_notes === 'string' 
        ? JSON.parse(booking.admin_notes) 
        : booking.admin_notes;
      
      // Only spread if it's a plain object, not array or other type
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        existingNotes = parsed;
      }
    }
  } catch (parseError) {
    console.error('Failed to parse existing admin_notes, starting fresh:', parseError);
    // Continue with empty object - better to lose old notes than crash
  }

  // Update booking with retry logic
  try {
    console.log('📝 Attempting to update booking:', {
      ref,
      current_status: booking.status,
      new_date: newDate,
      new_time: newTime,
      slot_index: slotIndex,
      has_clinic_id: !!booking.clinic_id
    });

    // Prepare the admin_notes payload
    const newAdminNotes = {
      ...existingNotes,
      alternative_chosen: {
        slot_index: slotIndex,
        date: newDate,
        time: newTime,
        chosen_at: new Date().toISOString(),
      },
    };
    
    const adminNotesString = JSON.stringify(newAdminNotes);
    console.log('📋 New admin_notes:', adminNotesString);

    const updateResult = await retryOperation(async () => {
      const { data, error: updateError } = await supabase
        .from('appointment_bookings')
        .update({
          preferred_date: newDate,
          time_slot: newTime,  // Save exact time (e.g., "09:00")
          status: 'confirmed',
          admin_notes: adminNotesString,
          updated_at: new Date().toISOString(),
        })
        .eq('booking_ref', ref)
        .in('status', ['pending', 'alternatives_offered'])
        .select();

      if (updateError) {
        console.error('❌ Database update error:', updateError);
        throw updateError;
      }
      
      if (!data || data.length === 0) {
        console.error('❌ Update matched 0 rows - booking status mismatch?');
        throw new Error(`No rows updated. Current status: ${booking.status}, expected: pending or alternatives_offered`);
      }

      console.log('✅ Update successful, rows affected:', data.length);
      return data;
    });
  } catch (error) {
    console.error('Failed to update booking:', error);
    console.error('Error type:', typeof error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('Booking details:', { 
      ref, 
      status: booking.status, 
      admin_notes_type: typeof booking.admin_notes,
      admin_notes_value: booking.admin_notes 
    });
    
    // Serialize error properly for Supabase errors (which are objects, not Error instances)
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : (typeof error === 'object' && error !== null ? error : { raw: String(error) });
    
    await sendAdminAlert(
      'Alternative Acceptance Failed',
      `Failed to confirm alternative for booking ${ref} after 3 retries`,
      { 
        booking_ref: ref, 
        slot_index: slotIndex, 
        booking_status: booking.status,
        expected_status: 'pending or alternatives_offered',
        admin_notes: booking.admin_notes,
        new_date: newDate,
        new_time: newTime,
        error_details: errorDetails,
        error_type: typeof error,
        error_constructor: error?.constructor?.name
      }
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

  // Format date and time for display in Singapore timezone
  const formattedDate = formatSingaporeDate(newDate);

  // Send confirmation notifications
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
      .update(`${ref}|${booking.email}`)
      .digest('hex')
      .slice(0, 32);
    
    const cancelUrl = `https://orachope.org/api/cancel-appointment?ref=${encodeURIComponent(ref as string)}&email=${encodeURIComponent(booking.email)}&token=${cancelToken}`;
    
    const googleMapsUrl = clinic?.address 
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address + ', ' + (clinic.township || ''))}`
      : 'https://orachope.org/travel-guide';

    // Notify patient
    const patientResults = await notificationService.send(
      'appointment_confirmed',
      {
        name: booking.patient_name,
        email: booking.email,
        whatsapp: booking.whatsapp,
      },
      {
        patient_name: booking.patient_name,
        booking_ref: ref as string,
        clinic_name: clinic?.name || booking.clinic_location,
        clinic_address: clinic?.address || '',
        clinic_city: clinic?.township || 'Johor Bahru',
        clinic_state: 'Johor',
        clinic_postcode: '',
        clinic_country: 'Malaysia',
        formatted_date: formattedDate,
        time_slot: newTime,
        treatment_type: booking.treatment_type,
        travel_guide_url: 'https://orachope.org/travel-guide',
        google_maps_url: googleMapsUrl,
        cancel_url: cancelUrl,
      },
      ['email', 'whatsapp']
    );

    // Notify clinic (FYI only - no action required)
    if (clinicEmail) {
      const clinicResults = await notificationService.send(
        'alternative_accepted_clinic',
        {
          name: clinic?.name || booking.clinic_location,
          email: clinicEmail,
          whatsapp: clinic?.whatsapp_number || undefined,
        },
        {
          clinic_name: clinic?.name || booking.clinic_location,
          patient_name: booking.patient_name,
          booking_ref: ref as string,
          confirmed_date: formattedDate,
          confirmed_time: newTime,
          treatment_type: booking.treatment_type,
          patient_whatsapp: booking.whatsapp,
          patient_email: booking.email,
        },
        ['email', 'whatsapp']
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
  const { ref, token } = getNormalizedParams(req.query);

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
    const normalized = getNormalizedParams(req.query);
    const action = normalized.action || ((normalized.ref && normalized.slot && normalized.token) ? 'accept' : undefined);

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
