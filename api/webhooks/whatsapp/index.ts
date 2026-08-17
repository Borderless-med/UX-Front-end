import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * META WHATSAPP WEBHOOK ENDPOINT
 * 
 * Purpose: Enable Meta's "Live Handshake" to unlock Authentication template category
 * 
 * This endpoint handles:
 * 1. GET - Webhook verification (Meta's handshake during setup)
 * 2. POST - Incoming webhook events (message status, template status, etc.)
 * 
 * Meta Documentation:
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // ========================================
  // GET REQUEST - WEBHOOK VERIFICATION
  // ========================================
  if (req.method === 'GET') {
    return handleWebhookVerification(req, res);
  }

  // ========================================
  // POST REQUEST - WEBHOOK EVENTS
  // ========================================
  if (req.method === 'POST') {
    return handleWebhookEvent(req, res);
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

/**
 * WEBHOOK VERIFICATION (GET REQUEST)
 * 
 * When you configure the webhook in Meta Business Manager, Meta sends:
 * - hub.mode=subscribe
 * - hub.challenge=<random_string>
 * - hub.verify_token=<your_verify_token>
 * 
 * You must:
 * 1. Verify the token matches your WHATSAPP_VERIFY_TOKEN
 * 2. Return the hub.challenge value (plain text, not JSON)
 */
function handleWebhookVerification(req: VercelRequest, res: VercelResponse) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  console.log('📞 Webhook verification request received:', {
    mode,
    tokenProvided: !!token,
    challengeProvided: !!challenge,
    verifyTokenConfigured: !!VERIFY_TOKEN
  });

  // Check if verify token is configured
  if (!VERIFY_TOKEN) {
    console.error('❌ WHATSAPP_VERIFY_TOKEN not configured in environment variables');
    return res.status(500).send('Server configuration error: WHATSAPP_VERIFY_TOKEN not set');
  }

  // Verify the request
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verification successful - returning challenge');
    // IMPORTANT: Return challenge as plain text, not JSON
    return res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed:', {
      modeMatch: mode === 'subscribe',
      tokenMatch: token === VERIFY_TOKEN
    });
    return res.status(403).send('Forbidden: Invalid verification token');
  }
}

/**
 * WEBHOOK EVENT HANDLER (POST REQUEST)
 * 
 * Meta sends webhook events for:
 * - Message status updates (sent, delivered, read, failed)
 * - Template status updates (approved, rejected)
 * - Account updates
 * - etc.
 * 
 * Event format:
 * {
 *   "object": "whatsapp_business_account",
 *   "entry": [{
 *     "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
 *     "changes": [{
 *       "value": {
 *         "messaging_product": "whatsapp",
 *         "metadata": { "display_phone_number": "...", "phone_number_id": "..." },
 *         "statuses": [...] // Message status updates
 *       },
 *       "field": "messages"
 *     }]
 *   }]
 * }
 */
async function handleWebhookEvent(req: VercelRequest, res: VercelResponse) {
  try {
    const body = req.body;

    console.log('📨 Webhook event received:', {
      object: body?.object,
      entryCount: body?.entry?.length || 0,
      timestamp: new Date().toISOString()
    });

    // Log full payload for debugging (first 1000 chars to avoid log spam)
    console.log('Webhook payload:', JSON.stringify(body, null, 2).slice(0, 1000));

    // Verify this is a WhatsApp Business webhook
    if (body?.object !== 'whatsapp_business_account') {
      console.warn('⚠️ Received non-WhatsApp webhook:', body?.object);
      return res.status(400).json({ error: 'Invalid webhook object type' });
    }

    // Process each entry
    if (body.entry && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        const changes = entry.changes || [];
        
        for (const change of changes) {
          await processWebhookChange(change);
        }
      }
    }

    // Always return 200 OK to acknowledge receipt
    // If you don't return 200, Meta will retry the webhook
    return res.status(200).json({ success: true, received: true });

  } catch (error) {
    console.error('❌ Error processing webhook event:', error);
    
    // Still return 200 to prevent Meta from retrying
    // Log the error for investigation instead
    return res.status(200).json({ 
      success: false, 
      error: 'Internal error logged',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * PROCESS INDIVIDUAL WEBHOOK CHANGE
 * 
 * Extracts and logs useful information from webhook events
 */
async function processWebhookChange(change: any) {
  const field = change.field;
  const value = change.value;

  console.log(`📬 Processing change - Field: ${field}`);

  // Handle message status updates
  if (value.statuses && Array.isArray(value.statuses)) {
    for (const status of value.statuses) {
      console.log('📊 Message Status Update:', {
        messageId: status.id,
        status: status.status, // sent, delivered, read, failed
        timestamp: status.timestamp,
        recipientId: status.recipient_id,
        conversationId: status.conversation?.id,
        errorCode: status.errors?.[0]?.code,
        errorTitle: status.errors?.[0]?.title
      });

      // TODO: Update booking_otp_verification or appointments table with delivery status
      // Example: Mark OTP as delivered/failed based on status.id
    }
  }

  // Handle incoming messages (if you enable two-way messaging later)
  if (value.messages && Array.isArray(value.messages)) {
    for (const message of value.messages) {
      console.log('💬 Incoming Message:', {
        from: message.from,
        messageId: message.id,
        timestamp: message.timestamp,
        type: message.type,
        text: message.text?.body
      });

      // TODO: Handle incoming messages (e.g., replies to appointment confirmations)
    }
  }

  // Handle template status updates (approval/rejection)
  if (field === 'message_template_status_update') {
    console.log('📝 Template Status Update:', {
      templateName: value.message_template_name,
      templateId: value.message_template_id,
      event: value.event, // APPROVED, REJECTED, PAUSED, etc.
      reason: value.reason,
      language: value.message_template_language
    });

    // TODO: Update your template status tracking if needed
  }

  // Handle account updates
  if (field === 'account_update') {
    console.log('🔔 Account Update:', value);
  }
}
