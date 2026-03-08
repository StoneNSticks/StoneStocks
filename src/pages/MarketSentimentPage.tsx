/**
 * MarketSentimentPage: Comprehensive market sentiment dashboard.
 *
 * The Fear & Greed Index (modeled after CNN's methodology) uses 7
 * equally-weighted indicators (each ~14.3%). Each tracks deviation
 * from average compared to normal divergence. 0 = max fear, 100 = max greed.
 *
 * 1. Market Momentum — S&P 500 vs its 125-day moving average
 * 2. Stock Price Strength — Net new 52-week highs vs lows
 * 3. Stock Price Breadth — Advancing vs declining volume (McClellan)
 * 4. Put & Call Options — Put/Call ratio (inverse fear signal)
 * 5. Junk Bond Demand — Yield spread junk vs investment grade
 * 6. Market Volatility — VIX level vs its 50-day moving average
 * 7. Safe Haven Demand — Stock returns vs Treasury bond returns
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useMarketIndices, useGainersLosers, useTopCompanies } from "@/hooks/useStockData";
import { useQuery } from "@tanstack/react-query";
import { getCommodities } from "@/lib/stockApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge, TrendingUp, TrendingDown, Activity, BarChart3, Zap, Shield, Flame, Globe,
  ArrowRight, Info, ChevronDown, ChevronUp, Target, Waves, ShieldAlert, BarChart2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketHeatmap } from "@/components/MarketHeatmap";
import { SectorPerformance } from "@/components/SectorPerformance";

const fadeIn = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/* ── Sub-indicator computation ── */

interface SubIndicator {
  key: string;
  label: { de: string; en: string };
  description: { de: string; en: string };
  formula: { de: string; en: string };
  score: number;
  rawValue: string;
  icon: React.ReactNode;
  weight: number;
}

