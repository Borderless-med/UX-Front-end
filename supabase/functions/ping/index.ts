import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("✅ Ping function called successfully");
    
    return new Response(
      JSON.stringify({ 
        ok: true, 
        timestamp: Date.now(),
        message: "Ping successful - Supabase Edge Functions are reachable"
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("❌ Ping function error:", error);
    
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: (error as Error).message,
        timestamp: Date.now()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});