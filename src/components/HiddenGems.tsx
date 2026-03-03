import { Link } from "react-router-dom";
import { useHiddenGems } from "@/hooks/useStockData";
import { formatPercent, formatNumber, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export function HiddenGems() {
  const { data: stocks, isLoading } = useHiddenGems();
  const fc = useFormattedCurrency();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Hidden Gems</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Hidden Gems</h2>
        </div>
        <span className="text-xs text-muted-foreground">Strong buy consensus with momentum</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {stocks.slice(0, 12).map((s: any) => (
          <Link
            key={s.symbol}
            to={`/stock/${s.symbol}`}
            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted group"
          >
            {s.logo ? (
              <img
                src={s.logo}
                alt={s.name}
                className="w-9 h-9 rounded-lg object-contain bg-background border border-border/40"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {s.symbol?.slice(0, 2)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold text-sm group-hover:text-primary transition-colors">
                {s.name || s.symbol}
              </div>
              <div className="text-[11px] text-muted-foreground">{s.symbol}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium tabular-nums">{fc(s.price)}</div>
              <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(s.changePercent)}`}>
                {formatPercent(s.changePercent)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
