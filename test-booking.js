
// Test script to call the booking function
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
    const response = await fetch('https://uzppuebjzqxeavgmwtvr.supabase.co/functions/v1/send-appointment-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cHB1ZWJqenF4ZWF2Z213dHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDMxNTQsImV4cCI6MjA2NTk3OTE1NH0.kxPUYZ1LO1kcGiOy7Vtf2MwAfdi_dv4lzJQMdHGnmbA'
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