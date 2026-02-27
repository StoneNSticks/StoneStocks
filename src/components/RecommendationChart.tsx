import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

export function RecommendationChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 12).reverse().map((d: any) => ({
    period: d.period?.substring(0, 7),
    strongBuy: d.strongBuy || 0,
    buy: d.buy || 0,
    hold: d.hold || 0,
    sell: d.sell || 0,
    strongSell: d.strongSell || 0,
  }));

  const latest = chartData[chartData.length - 1];
  const total = latest ? latest.strongBuy + latest.buy + latest.hold + latest.sell + latest.strongSell : 0;
  const bullish = latest ? latest.strongBuy + latest.buy : 0;
  const bearish = latest ? latest.sell + latest.strongSell : 0;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-1">Analyst Recommendations</h3>
      {total > 0 && (
        <div className="mb-4">
          {/* Sentiment bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-[hsl(145,80%,35%)]" style={{ width: `${(latest.strongBuy / total) * 100}%` }} />
            <div className="bg-[hsl(145,63%,50%)]" style={{ width: `${(latest.buy / total) * 100}%` }} />
            <div className="bg-warning" style={{ width: `${(latest.hold / total) * 100}%` }} />
            <div className="bg-[hsl(0,60%,55%)]" style={{ width: `${(latest.sell / total) * 100}%` }} />
            <div className="bg-destructive" style={{ width: `${(latest.strongSell / total) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gain font-medium">{bullish} Bullish ({((bullish / total) * 100).toFixed(0)}%)</span>
            <span className="text-muted-foreground">{latest.hold} Hold</span>
            <span className="text-loss font-medium">{bearish} Bearish ({((bearish / total) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
              color: "hsl(var(--foreground))",
            }}
          />
          <Bar dataKey="strongBuy" stackId="a" fill="hsl(145, 80%, 35%)" name="Strong Buy" />
          <Bar dataKey="buy" stackId="a" fill="hsl(145, 63%, 50%)" name="Buy" />
          <Bar dataKey="hold" stackId="a" fill="hsl(38, 92%, 50%)" name="Hold" />
          <Bar dataKey="sell" stackId="a" fill="hsl(0, 60%, 55%)" name="Sell" />
          <Bar dataKey="strongSell" stackId="a" fill="hsl(0, 72%, 41%)" radius={[3, 3, 0, 0]} name="Strong Sell" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-3 mt-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(145, 80%, 35%)" }} />
          <span className="text-[11px] text-muted-foreground">Strong Buy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(145, 63%, 50%)" }} />
          <span className="text-[11px] text-muted-foreground">Buy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-warning" />
          <span className="text-[11px] text-muted-foreground">Hold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(0, 60%, 55%)" }} />
          <span className="text-[11px] text-muted-foreground">Sell</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-destructive" />
          <span className="text-[11px] text-muted-foreground">Strong Sell</span>
        </div>
      </div>
    </div>
  );
}
