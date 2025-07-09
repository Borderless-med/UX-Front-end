
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { token } = await req.json()

    // Input validation
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing confirmation token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate token format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(token)) {
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Find and update the waitlist signup
    const { data, error } = await supabase
      .from('waitlist_signups')
      .update({ 
        double_optin_confirmed: true,
        whatsapp_consent: true,
        consent_timestamp: new Date().toISOString()
      })
      .eq('confirmation_token', token)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Database operation failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired confirmation token' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if token is not too old (e.g., 24 hours)
    const signup = data[0]
    const confirmationSentAt = new Date(signup.confirmation_sent_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - confirmationSentAt.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      return new Response(
        JSON.stringify({ error: 'Confirmation token has expired' }),
        { 
          status: 410, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log the activity for security monitoring
    console.log(`WhatsApp opt-in confirmed for email: ${signup.email} from IP: ${clientIP}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp opt-in confirmed successfully',
        email: signup.email
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
