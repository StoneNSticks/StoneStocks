// Shared CORS, auth and rate-limit helpers for StoneStocks edge functions.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-z0-9-]+\.)*lovable\.app$/,
  /^https:\/\/([a-z0-9-]+\.)*lovableproject\.com$/,
  /^https:\/\/([a-z0-9-]+\.)*stonestocks\.com$/,
];

const BASE_HEADERS = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

/** CORS headers restricted to the app's own origins. */
export function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
  return { ...BASE_HEADERS, "Access-Control-Allow-Origin": allowed ? origin : "null" };
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(req), "Content-Type": "application/json" },
  });
}

/** Resolves the calling user from the Authorization header. Returns null when anonymous. */
export async function getUser(req: Request): Promise<{ id: string } | null> {
  const auth = req.headers.get("Authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
  try {
    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) return null;
    return { id: data.user.id };
  } catch {
    return null;
  }
}

// ── In-isolate sliding-window rate limiter ──
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000));
    buckets.set(key, hits);
    return { ok: false, retryAfter };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear(); // crude memory guard
  return { ok: true, retryAfter: 0 };
}

/**
 * Guards an AI endpoint: requires a signed-in user and applies a per-user rate limit.
 * Returns a Response to short-circuit with, or the resolved user id.
 */
export async function guardAI(
  req: Request,
  opts: { max: number; windowMs: number },
): Promise<{ error: Response } | { userId: string }> {
  const user = await getUser(req);
  if (!user) {
    return { error: json(req, { error: "Sign in to use AI features." }, 401) };
  }
  const { ok, retryAfter } = rateLimit(user.id, opts.max, opts.windowMs);
  if (!ok) {
    return {
      error: new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again shortly.", retryAfter }),
        {
          status: 429,
          headers: { ...cors(req), "Content-Type": "application/json", "Retry-After": String(retryAfter) },
        },
      ),
    };
  }
  return { userId: user.id };
}
