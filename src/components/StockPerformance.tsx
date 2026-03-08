import { memo } from "react";
import { formatPercent, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { useT } from "@/contexts/LanguageContext";

interface StockPerformanceProps {
  quote: Record<string, number> | null;
  overview: Record<string, string> | null;
  massiveSnapshot: Record<string, unknown> | null;
}

export const StockPerformance = memo(function StockPerformance({ quote, overview, massiveSnapshot }: StockPerformanceProps) {
  const fc = useFormattedCurrency();
  const t = useT();

  const high52 = parseFloat(overview?.["52WeekHigh"] || "0") || (quote as any)?.["52WeekHigh"] || 0;
  const low52 = parseFloat(overview?.["52WeekLow"] || "0") || (quote as any)?.["52WeekLow"] || 0;
  const price = quote?.c || 0;
  const rangePercent = high52 > low52 && price > 0 ? ((price - low52) / (high52 - low52)) * 100 : 50;
  const dayHigh = quote?.h || 0;
  const dayLow = quote?.l || 0;
  const dayRangePercent = dayHigh > dayLow && price > 0 ? ((price - dayLow) / (dayHigh - dayLow)) * 100 : 50;
  const beta = parseFloat(overview?.Beta || "0");
  const targetPrice = parseFloat(overview?.AnalystTargetPrice || "0");
  const upside = targetPrice > 0 && price > 0 ? ((targetPrice - price) / price) * 100 : 0;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
      <h3 className="font-display font-semibold text-sm text-muted-foreground">{t("perf.title")}</h3>
      {dayHigh > 0 && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{t("perf.dayRange")}</span>
            <span>{fc(dayLow)} – {fc(dayHigh)}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full">
            <div className="absolute top-0 h-2 bg-primary rounded-full" style={{ width: `${Math.min(100, Math.max(0, dayRangePercent))}%` }} />
          </div>
        </div>
      )}
      {high52 > 0 && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{t("perf.weekRange")}</span>
            <span>{fc(low52)} – {fc(high52)}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full">
            <div className="absolute top-0 h-2 bg-primary/70 rounded-full" style={{ width: `${Math.min(100, Math.max(0, rangePercent))}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background" style={{ left: `${Math.min(96, Math.max(2, rangePercent))}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>{rangePercent.toFixed(0)}% {t("perf.fromLow")}</span>
            <span>{(100 - rangePercent).toFixed(0)}% {t("perf.fromHigh")}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 pt-1">
        {beta > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold font-display">{beta.toFixed(2)}</div>
            <div className="text-[10px] text-muted-foreground">{t("perf.beta")}</div>
          </div>
        )}
        {targetPrice > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold font-display">{fc(targetPrice)}</div>
            <div className="text-[10px] text-muted-foreground">{t("perf.targetPrice")}</div>
          </div>
        )}
        {upside !== 0 && (
          <div className="text-center">
            <div className={`text-lg font-bold font-display ${priceChangeColor(upside)}`}>{formatPercent(upside)}</div>
            <div className="text-[10px] text-muted-foreground">{t("perf.upside")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
