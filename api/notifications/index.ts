import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import handlers from lib/ (NOT serverless functions, just modules)
import appointmentHandler from '../../lib/notifications/appointment-handler';
import inquiryHandler from '../../lib/notifications/inquiry-handler';
import partnerHandler from '../../lib/notifications/partner-handler';

/**
 * UNIFIED NOTIFICATIONS ENDPOINT
 * Consolidates 3 notification endpoints into 1 to stay under Vercel Hobby 12-function limit
 * 
 * OLD ENDPOINTS (now deprecated):
 * - /api/send-appointment-confirmation
 * - /api/send-inquiry-notification  
 * - /api/send-partner-confirmation
 * 
 * NEW USAGE:
 * - POST /api/notifications with { type: 'appointment', ...appointmentData }
 * - POST /api/notifications with { type: 'inquiry', ...inquiryData }
 * - POST /api/notifications with { type: 'partner', ...partnerData }
 * 
 * For backward compatibility, the endpoint also accepts requests without 'type' field
 * and tries to detect the type based on the data structure.
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type, x-environment");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    let { type, ...data } = req.body;

    // Auto-detect type for backward compatibility
    if (!type) {
      if (data.booking_hash || data.otp_code || data.turnstile_token) {
        type = 'appointment';
      } else if (data.inquiry_id || data.inquiry_message) {
        type = 'inquiry';
      } else if (data.clinicLicense || data.mdcRegistrationNumber) {
        type = 'partner';
      } else {
        return res.status(400).json({ 
          error: 'Cannot determine notification type. Please include "type" field: appointment, inquiry, or partner',
          code: 'MISSING_TYPE'
        });
      }
    }

    // Route to appropriate handler
    switch (type) {
      case 'appointment':
        // Merge data back into req.body for handler compatibility
        req.body = { ...data, type };
        return await appointmentHandler(req, res);
      
      case 'inquiry':
        req.body = { ...data, type };
        return await inquiryHandler(req, res);
      
      case 'partner':
        req.body = { ...data, type };
        return await partnerHandler(req, res);
      
      default:
        return res.status(400).json({ 
          error: `Invalid notification type: ${type}. Must be: appointment, inquiry, or partner`,
          code: 'INVALID_TYPE'
        });
    }
  } catch (error) {
    console.error('Notifications endpoint error:', error);
    return res.status(500).json({ 
      error: error?.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
}
