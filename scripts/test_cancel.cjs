#!/usr/bin/env node
const crypto = require('crypto');
// Using Node 18+ global fetch (no dependency required)

async function main() {
  const [,, ref, email, baseUrl, reason] = process.argv;
  if (!ref || !email) {
    console.error('Usage: node scripts/test_cancel.cjs <booking_ref> <email> [baseUrl] [reason]');
    process.exit(1);
  }
  const CANCEL_SECRET = process.env.CANCEL_SECRET || 'dev-cancel-secret';
  const token = crypto.createHmac('sha256', CANCEL_SECRET).update(`${ref}|${email}`).digest('hex').slice(0,32);
  const urlBase = baseUrl || 'https://www.orachope.org';
  const url = `${urlBase}/api/cancel-appointment`;
  console.log('POST ->', url);
  const params = new URLSearchParams({ ref, email, token });
  if (reason) params.set('reason', reason);

  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(params.entries()))
  });
  const text = await res.text();
  console.log('POST status:', res.status);
  console.log('POST response:', text);

  console.log('GET ->', url + '?' + params.toString());
  res = await fetch(url + '?' + params.toString(), { method: 'GET' });
  const text2 = await res.text();
  console.log('GET status:', res.status);
  console.log('GET response:', text2);
}

main().catch(e => { console.error(e); process.exit(1); });
