/**
 * AnalystConsensus: Premium analyst overview card.
 * 
 * Combines:
 * - Consensus gauge (1-5 scale, visual arc)
 * - Rating breakdown (segmented bar + counts)
 * - Bullish vs Bearish split
 * - Price target range with visual bar
 * - 12-month recommendation history chart
 * - 3-month trend indicator
 */
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Target, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Info, Users, DollarSign } from "lucide-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();
  const [showHistory, setShowHistory] = useState(false);

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

  const trendImproved = consensus < prevConsensus - 0.1;
  const trendWorsened = consensus > prevConsensus + 0.1;

  const consensusLabel = consensus <= 1.5 ? t("rec.strongBuy") : consensus <= 2.5 ? t("rec.buy") : consensus <= 3.5 ? t("rec.hold") : consensus <= 4.5 ? t("rec.sell") : t("rec.strongSell");
  const consensusColor = consensus <= 2.0 ? COLORS.strongBuy : consensus <= 2.5 ? COLORS.buy : consensus <= 3.5 ? COLORS.hold : consensus <= 4.5 ? COLORS.sell : COLORS.strongSell;

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
  const neutral = latest?.hold || 0;

  if (!total && !target) return null;

  const gaugeAngle = total > 0 ? ((consensus - 1) / 4) * 180 : 90;

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Target className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm text-foreground">{t("rec.title")}</h3>
          <p className="text-[10px] text-muted-foreground">
            {total > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 inline" />
                {total} {t("rec.analysts")}
                {trendImproved && <span className="text-chart-2 font-medium ml-1">↑ {lang === "de" ? "verbessert" : "improving"}</span>}
                {trendWorsened && <span className="text-destructive font-medium ml-1">↓ {lang === "de" ? "verschlechtert" : "declining"}</span>}
              </span>
            )}
          </p>
        </div>
        {trendImproved && <TrendingUp className="h-4 w-4 text-chart-2 shrink-0" />}
        {trendWorsened && <TrendingDown className="h-4 w-4 text-destructive shrink-0" />}
        {!trendImproved && !trendWorsened && total > 0 && <Minus className="h-4 w-4 text-muted-foreground shrink-0" />}
      </div>

      {/* ── Consensus Gauge ── */}
      {total > 0 && (
        <div className="px-5 pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* SVG Gauge */}
            <div className="relative w-40 h-24 shrink-0">
              <svg viewBox="0 0 200 110" className="w-full h-full">
                <defs>
                  <linearGradient id="analystArc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={COLORS.strongBuy} />
                    <stop offset="25%" stopColor={COLORS.buy} />
                    <stop offset="50%" stopColor={COLORS.hold} />
                    <stop offset="75%" stopColor={COLORS.sell} />
                    <stop offset="100%" stopColor={COLORS.strongSell} />
                  </linearGradient>
                </defs>
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" />
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#analystArc)" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
                <line
                  x1="100" y1="100"
                  x2={100 + 58 * Math.cos((Math.PI * (180 - gaugeAngle)) / 180)}
                  y2={100 - 58 * Math.sin((Math.PI * (180 - gaugeAngle)) / 180)}
                  stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="4" fill="hsl(var(--foreground))" />
                {/* Labels */}
                <text x="18" y="108" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="start">{lang === "de" ? "Kauf" : "Buy"}</text>
                <text x="182" y="108" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="end">{lang === "de" ? "Verkauf" : "Sell"}</text>
              </svg>
            </div>
            {/* Score */}
            <div className="text-center sm:text-left flex-1">
              <div className="text-2xl font-display font-bold" style={{ color: consensusColor }}>{consensusLabel}</div>
              <div className="font-mono text-lg font-bold text-foreground">{consensus.toFixed(2)}<span className="text-muted-foreground text-sm"> / 5.00</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ── Rating Breakdown ── */}
      {total > 0 && (
        <div className="px-5 pb-4 space-y-3">
          {/* Segmented bar */}
          <div className="flex h-3.5 rounded-full overflow-hidden gap-0.5">
            {segments.map((s) => (
              <motion.div
                key={s.label}
                initial={{ width: 0 }}
                animate={{ width: `${(s.count / total) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ backgroundColor: s.color, minWidth: s.count > 0 ? "6px" : "0" }}
                className="rounded-sm"
              />
            ))}
          </div>

          {/* Rating chips */}
          <div className="flex gap-1 flex-wrap justify-center">
            {segments.map((s) => s.count > 0 && (
              <div key={s.label} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium"
                style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                <span className="font-bold">{s.count}</span>
                <span className="opacity-80 text-[10px]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Bullish / Neutral / Bearish summary */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold flex items-center gap-1" style={{ color: COLORS.buy }}>
              <TrendingUp className="h-3 w-3" />
              {bullish} {t("rec.bullish")} ({((bullish / total) * 100).toFixed(0)}%)
            </span>
            <span className="text-muted-foreground font-medium">{neutral} {lang === "de" ? "Halten" : "Hold"}</span>
            <span className="font-semibold flex items-center gap-1" style={{ color: COLORS.sell }}>
              {bearish} {t("rec.bearish")} ({((bearish / total) * 100).toFixed(0)}%)
              <TrendingDown className="h-3 w-3" />
            </span>
          </div>
        </div>
      )}

      {/* ── Price Target ── */}
      {target > 0 && price > 0 && (
        <div className="mx-5 mb-4 rounded-xl bg-muted/40 border border-border/40 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{t("at.title")}</span>
            <span className={`ml-auto font-bold font-mono ${upside >= 0 ? "text-chart-2" : "text-destructive"}`}>
              {upside >= 0 ? "+" : ""}{upside.toFixed(1)}%
            </span>
          </div>

          {/* Three price boxes */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {low > 0 && (
              <div className="rounded-lg bg-background p-2 border border-border/30">
                <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{lang === "de" ? "Tief" : "Low"}</div>
                <div className="font-mono font-bold text-sm text-destructive">{cSym}{(convert(low) ?? low).toFixed(0)}</div>
              </div>
            )}
            <div className="rounded-lg bg-background p-2 border border-primary/30 shadow-sm">
              <div className="text-[9px] text-primary font-semibold uppercase tracking-wider">Target</div>
              <div className="font-mono font-bold text-sm text-foreground">{cSym}{(convert(target) ?? target).toFixed(2)}</div>
            </div>
            {high > 0 && (
              <div className="rounded-lg bg-background p-2 border border-border/30">
                <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{lang === "de" ? "Hoch" : "High"}</div>
                <div className="font-mono font-bold text-sm text-chart-2">{cSym}{(convert(high) ?? high).toFixed(0)}</div>
              </div>
            )}
          </div>

          {/* Range bar */}
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
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                <div className="absolute top-0 h-full rounded-full bg-primary/15" style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }} />
                <div className="absolute top-0 h-full w-0.5 bg-foreground/70 z-10" style={{ left: `${Math.min(100, Math.max(0, pricePct))}%` }} title={`Current: ${cSym}${convert(price)?.toFixed(2)}`} />
                <div className="absolute -top-0.5 h-3 w-1.5 rounded-full z-10" style={{
                  left: `${Math.min(100, Math.max(0, targetPct))}%`,
                  backgroundColor: upside >= 0 ? COLORS.buy : COLORS.sell,
                }} title={`Target: ${cSym}${convert(target)?.toFixed(2)}`} />
              </div>
            );
          })()}

          <div className="text-[10px] text-muted-foreground text-center">
            {t("at.current")}: <span className="font-mono font-medium text-foreground">{cSym}{convert(price)?.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* ── History Toggle ── */}
      {chartData.length > 0 && (
        <div className="border-t border-border/40">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-center gap-1.5 px-5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            {showHistory
              ? (lang === "de" ? "Verlauf ausblenden" : "Hide history")
              : (lang === "de" ? "12-Monats-Verlauf anzeigen" : "Show 12-month history")}
            {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5">
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={chartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="period" axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" height={40} tick={{ fontSize: 7, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 10, color: "hsl(var(--foreground))" }} />
                      <Bar dataKey="strongBuy" stackId="a" fill={COLORS.strongBuy} name={t("rec.strongBuy")} />
                      <Bar dataKey="buy" stackId="a" fill={COLORS.buy} name={t("rec.buy")} />
                      <Bar dataKey="hold" stackId="a" fill={COLORS.hold} name={t("rec.hold")} />
                      <Bar dataKey="sell" stackId="a" fill={COLORS.sell} name={t("rec.sell")} />
                      <Bar dataKey="strongSell" stackId="a" fill={COLORS.strongSell} radius={[3, 3, 0, 0]} name={t("rec.strongSell")} />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Per-month mini breakdown */}
                  <div className="mt-3 space-y-1 max-h-[200px] overflow-y-auto">
                    {chartData.map((row) => {
                      const rowTotal = row.strongBuy + row.buy + row.hold + row.sell + row.strongSell;
                      return (
                        <div key={row.period} className="flex items-center gap-2 text-[10px] px-1 py-1 rounded-md hover:bg-muted/30">
                          <span className="w-14 text-muted-foreground font-mono">{row.period}</span>
                          <div className="flex-1 flex h-1.5 rounded-full overflow-hidden gap-px">
                            {segments.map((s) => {
                              const val = row[s.key] as number;
                              return <div key={s.label} style={{ width: rowTotal > 0 ? `${(val / rowTotal) * 100}%` : "0", backgroundColor: s.color, minWidth: val > 0 ? "2px" : "0" }} />;
                            })}
                          </div>
                          <span className="w-6 text-right text-muted-foreground font-mono">{rowTotal}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
