import { useMarketIndices } from "@/hooks/useStockData";
import { priceChangeColor } from "@/lib/formatters";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function formatPoints(num: number): string {
  if (num == null || isNaN(num) || num === 0) return "—";
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] min-w-[190px] rounded-xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (!indices || indices.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
      {indices.map((idx: any) => {
        const isPositive = idx.changePercent >= 0;
        return (
          <div
            key={idx.indexSymbol}
            className={`flex-shrink-0 min-w-[190px] rounded-xl border px-4 py-3 transition-all ${
              isPositive
                ? "border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.04)]"
                : "border-destructive/30 bg-destructive/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">
                  {idx.name}
                </span>
              </div>
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-gain flex-shrink-0" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-loss flex-shrink-0" />
              )}
            </div>
            <div className="font-display font-bold text-lg tabular-nums">
              {formatPoints(idx.price)}
            </div>
            <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(idx.changePercent)}`}>
              {formatChange(idx.change)} ({formatChangePercent(idx.changePercent)})
            </div>
          </div>
        );
      })}
    </div>
  );
}
