import { Link } from "react-router-dom";
import { useMarketIndices } from "@/hooks/useStockData";
import { priceChangeColor } from "@/lib/formatters";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function formatPoints(num: number): string {
  if (num == null || isNaN(num)) return "—";
  return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatChange(num: number): string {
  if (num == null || isNaN(num)) return "—";
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}`;
}

function formatChangePercent(num: number): string {
  if (num == null || isNaN(num)) return "—";
  const sign = num >= 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

export function MarketOverview() {
  const { data: indices, isLoading } = useMarketIndices();

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 min-w-[180px] rounded-xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (!indices || indices.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
      {indices.map((idx: any) => (
        <Link
          key={idx.symbol}
          to={`/stock/${idx.symbol}`}
          className="flex-shrink-0 min-w-[180px] rounded-xl border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/40 hover:shadow-sm group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {idx.name}
            </span>
            {idx.changePercent >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-gain flex-shrink-0" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-loss flex-shrink-0" />
            )}
          </div>
          <div className="font-display font-bold text-lg">
            {formatPoints(idx.price)}
          </div>
          <div className={`text-[11px] font-medium ${priceChangeColor(idx.changePercent)}`}>
            {formatChange(idx.change)} ({formatChangePercent(idx.changePercent)})
          </div>
        </Link>
      ))}
    </div>
  );
}
