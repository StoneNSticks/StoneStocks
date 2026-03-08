/**
 * Phase 94: Screener Heatmap — Results as interactive treemap
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTopCompanies } from "@/hooks/useStockData";
import { Link } from "react-router-dom";
import { Grid3X3 } from "lucide-react";

export function ScreenerHeatmap() {
  const { lang } = useLanguage();
  const { data: companies } = useTopCompanies();

  const items = useMemo(() => {
    if (!companies) return [];
    return (companies as any[])
      .filter((c: any) => c.marketCap > 0)
      .sort((a: any, b: any) => (b.marketCap || 0) - (a.marketCap || 0))
      .slice(0, 40);
  }, [companies]);

  if (items.length === 0) return null;

  const maxMcap = items[0]?.marketCap || 1;

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border/40 bg-muted/30">
        <Grid3X3 className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Markt-Heatmap" : "Market Heatmap"}</h3>
      </div>
      <div className="p-3 flex flex-wrap gap-1">
        {items.map((c: any) => {
          const change = c.changePercent || 0;
          const size = Math.max(40, Math.sqrt(c.marketCap / maxMcap) * 120);
          const bg = change > 2 ? "bg-chart-2/80" : change > 0 ? "bg-chart-2/40" : change > -2 ? "bg-destructive/40" : "bg-destructive/80";
          const ticker = c.ticker || c.symbol;
          return (
            <Link
              key={ticker}
              to={`/stock/${ticker}`}
              className={`${bg} rounded-lg flex flex-col items-center justify-center text-white transition-transform hover:scale-105`}
              style={{ width: size, height: size, minWidth: 40, minHeight: 40 }}
            >
              <span className="font-mono font-bold text-[10px] leading-none">{ticker}</span>
              <span className="text-[9px] opacity-80">{change >= 0 ? "+" : ""}{change.toFixed(1)}%</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
