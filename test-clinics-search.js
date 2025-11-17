// Minimal smoke test for /api/clinics-search (filters-only path)
// Run this in a browser (via Vite dev) or Node with fetch polyfill. Assumes /api is available.

async function run() {
  try {
    const resp = await fetch('/api/clinics-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'SG', minRating: 4, limit: 5 })
    });
    console.log('Status:', resp.status);
    const json = await resp.json();
    console.log('Result:', json);
  } catch (e) {
    console.error('Smoke test failed:', e);
  }
}

run();
