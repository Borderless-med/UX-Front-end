import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ref = typeof req.query.ref === 'string' ? req.query.ref : '';
  const slot = typeof req.query.slot === 'string' ? req.query.slot : '';
  const token = typeof req.query.token === 'string' ? req.query.token : '';

  if (!ref || !slot || !token) {
    return res.status(400).send(`
      <html>
        <head><title>Missing Parameters</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: #dc2626;">Invalid Link</h1>
          <p>This acceptance link is missing required booking details.</p>
        </body>
      </html>
    `);
  }

  const redirectUrl = `/api/patient/booking-response?action=accept&ref=${encodeURIComponent(ref)}&slot=${encodeURIComponent(slot)}&token=${encodeURIComponent(token)}`;
  return res.redirect(302, redirectUrl);
}
