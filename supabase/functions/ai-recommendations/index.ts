import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { portfolio, watchlist } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const portfolioStr = Array.isArray(portfolio) && portfolio.length > 0
      ? portfolio.map((p: any) => `${p.symbol} (${p.shares} shares @ $${p.avg_cost})`).join(", ")
      : "Empty portfolio";

    const watchlistStr = Array.isArray(watchlist) && watchlist.length > 0
      ? watchlist.map((w: any) => w.symbol).join(", ")
      : "Empty watchlist";

    const prompt = `Based on this investor's portfolio and watchlist, provide 5 personalized stock recommendations.

Portfolio: ${portfolioStr}
Watchlist: ${watchlistStr}

For each recommendation, provide:
1. Ticker symbol
2. Company name
3. Why it fits this portfolio (diversification, sector exposure, growth/value balance)
4. Risk level (Low/Medium/High)
5. A brief thesis (1-2 sentences)

Focus on:
- Diversification gaps (missing sectors/geographies)
- Complementary stocks to existing holdings
- Risk-adjusted suggestions based on portfolio style (growth vs value vs income)

Format as a clean numbered list with markdown. Be specific and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert portfolio advisor. Provide specific, actionable stock recommendations based on the investor's current holdings. Be concise but insightful. Never recommend stocks already in the portfolio or watchlist." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI rec error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI recommendation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No recommendations available.";

    return new Response(JSON.stringify({ recommendations: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI rec error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
