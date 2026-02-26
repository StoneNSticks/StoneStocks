import { useMarketIndices } from "@/hooks/useStockData";
import { formatCurrency, formatPercent, priceChangeColor } from "@/lib/formatters";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketOverview() {
  const { data: indices, isLoading } = useMarketIndices();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!indices || indices.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {indices.map((idx: any) => (
        <div
          key={idx.symbol}
          className="rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground truncate">{idx.name}</span>
            {idx.changePercent >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-gain flex-shrink-0" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-loss flex-shrink-0" />
            )}
          </div>
          <div className="font-display font-semibold text-lg">{formatCurrency(idx.price)}</div>
          <div className={`text-xs font-medium mt-0.5 ${priceChangeColor(idx.changePercent)}`}>
            {formatPercent(idx.changePercent)}
          </div>
        </div>
      ))}
    </div>
  );
}
