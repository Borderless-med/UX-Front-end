import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { NotificationService } from '../../services/notification-service.js';

function firstValue(value: unknown): string | undefined {
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

async function sendAdminCancellationEmail(params: { booking: any; ref: string; email: string; reason?: string }) {
  const { booking, ref, email, reason } = params;
  const smtp2goApiKey = process.env.SMTP2GO_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const fromUser = process.env.SMTP_USER || 'no-reply@orachope.org';
  const admin = 'contact@orachope.org';
  const formattedDate = new Date(booking.preferred_date).toLocaleDateString('en-SG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;line-height:1.5">
      <h2 style="margin:0 0 12px;color:#991b1b">Booking Cancelled</h2>
      <p style="margin:0 0 12px;color:#334155">Reference <strong>${ref}</strong> was cancelled.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:12px">
        <tr><td style="padding:4px 0;font-weight:600;color:#475569">Patient</td><td style="padding:4px 0">${booking.patient_name}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;color:#475569">Email</td><td style="padding:4px 0">${email}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;color:#475569">Treatment</td><td style="padding:4px 0">${booking.treatment_type}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;color:#475569">Date</td><td style="padding:4px 0">${formattedDate}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;color:#475569">Time Slot</td><td style="padding:4px 0">${booking.time_slot}</td></tr>
        <tr><td style="padding:4px 0;font-weight:600;color:#475569">Clinic Location</td><td style="padding:4px 0">${booking.clinic_location}</td></tr>
      </table>
      ${reason ? `<p style=\"margin:0 0 12px;color:#ea580c\"><strong>Reason:</strong> ${reason}</p>` : ''}
      <p style="margin:16px 0 0;font-size:11px;color:#94a3b8">Automated cancellation notice.</p>
    </div>`;
  const subject = `ADMIN: Booking Cancelled - ${ref}`;
  if (smtp2goApiKey) {
    const payload = { api_key: smtp2goApiKey, to: [admin], sender: fromUser, subject, html_body: html };
    await fetch('https://api.smtp2go.com/v3/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return;
  }
  if (brevoApiKey) {
    await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'api-key': brevoApiKey }, body: JSON.stringify({ sender: { email: fromUser, name: 'SG-JB Dental' }, to: [{ email: admin }], subject, htmlContent: html }) });
  }
}

async function sendClinicCancellationNotification(params: { 
  booking: any; 
  ref: string; 
  email: string; 
  reason?: string;
  supabase: any;
}) {
  const { booking, ref, email, reason, supabase } = params;
  
  try {
    // Get clinic details
    let clinic: any = null;
    
    if (booking.clinic_id) {
      const { data: jbClinic } = await supabase
        .from('clinics_data')
        .select('id, name, contact_email, whatsapp_number')
        .eq('id', booking.clinic_id)
        .single();
      
      const { data: sgClinic } = await supabase
        .from('sg_clinics')
        .select('id, name, contact_email, whatsapp_number')
        .eq('id', booking.clinic_id)
        .single();
      
      clinic = jbClinic || sgClinic;
    }
    
    // If no clinic_id or not found, search by name
    if (!clinic && booking.clinic_location) {
      const { data: jbClinics } = await supabase
        .from('clinics_data')
        .select('id, name, contact_email, whatsapp_number')
        .ilike('name', booking.clinic_location)
        .limit(1);
      
      const { data: sgClinics } = await supabase
        .from('sg_clinics')
        .select('id, name, contact_email, whatsapp_number')
        .ilike('name', booking.clinic_location)
        .limit(1);
      
      clinic = jbClinics?.[0] || sgClinics?.[0];
    }
    
    if (!clinic || !clinic.contact_email) {
      console.log('⚠️ No clinic contact_email found for cancellation notification');
      return;
    }
    
    // Initialize notification service
    const notificationService = new NotificationService({
      supabaseUrl: process.env.SUPABASE_URL!,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      whatsappEnabled: true, // Phase 3 complete - Meta approved booking_cancelled_clinic_v1
      smtpUser: process.env.SMTP_USER!,
    });
    
    // Format dates
    const cancelledAt = new Date().toLocaleString('en-SG', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const formattedDate = new Date(booking.preferred_date).toLocaleString('en-SG', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Send email + WhatsApp notification to clinic
    const results = await notificationService.send(
      'booking_cancelled_clinic',
      {
        name: clinic.name,
        email: clinic.contact_email,
        whatsapp: clinic.whatsapp_number, // Add WhatsApp recipient
      },
      {
        clinic_name: clinic.name,
        patient_name: booking.patient_name,
        patient_email: email,
        patient_whatsapp: booking.whatsapp,
        booking_ref: ref,
        treatment_type: booking.treatment_type,
        formatted_date: formattedDate,
        appointment_date: formattedDate, // Required for WhatsApp template
        time_slot: booking.time_slot,
        cancelled_at: cancelledAt,
        cancellation_reason: reason || 'No reason provided',
      },
      ['email', 'whatsapp'] // Enable both channels
    );
    
    console.log('✅ Clinic cancellation notification sent:', results);
  } catch (error) {
    console.error('❌ Failed to send clinic cancellation notification:', error);
    // Don't throw - cancellation should still succeed even if notification fails
  }
}

/*
  Minimal cancellation endpoint.
  GET or POST supported for simplicity.
  Params: booking_ref (ref), email, token (HMAC of ref|email using CANCEL_SECRET)
  Action: set status = 'cancelled' where booking_ref & email match (and not already cancelled)
  Safe: additive; no schema changes required.
*/

function htmlPage(title: string, contentHtml: string) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0b1220;color:#e5e7eb;margin:0;padding:0}
        .wrap{max-width:560px;margin:48px auto;padding:24px}
        .card{background:#0f172a;border:1px solid #1f2a44;border-radius:12px;padding:24px}
        h1{font-size:22px;margin:0 0 8px;color:#fff}
        p{margin:8px 0;color:#cbd5e1}
        .ok{background:#052e16;border:1px solid #14532d;color:#d1fae5;padding:12px 14px;border-radius:8px;margin:16px 0}
        .warn{background:#3f1d1d;border:1px solid #7f1d1d;color:#fecaca;padding:12px 14px;border-radius:8px;margin:16px 0}
        .btn{display:inline-block;background:#ef4444;color:#fff;text-decoration:none;padding:10px 14px;border-radius:6px;font-weight:600;border:0;cursor:pointer}
        .row{margin:8px 0}
        input[type=text], textarea{width:100%;background:#0b1220;color:#e5e7eb;border:1px solid #27324e;border-radius:6px;padding:10px}
        label{display:block;margin:6px 0}
        small{color:#94a3b8}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="card">
          ${contentHtml}
        </div>
      </div>
    </body>
  </html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let ref = firstValue(req.query.ref) || firstValue(req.body?.ref) || firstValue(req.query.booking_ref) || firstValue(req.body?.booking_ref);
  let email = firstValue(req.query.email) || firstValue(req.body?.email);
  let token = firstValue(req.query.token) || firstValue(req.body?.token);

  const stuffed = parseStuffedQuery(token);
  if (stuffed) {
    ref = ref || stuffed.get('ref') || stuffed.get('booking_ref') || undefined;
    email = email || stuffed.get('email') || undefined;
    token = stuffed.get('token') || token;
  }

  const reason = (req.query.reason || req.body?.reason || req.body?.cancellation_reason) as string | undefined;
  const accept = (req.headers?.accept || '') as string;
  const wantsHTML = accept.includes('text/html') || (method === 'GET');
  if (!ref || !email || !token) {
    if (wantsHTML) {
      res.status(400).send(htmlPage('Missing information', `<h1>Missing information</h1><p>Please use the cancel link from your email.</p>`));
    } else {
      res.status(400).json({ error: 'Missing ref, email or token' });
    }
    return;
  }

  const CANCEL_SECRET = process.env.CANCEL_SECRET || 'dev-cancel-secret';
  const expected = crypto.createHmac('sha256', CANCEL_SECRET).update(`${ref}|${email}`).digest('hex').slice(0,32);
  if (expected !== token) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    // Fetch booking
    const { data: booking, error: fetchErr } = await supabase
      .from('appointment_bookings')
      .select('*')
      .eq('booking_ref', ref)
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (fetchErr) throw fetchErr;
    if (!booking) {
      if (wantsHTML) {
        res.status(404).send(htmlPage('Booking not found', `<h1>Booking not found</h1><p>We could not find a booking for this link.</p>`));
      } else {
        res.status(404).json({ error: 'Booking not found' });
      }
      return;
    }
    // Handle POST: cancel with reason (notifications sent here)
    if (method === 'POST') {
      const now = new Date().toISOString();
      if (booking.status !== 'cancelled') {
        const { error: updateErr } = await supabase
          .from('appointment_bookings')
          .update({ status: 'cancelled', cancelled_at: now, cancellation_reason: reason || null, updated_at: now })
          .eq('booking_ref', ref)
          .eq('email', email);
        if (updateErr) throw updateErr;
        // Send admin cancellation notification
        try {
          await sendAdminCancellationEmail({ booking, ref, email, reason });
        } catch (e) {
          console.error('Admin cancellation email failed', e);
        }
        // Send clinic cancellation notification
        try {
          await sendClinicCancellationNotification({ booking, ref, email, reason, supabase });
        } catch (e) {
          console.error('Clinic cancellation notification failed', e);
        }
        if (wantsHTML) {
          res.status(200).send(htmlPage('Booking cancelled', `
            <h1>Booking cancelled</h1>
            <div class="ok">Your booking has been cancelled successfully.</div>
            <p><small>Reference: ${ref}</small></p>
          `));
        } else {
          res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
        }
        return;
      }
      // Already cancelled: allow adding/updating reason only
      if (reason && reason.trim().length > 0) {
        const { error: updateReasonErr } = await supabase
          .from('appointment_bookings')
          .update({ cancellation_reason: reason, updated_at: now })
          .eq('booking_ref', ref)
          .eq('email', email);
        if (updateReasonErr) throw updateReasonErr;
      }
      if (wantsHTML) {
        res.status(200).send(htmlPage('Already cancelled', `
          <h1>Already cancelled</h1>
          <div class="warn">This booking was already cancelled.</div>
          <p><small>Reference: ${ref}</small></p>
        `));
      } else {
        res.status(200).json({ success: true, message: 'Already cancelled' });
      }
      return;
    }

    // GET: Show confirmation form (don't cancel yet - wait for POST with reason)
    if (booking.status !== 'cancelled') {
      if (wantsHTML) {
        const form = `
          <h1>Cancel Appointment</h1>
          <div class="warn">You're about to cancel your booking.</div>
          <p><small>Reference: ${ref}</small></p>
          <form method="POST" class="row">
            <input type="hidden" name="ref" value="${ref}" />
            <input type="hidden" name="email" value="${email}" />
            <input type="hidden" name="token" value="${token}" />
            <label for="reason">Why are you cancelling? (optional)</label>
            <textarea id="reason" name="reason" rows="3" placeholder="Changed plans, picked another date, etc."></textarea>
            <div class="row"><button class="btn" type="submit">Confirm Cancellation</button></div>
          </form>`;
        res.status(200).send(htmlPage('Cancel Appointment', form));
      } else {
        res.status(200).json({ success: false, message: 'Please use POST to cancel', ref });
      }
      return;
    }

    // Already cancelled on GET - allow adding reason
    if (wantsHTML) {
      const form = `
        <h1>Already cancelled</h1>
        <div class="warn">This booking was already cancelled.</div>
        <p><small>Reference: ${ref}</small></p>
        <form method="POST" class="row">
          <input type="hidden" name="ref" value="${ref}" />
          <input type="hidden" name="email" value="${email}" />
          <input type="hidden" name="token" value="${token}" />
          <label for="reason">Add or update cancellation reason (optional)</label>
          <textarea id="reason" name="reason" rows="3" placeholder="Changed plans, picked another date, etc."></textarea>
          <div class="row"><button class="btn" type="submit">Submit reason</button></div>
        </form>`;
      res.status(200).send(htmlPage('Already cancelled', form));
    } else {
      res.status(200).json({ success: true, message: 'Already cancelled' });
    }
  } catch (e: any) {
    console.error('Cancellation error', e);
    if ((req.headers?.accept || '').includes('text/html') || req.method === 'GET') {
      res.status(500).send(htmlPage('Error', `<h1>Something went wrong</h1><p>${(e?.message || 'Please try again later.') as string}</p>`));
    } else {
      res.status(500).json({ error: e.message || 'Internal error' });
    }
  }
}
