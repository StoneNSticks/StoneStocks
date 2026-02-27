import { formatPercent, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StockPerformanceProps {
  quote: Record<string, number> | null;
  overview: Record<string, string> | null;
  massiveSnapshot: Record<string, unknown> | null;
}

export function StockPerformance({ quote, overview, massiveSnapshot }: StockPerformanceProps) {
  const fc = useFormattedCurrency();

  const high52 = parseFloat(overview?.["52WeekHigh"] || "0") || (quote as any)?.["52WeekHigh"] || 0;
  const low52 = parseFloat(overview?.["52WeekLow"] || "0") || (quote as any)?.["52WeekLow"] || 0;
  const price = quote?.c || 0;

  // Calculate where price sits in 52-week range
  const rangePercent = high52 > low52 && price > 0
    ? ((price - low52) / (high52 - low52)) * 100
    : 50;

  const dayHigh = quote?.h || 0;
  const dayLow = quote?.l || 0;
  const dayRangePercent = dayHigh > dayLow && price > 0
    ? ((price - dayLow) / (dayHigh - dayLow)) * 100
    : 50;

  // Performance calculations from overview
  const beta = parseFloat(overview?.Beta || "0");
  const targetPrice = parseFloat(overview?.AnalystTargetPrice || "0");
  const upside = targetPrice > 0 && price > 0 ? ((targetPrice - price) / price) * 100 : 0;

  const performances = [
    { label: "Day Change", value: quote?.dp || 0 },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
      <h3 className="font-display font-semibold text-sm text-muted-foreground">Performance & Range</h3>

      {/* Day Range */}
      {dayHigh > 0 && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Day Range</span>
            <span>{fc(dayLow)} — {fc(dayHigh)}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full">
            <div
              className="absolute top-0 h-2 bg-primary rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, dayRangePercent))}%` }}
            />
          </div>
        </div>
      )}

      {/* 52-week Range */}
      {high52 > 0 && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>52-Week Range</span>
            <span>{fc(low52)} — {fc(high52)}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full">
            <div
              className="absolute top-0 h-2 bg-primary/70 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, rangePercent))}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background"
              style={{ left: `${Math.min(96, Math.max(2, rangePercent))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>{rangePercent.toFixed(0)}% from low</span>
            <span>{(100 - rangePercent).toFixed(0)}% from high</span>
          </div>
        </div>
      )}

      {/* Key stats row */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        {beta > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold font-display">{beta.toFixed(2)}</div>
            <div className="text-[10px] text-muted-foreground">Beta</div>
          </div>
        )}
        {targetPrice > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold font-display">{fc(targetPrice)}</div>
            <div className="text-[10px] text-muted-foreground">Target Price</div>
          </div>
        )}
        {upside !== 0 && (
          <div className="text-center">
            <div className={`text-lg font-bold font-display ${priceChangeColor(upside)}`}>
              {formatPercent(upside)}
            </div>
            <div className="text-[10px] text-muted-foreground">Upside</div>
          </div>
        )}
      </div>
    </div>
  );
}
