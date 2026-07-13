import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ========================================
// OTP Configuration
// ========================================
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_REQUESTS_PER_HOUR = 3;

// In-memory rate limiting for OTP requests
const otpRateLimitStore = new Map<string, { count: number; firstRequest: number }>();

function checkOTPRateLimit(whatsapp: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = otpRateLimitStore.get(whatsapp);

  if (!record) {
    otpRateLimitStore.set(whatsapp, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  const HOUR_MS = 60 * 60 * 1000;
  if (now - record.firstRequest > HOUR_MS) {
    otpRateLimitStore.set(whatsapp, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  if (record.count >= MAX_OTP_REQUESTS_PER_HOUR) {
    return { 
      allowed: false, 
      message: `Too many OTP requests. Maximum ${MAX_OTP_REQUESTS_PER_HOUR} requests per hour allowed.` 
    };
  }

  record.count++;
  return { allowed: true };
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateBookingHash(): string {
  return crypto.randomBytes(16).toString('hex');
}

async function sendWhatsAppOTP(whatsapp: string, otpCode: string): Promise<boolean> {
  const WHATSAPP_ENABLED = process.env.WHATSAPP_ENABLED === 'true';
  const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_ENABLED || !WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log('📱 WhatsApp disabled - OTP would be:', otpCode);
    return true; // For development/testing
  }

  try {
    const formattedNumber = whatsapp.startsWith('+') ? whatsapp.substring(1) : whatsapp;
    
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedNumber,
          type: 'template',
          template: {
            name: 'otp_verification',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: otpCode }
                ]
              }
            ]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ WhatsApp OTP send failed:', errorData);
      return false;
    }

    console.log(`✅ OTP sent to WhatsApp: ${whatsapp}`);
    return true;
  } catch (error) {
    console.error('❌ WhatsApp OTP error:', error);
    return false;
  }
}

interface OTPRequest {
  whatsapp: string;
  patient_name: string;
  turnstile_token?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
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
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const requestData: OTPRequest = req.body;
    
    if (!requestData.whatsapp || !requestData.patient_name) {
      return res.status(400).json({ 
        error: 'Missing required fields: whatsapp and patient_name',
        code: 'INVALID_REQUEST'
      });
    }

    // Rate limiting per WhatsApp number
    const rateLimitCheck = checkOTPRateLimit(requestData.whatsapp);
    if (!rateLimitCheck.allowed) {
      console.warn(`⚠️ OTP rate limit exceeded for: ${requestData.whatsapp}`);
      return res.status(429).json({ 
        error: rateLimitCheck.message,
        code: 'OTP_RATE_LIMIT_EXCEEDED'
      });
    }

    // Generate OTP and booking hash
    const otpCode = generateOTP();
    const bookingHash = generateBookingHash();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    
    const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
                     (req.headers['x-real-ip'] as string) || 
                     'unknown';

    console.log(`🔐 Generating OTP for ${requestData.whatsapp} - Hash: ${bookingHash}`);

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('booking_otp_verification')
      .insert({
        whatsapp: requestData.whatsapp,
        otp_code: otpCode,
        booking_hash: bookingHash,
        expires_at: expiresAt.toISOString(),
        ip_address: clientIP,
      });

    if (dbError) {
      console.error('❌ Failed to store OTP:', dbError);
      return res.status(500).json({ 
        error: 'Failed to generate verification code. Please try again.',
        code: 'OTP_STORAGE_FAILED'
      });
    }

    // Send OTP via WhatsApp
    const otpSent = await sendWhatsAppOTP(requestData.whatsapp, otpCode);
    
    if (!otpSent) {
      // Clean up database entry if WhatsApp send failed
      await supabase
        .from('booking_otp_verification')
        .delete()
        .eq('booking_hash', bookingHash);
      
      return res.status(500).json({ 
        error: 'Failed to send verification code. Please check your WhatsApp number.',
        code: 'OTP_SEND_FAILED'
      });
    }

    console.log(`✅ OTP sent successfully - expires in ${OTP_EXPIRY_MINUTES} minutes`);

    return res.status(200).json({
      success: true,
      booking_hash: bookingHash,
      expires_in: OTP_EXPIRY_MINUTES * 60, // seconds
      message: `Verification code sent to ${requestData.whatsapp}`
    });

  } catch (error) {
    console.error('❌ OTP request error:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
}
