import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'OraChope.org';
  const subtitle =
    searchParams.get('subtitle') ||
    'World-Class Dental Care · Smart Savings · AI Concierge';

  return new ImageResponse(
    (
      <div
        style={{
          height: '630px',
          width: '1200px',
          display: 'flex',
          background: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Square-safe center tile so WhatsApp mobile crop shows full mark */}
        <div
          style={{
            height: 560,
            width: 560,
            borderRadius: 32,
            border: '1px solid #e5e7eb',
            boxShadow:
              '0 10px 25px rgba(2, 6, 23, 0.08), inset 0 0 0 8px rgba(37, 99, 235, 0.06)',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: 520,
              padding: 24,
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: -1,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 520,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: '#2563eb',
                lineHeight: 1.25,
                maxWidth: 520,
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
