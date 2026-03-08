/**
 * AnalystConsensus — Unified analyst view with gauge, price targets,
 * 12-month trend, and segmented rating breakdown.
 * Replaces separate AnalystTargets + RecommendationChart in the stock detail layout.
 */
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const COLORS = {
  strongBuy: "hsl(145, 80%, 35%)",
  buy: "hsl(145, 63%, 50%)",
  hold: "hsl(38, 92%, 50%)",
  sell: "hsl(0, 60%, 55%)",
  strongSell: "hsl(0, 72%, 41%)",
};

interface Props {
  recommendation: any[] | null;
  overview: Record<string, string> | null;
  quote: Record<string, number> | null;
}

export function AnalystConsensus({ recommendation, overview, quote }: Props) {
  const t = useT();
  const { convert, symbol: cSym } = useCurrency();

  const chartData = useMemo(() => {
    if (!recommendation?.length) return [];
    return recommendation.slice(0, 12).reverse().map((d: any) => ({
      period: d.period?.substring(0, 7),
      strongBuy: d.strongBuy || 0,
      buy: d.buy || 0,
      hold: d.hold || 0,
      sell: d.sell || 0,
      strongSell: d.strongSell || 0,
    }));
  }, [recommendation]);

  const latest = chartData[chartData.length - 1];
  const prev = chartData.length > 3 ? chartData[chartData.length - 4] : null;

  const total = latest ? latest.strongBuy + latest.buy + latest.hold + latest.sell + latest.strongSell : 0;

  const consensus = total > 0
    ? (latest.strongBuy * 1 + latest.buy * 2 + latest.hold * 3 + latest.sell * 4 + latest.strongSell * 5) / total
    : 0;

  const prevConsensus = prev
    ? ((prev.strongBuy * 1 + prev.buy * 2 + prev.hold * 3 + prev.sell * 4 + prev.strongSell * 5) /
      (prev.strongBuy + prev.buy + prev.hold + prev.sell + prev.strongSell || 1))
    : consensus;

  const trendImproved = consensus < prevConsensus;
  const trendWorsened = consensus > prevConsensus;

  const consensusLabel = consensus <= 1.5 ? t("rec.strongBuy") : consensus <= 2.5 ? t("rec.buy") : consensus <= 3.5 ? t("rec.hold") : consensus <= 4.5 ? t("rec.sell") : t("rec.strongSell");
  const consensusColor = consensus <= 2.0 ? COLORS.strongBuy : consensus <= 2.5 ? COLORS.buy : consensus <= 3.5 ? COLORS.hold : consensus <= 4.5 ? COLORS.sell : COLORS.strongSell;

  // Price target data
  const target = parseFloat(overview?.AnalystTargetPrice || "0");
  const high = parseFloat(overview?.AnalystHighTarget || "0");
  const low = parseFloat(overview?.AnalystLowTarget || "0");
  const price = quote?.c || 0;
  const upside = price && target ? ((target - price) / price) * 100 : 0;

  const segments = [
    { label: t("rec.strongBuy"), key: "strongBuy" as const, count: latest?.strongBuy || 0, color: COLORS.strongBuy },
    { label: t("rec.buy"), key: "buy" as const, count: latest?.buy || 0, color: COLORS.buy },
    { label: t("rec.hold"), key: "hold" as const, count: latest?.hold || 0, color: COLORS.hold },
    { label: t("rec.sell"), key: "sell" as const, count: latest?.sell || 0, color: COLORS.sell },
    { label: t("rec.strongSell"), key: "strongSell" as const, count: latest?.strongSell || 0, color: COLORS.strongSell },
  ];

  const bullish = (latest?.strongBuy || 0) + (latest?.buy || 0);
  const bearish = (latest?.sell || 0) + (latest?.strongSell || 0);

  if (!total && !target) return null;

  // Gauge angle: consensus 1-5 mapped to 180° arc
  const gaugeAngle = total > 0 ? ((consensus - 1) / 4) * 180 : 90;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-muted-foreground">{t("rec.title")}</h3>
        {trendImproved && <TrendingUp className="h-3.5 w-3.5 text-chart-2 ml-auto" />}
        {trendWorsened && <TrendingDown className="h-3.5 w-3.5 text-destructive ml-auto" />}
        {!trendImproved && !trendWorsened && <Minus className="h-3.5 w-3.5 text-muted-foreground ml-auto" />}
      </div>

      {/* Gauge */}
      {total > 0 && (
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 200 110" className="w-48 h-auto">
            {/* Arc background */}
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
            {/* Colored segments */}
            <path d="M 20 100 A 80 80 0 0 1 52 42" fill="none" stroke={COLORS.strongBuy} strokeWidth="14" strokeLinecap="round" />
            <path d="M 52 42 A 80 80 0 0 1 100 20" fill="none" stroke={COLORS.buy} strokeWidth="14" />
            <path d="M 100 20 A 80 80 0 0 1 148 42" fill="none" stroke={COLORS.hold} strokeWidth="14" />
            <path d="M 148 42 A 80 80 0 0 1 180 100" fill="none" stroke={COLORS.sell} strokeWidth="14" strokeLinecap="round" />
            {/* Needle */}
            <line
              x1="100" y1="100"
              x2={100 + 60 * Math.cos((Math.PI * (180 - gaugeAngle)) / 180)}
              y2={100 - 60 * Math.sin((Math.PI * (180 - gaugeAngle)) / 180)}
              stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="4" fill="hsl(var(--foreground))" />
          </svg>
          <div className="text-center -mt-2">
            <div className="text-2xl font-display font-bold" style={{ color: consensusColor }}>{consensusLabel}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {consensus.toFixed(2)} / 5.00 · {total} {t("rec.analysts")}
              {trendImproved && <span className="text-chart-2 ml-1.5">↑ vs 3M</span>}
              {trendWorsened && <span className="text-destructive ml-1.5">↓ vs 3M</span>}
            </div>
          </div>
        </div>
      )}

      {/* Segmented bar */}
      {total > 0 && (
        <>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {segments.map((s) => (
              <div key={s.label} className="transition-all" style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color, minWidth: s.count > 0 ? "6px" : "0" }} />
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                <span className="font-bold">{s.count}</span>
                <span className="opacity-80 text-[10px]">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs px-1">
            <span className="font-medium" style={{ color: COLORS.buy }}>{bullish} {t("rec.bullish")} ({total > 0 ? ((bullish / total) * 100).toFixed(0) : 0}%)</span>
            <span className="font-medium" style={{ color: COLORS.sell }}>{bearish} {t("rec.bearish")} ({total > 0 ? ((bearish / total) * 100).toFixed(0) : 0}%)</span>
          </div>
        </>
      )}

      {/* Price target range */}
      {target > 0 && price > 0 && (
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">{t("at.title")}</span>
            <span className={`font-bold ${upside >= 0 ? "text-chart-2" : "text-destructive"}`}>
              {upside >= 0 ? "+" : ""}{upside.toFixed(1)}% {t("at.upside")}
            </span>
          </div>
          {/* Price range bar */}
          {(() => {
            const lo = low || price * 0.7;
            const hi = high || price * 1.3;
            const rangeMin = Math.min(lo, price * 0.8);
            const rangeMax = Math.max(hi, price * 1.2);
            const span = rangeMax - rangeMin || 1;
            const pricePct = ((price - rangeMin) / span) * 100;
            const targetPct = ((target - rangeMin) / span) * 100;
            const lowPct = lo ? ((lo - rangeMin) / span) * 100 : 0;
            const highPct = hi ? ((hi - rangeMin) / span) * 100 : 100;

            return (
              <>
                <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
                  {/* Low-high range fill */}
                  <div className="absolute top-0 h-full rounded-full bg-primary/20" style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }} />
                  {/* Current price marker */}
                  <div className="absolute top-0 h-full w-0.5 bg-foreground z-10" style={{ left: `${Math.min(100, Math.max(0, pricePct))}%` }} />
                  {/* Target marker */}
                  <div className="absolute top-0 h-full w-1.5 rounded-full z-10" style={{
                    left: `${Math.min(100, Math.max(0, targetPct))}%`,
                    backgroundColor: upside >= 0 ? "hsl(145, 63%, 42%)" : "hsl(0, 72%, 51%)",
                  }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  {lo > 0 && <span>{cSym}{convert(lo)?.toFixed(0)} Low</span>}
                  <span className="font-medium text-foreground">{cSym}{convert(target)?.toFixed(2)} Target</span>
                  {hi > 0 && <span>{cSym}{convert(hi)?.toFixed(0)} High</span>}
                </div>
              </>
            );
          })()}
          <div className="text-[11px] text-muted-foreground text-center">
            {t("at.current")}: {cSym}{convert(price)?.toFixed(2)}
          </div>
        </div>
      )}

      {/* 12-month history chart */}
      {chartData.length > 0 && (
        <div>
          <div className="text-[11px] text-muted-foreground mb-2 font-medium">{t("rec.history")}</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 10, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="strongBuy" stackId="a" fill={COLORS.strongBuy} name={t("rec.strongBuy")} />
              <Bar dataKey="buy" stackId="a" fill={COLORS.buy} name={t("rec.buy")} />
              <Bar dataKey="hold" stackId="a" fill={COLORS.hold} name={t("rec.hold")} />
              <Bar dataKey="sell" stackId="a" fill={COLORS.sell} name={t("rec.sell")} />
              <Bar dataKey="strongSell" stackId="a" fill={COLORS.strongSell} radius={[3, 3, 0, 0]} name={t("rec.strongSell")} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
