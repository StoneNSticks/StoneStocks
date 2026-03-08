import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FINNHUB_KEY = Deno.env.get("FINNHUB_API_KEY")!;

// ---- VAPID Key Management ----

async function getOrCreateVapidKeys(): Promise<{ publicKey: string; privateKey: JsonWebKey }> {
  // Check cache
  const { data: cached } = await supabase
    .from("api_cache")
    .select("data")
    .eq("cache_key", "vapid_keys")
    .single();

  if (cached?.data) {
    const keys = cached.data as { publicKey: string; privateKey: JsonWebKey };
    return keys;
  }

  // Generate new ECDSA P-256 key pair
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  const rawPublic = await crypto.subtle.exportKey("raw", keyPair.publicKey);
  const jwkPrivate = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  // Base64url encode the public key
  const publicKeyB64 = arrayBufferToBase64Url(rawPublic);

  const keys = { publicKey: publicKeyB64, privateKey: jwkPrivate };

  // Store in cache (no expiry needed - permanent)
  const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10).toISOString();
  await supabase.from("api_cache").upsert({
    cache_key: "vapid_keys",
    data: keys,
    source: "system",
    expires_at: farFuture,
  }, { onConflict: "cache_key" });

  return keys;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(base64 + padding);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

// ---- Web Push Implementation ----

async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidKeys: { publicKey: string; privateKey: JsonWebKey }
) {
  const endpoint = new URL(subscription.endpoint);
  const audience = `${endpoint.protocol}//${endpoint.host}`;

  // Create VAPID JWT
  const jwt = await createVapidJwt(audience, vapidKeys.privateKey);

  // Encrypt payload
  const encrypted = await encryptPayload(
    payload,
    subscription.p256dh,
    subscription.auth
  );

  const response = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      "TTL": "86400",
      "Authorization": `vapid t=${jwt}, k=${vapidKeys.publicKey}`,
    },
    body: encrypted,
  });

  if (!response.ok && response.status === 410) {
    // Subscription expired, remove it
    await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", subscription.endpoint);
  }

  return response;
}

async function createVapidJwt(audience: string, privateKeyJwk: JsonWebKey): Promise<string> {
  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 3600,
    sub: "mailto:notifications@stonestocks.app",
  };

  const headerB64 = btoa(JSON.stringify(header)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unsigned = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "jwk",
    privateKeyJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(unsigned)
  );

  // Convert DER signature to raw r||s format (64 bytes)
  const sigBytes = new Uint8Array(signature);
  const rawSig = derToRaw(sigBytes);
  const sigB64 = arrayBufferToBase64Url(rawSig.buffer);

  return `${unsigned}.${sigB64}`;
}

function derToRaw(der: Uint8Array): Uint8Array {
  // ECDSA signature from WebCrypto is already in raw format (r||s, 64 bytes)
  if (der.length === 64) return der;

  // If it's DER encoded, parse it
  const raw = new Uint8Array(64);
  // Skip DER header
  let offset = 2;
  const rLen = der[offset + 1];
  offset += 2;
  const rStart = rLen > 32 ? offset + (rLen - 32) : offset;
  const rDest = rLen < 32 ? 32 - rLen : 0;
  raw.set(der.slice(rStart, rStart + Math.min(rLen, 32)), rDest);
  offset += rLen;
  const sLen = der[offset + 1];
  offset += 2;
  const sStart = sLen > 32 ? offset + (sLen - 32) : offset;
  const sDest = sLen < 32 ? 64 - sLen : 32;
  raw.set(der.slice(sStart, sStart + Math.min(sLen, 32)), sDest);
  return raw;
}

// ---- Payload Encryption (RFC 8291) ----

async function encryptPayload(
  payload: string,
  p256dhB64: string,
  authB64: string
): Promise<Uint8Array> {
  const payloadBytes = new TextEncoder().encode(payload);

  // Import subscriber's public key
  const p256dhBytes = base64UrlToUint8Array(p256dhB64);
  const authBytes = base64UrlToUint8Array(authB64);

  // Generate ephemeral ECDH key pair
  const localKeyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  const localPublicKey = await crypto.subtle.exportKey("raw", localKeyPair.publicKey);
  const localPublicKeyBytes = new Uint8Array(localPublicKey);

  // Import subscriber key
  const subscriberKey = await crypto.subtle.importKey(
    "raw",
    p256dhBytes,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // Derive shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: subscriberKey },
    localKeyPair.privateKey,
    256
  );

  // HKDF for IKM
  const ikmInfo = concatArrays(
    new TextEncoder().encode("WebPush: info\0"),
    p256dhBytes,
    localPublicKeyBytes
  );
  const ikm = await hkdfSha256(new Uint8Array(sharedSecret), authBytes, ikmInfo, 32);

  // Derive content encryption key and nonce
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cekInfo = new TextEncoder().encode("Content-Encoding: aes128gcm\0");
  const nonceInfo = new TextEncoder().encode("Content-Encoding: nonce\0");
  const cek = await hkdfSha256(ikm, salt, cekInfo, 16);
  const nonce = await hkdfSha256(ikm, salt, nonceInfo, 12);

  // Pad payload (add delimiter byte 0x02)
  const padded = new Uint8Array(payloadBytes.length + 1);
  padded.set(payloadBytes);
  padded[payloadBytes.length] = 2; // delimiter

  // Encrypt with AES-128-GCM
  const key = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    key,
    padded
  );

  // Build aes128gcm content coding header
  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, payloadBytes.length + 1 + 16 + 1); // +16 for tag, +1 for padding delimiter
  const header = concatArrays(
    salt,
    recordSize,
    new Uint8Array([localPublicKeyBytes.length]),
    localPublicKeyBytes
  );

  return concatArrays(header, new Uint8Array(encrypted));
}

