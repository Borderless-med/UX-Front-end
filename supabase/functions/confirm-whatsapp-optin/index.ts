
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmOptinRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { token }: ConfirmOptinRequest = await req.json();

    console.log('Confirming WhatsApp opt-in for token:', token);

    // Find and update the signup record
    const { data: signup, error: fetchError } = await supabaseClient
      .from('waitlist_signups')
      .select('*')
      .eq('confirmation_token', token)
      .eq('double_optin_confirmed', false)
      .single();

    if (fetchError || !signup) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired confirmation token' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Update the record to confirm opt-in
    const { error: updateError } = await supabaseClient
      .from('waitlist_signups')
      .update({ 
        double_optin_confirmed: true,
        consent_timestamp: new Date().toISOString()
      })
      .eq('confirmation_token', token);

    if (updateError) {
      throw updateError;
    }

    console.log('WhatsApp opt-in confirmed for:', signup.email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'WhatsApp opt-in confirmed successfully',
        name: signup.name
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in confirm-whatsapp-optin function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
