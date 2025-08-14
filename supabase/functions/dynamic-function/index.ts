
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const { history, applied_filters, candidate_pool } = await req.json();

    console.log('=== EDGE FUNCTION RECEIVING ===');
    console.log('History array length:', history?.length || 0);
    console.log('Applied filters:', applied_filters);
    console.log('Candidate pool length:', candidate_pool?.length || 0);
    
    if (history && history.length > 0) {
      console.log('Complete history being forwarded:', history);
    } else {
      console.log('WARNING: No history received or empty history');
    }
    console.log('================================');

    // Prepare the complete body for the external API with all three variables
    const apiBody = {
      history: history || [],
      applied_filters: applied_filters || {},
      candidate_pool: candidate_pool || []
    };

    console.log('Forwarding to external API:', apiBody);

    const response = await fetch('https://sg-jb-chatbot-backend.onrender.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiBody),
    });

    console.log('External API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', response.status, response.statusText);
      console.error('External API error details:', errorText);
      
      return new Response(JSON.stringify({ 
        error: `External API error: ${response.status} ${response.statusText}`,
        details: errorText 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const data = await response.json();
    console.log('External API response received successfully');

    return new Response(JSON.stringify({
      response: data.response || data.message || 'No response available',
      applied_filters: data.applied_filters || {},
      candidate_pool: data.candidate_pool || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in dynamic-function:', error);
    
    return new Response(JSON.stringify({ 
      response: 'Sorry, something went wrong. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
