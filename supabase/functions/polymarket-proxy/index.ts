import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const API_BASES: Record<string, string> = {
  gamma: "https://gamma-api.polymarket.com",
  clob: "https://clob.polymarket.com",
  data: "https://data-api.polymarket.com",
};

// Map endpoint prefixes to the right API
function resolveApi(path: string): { base: string; endpoint: string } {
  // CLOB endpoints
  if (path.startsWith("/book") || path.startsWith("/prices") || path.startsWith("/midpoint") || path.startsWith("/spread")) {
    return { base: API_BASES.clob, endpoint: path };
  }
  // Data API endpoints
  if (path.startsWith("/time-series") || path.startsWith("/activity") || path.startsWith("/positions") || path.startsWith("/leaderboard")) {
    return { base: API_BASES.data, endpoint: path };
  }
  // Everything else → Gamma (events, markets, tags, search)
  return { base: API_BASES.gamma, endpoint: path };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");
    if (!path) {
      return new Response(JSON.stringify({ error: "Missing 'path' query parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Forward all other query params (except 'path')
    const forwardParams = new URLSearchParams();
    url.searchParams.forEach((v, k) => {
      if (k !== "path") forwardParams.set(k, v);
    });

    const { base, endpoint } = resolveApi(path);
    const qs = forwardParams.toString();
    const targetUrl = `${base}${endpoint}${qs ? "?" + qs : ""}`;

    console.log(`Proxying to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Polymarket proxy error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
