import { useQuery } from "@tanstack/react-query";
import { getTechnicals } from "@/lib/stockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/contexts/LanguageContext";

export function TechnicalIndicators({ symbol }: { symbol: string }) {
  const t = useT();
  const { data, isLoading } = useQuery({
    queryKey: ["technicals", symbol],
    queryFn: () => getTechnicals(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 4,
  });

  if (isLoading) return <Skeleton className="h-24 rounded-xl" />;

  const rsiVal = data?.rsi?.[0]?.rsi ? parseFloat(data.rsi[0].rsi) : null;
  const macdVal = data?.macd?.[0]?.macd ? parseFloat(data.macd[0].macd) : null;
  const macdSignal = data?.macd?.[0]?.macd_signal ? parseFloat(data.macd[0].macd_signal) : null;

  if (rsiVal == null && macdVal == null) return null;

  const rsiSignal = rsiVal != null ? (rsiVal > 70 ? "overbought" : rsiVal < 30 ? "oversold" : "neutral") : null;
  const macdCross = macdVal != null && macdSignal != null ? (macdVal > macdSignal ? "bullish" : "bearish") : null;

  const signalColor = (s: string | null) => {
    if (s === "bullish" || s === "oversold") return "text-chart-2 bg-chart-2/10 border-chart-2/20";
    if (s === "bearish" || s === "overbought") return "text-destructive bg-destructive/10 border-destructive/20";
    return "text-muted-foreground bg-muted border-border/60";
  };

  const signalLabel = (s: string | null) => {
    if (!s) return "—";
    const labels: Record<string, string> = {
      bullish: t("ti.bullish"), bearish: t("ti.bearish"),
      overbought: t("ti.overbought"), oversold: t("ti.oversold"),
      neutral: t("ti.neutral"),
    };
    return labels[s] || s;
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">{t("ti.title")}</h3>
      <div className="grid grid-cols-2 gap-3">
        {rsiVal != null && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">RSI (14)</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${signalColor(rsiSignal)}`}>
                {signalLabel(rsiSignal)}
              </span>
            </div>
            <div className="font-mono font-bold text-lg">{rsiVal.toFixed(1)}</div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, rsiVal)}%`,
                  backgroundColor: rsiVal > 70 ? "hsl(0, 72%, 51%)" : rsiVal < 30 ? "hsl(145, 63%, 42%)" : "hsl(210, 80%, 55%)",
                }}
              />
            </div>
          </div>
        )}
        {macdVal != null && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">MACD</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${signalColor(macdCross)}`}>
                {signalLabel(macdCross)}
              </span>
            </div>
            <div className="font-mono font-bold text-lg">{macdVal.toFixed(3)}</div>
            <div className="text-[10px] text-muted-foreground">
              Signal: {macdSignal?.toFixed(3) || "—"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
