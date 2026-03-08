/**
 * SentimentVote — Bullish/Bearish voting widget for stocks.
 * Reads/writes to `stock_votes` table. Shows aggregate sentiment.
 * Users can vote once per stock (upsert on user_id + symbol).
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown } from "lucide-react";

export function SentimentVote({ symbol }: { symbol: string }) {
  const { user } = useAuth();
  const t = useT();
  const [bulls, setBulls] = useState(0);
  const [bears, setBears] = useState(0);
  const [userVote, setUserVote] = useState<"bullish" | "bearish" | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await (supabase as any)
        .from("stock_votes")
        .select("vote")
        .eq("symbol", symbol);
      if (data) {
        setBulls(data.filter((v: any) => v.vote === "bullish").length);
        setBears(data.filter((v: any) => v.vote === "bearish").length);
      }
      if (user) {
        const { data: myVote } = await (supabase as any)
          .from("stock_votes")
          .select("vote")
          .eq("symbol", symbol)
          .eq("user_id", user.id)
          .maybeSingle();
        if (myVote) setUserVote(myVote.vote as "bullish" | "bearish");
      }
    };
    fetch();
  }, [symbol, user]);

  const vote = async (v: "bullish" | "bearish") => {
    if (!user) return;
    const { error } = await (supabase as any)
      .from("stock_votes")
      .upsert({ user_id: user.id, symbol, vote: v }, { onConflict: "user_id,symbol" });
    if (!error) {
      if (userVote === v) return;
      if (userVote) {
        if (userVote === "bullish") setBulls(b => b - 1); else setBears(b => b - 1);
      }
      if (v === "bullish") setBulls(b => b + 1); else setBears(b => b + 1);
      setUserVote(v);
    }
  };

  const total = bulls + bears;
  const bullPct = total > 0 ? (bulls / total) * 100 : 50;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="text-xs text-muted-foreground mb-3 font-medium">{t("sentiment.community")}</div>
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => vote("bullish")}
          disabled={!user}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${userVote === "bullish" ? "bg-chart-2/20 text-chart-2 ring-1 ring-chart-2/40" : "bg-muted/50 text-muted-foreground hover:bg-chart-2/10"}`}
        >
          <TrendingUp className="h-4 w-4" /> {t("sentiment.bullish")} ({bulls})
        </button>
        <button
          onClick={() => vote("bearish")}
          disabled={!user}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${userVote === "bearish" ? "bg-destructive/20 text-destructive ring-1 ring-destructive/40" : "bg-muted/50 text-muted-foreground hover:bg-destructive/10"}`}
        >
          <TrendingDown className="h-4 w-4" /> {t("sentiment.bearish")} ({bears})
        </button>
      </div>
      {total > 0 && (
        <div className="flex rounded-lg overflow-hidden h-2.5">
          <div className="bg-chart-2/70 transition-all" style={{ width: `${bullPct}%` }} />
          <div className="bg-destructive/70 transition-all" style={{ width: `${100 - bullPct}%` }} />
        </div>
      )}
      {!user && <p className="text-[10px] text-muted-foreground mt-2">{t("sentiment.loginToVote")}</p>}
    </div>
  );
}
