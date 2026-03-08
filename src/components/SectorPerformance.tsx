/**
 * SectorPerformance — Horizontal bar chart showing daily performance by sector.
 * Derives sector data from the topCompanies API response, grouping by sector
 * and averaging the daily change percentage.
 */
import { useMemo } from "react";
import { useTopCompanies } from "@/hooks/useStockData";
import { useT } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

export function SectorPerformance() {
  const { data: companies, isLoading } = useTopCompanies();
  const t = useT();

  const sectors = useMemo(() => {
    if (!companies) return [];
    const map: Record<string, { sum: number; count: number }> = {};
    companies.forEach((c: any) => {
      const sector = c.sector || "Other";
      if (!map[sector]) map[sector] = { sum: 0, count: 0 };
      map[sector].sum += c.changePercent || 0;
      map[sector].count += 1;
    });
    return Object.entries(map)
      .map(([name, { sum, count }]) => ({ name, avg: sum / count }))
      .sort((a, b) => b.avg - a.avg);
  }, [companies]);

  if (isLoading) return <Skeleton className="h-48 rounded-xl" />;
  if (sectors.length === 0) return null;

  const max = Math.max(...sectors.map(s => Math.abs(s.avg)), 1);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        {t("sector.title")}
      </h3>
      <div className="space-y-2">
        {sectors.map(s => {
          const isUp = s.avg >= 0;
          const width = Math.min(Math.abs(s.avg) / max * 100, 100);
          return (
            <div key={s.name} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-24 truncate shrink-0">{s.name}</span>
              <div className="flex-1 h-5 bg-muted/30 rounded-md overflow-hidden relative">
                <div
                  className={`h-full rounded-md transition-all ${isUp ? "bg-chart-2/60" : "bg-destructive/60"}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className={`text-xs font-mono font-semibold w-14 text-right ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? "+" : ""}{s.avg.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
