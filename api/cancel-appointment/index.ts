import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

/*
  Minimal cancellation endpoint.
  GET or POST supported for simplicity.
  Params: booking_ref (ref), email, token (HMAC of ref|email using CANCEL_SECRET)
  Action: set status = 'cancelled' where booking_ref & email match (and not already cancelled)
  Safe: additive; no schema changes required.
*/

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

  const ref = (req.query.ref || req.body?.ref || req.query.booking_ref || req.body?.booking_ref) as string | undefined;
  const email = (req.query.email || req.body?.email) as string | undefined;
  const token = (req.query.token || req.body?.token) as string | undefined;
  const reason = (req.query.reason || req.body?.reason || req.body?.cancellation_reason) as string | undefined;
  if (!ref || !email || !token) {
    res.status(400).json({ error: 'Missing ref, email or token' });
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
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    if (booking.status === 'cancelled') {
      res.status(200).json({ success: true, message: 'Already cancelled' });
      return;
    }

    const now = new Date().toISOString();
    const { error: updateErr } = await supabase
      .from('appointment_bookings')
      .update({
        status: 'cancelled',
        cancelled_at: now,
        cancellation_reason: reason || null,
        updated_at: now
      })
      .eq('booking_ref', ref)
      .eq('email', email);

    if (updateErr) throw updateErr;

    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  } catch (e: any) {
    console.error('Cancellation error', e);
    res.status(500).json({ error: e.message || 'Internal error' });
  }
}
