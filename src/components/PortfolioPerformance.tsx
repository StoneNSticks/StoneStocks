/**
 * PortfolioPerformance — Historical portfolio value chart with S&P 500 benchmark comparison.
 * Computes daily portfolio value from position data + historical prices.
 */
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getTimeSeries } from "@/lib/stockApi";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Position {
  symbol: string;
  shares: number;
  avg_cost: number;
}

interface PortfolioPerformanceProps {
  positions: Position[];
}

export function PortfolioPerformance({ positions }: PortfolioPerformanceProps) {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();

  // Fetch 6-month history for each position + SPY as benchmark
  const allSymbols = useMemo(() => {
    const syms = positions.map(p => p.symbol);
    if (!syms.includes("SPY")) syms.push("SPY");
    return syms;
  }, [positions]);

  const queries = useQueries({
    queries: allSymbols.map(sym => ({
      queryKey: ["perf-series", sym, "1day", "180"],
      queryFn: () => getTimeSeries(sym, "1day", "180"),
      enabled: !!sym,
      staleTime: 1000 * 60 * 60,
    })),
  });

  const isLoading = queries.some(q => q.isLoading);

  const { chartData, totalCost, currentValue, returnPct } = useMemo(() => {
    if (isLoading || positions.length === 0) return { chartData: [], totalCost: 0, currentValue: 0, returnPct: 0 };

    // Parse series per symbol
    const seriesMap: Record<string, Record<string, number>> = {};
    allSymbols.forEach((sym, i) => {
      const raw = queries[i]?.data;
      if (!raw) return;
      let points: any[] = [];
      if (Array.isArray(raw)) points = raw;
      else if (raw.values) points = raw.values;
      else if (raw.results) points = raw.results;

      seriesMap[sym] = {};
      points.forEach((p: any) => {
        const date = (p.datetime || p.date || p.t || "").slice(0, 10);
        const close = Number(p.close || p.c || 0);
        if (date && close > 0) seriesMap[sym][date] = close;
      });
    });

    // Find common dates across all position symbols
    const positionSymbols = positions.map(p => p.symbol);
    const allDates = new Set<string>();
    positionSymbols.forEach(sym => {
      if (seriesMap[sym]) Object.keys(seriesMap[sym]).forEach(d => allDates.add(d));
    });
    const sortedDates = [...allDates].sort();

    // Compute total cost basis
    const tCost = positions.reduce((sum, p) => sum + p.shares * p.avg_cost, 0);

    // SPY baseline
    const spyData = seriesMap["SPY"] || {};
    const spyDates = Object.keys(spyData).sort();
    const spyStart = spyDates.length > 0 ? spyData[spyDates[0]] : 1;

    const data = sortedDates.map(date => {
      let portfolioValue = 0;
      positions.forEach(p => {
        const price = seriesMap[p.symbol]?.[date];
        if (price) portfolioValue += p.shares * price;
      });

      const spyPrice = spyData[date] || 0;
      const spyNormalized = spyStart > 0 ? (spyPrice / spyStart) * tCost : 0;

      return {
        date,
        portfolio: portfolioValue,
        benchmark: spyNormalized,
      };
    }).filter(d => d.portfolio > 0);

    const cv = data.length > 0 ? data[data.length - 1].portfolio : tCost;
    const rp = tCost > 0 ? ((cv - tCost) / tCost) * 100 : 0;

    return { chartData: data, totalCost: tCost, currentValue: cv, returnPct: rp };
  }, [isLoading, positions, allSymbols, queries]);

  if (positions.length === 0) return null;
  if (isLoading) return <Skeleton className="h-72 rounded-xl" />;
  if (chartData.length === 0) return null;

  const isUp = returnPct >= 0;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">
          {lang === "de" ? "Portfolio-Performance (6M)" : "Portfolio Performance (6M)"}
        </h3>
        <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? "text-chart-2" : "text-destructive"}`}>
          {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {isUp ? "+" : ""}{returnPct.toFixed(1)}%
        </div>
      </div>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isUp ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)"} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              minTickGap={50}
              tickFormatter={(d: string) => {
                if (!d) return "";
                const date = new Date(d);
                const span = chartData.length > 0
                  ? (new Date(chartData[chartData.length - 1].date).getTime() - new Date(chartData[0].date).getTime()) / (1000 * 60 * 60 * 24)
                  : 0;
                if (span > 365) return date.toLocaleDateString(undefined, { year: "numeric" });
                if (span > 90) return date.toLocaleDateString(undefined, { month: "short" });
                return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
              }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v: number) => `${cSym}${(convert(v) / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(value: number, name: string) => [
                `${cSym}${convert(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                name === "benchmark" ? "S&P 500" : "Portfolio"
              ]}
            />
            <ReferenceLine y={totalCost} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.4} />
            <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fill="url(#benchGrad)" strokeWidth={1} strokeDasharray="4 4" dot={false} name="S&P 500" />
            <Area type="monotone" dataKey="portfolio" stroke={isUp ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)"} fill="url(#perfGrad)" strokeWidth={2} dot={false} name="Portfolio" />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
