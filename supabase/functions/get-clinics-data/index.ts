import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🔧 Edge function: get-clinics-data started')
    const startTime = performance.now()
    
    // Create Supabase client for server-side operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('📡 Edge function: Querying clinics_data table...')
    
    // Query clinics data directly from server
    const { data, error } = await supabase
      .from('clinics_data')
      .select('*')
      .order('distance', { ascending: true })

    const queryTime = performance.now() - startTime
    console.log(`✅ Edge function: Query completed in ${queryTime.toFixed(1)}ms`)

    if (error) {
      console.error('❌ Edge function: Supabase error:', error)
      throw error
    }

    console.log(`📊 Edge function: Retrieved ${data?.length || 0} clinics`)

    // Return optimized response (exclude heavy embedding fields if present)
    const optimizedData = data?.map(clinic => {
      const { embedding, embedding_arr, ...optimizedClinic } = clinic
      return optimizedClinic
    })

    const totalTime = performance.now() - startTime
    console.log(`🚀 Edge function: Total execution time: ${totalTime.toFixed(1)}ms`)

    return new Response(
      JSON.stringify({ 
        clinics: optimizedData, 
        metadata: { 
          count: optimizedData?.length || 0,
          executionTime: totalTime 
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('❌ Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch clinics data',
        details: error 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})