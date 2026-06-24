import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

type Primitive = string | number | boolean;

const FORBIDDEN_PARAM_PATTERNS = [
  'health',
  'medical',
  'dental',
  'diagnosis',
  'symptom',
  'condition',
  'treatment',
  'notes',
  'inquiry_message',
];

function shouldDropParam(key: string): boolean {
  const normalized = key.toLowerCase();
  return FORBIDDEN_PARAM_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function sanitizeEventData(input: Record<string, unknown> = {}): Record<string, Primitive> {
  const safeData: Record<string, Primitive> = {};

  Object.entries(input).forEach(([key, value]) => {
    if (value === null || value === undefined || shouldDropParam(key)) {
      return;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      safeData[key] = value;
    }
  });

  return safeData;
}

function normalizeEmail(email?: string): string | undefined {
  if (!email) {
    return undefined;
  }

  const normalized = email.trim().toLowerCase();
  return normalized || undefined;
}

function normalizePhone(phone?: string): string | undefined {
  if (!phone) {
    return undefined;
  }

  const normalized = phone.replace(/\D/g, '');
  return normalized || undefined;
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.VITE_META_PIXEL_ID || process.env.META_PIXEL_ID;

  if (!accessToken || !pixelId) {
    res.status(500).json({ error: 'Missing Meta configuration' });
    return;
  }

  const eventName = typeof req.body?.event_name === 'string' ? req.body.event_name : undefined;
  const eventId = typeof req.body?.event_id === 'string' ? req.body.event_id : undefined;
  const eventSourceUrl = typeof req.body?.event_source_url === 'string' ? req.body.event_source_url : undefined;
  const eventData = sanitizeEventData(req.body?.event_data ?? {});

  const rawEmail = normalizeEmail(req.body?.user_data?.email);
  const rawPhone = normalizePhone(req.body?.user_data?.phone);

  if (!eventName || !eventId) {
    res.status(400).json({ error: 'event_name and event_id are required' });
    return;
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIpAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim();
  const userAgent = req.headers['user-agent'];

  const userData: Record<string, unknown> = {};

  if (rawEmail) {
    userData.em = [sha256(rawEmail)];
  }

  if (rawPhone) {
    userData.ph = [sha256(rawPhone)];
  }

  if (clientIpAddress) {
    userData.client_ip_address = clientIpAddress;
  }

  if (userAgent) {
    userData.client_user_agent = userAgent;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: eventData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI error:', data);
      res.status(502).json({ error: 'Meta CAPI request failed', details: data });
      return;
    }

    res.status(200).json({ ok: true, meta: data });
  } catch (error) {
    console.error('Meta CAPI handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
