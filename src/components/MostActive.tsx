import { Link } from "react-router-dom";
import { useMostActive } from "@/hooks/useStockData";
import { formatCurrency, formatPercent, formatNumber, priceChangeColor } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

export function MostActive() {
  const { data: stocks, isLoading } = useMostActive();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Most Traded</h2>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Most Traded</h2>
        </div>
        <p className="text-sm text-muted-foreground py-4 text-center">
          Volume data loading — available after market close.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold">Most Traded</h2>
      </div>
      <div className="space-y-0.5">
        {stocks.slice(0, 10).map((s: any, i: number) => (
          <Link
            key={s.symbol}
            to={`/stock/${s.symbol}`}
            className="flex items-center justify-between rounded-lg px-2.5 py-2 -mx-1 transition-colors hover:bg-muted group"
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground w-4">{i + 1}</span>
              <span className="font-display font-semibold text-sm group-hover:text-primary transition-colors w-14">
                {s.symbol}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatNumber(s.volume)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm tabular-nums">{formatCurrency(s.price)}</span>
              <span className={`text-xs font-medium w-16 text-right tabular-nums ${priceChangeColor(s.changePercent)}`}>
                {formatPercent(s.changePercent)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
