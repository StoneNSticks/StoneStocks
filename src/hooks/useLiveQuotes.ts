/**
 * useLiveQuotes — Auto-refreshing quotes for a list of symbols.
 * Polls every 60s when the tab is visible, pauses when hidden.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { getQuote } from "@/lib/stockApi";

interface LiveQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

const REFRESH_INTERVAL = 60_000; // 60 seconds

export function useLiveQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const visibleRef = useRef(true);

  const fetchQuotes = useCallback(async () => {
    if (symbols.length === 0 || !visibleRef.current) return;
    setIsRefreshing(true);

    try {
      const results = await Promise.allSettled(
        symbols.map(async (s) => {
          const q = await getQuote(s);
          return {
            symbol: s,
            price: q?.c || 0,
            change: q?.d || 0,
            changePercent: q?.dp || 0,
            high: q?.h || 0,
            low: q?.l || 0,
            volume: q?.v || 0,
            timestamp: Date.now(),
          } as LiveQuote;
        })
      );

      const newQuotes: Record<string, LiveQuote> = {};
      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value.price > 0) {
          newQuotes[r.value.symbol] = r.value;
        }
      });

      setQuotes((prev) => ({ ...prev, ...newQuotes }));
      setLastUpdate(new Date());
    } catch {
      // silent
    } finally {
      setIsRefreshing(false);
    }
  }, [symbols.join(",")]);

  useEffect(() => {
    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
      if (!document.hidden) fetchQuotes();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchQuotes]);

  useEffect(() => {
    fetchQuotes();
    intervalRef.current = setInterval(fetchQuotes, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchQuotes]);

  return { quotes, lastUpdate, isRefreshing, refresh: fetchQuotes };
}
