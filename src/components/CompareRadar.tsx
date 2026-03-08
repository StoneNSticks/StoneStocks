/**
 * CompareRadar — Radar chart for side-by-side metric comparison on ComparePage.
 * Normalizes metrics to 0-100 scale for visual comparison.
 */
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getFullStock } from "@/lib/stockApi";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/contexts/LanguageContext";

const COLORS = [
  "hsl(210, 80%, 55%)",
  "hsl(145, 63%, 42%)",
  "hsl(35, 90%, 55%)",
  "hsl(330, 70%, 55%)",
  "hsl(280, 65%, 55%)",
];

interface CompareRadarProps {
  symbols: string[];
}

function safeNum(v: unknown): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

// Normalize a value to 0-100 given a range
function normalize(val: number, min: number, max: number, invert = false): number {
  if (max === min) return 50;
  const norm = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  return invert ? 100 - norm : norm;
}

export function CompareRadar({ symbols }: CompareRadarProps) {
  const t = useT();

  const queries = useQueries({
    queries: symbols.map((sym) => ({
      queryKey: ["full-stock", sym],
      queryFn: () => getFullStock(sym),
      staleTime: 5 * 60_000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const allLoaded = queries.every((q) => q.data);

  const chartData = useMemo(() => {
    if (!allLoaded) return [];

    // Extract raw metrics per symbol
    const metrics: Record<string, Record<string, number>> = {};
    symbols.forEach((sym, i) => {
      const d = queries[i]?.data;
      if (!d) return;
      const { overview, derived, quote } = d;
      metrics[sym] = {
        profitMargin: overview?.ProfitMargin ? safeNum(overview.ProfitMargin) * 100 : 0,
        roe: overview?.ReturnOnEquityTTM ? safeNum(overview.ReturnOnEquityTTM) * 100 : 0,
        revGrowth: overview?.QuarterlyRevenueGrowthYOY ? safeNum(overview.QuarterlyRevenueGrowthYOY) * 100 : 0,
        divYield: safeNum(derived?.dividendYield),
        peValue: safeNum(derived?.calculatedPE) || safeNum(overview?.PERatio),
        dayPerf: safeNum(quote?.dp),
      };
    });

    const dims = [
      { key: "profitMargin", label: t("compare.profitMargin"), invert: false },
      { key: "roe", label: "ROE", invert: false },
      { key: "revGrowth", label: t("compare.revGrowth"), invert: false },
      { key: "divYield", label: t("compare.divYield"), invert: false },
      { key: "peValue", label: "P/E Value", invert: true }, // lower is better
      { key: "dayPerf", label: t("compare.change"), invert: false },
    ];

    return dims.map((dim) => {
      const vals = symbols.map((s) => metrics[s]?.[dim.key] || 0);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const point: Record<string, unknown> = { metric: dim.label };
      symbols.forEach((sym) => {
        point[sym] = normalize(metrics[sym]?.[dim.key] || 0, min, max, dim.invert);
      });
      return point;
    });
  }, [allLoaded, queries, symbols, t]);

  if (symbols.length < 2) return null;
  if (isLoading) return <Skeleton className="h-[320px] rounded-xl" />;
  if (chartData.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm mb-4">
        {t("compare.radar")} <span className="text-muted-foreground font-normal">(0–100)</span>
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 11,
              }}
              formatter={(v: number, name: string) => [`${v.toFixed(0)}`, name]}
            />
            {symbols.map((sym, i) => (
              <Radar
                key={sym}
                name={sym}
                dataKey={sym}
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
