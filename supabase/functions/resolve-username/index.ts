// Username + password login. The email behind a username is never returned to
// the caller: the function verifies the password server-side and hands back a
// session only on success. This removes the email-enumeration surface.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { cors, rateLimit } from "../_shared/guard.ts";

Deno.serve(async (req) => {
  const corsHeaders = cors(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const jsonRes = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // Throttle credential guessing per client IP.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`login:${ip}`, 10, 60_000);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: "Too many attempts. Please try again shortly." }),
      {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(rl.retryAfter) },
      },
    );
  }

  try {
    const { username, password } = await req.json();
    if (
      typeof username !== "string" || !username.trim() || username.length > 64 ||
      typeof password !== "string" || !password || password.length > 512
    ) {
      return jsonRes({ error: "invalid credentials" }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await admin
      .from("profiles")
      .select("email")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    // Generic response for both unknown username and wrong password.
    if (error || !data?.email) return jsonRes({ error: "invalid credentials" }, 401);

    const anon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { auth: { persistSession: false } },
    );
    const { data: signIn, error: signInError } = await anon.auth.signInWithPassword({
      email: data.email,
      password,
    });
    if (signInError || !signIn.session) return jsonRes({ error: "invalid credentials" }, 401);

    return jsonRes({
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
    });
  } catch {
    return jsonRes({ error: "bad request" }, 400);
  }
});
