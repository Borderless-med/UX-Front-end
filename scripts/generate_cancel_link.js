#!/usr/bin/env node
/**
 * Generate cancellation link for a booking (client-side reproduction of server logic).
 * Usage: node scripts/generate_cancel_link.js <booking_ref> <email> [baseUrl]
 */
const crypto = require('crypto');

const [,, ref, email, baseUrl] = process.argv;
if (!ref || !email) {
  console.error('Usage: node scripts/generate_cancel_link.js <booking_ref> <email> [baseUrl]');
  process.exit(1);
}
const CANCEL_SECRET = process.env.CANCEL_SECRET || 'dev-cancel-secret';
const token = crypto.createHmac('sha256', CANCEL_SECRET).update(`${ref}|${email}`).digest('hex').slice(0,32);
const urlBase = baseUrl || 'https://www.orachope.org';
const link = `${urlBase}/api/cancel-appointment?ref=${encodeURIComponent(ref)}&email=${encodeURIComponent(email)}&token=${token}`;
console.log(link);
