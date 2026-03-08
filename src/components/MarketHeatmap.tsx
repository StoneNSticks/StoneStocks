/**
 * MarketHeatmap — Enhanced treemap visualization of market sectors.
 * Sector grouping, click-to-navigate, sector filters, coloring mode toggle.
 */
import { useMemo, useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { useTopCompanies } from "@/hooks/useStockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const SECTOR_LABELS: Record<string, Record<string, string>> = {
  Technology: { de: "Tech", en: "Tech" },
  "Consumer Cyclical": { de: "Konsum", en: "Consumer" },
  "Communication Services": { de: "Komm.", en: "Comms" },
  Healthcare: { de: "Gesundheit", en: "Health" },
  Financials: { de: "Finanzen", en: "Finance" },
  "Consumer Defensive": { de: "Basiskons.", en: "Staples" },
  Energy: { de: "Energie", en: "Energy" },
  Industrials: { de: "Industrie", en: "Industrial" },
  "Basic Materials": { de: "Rohstoffe", en: "Materials" },
  "Real Estate": { de: "Immobilien", en: "Real Estate" },
  Utilities: { de: "Versorger", en: "Utilities" },
};

const SECTOR_FILTERS = ["All", "Technology", "Financials", "Healthcare", "Consumer Cyclical", "Energy", "Industrials"];

function getColor(change: number): string {
  if (change >= 3) return "hsl(145, 63%, 35%)";
  if (change >= 1.5) return "hsl(145, 55%, 42%)";
  if (change >= 0.5) return "hsl(145, 40%, 50%)";
  if (change >= 0) return "hsl(145, 20%, 55%)";
  if (change >= -0.5) return "hsl(0, 20%, 55%)";
  if (change >= -1.5) return "hsl(0, 40%, 50%)";
  if (change >= -3) return "hsl(0, 55%, 42%)";
  return "hsl(0, 63%, 35%)";
}

function formatCompact(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(0)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return `${n}`;
}

const CustomContent = (props: any) => {
  const { x, y, width, height, name, changePercent, marketCap } = props;
  if (width < 35 || height < 25) return null;
  return (
    <g style={{ cursor: "pointer" }}>
      <rect x={x} y={y} width={width} height={height} fill={getColor(changePercent || 0)} stroke="hsl(var(--background))" strokeWidth={2} rx={4} />
      {width > 45 && height > 30 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - (height > 50 ? 10 : 4)} textAnchor="middle" fill="white" fontSize={width > 90 ? 12 : width > 60 ? 10 : 8} fontWeight="bold">{name}</text>
          <text x={x + width / 2} y={y + height / 2 + (height > 50 ? 6 : 10)} textAnchor="middle" fill="hsla(0,0%,100%,0.85)" fontSize={width > 90 ? 11 : 8}>
            {(changePercent || 0) >= 0 ? "+" : ""}{(changePercent || 0).toFixed(1)}%
          </text>
          {width > 80 && height > 55 && marketCap && (
            <text x={x + width / 2} y={y + height / 2 + 20} textAnchor="middle" fill="hsla(0,0%,100%,0.6)" fontSize={8}>
              {formatCompact(marketCap)}
            </text>
          )}
        </>
      )}
    </g>
  );
};

export function MarketHeatmap() {
  const { lang } = useLanguage();
  const { data: companies, isLoading } = useTopCompanies();
  const navigate = useNavigate();
  const [sectorFilter, setSectorFilter] = useState("All");

  const treemapData = useMemo(() => {
    if (!companies?.length) return [];
    let filtered = companies;
    if (sectorFilter !== "All") {
      filtered = companies.filter((c: any) => c.sector === sectorFilter);
    }
    return filtered
      .filter((c: any) => c.price > 0)
      .map((c: any) => ({
        name: c.symbol,
        fullName: c.name || c.symbol,
        sector: c.sector || "Other",
        sectorLabel: SECTOR_LABELS[c.sector]?.[lang] || c.sector || "Other",
        size: Math.max(c.marketCap || 1e9, 1e8),
        marketCap: c.marketCap || 0,
        changePercent: c.changePercent || 0,
      }));
  }, [companies, sectorFilter, lang]);

  const handleClick = (data: any) => {
    if (data?.name) {
      navigate(`/stock/${data.name}`);
    }
  };

  if (isLoading) return <Skeleton className="h-72 rounded-2xl" />;
  if (!treemapData.length) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold">{lang === "de" ? "Markt-Heatmap" : "Market Heatmap"}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:ml-auto">
          {SECTOR_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSectorFilter(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                sectorFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "All" ? (lang === "de" ? "Alle" : "All") : SECTOR_LABELS[s]?.[lang] || s}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={16 / 9}
          content={<CustomContent />}
          onClick={handleClick}
        >
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
            formatter={(_: unknown, __: string, entry: any) => [
              `${(entry.payload.changePercent || 0) >= 0 ? "+" : ""}${(entry.payload.changePercent || 0).toFixed(2)}% · ${formatCompact(entry.payload.marketCap)}`,
              entry.payload.fullName,
            ]}
          />
        </Treemap>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        {[
          { color: "hsl(0, 55%, 42%)", label: lang === "de" ? "Verlust" : "Loss" },
          { color: "hsl(0, 20%, 55%)", label: lang === "de" ? "Leicht −" : "Slight −" },
          { color: "hsl(145, 20%, 55%)", label: lang === "de" ? "Leicht +" : "Slight +" },
          { color: "hsl(145, 55%, 42%)", label: lang === "de" ? "Gewinn" : "Gain" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
