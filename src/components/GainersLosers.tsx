import { useState } from "react";
import { Link } from "react-router-dom";
import { useGainersLosers } from "@/hooks/useStockData";
import { formatPercent, formatNumber, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export function GainersLosers() {
  const [tab, setTab] = useState<"gainers" | "losers">("gainers");
  const { data, isLoading } = useGainersLosers();
  const fc = useFormattedCurrency();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Winners & Losers</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const list = tab === "gainers" ? data?.gainers : data?.losers;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold">Winners & Losers</h2>
      </div>
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setTab("gainers")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === "gainers"
              ? "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Winners
        </button>
        <button
          onClick={() => setTab("losers")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === "losers"
              ? "bg-destructive/15 text-destructive"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Losers
        </button>
      </div>
      {list && list.length > 0 ? (
        <div className="space-y-1">
          {list.slice(0, 8).map((item: any, i: number) => (
            <Link
              key={item.symbol}
              to={`/stock/${item.symbol}`}
              className="flex items-center gap-3 rounded-lg p-2.5 -mx-1 transition-colors hover:bg-muted group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.name || item.symbol}
                    className="w-8 h-8 rounded-lg object-contain bg-background border border-border/40"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {(item.name || item.symbol)?.slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-display font-semibold text-sm group-hover:text-primary transition-colors truncate">
                    {item.name || item.symbol}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.symbol} · Vol: {formatNumber(item.volume)}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium tabular-nums">{fc(item.price)}</div>
                <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(item.changePercent)}`}>
                  {formatPercent(item.changePercent)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Market data loading…
        </p>
      )}
    </div>
  );
}
