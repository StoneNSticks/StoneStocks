import { useQuery } from "@tanstack/react-query";
import { getTechnicals } from "@/lib/stockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function parseVal(obj: any, key: string): number | null {
  const v = obj?.[0]?.[key];
  return v != null ? parseFloat(v) : null;
}

export function TechnicalIndicators({ symbol }: { symbol: string }) {
  const t = useT();
  const { lang } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["technicals", symbol],
    queryFn: () => getTechnicals(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 4,
  });

  if (isLoading) return <Skeleton className="h-48 rounded-xl" />;

  const rsiVal = parseVal(data?.rsi, "rsi");
  const macdVal = parseVal(data?.macd, "macd");
  const macdSignal = parseVal(data?.macd, "macd_signal");
  const macdHist = parseVal(data?.macd, "macd_hist");
  const sma20 = parseVal(data?.sma20, "sma");
  const sma50 = parseVal(data?.sma50, "sma");
  const sma200 = parseVal(data?.sma200, "sma");
  const ema12 = parseVal(data?.ema12, "ema");
  const ema26 = parseVal(data?.ema26, "ema");
  const stochK = parseVal(data?.stoch, "slow_k");
  const stochD = parseVal(data?.stoch, "slow_d");
  const adxVal = parseVal(data?.adx, "adx");
  const atrVal = parseVal(data?.atr, "atr");
  const bbandsUpper = parseVal(data?.bbands, "upper_band");
  const bbandsMiddle = parseVal(data?.bbands, "middle_band");
  const bbandsLower = parseVal(data?.bbands, "lower_band");
  const cciVal = parseVal(data?.cci, "cci");

  const hasAny = rsiVal != null || macdVal != null || sma20 != null;
  if (!hasAny) return null;

  const signalColor = (s: "bullish" | "bearish" | "neutral") => {
    if (s === "bullish") return "text-chart-2 bg-chart-2/10 border-chart-2/20";
    if (s === "bearish") return "text-destructive bg-destructive/10 border-destructive/20";
    return "text-muted-foreground bg-muted border-border/60";
  };

  const signalIcon = (s: "bullish" | "bearish" | "neutral") => {
    if (s === "bullish") return <TrendingUp className="h-3 w-3" />;
    if (s === "bearish") return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const rsiSignal: "bullish" | "bearish" | "neutral" = rsiVal != null ? (rsiVal > 70 ? "bearish" : rsiVal < 30 ? "bullish" : "neutral") : "neutral";
  const macdCross: "bullish" | "bearish" | "neutral" = macdVal != null && macdSignal != null ? (macdVal > macdSignal ? "bullish" : "bearish") : "neutral";
  const stochSignal: "bullish" | "bearish" | "neutral" = stochK != null ? (stochK > 80 ? "bearish" : stochK < 20 ? "bullish" : "neutral") : "neutral";
  const cciSignal: "bullish" | "bearish" | "neutral" = cciVal != null ? (cciVal > 100 ? "bearish" : cciVal < -100 ? "bullish" : "neutral") : "neutral";
  const adxSignal: "bullish" | "bearish" | "neutral" = adxVal != null ? (adxVal > 25 ? "bullish" : "neutral") : "neutral";

  // SMA trend
  const smaSignal: "bullish" | "bearish" | "neutral" = sma50 != null && sma200 != null
    ? (sma50 > sma200 ? "bullish" : "bearish")
    : "neutral";

  type Indicator = { label: string; value: string; signal: "bullish" | "bearish" | "neutral"; signalText: string; sub?: string };
  const indicators: Indicator[] = [];

  if (rsiVal != null) indicators.push({
    label: "RSI (14)",
    value: rsiVal.toFixed(1),
    signal: rsiSignal,
    signalText: rsiVal > 70 ? (lang === "de" ? "Überkauft" : "Overbought") : rsiVal < 30 ? (lang === "de" ? "Überverkauft" : "Oversold") : "Neutral",
  });

  if (macdVal != null) indicators.push({
    label: "MACD",
    value: macdVal.toFixed(3),
    signal: macdCross,
    signalText: macdCross === "bullish" ? (lang === "de" ? "Bullisch" : "Bullish") : (lang === "de" ? "Bärisch" : "Bearish"),
    sub: `Signal: ${macdSignal?.toFixed(3) ?? "—"} | Hist: ${macdHist?.toFixed(3) ?? "—"}`,
  });

  if (stochK != null) indicators.push({
    label: "Stochastic",
    value: `%K ${stochK.toFixed(1)}`,
    signal: stochSignal,
    signalText: stochK > 80 ? (lang === "de" ? "Überkauft" : "Overbought") : stochK < 20 ? (lang === "de" ? "Überverkauft" : "Oversold") : "Neutral",
    sub: `%D ${stochD?.toFixed(1) ?? "—"}`,
  });

  if (adxVal != null) indicators.push({
    label: "ADX (14)",
    value: adxVal.toFixed(1),
    signal: adxSignal,
    signalText: adxVal > 25 ? (lang === "de" ? "Starker Trend" : "Strong Trend") : (lang === "de" ? "Schwacher Trend" : "Weak Trend"),
  });

  if (cciVal != null) indicators.push({
    label: "CCI (20)",
    value: cciVal.toFixed(1),
    signal: cciSignal,
    signalText: cciVal > 100 ? (lang === "de" ? "Überkauft" : "Overbought") : cciVal < -100 ? (lang === "de" ? "Überverkauft" : "Oversold") : "Neutral",
  });

  if (atrVal != null) indicators.push({
    label: "ATR (14)",
    value: atrVal.toFixed(2),
    signal: "neutral",
    signalText: lang === "de" ? "Volatilität" : "Volatility",
  });

  // Moving averages section
  const mas: { label: string; value: number | null }[] = [
    { label: "SMA 20", value: sma20 },
    { label: "SMA 50", value: sma50 },
    { label: "SMA 200", value: sma200 },
    { label: "EMA 12", value: ema12 },
    { label: "EMA 26", value: ema26 },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
      <h3 className="font-display font-semibold text-sm text-muted-foreground">{t("ti.title")}</h3>

      {/* Oscillators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {indicators.map((ind) => (
          <div key={ind.label} className="rounded-lg border border-border/40 bg-background p-2.5 space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] text-muted-foreground font-medium">{ind.label}</span>
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${signalColor(ind.signal)}`}>
                {signalIcon(ind.signal)}
                {ind.signalText}
              </span>
            </div>
            <div className="font-mono font-bold text-base">{ind.value}</div>
            {ind.sub && <div className="text-[10px] text-muted-foreground">{ind.sub}</div>}
            {ind.label === "RSI (14)" && rsiVal != null && (
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, rsiVal)}%`,
                    backgroundColor: rsiVal > 70 ? "hsl(var(--destructive))" : rsiVal < 30 ? "hsl(145, 63%, 42%)" : "hsl(var(--primary))",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Moving Averages */}
      {mas.some(m => m.value != null) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">{lang === "de" ? "Gleitende Durchschnitte" : "Moving Averages"}</span>
            {sma50 != null && sma200 != null && (
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${signalColor(smaSignal)}`}>
                {signalIcon(smaSignal)}
                {sma50 > sma200 ? "Golden Cross" : "Death Cross"}
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {mas.map((m) => m.value != null && (
              <div key={m.label} className="rounded-md bg-muted/40 p-1.5 text-center">
                <div className="text-[9px] text-muted-foreground font-medium">{m.label}</div>
                <div className="font-mono text-xs font-bold text-foreground">{m.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bollinger Bands */}
      {bbandsUpper != null && bbandsLower != null && (
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground">Bollinger Bands (20)</span>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-md bg-muted/40 p-1.5 text-center">
              <div className="text-[9px] text-muted-foreground">{lang === "de" ? "Unten" : "Lower"}</div>
              <div className="font-mono text-xs font-bold">{bbandsLower.toFixed(2)}</div>
            </div>
            <div className="rounded-md bg-primary/[0.06] border border-primary/20 p-1.5 text-center">
              <div className="text-[9px] text-primary font-medium">{lang === "de" ? "Mitte" : "Middle"}</div>
              <div className="font-mono text-xs font-bold">{bbandsMiddle?.toFixed(2)}</div>
            </div>
            <div className="rounded-md bg-muted/40 p-1.5 text-center">
              <div className="text-[9px] text-muted-foreground">{lang === "de" ? "Oben" : "Upper"}</div>
              <div className="font-mono text-xs font-bold">{bbandsUpper.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
