
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
    const body = await req.json();
    const { history, message, applied_filters } = body;
    
    // Support both new history format and legacy message format
    if (!history && !message) {
      return new Response(JSON.stringify({ error: 'History or message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Routing to external API with:', history ? 'history array' : 'single message');
    console.log('External API URL:', 'https://sg-jb-chatbot-backend.onrender.com/chat');
    console.log('Request body structure:', { 
      hasHistory: !!history, 
      hasMessage: !!message, 
      appliedFilters: applied_filters 
    });

    // Prepare the body for the external API  
    const apiBody = history 
      ? { history, applied_filters: applied_filters || {} } 
      : { message, applied_filters: applied_filters || {} };

    // Call the external chatbot API
    const response = await fetch('https://sg-jb-chatbot-backend.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    
    // Ensure we always return the expected structure with candidate_pool preserved
    const formattedResult = {
      response: data.response || 'No response from API',
      applied_filters: data.applied_filters || {},
      candidate_pool: data.candidate_pool || []
    };

    return new Response(JSON.stringify(formattedResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
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
