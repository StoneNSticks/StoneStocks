import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getTimeSeries } from "@/lib/stockApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/contexts/LanguageContext";

const COLORS = [
  "hsl(210, 80%, 55%)",
  "hsl(145, 63%, 42%)",
  "hsl(35, 90%, 55%)",
  "hsl(330, 70%, 55%)",
];

interface NormalizedChartProps {
  symbols: string[];
}

export function NormalizedChart({ symbols }: NormalizedChartProps) {
  const t = useT();

  const queries = useQueries({
    queries: symbols.map((sym) => ({
      queryKey: ["series", sym, "1day", "252"],
      queryFn: () => getTimeSeries(sym, "1day", "252"),
      enabled: !!sym,
      staleTime: 1000 * 60 * 60,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const chartData = useMemo(() => {
    if (isLoading) return [];

    // Parse each symbol's series into { date, close } sorted ascending
    const allSeries: Record<string, Array<{ date: string; close: number }>> = {};
    symbols.forEach((sym, i) => {
      const raw = queries[i]?.data;
      if (!raw) return;

      let points: Array<{ date: string; close: number }> = [];

      // Handle different API response formats
      if (Array.isArray(raw)) {
        points = raw
          .map((p: any) => ({ date: p.datetime || p.date || p.t, close: Number(p.close || p.c) }))
          .filter((p) => p.date && !isNaN(p.close));
      } else if (raw.values && Array.isArray(raw.values)) {
        points = raw.values
          .map((p: any) => ({ date: p.datetime || p.date, close: Number(p.close) }))
          .filter((p: any) => p.date && !isNaN(p.close));
      } else if (raw.results && Array.isArray(raw.results)) {
        points = raw.results
          .map((p: any) => ({
            date: new Date(p.t).toISOString().slice(0, 10),
            close: Number(p.c),
          }))
          .filter((p) => p.date && !isNaN(p.close));
      }

      // Sort ascending by date
      points.sort((a, b) => a.date.localeCompare(b.date));
      allSeries[sym] = points;
    });

    if (Object.keys(allSeries).length === 0) return [];

    // Find overlapping dates
    const dateSets = Object.values(allSeries).map((s) => new Set(s.map((p) => p.date)));
    const commonDates = [...dateSets[0]].filter((d) => dateSets.every((ds) => ds.has(d))).sort();

    if (commonDates.length === 0) return [];

    // Build lookup maps
    const lookups: Record<string, Record<string, number>> = {};
    for (const sym of Object.keys(allSeries)) {
      lookups[sym] = {};
      for (const p of allSeries[sym]) {
        lookups[sym][p.date] = p.close;
      }
    }

    // Base values (first common date)
    const baseDate = commonDates[0];
    const bases: Record<string, number> = {};
    for (const sym of Object.keys(lookups)) {
      bases[sym] = lookups[sym][baseDate];
    }

    // Build normalized data
    return commonDates.map((date) => {
      const point: Record<string, unknown> = { date: date.slice(5) }; // MM-DD format
      for (const sym of Object.keys(lookups)) {
        point[sym] = bases[sym] ? +((lookups[sym][date] / bases[sym]) * 100).toFixed(2) : 100;
      }
      return point;
    });
  }, [isLoading, queries, symbols]);

  if (symbols.length < 2) return null;

  if (isLoading) return <Skeleton className="h-[320px] rounded-xl" />;

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5 h-[320px] flex items-center justify-center text-sm text-muted-foreground">
        {t("compare.noChartData")}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm mb-4">
        {t("compare.perfChart")} <span className="text-muted-foreground font-normal">({t("compare.base100")})</span>
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }}
              minTickGap={40}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `${v}`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 11,
              }}
              formatter={(v: number, name: string) => [`${v.toFixed(1)}`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              iconType="line"
            />
            {symbols.map((sym, i) => (
              <Line
                key={sym}
                type="monotone"
                dataKey={sym}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ))}
            {/* Reference line at 100 */}
            <Line
              type="monotone"
              dataKey={() => 100}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              legendType="none"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
