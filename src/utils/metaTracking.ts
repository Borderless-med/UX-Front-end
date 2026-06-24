type Primitive = string | number | boolean;

type EventPayload = Record<string, Primitive | null | undefined>;

interface MetaUserData {
  email?: string;
  phone?: string;
}

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let pixelInitialized = false;

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

function sanitizePayload(payload: EventPayload): Record<string, Primitive> {
  const cleaned: Record<string, Primitive> = {};

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (shouldDropParam(key)) {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function initMetaPixel(): void {
  if (pixelInitialized || !META_PIXEL_ID || typeof window === 'undefined') {
    return;
  }

  /* eslint-disable */
  !(function (f: any, b, e, v, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq?.('init', META_PIXEL_ID);
  pixelInitialized = true;
}

export function trackMetaEvent(
  eventName: string,
  eventData: EventPayload = {},
  userData?: MetaUserData,
  providedEventId?: string,
): string {
  const eventId = providedEventId || generateEventId();
  const safeEventData = sanitizePayload(eventData);

  initMetaPixel();

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, safeEventData, { eventID: eventId });
  }

  if (typeof window !== 'undefined') {
    void fetch('/api/dynamic-function?route=meta-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_data: safeEventData,
        user_data: userData,
        event_source_url: window.location.href,
      }),
    }).catch((error) => {
      console.error('Meta CAPI call failed:', error);
    });
  }

  return eventId;
}

export function trackPageView(): string {
  return trackMetaEvent('PageView');
}
