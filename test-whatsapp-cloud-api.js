/**
 * WhatsApp Cloud API Test Script
 * 
 * Tests sending booking_confirmation template message
 * to +65 8222 9202
 * 
 * Run: node test-whatsapp-cloud-api.js
 */

// Your WhatsApp Cloud API credentials
const WHATSAPP_TOKEN = 'EAAWyzt38hNUBQ0Yu7LbMBZCljWkgr2QTWlwIuRR8qdkGUwgvoXdpJCcGtbhgG9UddZAoZA4P69VAcMZCalWuxeeCNW4ZBFZCqi8lgcOYOc7KR8rZBFqkllU0lNPHxCXfCAL0jFIcPjCoGjg3eGqLzyNekgw6y6ZADiaZBdsvy2YNltiXdq0Cb94atTEVIcA4IFQZDZD';
const PHONE_NUMBER_ID = '987884714412226';
// Test recipient - verified and added in Meta Business Manager with green checkmark ✓
const RECIPIENT = '6582229202'; // +65 8222 9202 (your personal number)

// Test data for template variables
const testData = {
  name: 'John',
  date: 'April 15',
  bookingId: 'OR-9982'
};

async function sendWhatsAppMessage() {
  console.log('📱 Testing WhatsApp Cloud API...\n');
  console.log('Configuration:');
  console.log(`- Phone Number ID: ${PHONE_NUMBER_ID}`);
  console.log(`- Recipient: +${RECIPIENT}`);
  console.log(`- Template: booking_confirmation`);
  console.log(`- Variables: ${testData.name}, ${testData.date}, ${testData.bookingId}\n`);

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: RECIPIENT,
    type: 'template',
    template: {
      name: 'booking_confirmation',
      language: {
        code: 'en' // English
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: testData.name // {{1}} - John
            },
            {
              type: 'text',
              text: testData.date // {{2}} - April 15
            },
            {
              type: 'text',
              text: testData.bookingId // {{3}} - OR-9982
            }
          ]
        }
      ]
    }
  };

  try {
    console.log('🚀 Sending message...\n');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! Message sent!\n');
      console.log('Response:');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n📱 Check your phone (+65 8222 9202) for the WhatsApp message!');
      console.log('\nExpected message:');
      console.log(`"Hi John, Your booking for Orachope.org is confirmed! We look forward to seeing you on April 15. Your booking ID is OR-9982."`);
    } else {
      console.log('❌ FAILED! Error response:\n');
      console.log(JSON.stringify(data, null, 2));
      
      // Common error explanations
      if (data.error?.code === 100) {
        console.log('\n💡 Error 100: Invalid parameter. Check:');
        console.log('   - Template name spelling: "booking_confirmation"');
        console.log('   - Number of variables (should be 3)');
        console.log('   - Phone number format (no + or -)');
      } else if (data.error?.code === 190) {
        console.log('\n💡 Error 190: Invalid token. Check:');
        console.log('   - Token is correct (not expired)');
        console.log('   - Token has proper permissions');
      } else if (data.error?.message?.includes('template')) {
        console.log('\n💡 Template error. Check:');
        console.log('   - Template status is "Active" in Meta Business Manager');
        console.log('   - Template name matches exactly: "booking_confirmation"');
      }
    }

  } catch (error) {
    console.log('❌ ERROR: Failed to send message\n');
    console.error(error);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check internet connection');
    console.log('   - Verify token is correct');
    console.log('   - Ensure Node.js version supports fetch (v18+)');
  }
}

// Run the test
sendWhatsAppMessage();
