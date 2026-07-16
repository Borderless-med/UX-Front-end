import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

// ========================================
// BOT PROTECTION: IP Rate Limiting
// ========================================
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_BOOKINGS_PER_IP = 2;

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  if (record.count >= MAX_BOOKINGS_PER_IP) {
    return { 
      allowed: false, 
      message: `Rate limit exceeded. Maximum ${MAX_BOOKINGS_PER_IP} bookings per hour allowed.` 
    };
  }

  record.count++;
  return { allowed: true };
}

// ========================================
// BOT PROTECTION: Turnstile Verification
// ========================================
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET_KEY");
  
  console.log('🔐 Turnstile Config:', {
    secretConfigured: !!TURNSTILE_SECRET,
    secretLength: TURNSTILE_SECRET ? TURNSTILE_SECRET.length : 0,
    startsCorrect: TURNSTILE_SECRET?.startsWith('0x4') || false
  });
  
  if (!TURNSTILE_SECRET) {
    console.error('❌ TURNSTILE_SECRET_KEY not configured - BLOCKING request');
    return false;
  }

  if (!token) {
    console.warn('❌ No Turnstile token provided');
    return false;
  }

  try {
    console.log('🔍 Calling Cloudflare siteverify...');
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });

    const data = await response.json();
    console.log('✅ Cloudflare Response:', {
      success: data.success,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      errors: data['error-codes'] || []
    });
    
    return data.success === true;
  } catch (error) {
    console.error('❌ Turnstile API error:', error);
    return false;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentBookingRequest {
  patient_name: string;
  email: string;
  whatsapp: string;
  treatment_type: string;
  preferred_date: string;
  time_slot: string;
  clinic_location: string;
  preferred_clinic?: string;
  consent_given: boolean;
  create_account?: boolean;
  turnstile_token?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📋 Processing booking request...");

    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    console.log('📍 Request from IP:', clientIP);

    // Check rate limit
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: rateLimitCheck.message,
          code: 'RATE_LIMIT_EXCEEDED'
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const bookingData: AppointmentBookingRequest = await req.json();
    console.log("📝 Booking data received");

    // STRICT BOT PROTECTION: Require Turnstile token
    console.log('🛡️ Starting bot protection checks...');
    
    if (!bookingData.turnstile_token) {
      console.error(`❌ BLOCKED: No Turnstile token from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: 'Security verification required. Please refresh and try again.',
          code: 'TURNSTILE_MISSING'
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const isValidToken = await verifyTurnstileToken(bookingData.turnstile_token, clientIP);
    if (!isValidToken) {
      console.error(`❌ BLOCKED: Invalid Turnstile token from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: 'Security verification failed. Please refresh and try again.',
          code: 'TURNSTILE_FAILED'
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('✅ Bot protection passed - processing booking');

    // Validate required fields
    const requiredFields = ['patient_name', 'email', 'whatsapp', 'treatment_type', 'preferred_date', 'time_slot', 'clinic_location'];
    for (const field of requiredFields) {
      if (!bookingData[field as keyof AppointmentBookingRequest]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!bookingData.consent_given) {
      throw new Error("PDPA consent is required");
    }

    // Generate booking reference
    const { data: bookingRef, error: refError } = await supabase.rpc('generate_booking_ref');
    if (refError) {
      console.error("Error generating booking reference:", refError);
      throw new Error("Failed to generate booking reference");
    }

    console.log("Generated booking reference:", bookingRef);

    // Create user account if requested
    let userCreated = false;
    
    if (bookingData.create_account) {
      console.log("Creating user account for:", bookingData.email);
      try {
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: bookingData.email,
          email_confirm: true,
          user_metadata: {
            full_name: bookingData.patient_name,
            whatsapp: bookingData.whatsapp,
            created_via: 'booking_form',
            booking_ref: bookingRef
          }
        });
        
        if (userError) {
          if (userError.message.includes('already') || userError.message.includes('exists')) {
            console.log("User already exists");
            userCreated = true;
          } else {
            console.error("Error creating user:", userError);
          }
        } else {
          console.log("User created successfully:", newUser.user?.id);
          userCreated = true;
        }
      } catch (e) {
        console.error("Exception during user creation:", e);
      }
    }

    // Insert appointment booking
    const { create_account, turnstile_token, ...bookingDataForDb } = bookingData;
    const { data: appointment, error: insertError } = await supabase
      .from('appointment_bookings')
      .insert({
        ...bookingDataForDb,
        booking_ref: bookingRef,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting appointment:", insertError);
      throw new Error("Failed to save appointment booking");
    }

    console.log("✅ Appointment saved successfully:", appointment.id);

    // Send notifications (your existing email/WhatsApp code continues here)
    // For now, return success
    return new Response(
      JSON.stringify({
        success: true,
        booking_ref: bookingRef,
        user_created: userCreated,
        message: "Booking created successfully with bot protection verified"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("Error in send-appointment-confirmation function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
