#!/usr/bin/env node
/**
 * Create a test booking by calling the send-appointment-confirmation endpoint.
 * Usage: node scripts/create_test_booking.cjs <email> [baseUrl]
 */
const crypto = require('crypto');

async function main() {
  const [,, email, baseUrl] = process.argv;
  if (!email) {
    console.error('Usage: node scripts/create_test_booking.cjs <email> [baseUrl]');
    process.exit(1);
  }
  const urlBase = baseUrl || 'https://www.orachope.org';
  const endpoint = `${urlBase}/api/send-appointment-confirmation`;
  // Simple future date
  const preferredDate = new Date(Date.now() + 5*24*60*60*1000).toISOString();
  const payload = {
    patient_name: 'Test Patient',
    email,
    whatsapp: '+6581926158',
    treatment_type: 'Consultation',
    preferred_date: preferredDate,
    time_slot: '09:30',
    clinic_location: 'Johor Bahru',
    consent_given: true,
    create_account: false
  };
  console.log('POST', endpoint);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Raw response:', text);
  let json;
  try { json = JSON.parse(text); } catch {}
  if (json?.booking_ref) {
    const CANCEL_SECRET = process.env.CANCEL_SECRET || 'dev-cancel-secret';
    const token = crypto.createHmac('sha256', CANCEL_SECRET).update(`${json.booking_ref}|${email}`).digest('hex').slice(0,32);
    const cancelLink = `${urlBase}/api/cancel-appointment?ref=${encodeURIComponent(json.booking_ref)}&email=${encodeURIComponent(email)}&token=${token}`;
    console.log('Derived cancel link:', cancelLink);
    console.log('Next: node scripts/test_cancel.cjs', json.booking_ref, email, urlBase);
  } else {
    console.log('No booking_ref found in response (check error above).');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
