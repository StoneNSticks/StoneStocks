/**
 * useEarningsNotifications — Manages push subscription and in-app earnings reminders.
 * Checks on load if watchlist stocks have earnings tomorrow and shows browser notification.
 */
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useEarningsCalendar } from "@/hooks/useStockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const NOTIF_FN_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/notifications`;

export type PushStatus = "unsupported" | "denied" | "granted" | "default" | "loading";

/** Fetch VAPID public key from edge function */
async function fetchVapidKey(): Promise<string | null> {
  try {
    const res = await fetch(`${NOTIF_FN_URL}?action=vapid_key`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    const json = await res.json();
    return json.publicKey || null;
  } catch {
    return null;
  }
}

function urlBase64ToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(base64 + padding);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function usePushSubscription() {
  const { user } = useAuth();
  const [status, setStatus] = useState<PushStatus>("loading");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as PushStatus);

    // Check if already subscribed
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!user) {
      toast.error("Bitte zuerst einloggen");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as PushStatus);
      if (permission !== "granted") return false;

      const vapidKey = await fetchVapidKey();
      if (!vapidKey) {
        toast.error("Push-Setup fehlgeschlagen");
        return false;
      }

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      });

      const subJson = subscription.toJSON();
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(`${NOTIF_FN_URL}?action=subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        toast.success("Push-Benachrichtigungen aktiviert! 🔔");
        return true;
      }
      return false;
    } catch (e) {
      console.error("Push subscription failed:", e);
      toast.error("Push-Abo konnte nicht erstellt werden");
      return false;
    }
  }, [user]);

  const unsubscribe = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const subJson = sub.toJSON();
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        await fetch(`${NOTIF_FN_URL}?action=unsubscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint: subJson.endpoint }),
        });

        await sub.unsubscribe();
      }
      setIsSubscribed(false);
      toast.success("Push-Benachrichtigungen deaktiviert");
    } catch (e) {
      console.error("Unsubscribe failed:", e);
    }
  }, []);

  return { status, isSubscribed, subscribe, unsubscribe };
}

/** In-app check: shows toast notification when earnings are tomorrow */
export function useInAppEarningsCheck() {
  const { user } = useAuth();
  const { data: watchlist } = useWatchlist();
  const symbols = (watchlist || []).map((w) => w.symbol);
  const symbolStr = symbols.join(",");
  const { data: earnings } = useEarningsCalendar(symbolStr);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!user || !earnings || !Array.isArray(earnings) || checkedRef.current) return;
    checkedRef.current = true;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const tomorrowEarnings = earnings.filter((e: any) => e.date === tomorrowStr);
    const todayEarnings = earnings.filter((e: any) => e.date === todayStr);

    if (todayEarnings.length > 0) {
      const syms = todayEarnings.map((e: any) => e.symbol).join(", ");
      toast.info(`📊 Heute Quartalszahlen: ${syms}`, { duration: 8000 });
    }

    if (tomorrowEarnings.length > 0) {
      const syms = tomorrowEarnings.map((e: any) => e.symbol).join(", ");
      toast.info(`🔔 Morgen Quartalszahlen: ${syms}`, { duration: 8000 });
    }
  }, [user, earnings]);
}
