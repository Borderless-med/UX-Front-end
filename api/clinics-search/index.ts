import type { VercelRequest, VercelResponse } from '@vercel/node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type SearchBody = {
  country?: 'SG' | 'MY' | 'ALL' | 'sg' | 'jb' | 'all';
  minRating?: number;
  limit?: number;
  embedding?: number[]; // Optional: if provided, vector search is used
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL as string;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
    }

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as SearchBody;
    const countryInput = body.country;
    const limit = Math.min(Math.max(body.limit ?? 10, 1), 50);
    const minRating = body.minRating ?? null;
    // Map user-friendly country options
    const country = countryInput === 'ALL' || countryInput === 'all' ? null
      : countryInput === 'sg' ? 'SG'
      : countryInput === 'jb' ? 'MY'
      : countryInput ?? null;

    // If embedding provided: call RPC for vector + filters
    if (Array.isArray(body.embedding) && body.embedding.length > 0) {
      const rpcUrl = `${SUPABASE_URL}/rest/v1/rpc/search_clinics`;
      const rpcPayload: Record<string, any> = {
        query_embedding: body.embedding,
        p_country: country,
        p_min_rating: minRating,
        p_limit: limit
      };
      const rpcResp = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(rpcPayload)
      });

      if (!rpcResp.ok) {
        const text = await rpcResp.text();
        throw new Error(`RPC search_clinics failed: ${rpcResp.status} ${text}`);
      }
      const data = await rpcResp.json();
      res.status(200).json({ data, used: 'vector+filters' });
      return;
    }

    // Fallback: filter-only REST query
    const params: string[] = ['select=*'];
    if (country) params.push(`country=eq.${encodeURIComponent(country)}`);
    if (minRating !== null) params.push(`rating=gte.${encodeURIComponent(String(minRating))}`);
    params.push('order=distance.asc');
    params.push(`limit=${limit}`);

    const url = `${SUPABASE_URL}/rest/v1/clinics_data?${params.join('&')}`;
    const resp = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`REST clinics_data failed: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    res.status(200).json({ data, used: 'filters-only' });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Unknown error' });
  }
}
