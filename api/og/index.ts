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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            padding: '60px',
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: '#2563eb',
              textAlign: 'center',
            }}
          >
            {subtitle}
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
