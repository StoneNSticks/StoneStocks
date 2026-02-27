import { useState } from "react";
import { Link } from "react-router-dom";
import { useGainersLosers } from "@/hooks/useStockData";
import { formatCurrency, formatPercent, formatNumber, priceChangeColor } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export function GainersLosers() {
  const [tab, setTab] = useState<"gainers" | "losers">("gainers");
  const { data, isLoading } = useGainersLosers();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Winners & Losers</h2>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const list = tab === "gainers" ? data?.gainers : data?.losers;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
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
        <div className="space-y-0.5">
          {list.slice(0, 8).map((item: any) => (
            <Link
              key={item.symbol}
              to={`/stock/${item.symbol}`}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 -mx-1 transition-colors hover:bg-muted group"
            >
              <span className="font-display font-semibold text-sm group-hover:text-primary transition-colors">
                {item.symbol}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm">{formatCurrency(item.price)}</span>
                <span className={`text-xs font-medium w-16 text-right ${priceChangeColor(item.changePercent)}`}>
                  {formatPercent(item.changePercent)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No data available yet.</p>
      )}
    </div>
  );
}
