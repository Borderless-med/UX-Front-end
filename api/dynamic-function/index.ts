import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PROD_BACKEND_URL = "https://sg-jb-chatbot-backend.onrender.com/chat";
const DEV_BACKEND_URL = "https://sg-jb-chatbot-backend-development.onrender.com/chat";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-environment",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const environment = req.headers.get("x-environment") || "development";
    const backendUrl = environment === "production" ? PROD_BACKEND_URL : DEV_BACKEND_URL;

    console.log(`Request received with environment: ${environment}`);
    console.log(`Routing to backend: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Critical Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
