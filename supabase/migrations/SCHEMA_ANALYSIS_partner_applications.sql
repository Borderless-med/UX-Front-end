-- =============================================================================
-- SCHEMA ANALYSIS QUERIES FOR partner_applications TABLE
-- =============================================================================
-- Use these queries to download/analyze the table structure
-- Copy and paste into Supabase SQL Editor or your PostgreSQL client
-- =============================================================================

-- -------------------------------------------------------------------------
-- 1. GET COMPLETE TABLE SCHEMA (Column Names, Data Types, Constraints)
-- -------------------------------------------------------------------------
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default,
    ordinal_position
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'partner_applications'
ORDER BY 
    ordinal_position;


-- -------------------------------------------------------------------------
-- 2. GET TABLE CONSTRAINTS (Primary Keys, Foreign Keys, Unique)
-- -------------------------------------------------------------------------
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    tc.table_name
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
WHERE 
    tc.table_schema = 'public'
    AND tc.table_name = 'partner_applications'
ORDER BY 
    tc.constraint_type, kcu.ordinal_position;


-- -------------------------------------------------------------------------
-- 3. GET COLUMN COMMENTS/DOCUMENTATION
-- -------------------------------------------------------------------------
SELECT 
    c.column_name,
    pgd.description AS column_comment
FROM 
    pg_catalog.pg_statio_all_tables AS st
    INNER JOIN pg_catalog.pg_description pgd ON (
        pgd.objoid = st.relid
    )
    INNER JOIN information_schema.columns c ON (
        pgd.objsubid = c.ordinal_position
        AND c.table_schema = st.schemaname
        AND c.table_name = st.relname
    )
WHERE 
    st.schemaname = 'public'
    AND st.relname = 'partner_applications';


-- -------------------------------------------------------------------------
-- 4. GET INDEXES ON TABLE
-- -------------------------------------------------------------------------
SELECT
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
    AND tablename = 'partner_applications';


-- -------------------------------------------------------------------------
-- 5. GET ROW LEVEL SECURITY POLICIES
-- -------------------------------------------------------------------------
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    schemaname = 'public'
    AND tablename = 'partner_applications';


-- -------------------------------------------------------------------------
-- 6. GENERATE CREATE TABLE STATEMENT (Approximation)
-- -------------------------------------------------------------------------
SELECT 
    'CREATE TABLE public.partner_applications (' || 
    STRING_AGG(
        '  ' || column_name || ' ' || 
        CASE 
            WHEN data_type = 'character varying' THEN 'VARCHAR(' || character_maximum_length || ')'
            WHEN data_type = 'timestamp with time zone' THEN 'TIMESTAMP WITH TIME ZONE'
            WHEN data_type = 'uuid' THEN 'UUID'
            WHEN data_type = 'boolean' THEN 'BOOLEAN'
            ELSE UPPER(data_type)
        END ||
        CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END ||
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
        E',\n'
        ORDER BY ordinal_position
    ) || E'\n);' AS create_statement
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'partner_applications';


-- -------------------------------------------------------------------------
-- 7. COUNT EXISTING RECORDS BY COLUMN (Data Analysis)
-- -------------------------------------------------------------------------
SELECT 
    'Total Records' AS metric,
    COUNT(*) AS value
FROM public.partner_applications

UNION ALL

SELECT 
    'Records with clinic_license (NEW)' AS metric,
    COUNT(clinic_license) AS value
FROM public.partner_applications
WHERE clinic_license IS NOT NULL

UNION ALL

SELECT 
    'Records with mdc_registration_number (NEW)' AS metric,
    COUNT(mdc_registration_number) AS value
FROM public.partner_applications
WHERE mdc_registration_number IS NOT NULL

UNION ALL

SELECT 
    'Records with experience (OLD - DEPRECATED)' AS metric,
    COUNT(experience) AS value
FROM public.partner_applications
WHERE experience IS NOT NULL

UNION ALL

SELECT 
    'Records with why_join (OLD - DEPRECATED)' AS metric,
    COUNT(why_join) AS value
FROM public.partner_applications
WHERE why_join IS NOT NULL

UNION ALL

SELECT 
    'Records with sentiment_analysis_interest' AS metric,
    COUNT(*) AS value
FROM public.partner_applications
WHERE sentiment_analysis_interest = TRUE

UNION ALL

SELECT 
    'Records with market_analysis_interest (NEW)' AS metric,
    COUNT(*) AS value
FROM public.partner_applications
WHERE market_analysis_interest = TRUE;


-- -------------------------------------------------------------------------
-- 8. EXPORT SAMPLE DATA (First 5 Records)
-- -------------------------------------------------------------------------
SELECT 
    id,
    clinic_name,
    contact_name,
    email,
    phone,
    city,
    clinic_license,
    mdc_registration_number,
    services,
    sentiment_analysis_interest,
    market_analysis_interest,
    ai_chatbot_interest,
    other_ai_features,
    created_at,
    updated_at
FROM 
    public.partner_applications
ORDER BY 
    created_at DESC
LIMIT 5;


-- -------------------------------------------------------------------------
-- 9. COLUMN MAPPING: OLD vs NEW FIELDS
-- -------------------------------------------------------------------------
-- This query shows the transition from old to new field structure
SELECT 
    'OLD FIELD → NEW FIELD' AS mapping_type,
    'registration_number → clinic_license (RENAMED)' AS field_mapping
UNION ALL
SELECT 
    'NEW FIELD',
    'mdc_registration_number (NEW)'
UNION ALL
SELECT 
    'NEW FIELD',
    'market_analysis_interest (NEW)'
UNION ALL
SELECT 
    'NEW FIELD',
    'other_ai_features (NEW)'
UNION ALL
SELECT 
    'DEPRECATED',
    'experience (kept for historical data)'
UNION ALL
SELECT 
    'DEPRECATED',
    'why_join (kept for historical data)';


-- -------------------------------------------------------------------------
-- 10. DOWNLOAD AS CSV (PostgreSQL COPY Command - Run in psql or Terminal)
-- -------------------------------------------------------------------------
-- Run this in your terminal if you have direct PostgreSQL access:
-- 
-- \COPY (SELECT * FROM public.partner_applications) TO 'partner_applications_schema.csv' WITH CSV HEADER;
--
-- Or use Supabase dashboard: Table Editor → Export → CSV
