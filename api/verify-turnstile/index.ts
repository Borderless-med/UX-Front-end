// api/verify-turnstile/index.ts
// Vercel serverless function to verify Cloudflare Turnstile tokens server-side

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface TurnstileVerifyRequest {
  token: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body as TurnstileVerifyRequest;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
    if (!TURNSTILE_SECRET) {
      console.error('TURNSTILE_SECRET_KEY not configured');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    // Get client IP for additional verification
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const ip = Array.isArray(clientIP) ? clientIP[0] : clientIP;

    // Verify token with Cloudflare Turnstile API
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });

    if (!verifyResponse.ok) {
      console.error('Turnstile API error:', verifyResponse.statusText);
      return res.status(500).json({ success: false, error: 'Verification service error' });
    }

    const verifyData: TurnstileVerifyResponse = await verifyResponse.json();

    if (verifyData.success) {
      console.log(`✅ Turnstile verification succeeded for IP: ${ip}`);
      return res.status(200).json({ success: true });
    } else {
      console.warn(`❌ Turnstile verification failed for IP: ${ip}`, verifyData['error-codes']);
      return res.status(403).json({ 
        success: false, 
        error: 'Verification failed',
        errorCodes: verifyData['error-codes'] 
      });
    }
  } catch (error: any) {
    console.error('Error verifying Turnstile token:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
