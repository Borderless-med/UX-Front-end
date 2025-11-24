#!/usr/bin/env node
/**
 * Test cancellation endpoint end-to-end assuming booking exists.
 * Usage: node scripts/test_cancel.js <booking_ref> <email> [baseUrl] [reason]
 */
const crypto = require('crypto');
const fetch = require('node-fetch');

async function main() {
  const [,, ref, email, baseUrl, reason] = process.argv;
  if (!ref || !email) {
    console.error('Usage: node scripts/test_cancel.js <booking_ref> <email> [baseUrl] [reason]');
    process.exit(1);
  }
  const CANCEL_SECRET = process.env.CANCEL_SECRET || 'dev-cancel-secret';
  const token = crypto.createHmac('sha256', CANCEL_SECRET).update(`${ref}|${email}`).digest('hex').slice(0,32);
  const urlBase = baseUrl || 'https://www.orachope.org';
  const url = `${urlBase}/api/cancel-appointment`;
  console.log('Calling:', url);
  const params = new URLSearchParams({ ref, email, token });
  if (reason) params.set('reason', reason);

  // Prefer POST (safer for long reason text)
  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(params.entries()))
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);

  // Re-run to verify idempotency
  res = await fetch(url + `?` + params.toString(), { method: 'GET' });
  const text2 = await res.text();
  console.log('Idempotency check status:', res.status);
  console.log('Idempotency response:', text2);
}

main().catch(e => { console.error(e); process.exit(1); });
