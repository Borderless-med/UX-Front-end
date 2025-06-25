
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmationRequest {
  email: string;
  name: string;
  confirmationToken: string;
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

    const { email, name, confirmationToken }: ConfirmationRequest = await req.json();

    console.log('Sending WhatsApp confirmation to:', email);

    // For now, we'll simulate sending an email confirmation
    // In a real implementation, you would integrate with an email service like Resend
    // or SMS service for WhatsApp confirmation
    
    // Update the confirmation_sent_at timestamp
    const { error: updateError } = await supabaseClient
      .from('waitlist_signups')
      .update({ 
        confirmation_sent_at: new Date().toISOString() 
      })
      .eq('confirmation_token', confirmationToken);

    if (updateError) {
      throw updateError;
    }

    console.log('Confirmation tracking updated for token:', confirmationToken);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation request processed',
        confirmationUrl: `${req.headers.get('origin')}/confirm-whatsapp?token=${confirmationToken}`
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
    console.error('Error in send-whatsapp-confirmation function:', error);
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
