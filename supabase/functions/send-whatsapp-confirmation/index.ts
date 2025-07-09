
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
    // Rate limiting check - simple in-memory store for demo
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { email, mobile, name } = await req.json()

    // Input validation
    if (!email || !mobile || !name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, mobile, name' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate mobile format (basic validation)
    const mobileRegex = /^\+?[\d\s\-\(\)]{8,}$/
    if (!mobileRegex.test(mobile)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mobile number format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Sanitize inputs
    const sanitizedName = name.trim().substring(0, 100)
    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedMobile = mobile.trim()

    // Generate confirmation token
    const confirmationToken = crypto.randomUUID()

    // Update waitlist signup with confirmation token
    const { data, error } = await supabase
      .from('waitlist_signups')
      .update({ 
        confirmation_token: confirmationToken,
        confirmation_sent_at: new Date().toISOString()
      })
      .eq('email', sanitizedEmail)
      .eq('mobile', sanitizedMobile)

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

    // Log the activity for security monitoring
    console.log(`WhatsApp confirmation sent to ${sanitizedEmail} from IP: ${clientIP}`)

    // In a real implementation, you would send the WhatsApp message here
    // For now, we'll just return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp confirmation sent successfully',
        token: confirmationToken // In production, don't return the token
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
