import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChevronDown, ChevronUp, Target } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

const COLORS = {
  strongBuy: "hsl(145, 80%, 35%)",
  buy: "hsl(145, 63%, 50%)",
  hold: "hsl(38, 92%, 50%)",
  sell: "hsl(0, 60%, 55%)",
  strongSell: "hsl(0, 72%, 41%)",
};

export function RecommendationChart({ data }: { data: any[] }) {
  const [expanded, setExpanded] = useState(false);
  const t = useT();

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

  const consensus = total > 0
    ? (latest.strongBuy * 1 + latest.buy * 2 + latest.hold * 3 + latest.sell * 4 + latest.strongSell * 5) / total
    : 3;

  const consensusLabel = consensus <= 1.5 ? t("rec.strongBuy") : consensus <= 2.5 ? t("rec.buy") : consensus <= 3.5 ? t("rec.hold") : consensus <= 4.5 ? t("rec.sell") : t("rec.strongSell");
  const consensusColor = consensus <= 2.0 ? COLORS.strongBuy : consensus <= 2.5 ? COLORS.buy : consensus <= 3.5 ? COLORS.hold : consensus <= 4.5 ? COLORS.sell : COLORS.strongSell;
  const gaugePercent = ((consensus - 1) / 4) * 100;

  const segments = [
    { label: t("rec.strongBuy"), key: "strongBuy" as const, count: latest?.strongBuy || 0, color: COLORS.strongBuy },
    { label: t("rec.buy"), key: "buy" as const, count: latest?.buy || 0, color: COLORS.buy },
    { label: t("rec.hold"), key: "hold" as const, count: latest?.hold || 0, color: COLORS.hold },
    { label: t("rec.sell"), key: "sell" as const, count: latest?.sell || 0, color: COLORS.sell },
    { label: t("rec.strongSell"), key: "strongSell" as const, count: latest?.strongSell || 0, color: COLORS.strongSell },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-muted-foreground">{t("rec.title")}</h3>
      </div>

      {total > 0 && (
        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-3xl font-display font-bold" style={{ color: consensusColor }}>{consensusLabel}</div>
            <div className="text-xs text-muted-foreground mt-1">{t("rec.score")}: {consensus.toFixed(2)} / 5.00 · {total} {t("rec.analysts")}</div>
          </div>

          <div className="relative mb-6">
            <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
              {segments.map((s) => (
                <div key={s.label} className="transition-all" style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color, minWidth: s.count > 0 ? "6px" : "0" }} />
              ))}
            </div>
            <div className="absolute top-[-4px] transition-all" style={{ left: `${gaugePercent}%`, transform: "translateX(-50%)" }}>
              <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-foreground" />
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap justify-center">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                <span className="font-bold text-sm">{s.count}</span>
                <span className="opacity-80">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs mt-4 px-2">
            <span className="font-medium" style={{ color: COLORS.buy }}>{bullish} {t("rec.bullish")} ({total > 0 ? ((bullish / total) * 100).toFixed(0) : 0}%)</span>
            <span className="font-medium" style={{ color: COLORS.sell }}>{bearish} {t("rec.bearish")} ({total > 0 ? ((bearish / total) * 100).toFixed(0) : 0}%)</span>
          </div>
        </div>
      )}

      <div className="mb-2">
        <div className="text-[11px] text-muted-foreground mb-2 font-medium">{t("rec.history")}</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11, color: "hsl(var(--foreground))" }} />
            <Bar dataKey="strongBuy" stackId="a" fill={COLORS.strongBuy} name={t("rec.strongBuy")} />
            <Bar dataKey="buy" stackId="a" fill={COLORS.buy} name={t("rec.buy")} />
            <Bar dataKey="hold" stackId="a" fill={COLORS.hold} name={t("rec.hold")} />
            <Bar dataKey="sell" stackId="a" fill={COLORS.sell} name={t("rec.sell")} />
            <Bar dataKey="strongSell" stackId="a" fill={COLORS.strongSell} radius={[3, 3, 0, 0]} name={t("rec.strongSell")} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto">
        {expanded ? t("rec.hideBreakdown") : t("rec.showBreakdown")}
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
                    const val = row[s.key] as number;
                    return <div key={s.label} className="rounded-sm" style={{ width: rowTotal > 0 ? `${(val / rowTotal) * 100}%` : "0", backgroundColor: s.color, minWidth: val > 0 ? "2px" : "0" }} />;
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
