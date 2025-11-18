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

  const ref = (req.query.ref || req.body?.ref || req.query.booking_ref || req.body?.booking_ref) as string | undefined;
  const email = (req.query.email || req.body?.email) as string | undefined;
  const token = (req.query.token || req.body?.token) as string | undefined;
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
    // Handle POST: cancel or add reason if already cancelled
    if (method === 'POST') {
      const now = new Date().toISOString();
      if (booking.status !== 'cancelled') {
        const { error: updateErr } = await supabase
          .from('appointment_bookings')
          .update({ status: 'cancelled', cancelled_at: now, cancellation_reason: reason || null, updated_at: now })
          .eq('booking_ref', ref)
          .eq('email', email);
        if (updateErr) throw updateErr;
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

    // GET: perform one-click cancel, then render friendly page
    if (booking.status !== 'cancelled') {
      const now = new Date().toISOString();
      const { error: updateErr } = await supabase
        .from('appointment_bookings')
        .update({ status: 'cancelled', cancelled_at: now, cancellation_reason: reason || null, updated_at: now })
        .eq('booking_ref', ref)
        .eq('email', email);
      if (updateErr) throw updateErr;
      if (wantsHTML) {
        const form = `
          <h1>Booking cancelled</h1>
          <div class="ok">Your booking has been cancelled successfully.</div>
          <p><small>Reference: ${ref}</small></p>
          <form method="POST" class="row">
            <input type="hidden" name="ref" value="${ref}" />
            <input type="hidden" name="email" value="${email}" />
            <input type="hidden" name="token" value="${token}" />
            <label for="reason">Tell us why (optional)</label>
            <textarea id="reason" name="reason" rows="3" placeholder="Changed plans, picked another date, etc."></textarea>
            <div class="row"><button class="btn" type="submit">Submit reason</button></div>
          </form>`;
        res.status(200).send(htmlPage('Booking cancelled', form));
      } else {
        res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
      }
      return;
    }

    // Already cancelled on GET
    if (wantsHTML) {
      const form = `
        <h1>Already cancelled</h1>
        <div class="warn">This booking was already cancelled.</div>
        <p><small>Reference: ${ref}</small></p>
        <form method="POST" class="row">
          <input type="hidden" name="ref" value="${ref}" />
          <input type="hidden" name="email" value="${email}" />
          <input type="hidden" name="token" value="${token}" />
          <label for="reason">Add a reason (optional)</label>
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
