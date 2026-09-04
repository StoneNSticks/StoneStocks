import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cors, guardAI } from "../_shared/guard.ts";


const SYSTEM_PROMPT = `You are StoneStocks AI — a professional stock market analyst assistant.

You help users analyze stocks, understand financial metrics, and make informed investment decisions.

Guidelines:
- Provide clear, data-driven analysis
- Explain financial concepts in simple terms when asked
- Always add a disclaimer that this is not financial advice
- Use markdown formatting: bold for key metrics, bullet points for lists
- Be concise but thorough
- When discussing specific stocks, mention key metrics like P/E, market cap, revenue growth
- Support both English and German — respond in the language the user writes in

You do NOT have access to real-time data. Provide general analysis and educational content.`;

serve(async (req) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Require a signed-in user and throttle per user to protect AI credits.
  const guard = await guardAI(req, { max: 30, windowMs: 60_000 });
  if ("error" in guard) return guard.error;

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("stock-chat error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
