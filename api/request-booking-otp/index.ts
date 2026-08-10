import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  ACTIVE_OTP_TEMPLATE, 
  buildWhatsAppTemplateRequest,
  formatWhatsAppNumber 
} from '../../lib/whatsapp-templates.config';

// ========================================
// OTP Configuration
// ========================================
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_REQUESTS_PER_HOUR = 3;

// WhatsApp OTP Configuration
// Uses hardcoded "123456" until Meta approves Authentication Template
const WHATSAPP_OTP_CODE = '123456';

// In-memory rate limiting for OTP requests (applies to both email and phone)
const otpRateLimitStore = new Map<string, { count: number; firstRequest: number }>();

function checkOTPRateLimit(identifier: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = otpRateLimitStore.get(identifier);

  if (!record) {
    otpRateLimitStore.set(identifier, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  const HOUR_MS = 60 * 60 * 1000;
  if (now - record.firstRequest > HOUR_MS) {
    otpRateLimitStore.set(identifier, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  if (record.count >= MAX_OTP_REQUESTS_PER_HOUR) {
    return { 
      allowed: false, 
      message: `Too many verification requests. Maximum ${MAX_OTP_REQUESTS_PER_HOUR} requests per hour allowed.` 
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

// ========================================
// Email OTP Delivery
// ========================================
async function sendEmailOTP(email: string, otpCode: string, patientName: string): Promise<boolean> {
  console.log(`📧 === sendEmailOTP called ===`);
  console.log(`   Email: ${email}`);
  console.log(`   OTP Code: ${otpCode}`);
  console.log(`   Patient: ${patientName}`);
  
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  console.log(`   RESEND_API_KEY configured: ${!!RESEND_API_KEY}`);
  
  if (!RESEND_API_KEY) {
    console.log('⚠️ Email service disabled (no API key) - OTP would be:', otpCode);
    return true; // For development
  }

  try {
    const firstName = patientName.split(' ')[0];
    
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">OraChope.org</h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Your Dental Care Partner</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hi ${firstName},</h2>
    
    <p style="font-size: 16px; color: #4b5563;">Your verification code for OraChope.org is:</p>
    
    <div style="background: #f3f4f6; border: 2px dashed #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
      <p style="font-size: 32px; font-weight: bold; color: #3B82F6; letter-spacing: 8px; margin: 0;">${otpCode}</p>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
      ⏱️ This code expires in <strong>5 minutes</strong>
    </p>
    
    <p style="font-size: 14px; color: #6b7280;">
      If you didn't request this code, please ignore this email.
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        © 2026 OraChope | Making dental care accessible across borders
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'OraChope <noreply@orachope.org>',
        to: [email],
        subject: 'Your OraChope Verification Code',
        html: emailHTML,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Email API Error:', errorData);
      return false;
    }

    console.log(`✅ Email OTP sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email OTP error:', error);
    return false;
  }
}

// ========================================
// WhatsApp OTP Delivery (Piggyback Method)
// ========================================
async function sendWhatsAppOTP(whatsapp: string, patientName: string): Promise<boolean> {
  console.log(`📱 === sendWhatsAppOTP called ===`);
  console.log(`   WhatsApp: ${whatsapp}`);
  console.log(`   Patient: ${patientName}`);
  console.log(`   OTP Code (hardcoded): ${WHATSAPP_OTP_CODE}`);
  
  const WHATSAPP_ENABLED = process.env.WHATSAPP_ENABLED === 'true';
  const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  console.log(`   WHATSAPP_ENABLED: ${WHATSAPP_ENABLED}`);
  console.log(`   WHATSAPP_TOKEN configured: ${!!WHATSAPP_TOKEN}`);
  console.log(`   WHATSAPP_PHONE_ID configured: ${!!WHATSAPP_PHONE_ID}`);

  if (!WHATSAPP_ENABLED || !WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log('⚠️ WhatsApp disabled (missing config) - OTP would be: 123456');
    return true; // For development
  }

  try {
    const formattedNumber = formatWhatsAppNumber(whatsapp);
    
    // Build request using template config (piggyback method)
    const variables = ACTIVE_OTP_TEMPLATE.mapToVariables(WHATSAPP_OTP_CODE, patientName);
    const requestBody = buildWhatsAppTemplateRequest(whatsapp, ACTIVE_OTP_TEMPLATE, variables);
    
    console.log('📤 Sending WhatsApp OTP (Piggyback):', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ WhatsApp API Error:', JSON.stringify(errorData, null, 2));
      return false;
    }

    const responseData = await response.json();
    console.log(`✅ WhatsApp OTP sent to: ${whatsapp}`, JSON.stringify(responseData, null, 2));
    return true;
  } catch (error) {
    console.error('❌ WhatsApp OTP error:', error);
    return false;
  }
}

interface OTPRequest {
  communication_preference: 'both' | 'email_only';
  whatsapp?: string;
  email: string;
  patient_name: string;
  turnstile_token?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  console.log('🚀 === OTP Request Received ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    console.log('✅ OPTIONS request - returning 200');
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    console.log('📝 Processing POST request...');
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const requestData: OTPRequest = req.body;
    console.log('📦 Request data:', {
      email: requestData.email,
      patient_name: requestData.patient_name,
      communication_preference: requestData.communication_preference,
      has_whatsapp: !!requestData.whatsapp,
      has_turnstile: !!requestData.turnstile_token
    });
    
    // Validate required fields
    if (!requestData.email || !requestData.patient_name || !requestData.communication_preference) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields: email, patient_name, communication_preference',
        code: 'INVALID_REQUEST'
      });
    }

    // Validate WhatsApp if user chose 'both'
    if (requestData.communication_preference === 'both' && !requestData.whatsapp) {
      console.log('❌ Validation failed - missing WhatsApp for "both" preference');
      return res.status(400).json({ 
        error: 'WhatsApp number required when communication_preference is "both"',
        code: 'INVALID_REQUEST'
      });
    }

    console.log('✅ Validation passed');

    // Determine identifier for rate limiting (use email for email_only, whatsapp for both)
    const identifier = requestData.communication_preference === 'both' 
      ? requestData.whatsapp! 
      : requestData.email;

    // Rate limiting check
    const rateLimitCheck = checkOTPRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      console.warn(`⚠️ OTP rate limit exceeded for: ${identifier}`);
      return res.status(429).json({ 
        error: rateLimitCheck.message,
        code: 'OTP_RATE_LIMIT_EXCEEDED'
      });
    }

    // Generate OTP based on communication preference
    const otpCode = requestData.communication_preference === 'both' 
      ? WHATSAPP_OTP_CODE  // Use hardcoded "123456" for WhatsApp
      : generateOTP();      // Use random code for email
    
    const bookingHash = generateBookingHash();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    
    const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
                     (req.headers['x-real-ip'] as string) || 
                     'unknown';

    console.log(`🔐 Generating OTP for ${identifier} - Preference: ${requestData.communication_preference} - Hash: ${bookingHash}`);

    // Store OTP in new otp_verifications table
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .insert({
        identifier: identifier,
        code: otpCode,
        booking_hash: bookingHash,
        expires_at: expiresAt.toISOString(),
      });

    if (dbError) {
      console.error('❌ Failed to store OTP:', dbError);
      return res.status(500).json({ 
        error: 'Failed to generate verification code. Please try again.',
        code: 'OTP_STORAGE_FAILED'
      });
    }

    // Send OTP based on preference
    let otpSent = false;
    let deliveryMethod = '';

    if (requestData.communication_preference === 'both') {
      // Send via WhatsApp
      console.log(`📱 Attempting to send WhatsApp OTP to: ${requestData.whatsapp}`);
      otpSent = await sendWhatsAppOTP(requestData.whatsapp!, requestData.patient_name);
      deliveryMethod = 'WhatsApp';
      console.log(`📱 WhatsApp send result: ${otpSent ? 'SUCCESS' : 'FAILED'}`);
      
      if (!otpSent) {
        console.log('🧹 Cleaning up failed OTP record...');
        // Clean up database if send failed
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('booking_hash', bookingHash);
        
        return res.status(500).json({ 
          error: 'We had trouble reaching your WhatsApp. Try Email?',
          code: 'WHATSAPP_SEND_FAILED',
          suggestion: 'Switch to Email verification'
        });
      }
    } else {
      // Send via Email
      console.log(`📧 Attempting to send Email OTP to: ${requestData.email}`);
      otpSent = await sendEmailOTP(requestData.email, otpCode, requestData.patient_name);
      deliveryMethod = 'Email';
      console.log(`📧 Email send result: ${otpSent ? 'SUCCESS' : 'FAILED'}`);
      
      if (!otpSent) {
        console.log('🧹 Cleaning up failed OTP record...');
        // Clean up database if send failed
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('booking_hash', bookingHash);
        
        return res.status(500).json({ 
          error: 'Failed to send verification code. Please try again.',
          code: 'EMAIL_SEND_FAILED'
        });
      }
    }

    console.log(`✅ OTP sent successfully via ${deliveryMethod} - expires in ${OTP_EXPIRY_MINUTES} minutes`);

    return res.status(200).json({
      success: true,
      booking_hash: bookingHash,
      communication_preference: requestData.communication_preference,
      expires_in: OTP_EXPIRY_MINUTES * 60, // seconds
      message: `Verification code sent via ${deliveryMethod}`
    });

  } catch (error) {
    console.error('❌ OTP request error:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
}
