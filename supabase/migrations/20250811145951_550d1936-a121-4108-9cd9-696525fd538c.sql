-- Complete security fixes: Update remaining functions with secure search_path
-- Skip the problematic match_documents function for now

CREATE OR REPLACE FUNCTION public.update_sentiments(clinic_id_to_update integer, s_overall numeric, s_skill numeric, s_pain numeric, s_cost numeric, s_staff numeric, s_ambiance numeric, s_convenience numeric)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  UPDATE public.clinics_data
  SET
      sentiment_overall = s_overall,
      sentiment_dentist_skill = s_skill,
      sentiment_pain_management = s_pain,
      sentiment_cost_value = s_cost,
      sentiment_staff_service = s_staff,
      sentiment_ambiance_cleanliness = s_ambiance,
      sentiment_convenience = s_convenience
  WHERE
      id = clinic_id_to_update;
END;
$function$;

CREATE OR REPLACE FUNCTION public.match_clinics(query_embedding extensions.vector, p_township text, match_count integer)
 RETURNS TABLE(id integer, name text, address text, township text, rating numeric, reviews integer, tooth_filling boolean, root_canal boolean, dental_crown boolean, dental_implant boolean, teeth_whitening boolean, braces boolean, wisdom_tooth boolean, gum_treatment boolean, composite_veneers boolean, porcelain_veneers boolean, dental_bonding boolean, inlays_onlays boolean, enamel_shaping boolean, gingivectomy boolean, bone_grafting boolean, sinus_lift boolean, frenectomy boolean, tmj_treatment boolean, sleep_apnea_appliances boolean, crown_lengthening boolean, oral_cancer_screening boolean, alveoplasty boolean, similarity double precision)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    clinics_data.id, clinics_data.name, clinics_data.address, clinics_data.township,
    clinics_data.rating, clinics_data.reviews,
    -- The complete list of services --
    clinics_data.tooth_filling, clinics_data.root_canal, clinics_data.dental_crown, clinics_data.dental_implant,
    clinics_data.teeth_whitening, clinics_data.braces, clinics_data.wisdom_tooth, clinics_data.gum_treatment,
    clinics_data.composite_veneers, clinics_data.porcelain_veneers, clinics_data.dental_bonding,
    clinics_data.inlays_onlays, clinics_data.enamel_shaping, clinics_data.gingivectomy, clinics_data.bone_grafting,
    clinics_data.sinus_lift, clinics_data.frenectomy, clinics_data.tmj_treatment, clinics_data.sleep_apnea_appliances,
    clinics_data.crown_lengthening, clinics_data.oral_cancer_screening, clinics_data.alveoplasty,
    -- End of service list --
    1 - (clinics_data.embedding <=> query_embedding) as similarity
  FROM
    public.clinics_data
  WHERE
    clinics_data.township ILIKE ('%' || p_township || '%')
  ORDER BY
    clinics_data.embedding <=> query_embedding
  LIMIT
    match_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.match_clinics_hybrid(query_embedding extensions.vector, match_threshold double precision, match_count integer, filter_township text DEFAULT NULL::text, min_rating double precision DEFAULT NULL::double precision, service_filter text DEFAULT NULL::text)
 RETURNS TABLE(id integer, name text, address text, township text, rating numeric, reviews integer, similarity double precision)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    clinics_data.id,
    clinics_data.name,
    clinics_data.address,
    clinics_data.township,
    clinics_data.rating,
    clinics_data.reviews,
    1 - (clinics_data.embedding <=> query_embedding) as similarity
  FROM
    public.clinics_data
  WHERE
    -- Apply standard filters first
    (filter_township IS NULL OR clinics_data.township ILIKE ('%' || filter_township || '%')) AND
    (min_rating IS NULL OR clinics_data.rating >= min_rating) AND
    
    -- <<< THE COMPREHENSIVE AND CORRECTED SERVICE FILTER >>>
    (service_filter IS NULL OR
        CASE
            -- Basic & Restorative
            WHEN service_filter = 'tooth_filling' THEN clinics_data.tooth_filling = TRUE
            WHEN service_filter = 'root_canal' THEN clinics_data.root_canal = TRUE
            WHEN service_filter = 'dental_crown' THEN clinics_data.dental_crown = TRUE
            WHEN service_filter = 'dental_implant' THEN clinics_data.dental_implant = TRUE
            WHEN service_filter = 'wisdom_tooth' THEN clinics_data.wisdom_tooth = TRUE
            WHEN service_filter = 'gum_treatment' THEN clinics_data.gum_treatment = TRUE
            WHEN service_filter = 'dental_bonding' THEN clinics_data.dental_bonding = TRUE
            WHEN service_filter = 'inlays_onlays' THEN clinics_data.inlays_onlays = TRUE
            
            -- Cosmetic
            WHEN service_filter = 'teeth_whitening' THEN clinics_data.teeth_whitening = TRUE
            WHEN service_filter = 'composite_veneers' THEN clinics_data.composite_veneers = TRUE
            WHEN service_filter = 'porcelain_veneers' THEN clinics_data.porcelain_veneers = TRUE
            WHEN service_filter = 'enamel_shaping' THEN clinics_data.enamel_shaping = TRUE
            
            -- Orthodontic
            WHEN service_filter = 'braces' THEN clinics_data.braces = TRUE
            
            -- Surgical & Specialized
            WHEN service_filter = 'gingivectomy' THEN clinics_data.gingivectomy = TRUE
            WHEN service_filter = 'bone_grafting' THEN clinics_data.bone_grafting = TRUE
            WHEN service_filter = 'sinus_lift' THEN clinics_data.sinus_lift = TRUE
            WHEN service_filter = 'frenectomy' THEN clinics_data.frenectomy = TRUE
            WHEN service_filter = 'tmj_treatment' THEN clinics_data.tmj_treatment = TRUE
            WHEN service_filter = 'sleep_apnea_appliances' THEN clinics_data.sleep_apnea_appliances = TRUE
            WHEN service_filter = 'crown_lengthening' THEN clinics_data.crown_lengthening = TRUE
            WHEN service_filter = 'oral_cancer_screening' THEN clinics_data.oral_cancer_screening = TRUE
            WHEN service_filter = 'alveoplasty' THEN clinics_data.alveoplasty = TRUE

            ELSE TRUE -- If the service_filter doesn't match a known column, this filter is ignored
        END
    ) AND
    
    -- Finally, apply the semantic search filter
    1 - (clinics_data.embedding <=> query_embedding) > match_threshold
  ORDER BY
    similarity DESC
  LIMIT
    match_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.match_clinics_simple(query_embedding extensions.vector, match_count integer)
 RETURNS SETOF public.clinics_data
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM
    public.clinics_data
  ORDER BY
    clinics_data.embedding <=> query_embedding
  LIMIT
    match_count;
END;
$function$;