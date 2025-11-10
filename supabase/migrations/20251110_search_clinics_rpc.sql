-- Ensure pgvector is available
create extension if not exists vector;

-- Optional: vector index for faster ANN search (assumes column exists)
create index if not exists clinics_embedding_ivfflat_idx
on public.clinics_data using ivfflat (embedding vector_l2_ops);

-- Helpful btree indexes for common filters
create index if not exists clinics_rating_idx on public.clinics_data (rating);
create index if not exists clinics_township_idx on public.clinics_data (township);
create index if not exists clinics_license_idx on public.clinics_data (mda_license);
create index if not exists clinics_country_idx on public.clinics_data (country);

-- RPC: vector + filters search. Accepts an array for PostgREST compatibility, cast to vector inside.
create or replace function public.search_clinics(
  query_embedding double precision[],
  p_country text default null,
  p_min_rating numeric default null,
  p_limit int default 10
)
returns table (
  id int,
  name text,
  address text,
  dentist text,
  rating numeric,
  reviews int,
  distance numeric,
  sentiment numeric,
  mda_license text,
  credentials text,
  country text,
  township text,
  website_url text,
  google_review_url text,
  operating_hours text,
  similarity real
)
language sql stable as $$
  select
    c.id,
    c.name,
    c.address,
    c.dentist,
    c.rating,
    c.reviews,
    c.distance,
    c.sentiment,
    c.mda_license,
    c.credentials,
    c.country,
    c.township,
    c.website_url,
    c.google_review_url,
    c.operating_hours,
    (1 - (c.embedding <=> (query_embedding::vector)))::real as similarity
  from public.clinics_data c
  where (p_country is null or c.country = p_country)
    and (p_min_rating is null or c.rating >= p_min_rating)
  order by c.embedding <-> (query_embedding::vector)
  limit greatest(1, least(p_limit, 50));
$$;

comment on function public.search_clinics is 'Vector similarity search over clinics_data with optional filters; expects query_embedding as float8[] matching embedding dimension.';
