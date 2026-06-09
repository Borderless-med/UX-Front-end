// ============================================
// PATIENT RESPONSE: DECLINE ALTERNATIVE SLOTS
// URL: /api/patient/decline-alternatives?ref=APT-xxx&token=xxx
// Marks booking as rejected, redirects to clinic search
// ============================================

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
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

  } catch (error) {
    console.error('DECLINE ALTERNATIVES ERROR:', error);
    
    // On error, still redirect to clinic search (fail gracefully)
    return res.status(302).redirect('https://orachope.org/clinics');
  }
}
