-- Add SET search_path to the vector functions to complete the security fix
-- This will resolve the "Function Search Path Mutable" warnings

-- Update match_clinics function with proper search path
CREATE OR REPLACE FUNCTION public.match_clinics(
  query_embedding extensions.vector,
  p_township text,
  match_count integer
)
RETURNS TABLE(
  id integer,
  name text,
  address text,
  township text,
  rating numeric,
  reviews integer,
  tooth_filling boolean,
  root_canal boolean,
  dental_crown boolean,
  dental_implant boolean,
  teeth_whitening boolean,
  braces boolean,
  composite_veneers boolean,
  similarity double precision
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public, extensions'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    clinics_data.id,
    clinics_data.name,
    clinics_data.address,
    clinics_data.township,
    clinics_data.rating,
    clinics_data.reviews,
    clinics_data.tooth_filling,
    clinics_data.root_canal,
    clinics_data.dental_crown,
    clinics_data.dental_implant,
    clinics_data.teeth_whitening,
    clinics_data.braces,
    clinics_data.composite_veneers,
    1 - (clinics_data.embedding <=> query_embedding) as similarity
  FROM
    clinics_data
  WHERE
    clinics_data.township ILIKE ('%' || p_township || '%')
  ORDER BY
    clinics_data.embedding <=> query_embedding
  LIMIT
    match_count;
END;
$$;

-- Update match_documents function with proper search path
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding extensions.vector,
  match_threshold double precision,
  match_count integer
)
RETURNS TABLE(
  id bigint,
  text_content text,
  similarity double precision,
  metadata jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public, extensions'
AS $$
  SELECT
    cd.id,
    cd.name
      || ' – Address: ' || COALESCE(cd.address, 'N/A')
      || ' – Township: ' || COALESCE(cd.township, 'N/A')
      || ' – Rating: ' || COALESCE(cd.rating::text, 'N/A')
      || ' – Distance: ' || COALESCE(cd.distance::text, 'N/A')
      AS text_content,
    1 - (cd.embedding <=> query_embedding) AS similarity,
    to_jsonb(cd) - 'embedding' AS metadata
  FROM public.clinics_data AS cd
  WHERE 1 - (cd.embedding <=> query_embedding) > match_threshold
  ORDER BY cd.embedding <=> query_embedding
  LIMIT match_count;
$$;