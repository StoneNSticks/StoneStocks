import { Link } from "react-router-dom";
import { useMarketIndices } from "@/hooks/useStockData";
import { priceChangeColor } from "@/lib/formatters";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || paused) return;
    let raf: number;
    const speed = 0.5; // px per frame
    const step = () => {
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += speed;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, indices]);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-hidden pb-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] min-w-[180px] rounded-xl flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (!indices || indices.length === 0) return null;

  // Duplicate for infinite scroll illusion
  const items = [...indices, ...indices];

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-hidden pb-1 -mx-1 px-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((idx: any, i: number) => {
        const isPositive = idx.changePercent >= 0;
        return (
          <Link
            key={`${idx.indexSymbol}-${i}`}
            to={`/index/${idx.indexSymbol}`}
            className={`flex-shrink-0 min-w-[180px] rounded-xl border px-4 py-3 transition-all hover:scale-[1.02] cursor-pointer ${
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
          </Link>
        );
      })}
    </div>
  );
}
