import { useTimeSeries } from "@/hooks/useStockData";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const intervals = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export function StockChart({ symbol }: { symbol: string }) {
  const [interval, setInterval] = useState("daily");
  const { data: series, isLoading } = useTimeSeries(symbol, interval);

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

  if (isLoading) {
    return <Skeleton className="h-72 rounded-xl" />;
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-muted-foreground">Price Chart</h3>
        <div className="flex gap-1">
          {intervals.map((i) => (
            <button
              key={i.value}
              onClick={() => setInterval(i.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                interval === i.value
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
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(220,10%,50%)" }}
              tickFormatter={(d: string) =>
                new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
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
                background: "hsl(222, 25%, 9%)",
                border: "1px solid hsl(222, 20%, 16%)",
                borderRadius: "8px",
                fontSize: 12,
                color: "hsl(210, 20%, 92%)",
              }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, "Close"]}
              labelFormatter={(l: string) =>
                new Date(l).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={color}
              strokeWidth={2}
              fill="url(#colorClose)"
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
