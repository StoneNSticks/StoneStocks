/**
 * PolymarketMacroModule — Shows market-implied macro expectations from Polymarket.
 * Displays prediction markets for Fed rates, inflation, recession, etc.
 */
import { usePolymarketMacro } from "@/hooks/usePolymarket";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, TrendingUp, TrendingDown, BarChart3, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function parseOutcomes(market: { outcomes: string; outcomePrices: string }) {
  try {
    const outcomes = JSON.parse(market.outcomes || "[]");
    const prices = JSON.parse(market.outcomePrices || "[]").map(Number);
    return { outcomes, prices };
  } catch {
    return { outcomes: [], prices: [] };
  }
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export function PolymarketMacroModule() {
  const { lang } = useLanguage();
  const { data: events, isLoading } = usePolymarketMacro();

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;
  if (!events || events.length === 0) return null;

  // Flatten and sort markets by volume
  const allMarkets = events
    .flatMap(e => e.markets || [])
    .filter(m => m.active && !m.closed)
    .sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0))
    .slice(0, 8);

  if (allMarkets.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/40 bg-muted/30">
        <Activity className="h-4 w-4 text-primary" />
        <div className="flex-1">
          <h3 className="font-display font-bold text-sm">
            {lang === "de" ? "Markt-Prognosen (Polymarket)" : "Market-Implied Expectations"}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {lang === "de" ? "Wahrscheinlichkeiten aus Prognosemärkten" : "Probabilities from prediction markets"}
          </p>
        </div>
        <Badge variant="secondary" className="text-[9px]">Live</Badge>
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {allMarkets.map((market) => {
          const { outcomes, prices } = parseOutcomes(market);
          const yesPrice = prices[0] || 0;
          const change = market.oneDayPriceChange || 0;

          return (
            <div key={market.id} className="rounded-lg border border-border/30 p-3 space-y-1.5 hover:border-primary/20 transition-colors">
              <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">{market.question}</p>
              <div className="flex items-center gap-2">
                {outcomes.length >= 2 && (
                  <div className="flex-1 h-4 rounded-full bg-muted/50 overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-emerald-500/70 transition-all"
                      style={{ width: `${Math.max(yesPrice * 100, 2)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                      {(yesPrice * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                {change !== 0 && (
                  <span className={`flex items-center gap-0.5 font-medium ${change > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {change > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(change * 100).toFixed(1)}%
                  </span>
                )}
                <span className="flex items-center gap-0.5">
                  <BarChart3 className="h-2.5 w-2.5" />{formatVolume(Number(market.volume || 0))}
                </span>
                <a
                  href={`https://polymarket.com/event/${market.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-primary hover:underline flex items-center gap-0.5"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-2 border-t border-border/30 text-[10px] text-muted-foreground text-center">
        {lang === "de" ? "Daten von Polymarket • Keine Anlageberatung" : "Data from Polymarket • Not financial advice"}
      </div>
    </motion.div>
  );
}