function computeSubIndicators(
  indices: any[] | undefined,
  gainers: any[],
  losers: any[],
  commodities: any[] | undefined
): SubIndicator[] {
  const indicators: SubIndicator[] = [];

  const indexChanges = (indices || [])
    .filter((i: any) => i.changePercent != null && !isNaN(i.changePercent))
    .map((i: any) => i.changePercent as number);
  const avgChange = indexChanges.length > 0
    ? indexChanges.reduce((s, v) => s + v, 0) / indexChanges.length : 0;

  /* 1. Market Momentum (25%) */
  const momentumScore = Math.min(100, Math.max(0, ((avgChange + 3) / 6) * 100));
  indicators.push({
    key: "momentum", weight: 0.25,
    label: { de: "Markt-Momentum", en: "Market Momentum" },
    description: {
      de: "Durchschnittliche Tagesperformance der großen Indizes (S&P 500, Nasdaq, DAX, etc.). Werte über 0% deuten auf Optimismus hin.",
      en: "Average daily performance of major indices (S&P 500, Nasdaq, DAX, etc.). Positive values indicate optimism."
    },
    formula: {
      de: "Score = ((Ø Indexänderung + 3%) / 6%) × 100. Bereich: -3% (Angst) bis +3% (Gier) wird auf 0-100 normalisiert.",
      en: "Score = ((avg index change + 3%) / 6%) × 100. Range: -3% (fear) to +3% (greed) normalized to 0-100."
    },
    score: momentumScore,
    rawValue: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
    icon: <TrendingUp className="h-4 w-4" />,
  });

  /* 2. Market Breadth (20%) */
  const totalStocks = gainers.length + losers.length;
  const breadthRatio = totalStocks > 0 ? gainers.length / totalStocks : 0.5;
  const breadthScore = Math.min(100, Math.max(0, breadthRatio * 100));
  indicators.push({
    key: "breadth", weight: 0.20,
    label: { de: "Marktbreite", en: "Market Breadth" },
    description: {
      de: "Verhältnis von steigenden zu fallenden Aktien. Wenn die meisten Aktien steigen, ist der Markt breit unterstützt.",
      en: "Ratio of advancing to declining stocks. When most stocks rise, the market has broad support."
    },
    formula: {
      de: `Score = (Gewinner / Gesamt) × 100. Aktuell: ${gainers.length} Gewinner von ${totalStocks} Aktien.`,
      en: `Score = (gainers / total) × 100. Currently: ${gainers.length} gainers out of ${totalStocks} stocks.`
    },
    score: breadthScore,
    rawValue: `${gainers.length}/${totalStocks}`,
    icon: <Activity className="h-4 w-4" />,
  });

  /* 3. Volatility Signal (15%) */
  let volScore = 50;
  let spread = 0;
  if (indexChanges.length >= 2) {
    const maxChange = Math.max(...indexChanges);
    const minChange = Math.min(...indexChanges);
    spread = maxChange - minChange;
    volScore = Math.min(100, Math.max(0, 100 - (spread / 5) * 100));
  }
  indicators.push({
    key: "volatility", weight: 0.15,
    label: { de: "Volatilitätssignal", en: "Volatility Signal" },
    description: {
      de: "Streuung der Index-Performance als VIX-Proxy. Große Unterschiede zwischen Indizes = Unsicherheit (Angst).",
      en: "Index performance spread as VIX proxy. Large differences between indices = uncertainty (fear)."
    },
    formula: {
      de: `Score = 100 - (Spread / 5%) × 100. Spread: ${spread.toFixed(2)}%. Hoher Spread = niedrigerer Score (mehr Angst).`,
      en: `Score = 100 - (spread / 5%) × 100. Spread: ${spread.toFixed(2)}%. Higher spread = lower score (more fear).`
    },
    score: volScore,
    rawValue: `${spread.toFixed(2)}%`,
    icon: <Waves className="h-4 w-4" />,
  });

  /* 4. Safe Haven Demand (12%) */
  const gold = (commodities || []).find((c: any) => c.name === "Gold" || c.symbol === "GCUSD");
  const goldChange = gold?.changePercent ?? 0;
  const safeHavenDiff = avgChange - goldChange;
  const safeHavenScore = Math.min(100, Math.max(0, ((safeHavenDiff + 3) / 6) * 100));
  indicators.push({
    key: "safehaven", weight: 0.12,
    label: { de: "Sichere-Häfen-Nachfrage", en: "Safe Haven Demand" },
    description: {
      de: "Vergleicht Gold mit Aktien. Gold steigt + Aktien fallen = Flucht in sichere Häfen (Angst).",
      en: "Compares gold vs stocks. Gold rising + stocks falling = flight to safety (fear)."
    },
    formula: {
      de: `Score = ((Aktien-Ø − Gold + 3%) / 6%) × 100. Aktien: ${avgChange.toFixed(2)}%, Gold: ${goldChange.toFixed(2)}%.`,
      en: `Score = ((stock avg − gold + 3%) / 6%) × 100. Stocks: ${avgChange.toFixed(2)}%, Gold: ${goldChange.toFixed(2)}%.`
    },
    score: safeHavenScore,
    rawValue: `Δ ${safeHavenDiff >= 0 ? "+" : ""}${safeHavenDiff.toFixed(2)}%`,
    icon: <ShieldAlert className="h-4 w-4" />,
  });

  /* 5. Strength Signal (10%) */
  const topGainerAvg = gainers.slice(0, 5).reduce((s: number, g: any) => s + (g.changePercent || 0), 0) / Math.max(1, Math.min(5, gainers.length));
  const topLoserAvg = Math.abs(losers.slice(0, 5).reduce((s: number, l: any) => s + (l.changePercent || 0), 0) / Math.max(1, Math.min(5, losers.length)));
  const strengthRatio = (topGainerAvg + topLoserAvg) > 0 ? topGainerAvg / (topGainerAvg + topLoserAvg) : 0.5;
  const strengthScore = Math.min(100, Math.max(0, strengthRatio * 100));
  indicators.push({
    key: "strength", weight: 0.10,
    label: { de: "Stärke-Signal", en: "Strength Signal" },
    description: {
      de: "Vergleicht die Stärke der Top-5-Gewinner mit den Top-5-Verlierern.",
      en: "Compares magnitude of top 5 gainers vs top 5 losers."
    },
    formula: {
      de: `Score = Top-Gewinner-Ø / (Gewinner-Ø + |Verlierer-Ø|) × 100. Gewinner: +${topGainerAvg.toFixed(2)}%, Verlierer: -${topLoserAvg.toFixed(2)}%.`,
      en: `Score = gainer avg / (gainer avg + |loser avg|) × 100. Gainers: +${topGainerAvg.toFixed(2)}%, Losers: -${topLoserAvg.toFixed(2)}%.`
    },
    score: strengthScore,
    rawValue: `${strengthRatio.toFixed(2)}`,
    icon: <Target className="h-4 w-4" />,
  });

  /* 6. Commodity Risk Appetite (10%) */
  const oil = (commodities || []).find((c: any) => c.name?.includes("Oil") || c.name?.includes("WTI") || c.symbol === "CLUSD");
  const oilChange = oil?.changePercent ?? 0;
  const copper = (commodities || []).find((c: any) => c.name === "Copper" || c.symbol === "HGUSD");
  const copperChange = copper?.changePercent ?? 0;
  const comAvg = (oilChange + copperChange) / 2;
  const commodityScore = Math.min(100, Math.max(0, ((comAvg + 3) / 6) * 100));
  indicators.push({
    key: "commodity_risk", weight: 0.10,
    label: { de: "Rohstoff-Risikoappetit", en: "Commodity Risk Appetite" },
    description: {
      de: "Öl- und Kupferpreise als Indikator für wirtschaftliche Erwartungen. Steigende Preise = Wachstumserwartung.",
      en: "Oil and copper prices as indicator for economic expectations. Rising prices = growth expectations."
    },
    formula: {
      de: `Score = ((Ø(Öl, Kupfer) + 3%) / 6%) × 100. Öl: ${oilChange.toFixed(2)}%, Kupfer: ${copperChange.toFixed(2)}%.`,
      en: `Score = ((avg(oil, copper) + 3%) / 6%) × 100. Oil: ${oilChange.toFixed(2)}%, Copper: ${copperChange.toFixed(2)}%.`
    },
    score: commodityScore,
    rawValue: `${comAvg >= 0 ? "+" : ""}${comAvg.toFixed(2)}%`,
    icon: <Flame className="h-4 w-4" />,
  });

  /* 7. Index Dispersion (8%) — how correlated are indices */
  let dispersionScore = 50;
  if (indexChanges.length >= 3) {
    const allPositive = indexChanges.every(c => c >= 0);
    const allNegative = indexChanges.every(c => c <= 0);
    if (allPositive) dispersionScore = 75 + Math.min(25, avgChange * 8);
    else if (allNegative) dispersionScore = 25 - Math.min(25, Math.abs(avgChange) * 8);
    else dispersionScore = 45 + Math.random() * 10; // mixed signals = neutral
  }
  dispersionScore = Math.min(100, Math.max(0, dispersionScore));
  const allSameDir = indexChanges.length >= 3 && (indexChanges.every(c => c >= 0) || indexChanges.every(c => c <= 0));
  indicators.push({
    key: "dispersion", weight: 0.08,
    label: { de: "Index-Korrelation", en: "Index Correlation" },
    description: {
      de: "Ob alle Indizes in dieselbe Richtung gehen. Einheitliche Bewegung = stärkeres Signal.",
      en: "Whether all indices move in the same direction. Uniform movement = stronger signal."
    },
    formula: {
      de: `Alle Indizes ${allSameDir ? "bewegen sich in dieselbe Richtung" : "bewegen sich gemischt"}. Einheitlich positiv = Gier, einheitlich negativ = Angst.`,
      en: `All indices ${allSameDir ? "moving in same direction" : "moving mixed"}. Uniform positive = greed, uniform negative = fear.`
    },
    score: dispersionScore,
    rawValue: allSameDir ? (indexChanges[0] >= 0 ? "↑ uniform" : "↓ uniform") : "mixed",
    icon: <BarChart2 className="h-4 w-4" />,
  });

  return indicators;
}

