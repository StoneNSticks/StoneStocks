/**
 * MarketHeatmap — Treemap visualization of market sectors.
 * Each rectangle represents a stock, sized by market cap, colored by daily performance.
 * Uses data from the top_companies endpoint (useTopCompanies hook).
 * Rendered on the Market Sentiment page.
 */
import { useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { useTopCompanies } from "@/hooks/useStockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const SECTOR_MAP: Record<string, string> = {
  Technology: "Tech", "Consumer Cyclical": "Konsum", "Communication Services": "Kommunikation",
  Healthcare: "Gesundheit", Financials: "Finanzen", "Consumer Defensive": "Basiskons.",
  Energy: "Energie", Industrials: "Industrie", "Basic Materials": "Rohstoffe",
  "Real Estate": "Immobilien", Utilities: "Versorger",
};

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

const CustomContent = (props: any) => {
  const { x, y, width, height, name, changePercent } = props;
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={getColor(changePercent || 0)} stroke="hsl(var(--background))" strokeWidth={2} rx={4} />
      {width > 50 && height > 35 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="white" fontSize={width > 80 ? 11 : 9} fontWeight="bold">{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="hsla(0,0%,100%,0.8)" fontSize={width > 80 ? 10 : 8}>
            {(changePercent || 0) >= 0 ? "+" : ""}{(changePercent || 0).toFixed(1)}%
          </text>
        </>
      )}
    </g>
  );
};

export function MarketHeatmap() {
  const { lang } = useLanguage();
  const { data: companies, isLoading } = useTopCompanies();

  const treemapData = useMemo(() => {
    if (!companies?.length) return [];
    return companies.slice(0, 30).map((c: any) => ({
      name: c.symbol,
      fullName: c.name || c.symbol,
      size: Math.max(c.marketCap || 1e9, 1e8),
      changePercent: c.changePercent || 0,
    }));
  }, [companies]);

  if (isLoading) return <Skeleton className="h-72 rounded-2xl" />;
  if (!treemapData.length) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-3 rounded-sm bg-chart-2" />
        <h3 className="font-display font-semibold">{lang === "de" ? "Markt-Heatmap" : "Market Heatmap"}</h3>
        <span className="text-xs text-muted-foreground ml-auto">{lang === "de" ? "Top 30 nach Marktkapitalisierung" : "Top 30 by market cap"}</span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={16 / 9}
          content={<CustomContent />}
        >
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
            formatter={(value: number, name: string, entry: any) => [
              `${(entry.payload.changePercent || 0) >= 0 ? "+" : ""}${(entry.payload.changePercent || 0).toFixed(2)}%`,
              entry.payload.fullName,
            ]}
          />
        </Treemap>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(0, 55%, 42%)" }} />
          <span className="text-[10px] text-muted-foreground">{lang === "de" ? "Verlust" : "Loss"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(0, 20%, 55%)" }} />
          <span className="text-[10px] text-muted-foreground">{lang === "de" ? "Leicht −" : "Slight −"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(145, 20%, 55%)" }} />
          <span className="text-[10px] text-muted-foreground">{lang === "de" ? "Leicht +" : "Slight +"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(145, 55%, 42%)" }} />
          <span className="text-[10px] text-muted-foreground">{lang === "de" ? "Gewinn" : "Gain"}</span>
        </div>
      </div>
    </div>
  );
}
