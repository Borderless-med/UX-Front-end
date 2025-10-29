// Test script to call the booking function

// --- MODIFICATION: This function now reads the URL and Key from a secure source ---
// It is no longer hard-coded.
const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is not defined in environment variables.");
  }

  return { supabaseUrl, supabaseAnonKey };
};

const testBooking = async () => {
  const bookingData = {
    patient_name: "Test User",
    email: "lawwaibee@gmail.com",
    whatsapp: "+6591234567",
    treatment_type: "Dental Cleaning",
    preferred_date: "2025-01-25",
    time_slot: "Morning",
    clinic_location: "Johor Bahru",
    consent_given: true,
    create_account: true
  };

  try {
    const { supabaseAnonKey } = getSupabaseConfig();

    // --- MODIFICATION: This is the primary fix. ---
    // The URL is now pointing to your new, secure Vercel endpoint.
    // The "Emergency Rollback URL" is saved in a comment for safety.

    // Emergency Rollback URL: 'https://uzppuebjzqxeavgmwtvr.supabase.co/functions/v1/send-appointment-confirmation'
    const apiUrl = '/api/send-appointment-confirmation';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // --- MODIFICATION: The keys are now read securely ---
        // They are no longer hard-coded into this file.
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(bookingData)
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Full response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testBooking();