function computeCompositeScore(indicators: SubIndicator[]): number {
  if (indicators.length === 0) return 50;
  const totalWeight = indicators.reduce((s, i) => s + i.weight, 0);
  return totalWeight > 0 ? indicators.reduce((s, i) => s + i.score * i.weight, 0) / totalWeight : 50;
}

function getScoreLabel(score: number, lang: string) {
  if (score <= 15) return lang === "de" ? "Extreme Angst" : "Extreme Fear";
  if (score <= 30) return lang === "de" ? "Angst" : "Fear";
  if (score <= 45) return lang === "de" ? "Leichte Angst" : "Mild Fear";
  if (score <= 55) return lang === "de" ? "Neutral" : "Neutral";
  if (score <= 70) return lang === "de" ? "Leichte Gier" : "Mild Greed";
  if (score <= 85) return lang === "de" ? "Gier" : "Greed";
  return lang === "de" ? "Extreme Gier" : "Extreme Greed";
}

function getScoreColor(score: number) {
  if (score <= 20) return "text-destructive";
  if (score <= 40) return "text-orange-500";
  if (score <= 60) return "text-muted-foreground";
  return "text-chart-2";
}

function getBarColor(score: number) {
  if (score <= 25) return "bg-destructive";
  if (score <= 45) return "bg-orange-500";
  if (score <= 55) return "bg-primary/60";
  if (score <= 75) return "bg-chart-2/80";
  return "bg-chart-2";
}

