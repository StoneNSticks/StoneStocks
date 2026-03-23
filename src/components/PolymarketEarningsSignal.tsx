/**
 * PolymarketEarningsSignal — Shows prediction market data relevant to a stock's earnings.
 * Searches for markets mentioning the ticker or company name with earnings-related keywords.
 */
import { usePolymarketEarnings } from "@/hooks/usePolymarket";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, BarChart3, ExternalLink, Activity } from "lucide-react";

function parseOutcomes(market: { outcomes: string; outcomePrices: string }) {
  try {
    const outcomes = JSON.parse(market.outcomes || "[]");
    const prices = JSON.parse(market.outcomePrices || "[]").map(Number);
    return { outcomes, prices };
  } catch {
    return { outcomes: [], prices: [] };
  }
}

export function PolymarketEarningsSignal({ symbol, companyName }: { symbol: string; companyName?: string }) {
  const { lang } = useLanguage();
  const { data: markets, isLoading } = usePolymarketEarnings(symbol, companyName);

  if (isLoading) return <Skeleton className="h-32 rounded-xl" />;
  if (!markets || markets.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/40 bg-muted/30">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="font-display font-bold text-sm">
          {lang === "de" ? "Prognose-Signal" : "Prediction Signal"}
        </h3>
        <Badge variant="secondary" className="text-[9px] ml-auto">Polymarket</Badge>
      </div>
      <div className="p-3 space-y-2">
        {markets.slice(0, 3).map((market) => {
          const { outcomes, prices } = parseOutcomes(market);
          const yesPrice = prices[0] || 0;
          const change = market.oneDayPriceChange || 0;

          return (
            <div key={market.id} className="rounded-lg border border-border/30 p-3 space-y-1.5">
              <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">{market.question}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                {outcomes.length >= 1 && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {(yesPrice * 100).toFixed(0)}% {outcomes[0]}
                  </span>
                )}
                {change !== 0 && (
                  <span className={`flex items-center gap-0.5 ${change > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(change * 100).toFixed(1)}%
                  </span>
                )}
                <span className="flex items-center gap-0.5">
                  <BarChart3 className="h-3 w-3" />
                  ${(Number(market.volume || 0) / 1000).toFixed(0)}K vol
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
    </div>
  );
}
