/**
 * TickerTape: Horizontally scrolling ticker tape showing major indices and top stocks.
 * Uses CSS animation for smooth infinite scroll. Displays symbol, price, change%.
 */
import { useMarketIndices } from "@/hooks/useStockData";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

export function TickerTape() {
  const { data: indices } = useMarketIndices();
  const { convert, symbol: cSym } = useCurrency();

  if (!indices || indices.length === 0) return null;

  const items = indices.filter((i: any) => i.price > 0);
  if (items.length === 0) return null;

  // Double the items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-muted/30 border-b border-border/30">
      <div className="ticker-scroll flex items-center gap-6 py-1.5 whitespace-nowrap">
        {doubled.map((idx: any, i: number) => {
          const isUp = (idx.changePercent || 0) >= 0;
          return (
            <div key={`${idx.indexSymbol}-${i}`} className="flex items-center gap-1.5 text-xs shrink-0">
              <span className="font-mono font-semibold text-foreground/80">{idx.name}</span>
              <span className="font-mono text-foreground">
                {idx.price?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
              <span className={`flex items-center gap-0.5 font-mono font-semibold ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isUp ? "+" : ""}{idx.changePercent?.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
