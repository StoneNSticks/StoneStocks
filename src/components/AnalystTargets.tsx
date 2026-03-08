import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";

interface AnalystTargetsProps {
  overview: Record<string, string> | null;
  quote: Record<string, number> | null;
}

export function AnalystTargets({ overview, quote }: AnalystTargetsProps) {
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();

  const target = parseFloat(overview?.AnalystTargetPrice || "0");
  const high = parseFloat(overview?.AnalystHighTarget || overview?.["52WeekHigh"] || "0");
  const low = parseFloat(overview?.AnalystLowTarget || overview?.["52WeekLow"] || "0");
  const price = quote?.c || 0;

  if (!target || !price) return null;

  const upside = ((target - price) / price) * 100;
  const rangeMin = Math.min(low, price * 0.7);
  const rangeMax = Math.max(high, price * 1.3);
  const span = rangeMax - rangeMin || 1;
  const pricePct = ((price - rangeMin) / span) * 100;
  const targetPct = ((target - rangeMin) / span) * 100;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">
        {t("at.title")}
      </h3>
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-muted-foreground">{t("at.consensus")}</span>
        <span className="font-display font-bold">{cSym}{convert(target)?.toFixed(2)}</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-2">
        {/* Current price marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground z-10"
          style={{ left: `${Math.min(100, Math.max(0, pricePct))}%` }}
        />
        {/* Target marker */}
        <div
          className="absolute top-0 h-full w-1.5 rounded-full z-10"
          style={{
            left: `${Math.min(100, Math.max(0, targetPct))}%`,
            backgroundColor: upside >= 0 ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)",
          }}
        />
        {/* Fill to target */}
        <div
          className="absolute top-0 h-full rounded-full opacity-30"
          style={{
            left: `${Math.min(pricePct, targetPct)}%`,
            width: `${Math.abs(targetPct - pricePct)}%`,
            backgroundColor: upside >= 0 ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)",
          }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("at.current")}: {cSym}{convert(price)?.toFixed(2)}</span>
        <span className={`font-bold ${upside >= 0 ? "text-chart-2" : "text-destructive"}`}>
          {upside >= 0 ? "+" : ""}{upside.toFixed(1)}% {t("at.upside")}
        </span>
      </div>
    </div>
  );
}