async function hkdfSha256(
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  length: number
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", ikm, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  
  // Extract
  const prkKey = await crypto.subtle.importKey("raw", salt.length ? salt : new Uint8Array(32), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const prk = new Uint8Array(await crypto.subtle.sign("HMAC", prkKey, ikm));

  // Expand
  const expandKey = await crypto.subtle.importKey("raw", prk, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const infoWithCounter = concatArrays(info, new Uint8Array([1]));
  const okm = new Uint8Array(await crypto.subtle.sign("HMAC", expandKey, infoWithCounter));

  return okm.slice(0, length);
}

function concatArrays(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    result.set(a, offset);
    offset += a.length;
  }
  return result;
}

// ---- Earnings Check & Notification Logic ----

async function checkAndSendEarningsNotifications() {
  console.log("Checking earnings notifications...");

  const vapidKeys = await getOrCreateVapidKeys();

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // Get all users with push subscriptions
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth");

  if (!subscriptions || subscriptions.length === 0) {
    console.log("No push subscriptions found");
    return { sent: 0 };
  }

  // Get unique user IDs
  const userIds = [...new Set(subscriptions.map((s) => s.user_id))];

  // Get watchlist symbols for each user
  const { data: watchlistItems } = await supabase
    .from("watchlist")
    .select("user_id, symbol")
    .in("user_id", userIds);

  if (!watchlistItems || watchlistItems.length === 0) {
    console.log("No watchlist items found");
    return { sent: 0 };
  }

  // Get all unique symbols
  const allSymbols = [...new Set(watchlistItems.map((w) => w.symbol))];

  // Fetch earnings calendar from Finnhub
  const from = tomorrowStr;
  const to = tomorrowStr;
  let earningsData: any[] = [];

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&token=${FINNHUB_KEY}`
    );
    const json = await res.json();
    earningsData = json?.earningsCalendar || [];
  } catch (e) {
    console.error("Failed to fetch earnings:", e);
    return { sent: 0 };
  }

  // Filter to symbols in any watchlist
  const earningsSymbols = new Set(
    earningsData
      .filter((e: any) => allSymbols.includes(e.symbol))
      .map((e: any) => e.symbol)
  );

  if (earningsSymbols.size === 0) {
    console.log("No earnings tomorrow for watchlist symbols");
    return { sent: 0 };
  }

  // Check which notifications have already been sent
  const { data: alreadySent } = await supabase
    .from("earnings_notifications")
    .select("user_id, symbol")
    .eq("earnings_date", tomorrowStr);

  const sentSet = new Set(
    (alreadySent || []).map((n) => `${n.user_id}:${n.symbol}`)
  );

  let sentCount = 0;

  // For each user, check if any of their watchlist symbols have earnings tomorrow
  for (const userId of userIds) {
    const userSymbols = watchlistItems
      .filter((w) => w.user_id === userId)
      .map((w) => w.symbol)
      .filter((s) => earningsSymbols.has(s));

    // Filter already notified
    const toNotify = userSymbols.filter(
      (s) => !sentSet.has(`${userId}:${s}`)
    );

    if (toNotify.length === 0) continue;

    // Build notification message
    const symbolsList = toNotify.join(", ");
    const title = toNotify.length === 1
      ? `📊 ${toNotify[0]} Earnings morgen!`
      : `📊 ${toNotify.length} Earnings morgen!`;
    const body = toNotify.length === 1
      ? `${toNotify[0]} veröffentlicht morgen Quartalszahlen. Sei vorbereitet!`
      : `${symbolsList} veröffentlichen morgen Quartalszahlen.`;

    const payload = JSON.stringify({
      title,
      body,
      icon: "/pwa-192.png",
      badge: "/pwa-192.png",
      tag: `earnings-${tomorrowStr}`,
      data: {
        url: "/watchlist",
        symbols: toNotify,
      },
    });

    // Send to all user's subscriptions
    const userSubs = subscriptions.filter((s) => s.user_id === userId);
    for (const sub of userSubs) {
      try {
        await sendWebPush(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          payload,
          vapidKeys
        );
        sentCount++;
      } catch (e) {
        console.warn(`Push failed for ${sub.endpoint}:`, e);
      }
    }

    // Record sent notifications
    const records = toNotify.map((symbol) => ({
      user_id: userId,
      symbol,
      earnings_date: tomorrowStr,
    }));
    await supabase.from("earnings_notifications").upsert(records, {
      onConflict: "user_id,symbol,earnings_date",
    });
  }

  console.log(`Sent ${sentCount} push notifications`);
  return { sent: sentCount };
}

// ---- Request Handler ----

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "vapid_key") {
      const keys = await getOrCreateVapidKeys();
      return new Response(JSON.stringify({ publicKey: keys.publicKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "subscribe" && req.method === "POST") {
      const auth = req.headers.get("Authorization");
      if (!auth) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify the user
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: auth } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const { endpoint, keys: subKeys } = body;

      await supabase.from("push_subscriptions").upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh: subKeys.p256dh,
          auth: subKeys.auth,
        },
        { onConflict: "user_id,endpoint" }
      );

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "unsubscribe" && req.method === "POST") {
      const auth = req.headers.get("Authorization");
      if (!auth) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: auth } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("user_id", user.id)
        .eq("endpoint", body.endpoint);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "check_and_send") {
      const result = await checkAndSendEarningsNotifications();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Notification error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