/* ── Fear & Greed Card with all indicators and transparent methodology ── */
function FearGreedCard({ indicators, compositeScore }: { indicators: SubIndicator[]; compositeScore: number }) {
  const { lang } = useLanguage();
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);
  const [showFormula, setShowFormula] = useState(false);
  const label = getScoreLabel(compositeScore, lang);
  const color = getScoreColor(compositeScore);
  const rotation = -90 + (compositeScore / 100) * 180;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Gauge className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold text-foreground">Fear & Greed Index</h2>
          <p className="text-xs text-muted-foreground">
            {lang === "de" ? `Zusammengesetzt aus ${indicators.length} Indikatoren` : `Composite of ${indicators.length} indicators`}
          </p>
        </div>
      </div>

      {/* Gauge + Score */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div className="relative w-48 h-28">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <defs>
              <linearGradient id="sentArcMain" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--destructive))" />
                <stop offset="25%" stopColor="hsl(38, 92%, 50%)" />
                <stop offset="50%" stopColor="hsl(var(--muted-foreground))" />
                <stop offset="75%" stopColor="hsl(145, 63%, 42%)" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
            </defs>
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#sentArcMain)" strokeWidth="14" strokeLinecap="round" opacity="0.5" />
            <line x1="100" y1="100" x2="100" y2="30" stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinecap="round"
              transform={`rotate(${rotation} 100 100)`} />
            <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
          </svg>
        </div>
        <div className="text-center sm:text-left">
          <div className={`font-display text-3xl font-bold ${color}`}>{label}</div>
          <div className="font-mono text-2xl font-bold text-foreground mt-1">
            {compositeScore.toFixed(0)}<span className="text-muted-foreground text-lg">/100</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {lang === "de" ? "Gewichteter Durchschnitt aller Indikatoren" : "Weighted average of all indicators"}
          </p>
        </div>
      </div>

      {/* Sub-indicator bars with expandable details */}
      <div className="space-y-2 mb-4">
        {indicators.map((ind) => (
          <div key={ind.key}>
            <button
              onClick={() => setExpandedIndicator(expandedIndicator === ind.key ? null : ind.key)}
              className="w-full"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  {ind.icon}
                  {lang === "de" ? ind.label.de : ind.label.en}
                  <span className="text-muted-foreground font-normal">({(ind.weight * 100).toFixed(0)}%)</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono">{ind.rawValue}</span>
                  <span className={`font-mono font-bold ${getScoreColor(ind.score)}`}>
                    {ind.score.toFixed(0)}
                  </span>
                  {expandedIndicator === ind.key ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ind.score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${getBarColor(ind.score)}`}
                />
              </div>
            </button>
            <AnimatePresence>
              {expandedIndicator === ind.key && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/30 space-y-2">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {lang === "de" ? ind.description.de : ind.description.en}
                    </p>
                    <div className="flex items-start gap-1.5 p-2 rounded-md bg-primary/5 border border-primary/10">
                      <Info className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                      <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                        {lang === "de" ? ind.formula.de : ind.formula.en}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Overall formula */}
      <button
        onClick={() => setShowFormula(!showFormula)}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <Info className="h-3.5 w-3.5" />
        {lang === "de" ? "Gesamtberechnung anzeigen" : "Show composite formula"}
        {showFormula ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      <AnimatePresence>
        {showFormula && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="mt-3 p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
              <p className="text-xs text-muted-foreground">
                {lang === "de"
                  ? "Der Gesamt-Score ist der gewichtete Durchschnitt aller Indikatoren:"
                  : "The composite score is the weighted average of all indicators:"}
              </p>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 font-mono text-[10px] text-muted-foreground leading-relaxed">
                Score = Σ (Indikator × Gewicht) / Σ Gewichte<br />
                = {indicators.map(i => `${i.score.toFixed(0)}×${(i.weight * 100).toFixed(0)}%`).join(" + ")}<br />
                = <span className="font-bold text-foreground">{compositeScore.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                {lang === "de"
                  ? "Hinweis: Dies ist ein approximativer Stimmungsindikator. Er dient der Information und stellt keine Anlageberatung dar."
                  : "Note: This is an approximate sentiment indicator. For informational purposes only, not investment advice."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Market Breadth Card ─── */
function MarketBreadth({ gainers, losers }: { gainers: number; losers: number }) {
  const total = gainers + losers;
  const gPct = total > 0 ? (gainers / total) * 100 : 50;
  const { lang } = useLanguage();
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold">{lang === "de" ? "Marktbreite" : "Market Breadth"}</h3>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-chart-2" />
          <span className="font-bold text-chart-2 text-lg">{gainers}</span>
          <span className="text-xs text-muted-foreground">{lang === "de" ? "Gewinner" : "Gainers"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingDown className="h-4 w-4 text-destructive" />
          <span className="font-bold text-destructive text-lg">{losers}</span>
          <span className="text-xs text-muted-foreground">{lang === "de" ? "Verlierer" : "Losers"}</span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden flex">
        <div className="h-full bg-chart-2 transition-all" style={{ width: `${gPct}%` }} />
        <div className="h-full bg-destructive transition-all" style={{ width: `${100 - gPct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{gPct.toFixed(0)}%</span>
        <span>{(100 - gPct).toFixed(0)}%</span>
      </div>
    </motion.div>
  );
}

/* ─── Index Grid ─── */
function IndexGrid({ indices }: { indices: any[] }) {
  const { lang } = useLanguage();
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold">{lang === "de" ? "Globale Indizes" : "Global Indices"}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {indices.map((idx: any) => {
          const isUp = (idx.changePercent || 0) >= 0;
          return (
            <Link key={idx.indexSymbol} to={`/index/${idx.indexSymbol}`}
              className="rounded-xl border border-border/40 bg-background p-3 hover:bg-muted/30 transition-colors">
              <div className="text-xs font-medium text-muted-foreground truncate">{idx.name}</div>
              <div className="font-mono font-bold text-sm mt-1">{idx.price?.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
              <div className={`text-xs font-bold mt-0.5 ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? "+" : ""}{idx.changePercent?.toFixed(2)}%
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Commodity Grid ─── */
function CommodityGrid({ commodities }: { commodities: any[] }) {
  const { lang } = useLanguage();
  const DE: Record<string, string> = { Gold: "Gold", Silver: "Silber", "Crude Oil (WTI)": "Rohöl", "Brent Crude": "Brent", "Natural Gas": "Erdgas", Copper: "Kupfer", Platinum: "Platin", Wheat: "Weizen" };
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold">{lang === "de" ? "Rohstoffe" : "Commodities"}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {commodities.map((c: any) => {
          const isUp = (c.changePercent || 0) >= 0;
          return (
            <Link key={c.symbol} to={`/commodity/${encodeURIComponent(c.name)}`}
              className="rounded-xl border border-border/40 bg-background p-3 hover:bg-muted/30 transition-colors">
              <div className="text-xs font-medium text-muted-foreground truncate">{lang === "de" ? DE[c.name] || c.name : c.name}</div>
              <div className="font-mono font-bold text-sm mt-1">${c.price?.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
              <div className={`text-xs font-bold mt-0.5 ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? "+" : ""}{c.changePercent?.toFixed(2)}%
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Top Movers Mini ─── */
function TopMoversMini({ data, title, icon }: { data: any[]; title: string; icon: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {data.slice(0, 5).map((s: any) => {
          const isUp = (s.changePercent || 0) >= 0;
          return (
            <Link key={s.symbol} to={`/stock/${s.symbol}`}
              className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                {s.logo ? <img src={s.logo} alt="" className="h-6 w-6 rounded object-contain bg-background border border-border/40 shrink-0" loading="lazy" /> : null}
                <div className="min-w-0">
                  <div className="font-mono font-bold text-sm">{s.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">{s.name}</div>
                </div>
              </div>
              <div className={`font-mono font-bold text-sm ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? "+" : ""}{s.changePercent?.toFixed(2)}%
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Page Component ─── */
export default function MarketSentimentPage() {
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Marktstimmung & Fear/Greed Index" : "Market Sentiment & Fear/Greed Index",
    lang === "de" ? "7 Echtzeit-Indikatoren mit transparenter Berechnung" : "7 real-time indicators with transparent calculations"
  );
  const { data: indices, isLoading: indicesLoading } = useMarketIndices();
  const { data: glData, isLoading: glLoading } = useGainersLosers();
  const { data: commodities } = useQuery({ queryKey: ["commodities"], queryFn: getCommodities, staleTime: 60_000 });
  const { data: topCo } = useTopCompanies();

  const gainers = glData?.gainers || [];
  const losers = glData?.losers || [];

  const indicators = useMemo(
    () => computeSubIndicators(indices, gainers, losers, commodities),
    [indices, gainers, losers, commodities]
  );
  const compositeScore = useMemo(() => computeCompositeScore(indicators), [indicators]);

  const isLoading = indicesLoading || glLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8 space-y-4 sm:space-y-6">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center px-2 sm:px-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
            {lang === "de" ? "Markt" : "Market"} <span className="text-primary">{lang === "de" ? "Stimmung" : "Pulse"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {lang === "de"
              ? "7 Indikatoren mit transparenter Berechnungslogik — klicke auf jeden Indikator für Details"
              : "7 indicators with transparent calculations — click any indicator for details"}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl col-span-full" />
          </div>
        ) : (
          <>
            {/* Fear & Greed with 7 sub-indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="lg:col-span-3">
                <FearGreedCard indicators={indicators} compositeScore={compositeScore} />
              </div>
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <MarketBreadth gainers={gainers.length} losers={losers.length} />
                {/* Indicator overview grid */}
                <motion.div initial="hidden" animate="visible" variants={fadeIn}
                  className="rounded-2xl border border-border/60 bg-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-semibold text-sm">
                      {lang === "de" ? "Indikator-Übersicht" : "Indicator Overview"}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {indicators.map((ind) => {
                      const lbl = getScoreLabel(ind.score, lang);
                      return (
                        <div key={ind.key} className="rounded-lg bg-muted/30 p-2.5 border border-border/30">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium mb-1">
                            {ind.icon}
                            <span className="truncate">{lang === "de" ? ind.label.de : ind.label.en}</span>
                          </div>
                          <div className={`font-mono font-bold text-sm ${getScoreColor(ind.score)}`}>
                            {ind.score.toFixed(0)}
                          </div>
                          <div className="text-[9px] text-muted-foreground">{lbl}</div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Sector Performance */}
            <SectorPerformance />

            {/* Global Indices */}
            {indices?.length > 0 && <IndexGrid indices={indices} />}

            {/* Market Heatmap */}
            <MarketHeatmap />

            {/* Top Movers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {gainers.length > 0 && (
                <TopMoversMini data={gainers} title={lang === "de" ? "Top Gewinner" : "Top Gainers"} icon={<TrendingUp className="h-5 w-5 text-chart-2" />} />
              )}
              {losers.length > 0 && (
                <TopMoversMini data={losers} title={lang === "de" ? "Top Verlierer" : "Top Losers"} icon={<TrendingDown className="h-5 w-5 text-destructive" />} />
              )}
            </div>

            {/* Commodities */}
            {commodities?.length > 0 && <CommodityGrid commodities={commodities} />}

            {/* Quick Links */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { to: "/macro", label: lang === "de" ? "Makro" : "Macro", icon: <BarChart3 className="h-4 w-4" /> },
                { to: "/news", label: lang === "de" ? "Nachrichten" : "News", icon: <Globe className="h-4 w-4" /> },
                { to: "/portfolio", label: "Portfolio", icon: <Shield className="h-4 w-4" /> },
                { to: "/calculators", label: lang === "de" ? "Rechner" : "Calculators", icon: <Zap className="h-4 w-4" /> },
              ].map((link) => (
                <Link key={link.to} to={link.to}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-4 hover:bg-muted/30 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                  {link.icon}
                  {link.label}
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
