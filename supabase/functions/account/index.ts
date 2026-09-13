/**
 * account — GDPR self-service for signed-in users.
 *
 * POST { action: "export" }  → all rows stored for the caller
 * POST { action: "delete" }  → deletes the caller's rows and the auth user
 *
 * Only ever acts on the user resolved from the Authorization header.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { cors, json, getUser, rateLimit } from "../_shared/guard.ts";

/** Tables that hold user-owned rows, keyed by their user column. */
const USER_TABLES: { table: string; column: string }[] = [
  { table: "watchlist", column: "user_id" },
  { table: "portfolio_positions", column: "user_id" },
  { table: "price_alerts", column: "user_id" },
  { table: "earnings_notifications", column: "user_id" },
  { table: "stock_comments", column: "user_id" },
  { table: "stock_votes", column: "user_id" },
  { table: "learn_progress", column: "user_id" },
  { table: "profiles", column: "id" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });

  try {
    const user = await getUser(req);
    if (!user) return json(req, { error: "Unauthorized" }, 401);

    const limit = rateLimit(`account:${user.id}`, 5, 60_000);
    if (!limit.ok) return json(req, { error: "Too many requests" }, 429);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    if (action === "export") {
      const out: Record<string, unknown> = {
        exported_at: new Date().toISOString(),
        user_id: user.id,
      };
      for (const { table, column } of USER_TABLES) {
        const { data, error } = await admin.from(table).select("*").eq(column, user.id);
        if (error) {
          console.error(`export failed for ${table}`, error.message);
          continue;
        }
        out[table] = data ?? [];
      }
      const { data: authUser } = await admin.auth.admin.getUserById(user.id);
      out.account = authUser?.user
        ? {
            id: authUser.user.id,
            email: authUser.user.email ?? null,
            created_at: authUser.user.created_at,
            last_sign_in_at: authUser.user.last_sign_in_at ?? null,
            metadata: authUser.user.user_metadata ?? {},
          }
        : null;
      return json(req, out);
    }

    if (action === "delete") {
      for (const { table, column } of USER_TABLES) {
        const { error } = await admin.from(table).delete().eq(column, user.id);
        if (error) console.error(`delete failed for ${table}`, error.message);
      }
      const { error } = await admin.auth.admin.deleteUser(user.id);
      if (error) {
        console.error("auth delete failed", error.message);
        return json(req, { error: "Internal server error" }, 500);
      }
      return json(req, { ok: true });
    }

    return json(req, { error: "Unknown action" }, 400);
  } catch (e) {
    console.error("account function error", e);
    return json(req, { error: "Internal server error" }, 500);
  }
});
