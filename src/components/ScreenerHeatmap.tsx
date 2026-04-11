/**
 * ScreenerHeatmap — Treemap-style market heatmap with proper proportional sizing,
 * sector grouping, and gradient coloring based on daily change.
 */
import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTopCompanies } from "@/hooks/useStockData";
import { Link } from "react-router-dom";
import { Grid3X3 } from "lucide-react";

const SECTOR_COLORS: Record<string, string> = {
  Technology: "210",
  Healthcare: "160",
  Financials: "38",
  "Consumer Cyclical": "280",
  "Communication Services": "330",
  Energy: "25",
  Industrials: "190",
  "Consumer Defensive": "145",
  "Basic Materials": "80",
  Utilities: "50",
  "Real Estate": "0",
};

function getChangeBg(change: number): string {
  if (change >= 3) return "hsl(145, 65%, 30%)";
  if (change >= 1.5) return "hsl(145, 55%, 38%)";
  if (change >= 0.5) return "hsl(145, 40%, 45%)";
  if (change >= 0) return "hsl(145, 25%, 50%)";
  if (change >= -0.5) return "hsl(0, 25%, 50%)";
  if (change >= -1.5) return "hsl(0, 40%, 45%)";
  if (change >= -3) return "hsl(0, 55%, 38%)";
  return "hsl(0, 65%, 30%)";
}

function formatMcap(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(0)}B`;
  return `${(n / 1e6).toFixed(0)}M`;
}

const DEFAULT_SECTOR_FILTERS = ["All", "Technology", "Financials", "Healthcare", "Consumer Cyclical", "Energy", "Industrials", "Communication Services", "Consumer Defensive", "Utilities", "Basic Materials", "Real Estate"];

export function ScreenerHeatmap() {
  const { lang } = useLanguage();
  const { data: companies, isLoading } = useTopCompanies();
  const [filter, setFilter] = useState("All");

  // Dynamic sector extraction from actual data
  const sectorFilters = useMemo(() => {
    if (!companies) return DEFAULT_SECTOR_FILTERS;
    const sectors = new Set((companies as any[]).filter((c: any) => c.sector).map((c: any) => c.sector));
    const ordered = DEFAULT_SECTOR_FILTERS.filter(s => s === "All" || sectors.has(s));
    // Add any sectors not in default list
    for (const s of sectors) {
      if (!ordered.includes(s)) ordered.push(s);
    }
    return ordered;
  }, [companies]);

  const items = useMemo(() => {
    if (!companies) return [];
    let filtered = (companies as any[]).filter((c: any) => c.marketCap > 0);
    if (filter !== "All") {
      filtered = filtered.filter((c: any) => c.sector === filter);
    }
    return filtered
      .sort((a: any, b: any) => (b.marketCap || 0) - (a.marketCap || 0))
      .slice(0, 100);
  }, [companies, filter]);

  if (isLoading || items.length === 0) return null;

  const totalMcap = items.reduce((s: number, c: any) => s + c.marketCap, 0);

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Markt-Heatmap" : "Market Heatmap"}</h3>
          <span className="text-[10px] text-muted-foreground font-mono">{items.length} {lang === "de" ? "Aktien" : "stocks"}</span>
        </div>
        <div className="flex flex-wrap gap-1 sm:ml-auto">
          {sectorFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "All" ? (lang === "de" ? "Alle" : "All") : s.replace("Consumer ", "").replace("Communication ", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Treemap grid */}
      <div className="p-2 flex flex-wrap" style={{ minHeight: 320 }}>
        {items.map((c: any) => {
          const change = c.changePercent || 0;
          const weight = c.marketCap / totalMcap;
          // Size proportional to market cap weight - minimum 48px, scale up to fill container
          const area = Math.max(48, Math.sqrt(weight) * 600);
          const ticker = c.ticker || c.symbol;
          const bg = getChangeBg(change);

          return (
            <Link
              key={ticker}
              to={`/stock/${ticker}`}
              className="relative flex flex-col items-center justify-center text-white transition-all hover:brightness-125 hover:z-10 m-[1px] rounded-md overflow-hidden group"
              style={{
                width: area,
                height: area * 0.7,
                minWidth: 48,
                minHeight: 36,
                backgroundColor: bg,
                flexGrow: weight * 100,
                flexBasis: area,
              }}
            >
              <span className="font-mono font-bold text-[11px] leading-none drop-shadow-sm">{ticker}</span>
              <span className={`text-[10px] font-mono font-semibold ${change >= 0 ? "text-white/90" : "text-white/90"}`}>
                {change >= 0 ? "+" : ""}{change.toFixed(1)}%
              </span>
              {area > 80 && (
                <span className="text-[8px] text-white/50 mt-0.5">{formatMcap(c.marketCap)}</span>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 p-3 border-t border-border/20 flex-wrap">
        {[
          { color: "hsl(0, 55%, 38%)", label: "< -1.5%" },
          { color: "hsl(0, 25%, 50%)", label: "−0.5%" },
          { color: "hsl(145, 25%, 50%)", label: "+0.5%" },
          { color: "hsl(145, 55%, 38%)", label: "> +1.5%" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="h-3 w-6 rounded-sm" style={{ background: item.color }} />
            <span className="text-[10px] text-muted-foreground font-mono">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
