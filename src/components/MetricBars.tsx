/**
 * MetricBars — Range/progress bars for key stock metrics (P/E, RSI, margins, etc.)
 * Similar visual style to WeekRangeBar.
 */
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";

interface RangeBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  format?: "number" | "percent" | "currency";
  colorScheme?: "default" | "inverted" | "rsi";
}

function RangeBar({ label, value, min, max, format = "number", colorScheme = "default" }: RangeBarProps) {
  const { symbol: cSym } = useCurrency();
  if (value == null || isNaN(value) || max <= min) return null;

  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const fmtVal = (v: number) => {
    if (format === "percent") return `${v.toFixed(1)}%`;
    if (format === "currency") return `${cSym}${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return v.toFixed(1);
  };

  const getGradient = () => {
    if (colorScheme === "rsi") return "from-chart-2/60 via-muted-foreground/40 to-destructive/60";
    if (colorScheme === "inverted") return "from-destructive/60 via-muted-foreground/30 to-chart-2/60";
    return "from-destructive/60 via-primary to-chart-2/80";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className="text-xs font-mono font-semibold text-foreground">{fmtVal(value)}</span>
      </div>
      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getGradient()} opacity-30`} />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3.5 w-1 rounded-full bg-foreground shadow-md transition-all duration-500"
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] font-mono text-muted-foreground">{fmtVal(min)}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{fmtVal(max)}</span>
      </div>
    </div>
  );
}

function safeNum(val: unknown): number { const n = Number(val); return isNaN(n) ? 0 : n; }

export function MetricBars({ overview, quote, derived }: {
  overview: Record<string, string> | null;
  quote: Record<string, number> | null;
  derived: Record<string, number | null> | null;
}) {
  const t = useT();

  const pe = safeNum(derived?.calculatedPE) || safeNum(overview?.PERatio);
  const pb = safeNum(derived?.calculatedPB) || safeNum(overview?.PriceToBookRatio);
  const dividendYield = safeNum(derived?.dividendYield) || (overview?.DividendYield ? safeNum(overview.DividendYield) * 100 : 0);
  const profitMargin = overview?.ProfitMargin ? safeNum(overview.ProfitMargin) * 100 : 0;
  const operatingMargin = overview?.OperatingMarginTTM ? safeNum(overview.OperatingMarginTTM) * 100 : 0;
  const roe = overview?.ReturnOnEquityTTM ? safeNum(overview.ReturnOnEquityTTM) * 100 : 0;
  const beta = safeNum(overview?.Beta);
  const dayRange = quote?.h && quote?.l && quote?.c ? { low: quote.l, high: quote.h, current: quote.c } : null;

  const bars: RangeBarProps[] = [];

  if (dayRange && dayRange.high > dayRange.low) {
    bars.push({ label: t("m.dayRange") || "Day Range", value: dayRange.current, min: dayRange.low, max: dayRange.high, format: "currency" });
  }
  if (pe > 0 && pe < 200) bars.push({ label: t("m.pe"), value: pe, min: 0, max: 60, format: "number", colorScheme: "inverted" });
  if (pb > 0 && pb < 50) bars.push({ label: t("m.pb"), value: pb, min: 0, max: 15, format: "number", colorScheme: "inverted" });
  if (dividendYield > 0) bars.push({ label: t("m.dividendYield"), value: dividendYield, min: 0, max: 8, format: "percent" });
  if (profitMargin !== 0) bars.push({ label: t("m.profitMargin"), value: profitMargin, min: -20, max: 50, format: "percent" });
  if (operatingMargin !== 0) bars.push({ label: t("m.operatingMargin"), value: operatingMargin, min: -20, max: 50, format: "percent" });
  if (roe !== 0) bars.push({ label: t("m.roe"), value: roe, min: -20, max: 60, format: "percent" });
  if (beta > 0) bars.push({ label: t("m.beta"), value: beta, min: 0, max: 3, format: "number", colorScheme: "rsi" });

  if (bars.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        {t("m.keyRanges") || "Key Ranges"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bars.map(b => <RangeBar key={b.label} {...b} />)}
      </div>
    </div>
  );
}
