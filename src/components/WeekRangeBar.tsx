import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";

interface WeekRangeBarProps {
  low52: number;
  high52: number;
  current: number;
}

export function WeekRangeBar({ low52, high52, current }: WeekRangeBarProps) {
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();

  if (!low52 || !high52 || !current || high52 <= low52) return null;

  const pct = Math.min(100, Math.max(0, ((current - low52) / (high52 - low52)) * 100));
  const fmt = (v: number) => `${cSym}${(convert(v) ?? v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-medium">{t("m.52wRange") || "52-Week Range"}</span>
        <span className="text-xs font-mono text-muted-foreground">{pct.toFixed(0)}%</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-destructive/60 via-primary to-chart-2/80 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-foreground shadow-md transition-all duration-500"
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs">
          <span className="text-muted-foreground">Low </span>
          <span className="font-mono font-semibold text-destructive">{fmt(low52)}</span>
        </div>
        <div className="text-xs font-mono font-bold text-primary">{fmt(current)}</div>
        <div className="text-xs">
          <span className="text-muted-foreground">High </span>
          <span className="font-mono font-semibold text-chart-2">{fmt(high52)}</span>
        </div>
      </div>
    </div>
  );
}
