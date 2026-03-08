import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symbol, profile, quote, overview, derived, recommendation } = await req.json();
    
    if (!symbol) {
      return new Response(JSON.stringify({ error: "Symbol required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const companyName = profile?.name || overview?.Name || symbol;
    const price = quote?.c || "N/A";
    const change = quote?.dp ? `${quote.dp > 0 ? "+" : ""}${quote.dp.toFixed(2)}%` : "N/A";
    const pe = derived?.calculatedPE || overview?.PERatio || "N/A";
    const mcap = derived?.marketCap ? `$${(derived.marketCap / 1e9).toFixed(1)}B` : "N/A";
    const divYield = derived?.dividendYield ? `${derived.dividendYield.toFixed(2)}%` : "0%";
    const eps = overview?.EPS || "N/A";
    const profitMargin = overview?.ProfitMargin ? `${(parseFloat(overview.ProfitMargin) * 100).toFixed(1)}%` : "N/A";
    const roe = overview?.ReturnOnEquityTTM ? `${(parseFloat(overview.ReturnOnEquityTTM) * 100).toFixed(1)}%` : "N/A";
    const beta = overview?.Beta || "N/A";
    const sector = profile?.finnhubIndustry || overview?.Sector || "N/A";
    const recs = Array.isArray(recommendation) ? recommendation[0] : null;
    const consensus = recs ? `Buy:${recs.buy} Hold:${recs.hold} Sell:${recs.sell}` : "N/A";

    const prompt = `Analyze ${companyName} (${symbol}) stock concisely. Data: Price $${price} (${change}), P/E ${pe}, Market Cap ${mcap}, Div Yield ${divYield}, EPS ${eps}, Profit Margin ${profitMargin}, ROE ${roe}, Beta ${beta}, Sector ${sector}, Analyst consensus: ${consensus}.

Provide a brief 3-4 paragraph analysis covering:
1. **Overview**: Company position and recent performance
2. **Strengths & Risks**: Key advantages and potential concerns
3. **Valuation**: Whether the stock appears fairly valued based on metrics
4. **Outlook**: Short summary of near-term outlook

Keep it factual, concise, and balanced. Use markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a professional equity analyst providing concise stock analysis. Be factual, balanced, and avoid speculation. Format with markdown." },
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
      console.error("AI error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Analysis unavailable.";

    return new Response(JSON.stringify({ summary: content, symbol }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
