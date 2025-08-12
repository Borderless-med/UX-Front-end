
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
    const { history, message } = body;
    
    // Support both new history format and legacy message format
    if (!history && !message) {
      return new Response(JSON.stringify({ error: 'History or message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Routing to external API with:', history ? 'history array' : 'single message');
    console.log('External API URL:', 'https://sg-jb-chatbot-backend.onrender.com/chat');

    // Prepare the body for the external API
    const apiBody = history ? { history } : { message };

    // Call the external chatbot API
    const response = await fetch('https://sg-jb-chatbot-backend.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiBody),
    });

    console.log('External API response status:', response.status);

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('External API response:', data);

    // Return the response in the expected format
    return new Response(JSON.stringify(data), {
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
