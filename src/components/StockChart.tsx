import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { getTimeSeries } from "@/lib/stockApi";
import { useQuery } from "@tanstack/react-query";

const intervals = [
  { label: "1D", value: "1d", outputsize: "78", interval: "5min" },
  { label: "5D", value: "5d", outputsize: "390", interval: "15min" },
  { label: "1M", value: "1m", outputsize: "22", interval: "1day" },
  { label: "6M", value: "6m", outputsize: "130", interval: "1day" },
  { label: "1Y", value: "1y", outputsize: "252", interval: "1day" },
  { label: "5Y", value: "5y", outputsize: "260", interval: "1week" },
  { label: "MAX", value: "max", outputsize: "500", interval: "1month" },
];

export function StockChart({ symbol }: { symbol: string }) {
  const [selected, setSelected] = useState("1y");

  const config = intervals.find((i) => i.value === selected) || intervals[4];

  const { data: series, isLoading } = useQuery({
    queryKey: ["chartSeries", symbol, selected],
    queryFn: () => getTimeSeries(symbol, config.interval, config.outputsize),
    enabled: !!symbol,
    staleTime: selected.includes("d") && selected !== "1d" ? 1000 * 60 * 60 : 1000 * 60 * 5,
  });

  const chartData = useMemo(() => {
    if (!series?.values) return [];
    return [...series.values]
      .reverse()
      .map((v: any) => ({
        date: v.datetime,
        close: parseFloat(v.close),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        volume: parseInt(v.volume),
      }));
  }, [series]);

  const isPositive = chartData.length >= 2 && chartData[chartData.length - 1].close >= chartData[0].close;
  const color = isPositive ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)";

  const isIntraday = selected === "1d" || selected === "5d";

  const formatXLabel = (d: string) => {
    const date = new Date(d);
    if (isIntraday) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    if (selected === "max" || selected === "5y") {
      return date.toLocaleDateString("en-US", { year: "numeric" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return <Skeleton className="h-72 rounded-xl" />;
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-muted-foreground">Price Chart</h3>
        <div className="flex gap-0.5">
          {intervals.map((i) => (
            <button
              key={i.value}
              onClick={() => setSelected(i.value)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selected === i.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`colorClose-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(220,10%,50%)" }}
              tickFormatter={formatXLabel}
              minTickGap={40}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(220,10%,50%)" }}
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              width={55}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
                color: "hsl(var(--foreground))",
              }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, "Close"]}
              labelFormatter={(l: string) => {
                const d = new Date(l);
                if (isIntraday) {
                  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
                }
                return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={color}
              strokeWidth={2}
              fill={`url(#colorClose-${symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No chart data available
        </div>
      )}
    </div>
  );
}
