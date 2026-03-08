/**
 * useAlertChecker — Periodically checks active price alerts against live quotes.
 * When a price crosses the alert threshold, it marks the alert as triggered in the DB
 * and returns it so the UI can show a notification.
 */
import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getQuote } from "@/lib/stockApi";
import { useQueryClient } from "@tanstack/react-query";

interface TriggeredAlert {
  id: string;
  symbol: string;
  target_price: number;
  direction: string;
  currentPrice: number;
}

const CHECK_INTERVAL = 1000 * 60 * 3; // every 3 minutes

export function useAlertChecker() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [triggered, setTriggered] = useState<TriggeredAlert[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const prefsOff = localStorage.getItem("pref_price_alerts") === "false";

  const checkAlerts = useCallback(async () => {
    if (!user || prefsOff) return;

    const { data: alerts } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("user_id", user.id)
      .eq("triggered", false);

    if (!alerts || alerts.length === 0) return;

    // Group by symbol to minimise API calls
    const symbols = [...new Set(alerts.map((a) => a.symbol))];

    const quotes = await Promise.allSettled(
      symbols.map(async (s) => {
        const q = await getQuote(s);
        return { symbol: s, price: q?.c as number | undefined };
      })
    );

    const priceMap: Record<string, number> = {};
    quotes.forEach((r) => {
      if (r.status === "fulfilled" && r.value.price) {
        priceMap[r.value.symbol] = r.value.price;
      }
    });

    const newlyTriggered: TriggeredAlert[] = [];

    for (const alert of alerts) {
      const price = priceMap[alert.symbol];
      if (price == null) continue;

      const hit =
        (alert.direction === "above" && price >= alert.target_price) ||
        (alert.direction === "below" && price <= alert.target_price);

      if (hit) {
        await supabase
          .from("price_alerts")
          .update({ triggered: true })
          .eq("id", alert.id);

        newlyTriggered.push({
          id: alert.id,
          symbol: alert.symbol,
          target_price: alert.target_price,
          direction: alert.direction,
          currentPrice: price,
        });
      }
    }

    if (newlyTriggered.length > 0) {
      setTriggered((prev) => [...prev, ...newlyTriggered]);
      qc.invalidateQueries({ queryKey: ["price-alerts"] });
    }
  }, [user, prefsOff, qc]);

  useEffect(() => {
    if (!user || prefsOff) return;
    // Initial check after 5s
    const timeout = setTimeout(checkAlerts, 5000);
    intervalRef.current = setInterval(checkAlerts, CHECK_INTERVAL);
    return () => {
      clearTimeout(timeout);
      clearInterval(intervalRef.current);
    };
  }, [user, prefsOff, checkAlerts]);

  const dismiss = (id: string) => setTriggered((prev) => prev.filter((a) => a.id !== id));
  const dismissAll = () => setTriggered([]);

  return { triggered, dismiss, dismissAll };
}
