// Test Resend API directly
const testResend = async () => {
  const apiKey = 'your-resend-api-key-here'; // Replace with actual key from Supabase secrets
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "SG-JB Dental <onboarding@resend.dev>",
        to: ["lawwaibee@gmail.com"],
        subject: "Test Email from Resend",
        html: "<h1>Test Email</h1><p>This is a test email from Resend API.</p>"
      })
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Full response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

// Don't run automatically - just for reference
console.log('To test Resend API, update the API key above and uncomment the call below');
// testResend();