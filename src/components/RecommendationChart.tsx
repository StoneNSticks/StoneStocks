import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

export function RecommendationChart({ data }: { data: any[] }) {
  const [expanded, setExpanded] = useState(false);

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

  // Compute consensus score (1-5 scale, 1=strong buy, 5=strong sell)
  const consensus = total > 0
    ? (latest.strongBuy * 1 + latest.buy * 2 + latest.hold * 3 + latest.sell * 4 + latest.strongSell * 5) / total
    : 3;
  const consensusLabel = consensus <= 1.5 ? "Strong Buy" : consensus <= 2.5 ? "Buy" : consensus <= 3.5 ? "Hold" : consensus <= 4.5 ? "Sell" : "Strong Sell";
  const consensusColor = consensus <= 1.5 ? "text-[hsl(145,80%,35%)]" : consensus <= 2.5 ? "text-gain" : consensus <= 3.5 ? "text-warning" : "text-loss";

  const segments = [
    { label: "Strong Buy", count: latest?.strongBuy || 0, color: "hsl(145, 80%, 35%)" },
    { label: "Buy", count: latest?.buy || 0, color: "hsl(145, 63%, 50%)" },
    { label: "Hold", count: latest?.hold || 0, color: "hsl(38, 92%, 50%)" },
    { label: "Sell", count: latest?.sell || 0, color: "hsl(0, 60%, 55%)" },
    { label: "Strong Sell", count: latest?.strongSell || 0, color: "hsl(0, 72%, 41%)" },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-muted-foreground">Analyst Consensus</h3>
        </div>
        {total > 0 && (
          <div className={`font-display font-bold text-lg ${consensusColor}`}>
            {consensusLabel}
          </div>
        )}
      </div>

      {total > 0 && (
        <>
          {/* Consensus score meter */}
          <div className="mb-4">
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-2">
              {segments.map((s) => (
                <div
                  key={s.label}
                  className="transition-all rounded-sm"
                  style={{
                    width: `${(s.count / total) * 100}%`,
                    backgroundColor: s.color,
                    minWidth: s.count > 0 ? "4px" : "0",
                  }}
                />
              ))}
            </div>

            {/* Counts row */}
            <div className="flex justify-between">
              {segments.map((s) => (
                <div key={s.label} className="text-center flex-1">
                  <div className="text-lg font-bold font-display" style={{ color: s.color }}>
                    {s.count}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex justify-between text-xs mb-3 px-1">
            <span className="text-gain font-medium">{bullish} Bullish ({((bullish / total) * 100).toFixed(0)}%)</span>
            <span className="text-muted-foreground">{total} Analysts</span>
            <span className="text-loss font-medium">{bearish} Bearish ({((bearish / total) * 100).toFixed(0)}%)</span>
          </div>
        </>
      )}

      {/* Historical chart */}
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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

      {/* Expandable monthly detail */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
      >
        {expanded ? "Hide" : "Show"} monthly breakdown
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-1.5 max-h-[300px] overflow-y-auto">
          {chartData.map((row) => {
            const rowTotal = row.strongBuy + row.buy + row.hold + row.sell + row.strongSell;
            return (
              <div key={row.period} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-muted/50">
                <span className="w-16 text-muted-foreground font-medium">{row.period}</span>
                <div className="flex-1 flex h-2 rounded-full overflow-hidden gap-px">
                  {segments.map((s) => {
                    const val = row[s.label === "Strong Buy" ? "strongBuy" : s.label === "Strong Sell" ? "strongSell" : s.label.toLowerCase() as keyof typeof row] as number;
                    return (
                      <div
                        key={s.label}
                        className="rounded-sm"
                        style={{
                          width: rowTotal > 0 ? `${(val / rowTotal) * 100}%` : "0",
                          backgroundColor: s.color,
                          minWidth: val > 0 ? "2px" : "0",
                        }}
                      />
                    );
                  })}
                </div>
                <span className="w-8 text-right text-muted-foreground">{rowTotal}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
