import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

type Primitive = string | number | boolean;

const PROD_BACKEND_URL = 'https://sg-jb-chatbot-backend.onrender.com/chat';
const DEV_BACKEND_URL = 'https://sg-jb-chatbot-backend-development.onrender.com/chat';

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

function normalizeName(name?: string): string | undefined {
  if (!name) {
    return undefined;
  }

  const normalized = name.trim().toLowerCase();
  return normalized || undefined;
}

function normalizeExternalId(externalId?: string): string | undefined {
  if (!externalId) {
    return undefined;
  }

  const normalized = externalId.trim();
  return normalized || undefined;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized || undefined;
}

function isSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hashIfNeeded(value: string): string {
  return isSha256(value) ? value.toLowerCase() : sha256(value);
}

function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type, x-environment');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

async function handleChatProxy(req: VercelRequest, res: VercelResponse): Promise<void> {
  const environmentHeader = req.headers['x-environment'];
  const environment = Array.isArray(environmentHeader)
    ? environmentHeader[0]
    : environmentHeader || 'development';
  const backendUrl = environment === 'production' ? PROD_BACKEND_URL : DEV_BACKEND_URL;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body ?? {}),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Dynamic chat proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy chat request' });
  }
}

async function handleMetaCapi(req: VercelRequest, res: VercelResponse): Promise<void> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  console.log('[CAPI] Handler entered. pixelId present:', !!pixelId, '| accessToken present:', !!accessToken);
  if (pixelId) {
    console.log('[CAPI] Pixel ID (first 6 / last 4):', pixelId.slice(0, 6) + '...' + pixelId.slice(-4));
  }

  if (!accessToken || !pixelId) {
    console.error('[CAPI] Aborting: missing META_ACCESS_TOKEN or META_PIXEL_ID env vars');
    res.status(500).json({ error: 'Missing Meta configuration' });
    return;
  }

  const eventName = typeof req.body?.event_name === 'string' ? req.body.event_name : undefined;
  const eventId = typeof req.body?.event_id === 'string' ? req.body.event_id : undefined;
  const eventSourceUrl = typeof req.body?.event_source_url === 'string' ? req.body.event_source_url : undefined;

  // test_event_code: request body → META_TEST_EVENT_CODE env var → META_TEST_CODE env var
  const testEventCode =
    (typeof req.body?.test_event_code === 'string' ? req.body.test_event_code : undefined) ??
    process.env.META_TEST_EVENT_CODE ??
    process.env.META_TEST_CODE ??
    undefined;
  console.log('[CAPI] test_event_code resolved:', testEventCode ?? '(none)',
    '| META_TEST_EVENT_CODE present:', !!process.env.META_TEST_EVENT_CODE,
    '| META_TEST_CODE present:', !!process.env.META_TEST_CODE);

  // event_time: always server-generated — never trust the client
  const eventTime = Math.floor(Date.now() / 1000);
  console.log('[CAPI] event_time:', eventTime);

  const eventData = sanitizeEventData(req.body?.event_data ?? {});

  if (!eventName || !eventId) {
    console.error('[CAPI] Aborting: missing event_name or event_id in request body');
    res.status(400).json({ error: 'event_name and event_id are required' });
    return;
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIpAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim();
  const userAgent = req.headers['user-agent'];

  const incomingUserData =
    req.body?.user_data && typeof req.body.user_data === 'object' && !Array.isArray(req.body.user_data)
      ? (req.body.user_data as Record<string, unknown>)
      : {};

  const rawEmail = normalizeEmail(toStringValue(incomingUserData.em) ?? toStringValue(incomingUserData.email));
  const rawPhone = normalizePhone(toStringValue(incomingUserData.ph) ?? toStringValue(incomingUserData.phone));
  const rawFirstName = normalizeName(toStringValue(incomingUserData.fn) ?? toStringValue(incomingUserData.first_name));
  const rawLastName = normalizeName(toStringValue(incomingUserData.ln) ?? toStringValue(incomingUserData.last_name));
  const rawExternalId = normalizeExternalId(toStringValue(incomingUserData.external_id));
  const fbp = toStringValue(incomingUserData.fbp);
  const fbc = toStringValue(incomingUserData.fbc);

  const userData: Record<string, unknown> = {};

  if (rawEmail) {
    userData.em = [hashIfNeeded(rawEmail)];
  }

  if (rawPhone) {
    userData.ph = [hashIfNeeded(rawPhone)];
  }

  if (rawFirstName) {
    userData.fn = [hashIfNeeded(rawFirstName)];
  }

  if (rawLastName) {
    userData.ln = [hashIfNeeded(rawLastName)];
  }

  if (rawExternalId) {
    userData.external_id = [hashIfNeeded(rawExternalId)];
  }

  if (fbp) {
    userData.fbp = fbp;
  }

  if (fbc) {
    userData.fbc = fbc;
  }

  if (clientIpAddress) {
    userData.client_ip_address = clientIpAddress;
  }

  if (userAgent) {
    userData.client_user_agent = userAgent;
  }

  console.log('[CAPI] user_data keys:', Object.keys(userData));

  // test_event_code at root level per Meta CAPI spec — always included when env var is set
  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId,
        action_source: 'website',
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: eventData,
      },
    ],
    test_event_code: testEventCode,
  };

  console.log('[CAPI] Final Payload:', JSON.stringify(payload, null, 2));

  try {
    const metaResponse = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const metaData = await metaResponse.json();
    console.log('[CAPI] Meta API Response:', JSON.stringify(metaData, null, 2));

    if (!metaResponse.ok) {
      console.error('[CAPI] Meta returned non-2xx status:', metaResponse.status);
      res.status(502).json({ error: 'Meta CAPI request failed', details: metaData });
      return;
    }

    res.status(200).json({ ok: true, meta: metaData });
  } catch (error) {
    console.error('[CAPI] Fetch to Meta failed with exception:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const routeParam = req.query.route;
  const route = Array.isArray(routeParam) ? routeParam[0] : routeParam;

  if (route === 'meta-capi') {
    await handleMetaCapi(req, res);
    return;
  }

  await handleChatProxy(req, res);
}
