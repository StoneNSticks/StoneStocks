import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function RecommendationChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 6).reverse().map((d: any) => ({
    period: d.period,
    buy: (d.buy || 0) + (d.strongBuy || 0),
    hold: d.hold || 0,
    sell: (d.sell || 0) + (d.strongSell || 0),
  }));

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Analyst Recommendations</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }}
            tickFormatter={(p: string) => p.substring(0, 7)}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "hsl(222, 25%, 9%)",
              border: "1px solid hsl(222, 20%, 16%)",
              borderRadius: "8px",
              fontSize: 12,
              color: "hsl(210, 20%, 92%)",
            }}
          />
          <Bar dataKey="buy" stackId="a" fill="hsl(145, 63%, 42%)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="hold" stackId="a" fill="hsl(38, 92%, 50%)" />
          <Bar dataKey="sell" stackId="a" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-success" />
          <span className="text-[11px] text-muted-foreground">Buy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-warning" />
          <span className="text-[11px] text-muted-foreground">Hold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-destructive" />
          <span className="text-[11px] text-muted-foreground">Sell</span>
        </div>
      </div>
    </div>
  );
}
