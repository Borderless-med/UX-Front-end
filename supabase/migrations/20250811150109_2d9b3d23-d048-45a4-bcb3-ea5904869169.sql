-- Fix the last remaining function without secure search_path

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding extensions.vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id bigint, text_content text, similarity double precision, metadata jsonb)
 LANGUAGE sql
 STABLE 
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT
    cd.id,
    -- Build descriptive text from actual columns
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
$function$;