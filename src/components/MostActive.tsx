import { Link } from "react-router-dom";
import { useMostActive } from "@/hooks/useStockData";
import { formatPercent, formatNumber, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ErrorState";
import { Activity } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

export function MostActive() {
  const { data: stocks, isLoading, error, refetch } = useMostActive();
  const fc = useFormattedCurrency();
  const t = useT();

  if (error && !stocks) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">{t("active.title")}</h2>
        </div>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">{t("active.title")}</h2>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">{t("active.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground py-4 text-center">{t("active.loading")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold">{t("active.title")}</h2>
      </div>
      <div className="space-y-1">
        {stocks.slice(0, 10).map((s: any, i: number) => (
          <Link key={s.symbol} to={`/stock/${s.symbol}`} className="flex items-center gap-3 rounded-lg p-2.5 -mx-1 transition-colors hover:bg-muted group">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {s.logo ? (
                <img src={s.logo} alt={s.symbol} className="w-8 h-8 rounded-lg object-contain bg-background border border-border/40" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</div>
              )}
              <div className="min-w-0">
                <div className="font-display font-semibold text-sm group-hover:text-primary transition-colors">{s.name || s.symbol}</div>
                <div className="text-[11px] text-muted-foreground">{s.symbol} · Vol: {formatNumber(s.volume)}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium tabular-nums">{fc(s.price)}</div>
              <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(s.changePercent)}`}>{formatPercent(s.changePercent)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
