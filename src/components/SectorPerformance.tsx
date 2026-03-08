/**
 * SectorPerformance — Shows real sector ETF performance from Yahoo Finance.
 * Uses SPDR sector ETFs (XLK, XLV, XLF, etc.) for accurate daily sector returns.
 */
import { useYahooSectors } from "@/hooks/useStockData";
import { useT } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

const SECTOR_DE: Record<string, string> = {
  "Technology": "Technologie",
  "Healthcare": "Gesundheit",
  "Financials": "Finanzen",
  "Consumer Discretionary": "Zyklischer Konsum",
  "Consumer Staples": "Basiskonsumgüter",
  "Energy": "Energie",
  "Industrials": "Industrie",
  "Materials": "Grundstoffe",
  "Real Estate": "Immobilien",
  "Utilities": "Versorger",
  "Communication Services": "Kommunikation",
};

export function SectorPerformance() {
  const { data: sectors, isLoading } = useYahooSectors();
  const t = useT();

  if (isLoading) return <Skeleton className="h-48 rounded-xl" />;

  const items = (sectors || [])
    .filter((s: any) => s.changePercent != null)
    .sort((a: any, b: any) => (b.changePercent || 0) - (a.changePercent || 0));

  if (items.length === 0) return null;

  const max = Math.max(...items.map((s: any) => Math.abs(s.changePercent || 0)), 0.5);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">{t("sector.title")}</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">SPDR ETFs</span>
      </div>
      <div className="space-y-1.5">
        {items.map((s: any) => {
          const isUp = (s.changePercent || 0) >= 0;
          const width = Math.min(Math.abs(s.changePercent || 0) / max * 100, 100);
          const deName = SECTOR_DE[s.name] || s.name;
          return (
            <div key={s.symbol} className="flex items-center gap-2">
              <span className="text-xs w-28 sm:w-36 truncate shrink-0 text-muted-foreground" title={s.name}>
                {t("lang") === "de" ? deName : s.name}
              </span>
              <div className="flex-1 h-5 bg-muted/30 rounded-md overflow-hidden">
                <div
                  className={`h-full rounded-md transition-all duration-500 ${isUp ? "bg-chart-2/60" : "bg-destructive/60"}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className={`text-xs font-mono font-semibold w-14 text-right ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? "+" : ""}{(s.changePercent || 0).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
