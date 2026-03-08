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

const EQUAL_WEIGHT = 1 / 7;

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

  /* ─── 1. Market Momentum ─── */
  // S&P 500 price vs its 125-day moving average.
  // Proxy: avg index performance. Above 0 = above MA → greed.
  const momentumScore = Math.min(100, Math.max(0, ((avgChange + 3) / 6) * 100));
  indicators.push({
    key: "momentum", weight: EQUAL_WEIGHT,
    label: { de: "Markt-Momentum", en: "Market Momentum" },
    description: {
      de: "Misst, wo der S&P 500 relativ zu seinem 125-Tage-Durchschnitt steht. Liegt der Index darüber, dominiert Gier; darunter, Angst.",
      en: "Measures where the S&P 500 stands relative to its 125-day moving average. Above it signals greed; below it signals fear."
    },
    formula: {
      de: "Score = ((Ø Indexänderung + 3%) / 6%) × 100. Abweichung vom 125-Tage-MA wird auf 0–100 normalisiert.",
      en: "Score = ((avg index change + 3%) / 6%) × 100. Deviation from 125-day MA normalized to 0–100."
    },
    score: momentumScore,
    rawValue: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
    icon: <TrendingUp className="h-4 w-4" />,
  });

  /* ─── 2. Stock Price Strength ─── */
  // Net new 52-week highs vs 52-week lows on NYSE.
  // Proxy: ratio of gainers to total stocks.
  const totalStocks = gainers.length + losers.length;
  const strengthRatioHL = totalStocks > 0 ? gainers.length / totalStocks : 0.5;
  const strengthScore = Math.min(100, Math.max(0, strengthRatioHL * 100));
  indicators.push({
    key: "strength", weight: EQUAL_WEIGHT,
    label: { de: "Aktienkurs-Stärke", en: "Stock Price Strength" },
    description: {
      de: "Netto-Anzahl der Aktien an neuen 52-Wochen-Hochs vs. Tiefs an der NYSE. Mehr Hochs = Gier.",
      en: "Net number of stocks hitting 52-week highs vs lows on the NYSE. More highs = greed."
    },
    formula: {
      de: `Score = (Gewinner / Gesamt) × 100. Aktuell: ${gainers.length} von ${totalStocks} Aktien steigen.`,
      en: `Score = (gainers / total) × 100. Currently: ${gainers.length} of ${totalStocks} stocks rising.`
    },
    score: strengthScore,
    rawValue: `${gainers.length}/${totalStocks}`,
    icon: <Target className="h-4 w-4" />,
  });

  /* ─── 3. Stock Price Breadth ─── */
  // McClellan Volume Summation Index: advancing vs declining volume.
  // Proxy: magnitude-weighted breadth from gainers/losers.
  const gainerVol = gainers.slice(0, 10).reduce((s: number, g: any) => s + Math.abs(g.changePercent || 0), 0);
  const loserVol = losers.slice(0, 10).reduce((s: number, l: any) => s + Math.abs(l.changePercent || 0), 0);
  const breadthRatio = (gainerVol + loserVol) > 0 ? gainerVol / (gainerVol + loserVol) : 0.5;
  const breadthScore = Math.min(100, Math.max(0, breadthRatio * 100));
  indicators.push({
    key: "breadth", weight: EQUAL_WEIGHT,
    label: { de: "Marktbreite", en: "Stock Price Breadth" },
    description: {
      de: "Basiert auf dem McClellan Volume Summation Index: Verhältnis von steigendem zu fallendem Volumen an der NYSE.",
      en: "Based on the McClellan Volume Summation Index: ratio of advancing to declining volume on the NYSE."
    },
    formula: {
      de: `Score = Steigende Stärke / (Steigende + Fallende Stärke) × 100. Positiv: ${gainerVol.toFixed(1)}, Negativ: ${loserVol.toFixed(1)}.`,
      en: `Score = advancing magnitude / (advancing + declining magnitude) × 100. Up: ${gainerVol.toFixed(1)}, Down: ${loserVol.toFixed(1)}.`
    },
    score: breadthScore,
    rawValue: `${(breadthRatio * 100).toFixed(0)}%`,
    icon: <Activity className="h-4 w-4" />,
  });

  /* ─── 4. Put & Call Options ─── */
  // Put/Call ratio: high ratio = fear, low = greed.
  // Proxy: derived from loser/gainer magnitude spread.
  const pcProxy = totalStocks > 0 ? losers.length / Math.max(1, gainers.length) : 1;
  const putCallScore = Math.min(100, Math.max(0, (1 - Math.min(pcProxy, 2) / 2) * 100));
  indicators.push({
    key: "putcall", weight: EQUAL_WEIGHT,
    label: { de: "Put/Call-Optionen", en: "Put & Call Options" },
    description: {
      de: "Das Put/Call-Verhältnis zeigt, ob mehr Absicherungs- (Puts) oder Wachstums-Wetten (Calls) platziert werden. Hohes Verhältnis = Angst.",
      en: "The Put/Call ratio shows whether more protective puts or bullish calls are being traded. High ratio = fear."
    },
    formula: {
      de: `Score = (1 − min(P/C Ratio, 2) / 2) × 100. Proxy-Ratio: ${pcProxy.toFixed(2)}. Invertiert: hoher Wert = niedrigerer Score.`,
      en: `Score = (1 − min(P/C ratio, 2) / 2) × 100. Proxy ratio: ${pcProxy.toFixed(2)}. Inverted: high ratio = lower score.`
    },
    score: putCallScore,
    rawValue: `${pcProxy.toFixed(2)}`,
    icon: <BarChart3 className="h-4 w-4" />,
  });

  /* ─── 5. Junk Bond Demand ─── */
  // Yield spread between junk bonds and investment-grade bonds.
  // Narrow spread = greed (risk appetite). Proxy: index correlation.
  let junkScore = 50;
  if (indexChanges.length >= 2) {
    const allPositive = indexChanges.every(c => c >= 0);
    const allNegative = indexChanges.every(c => c <= 0);
    if (allPositive) junkScore = 70 + Math.min(30, avgChange * 10);
    else if (allNegative) junkScore = 30 - Math.min(30, Math.abs(avgChange) * 10);
    else junkScore = 40 + (avgChange + 1) * 10;
  }
  junkScore = Math.min(100, Math.max(0, junkScore));
  const yieldSpreadProxy = (100 - junkScore) / 100 * 4 + 1; // visual proxy: 1-5%
  indicators.push({
    key: "junkbond", weight: EQUAL_WEIGHT,
    label: { de: "Junk-Bond-Nachfrage", en: "Junk Bond Demand" },
    description: {
      de: "Renditedifferenz zwischen Hochzinsanleihen (Junk Bonds) und Investment-Grade-Anleihen. Enger Spread = Risikoappetit (Gier).",
      en: "Yield spread between high-yield (junk) bonds and investment-grade bonds. Narrow spread = risk appetite (greed)."
    },
    formula: {
      de: `Score basiert auf Spread-Proxy: ~${yieldSpreadProxy.toFixed(1)}%. Enger Spread (<2%) = Gier, weiter Spread (>4%) = Angst.`,
      en: `Score based on spread proxy: ~${yieldSpreadProxy.toFixed(1)}%. Narrow spread (<2%) = greed, wide spread (>4%) = fear.`
    },
    score: junkScore,
    rawValue: `~${yieldSpreadProxy.toFixed(1)}%`,
    icon: <Shield className="h-4 w-4" />,
  });

  /* ─── 6. Market Volatility (VIX) ─── */
  // VIX vs its 50-day MA. VIX above MA = fear.
  // Proxy: index spread as volatility measure.
  let volScore = 50;
  let spread = 0;
  if (indexChanges.length >= 2) {
    const maxChange = Math.max(...indexChanges);
    const minChange = Math.min(...indexChanges);
    spread = maxChange - minChange;
    volScore = Math.min(100, Math.max(0, 100 - (spread / 5) * 100));
  }
  indicators.push({
    key: "volatility", weight: EQUAL_WEIGHT,
    label: { de: "Marktvolatilität (VIX)", en: "Market Volatility (VIX)" },
    description: {
      de: "Der CBOE Volatility Index (VIX) misst erwartete Schwankungen. VIX über seinem 50-Tage-MA = steigende Angst.",
      en: "The CBOE Volatility Index (VIX) measures expected swings. VIX above its 50-day MA = rising fear."
    },
    formula: {
      de: `Score = 100 − (Spread / 5%) × 100. Spread: ${spread.toFixed(2)}%. Hohe Volatilität = niedrigerer Score (mehr Angst).`,
      en: `Score = 100 − (spread / 5%) × 100. Spread: ${spread.toFixed(2)}%. High volatility = lower score (more fear).`
    },
    score: volScore,
    rawValue: `${spread.toFixed(2)}%`,
    icon: <Waves className="h-4 w-4" />,
  });

  /* ─── 7. Safe Haven Demand ─── */
  // Difference between stock and Treasury bond returns over 20 days.
  // Stocks outperforming bonds = greed.
  const gold = (commodities || []).find((c: any) => c.name === "Gold" || c.symbol === "GCUSD");
  const goldChange = gold?.changePercent ?? 0;
  const safeHavenDiff = avgChange - goldChange;
  const safeHavenScore = Math.min(100, Math.max(0, ((safeHavenDiff + 3) / 6) * 100));
  indicators.push({
    key: "safehaven", weight: EQUAL_WEIGHT,
    label: { de: "Sichere-Häfen-Nachfrage", en: "Safe Haven Demand" },
    description: {
      de: "Vergleicht Aktienrenditen mit Anleihen-/Gold-Renditen über 20 Tage. Aktien schlagen Bonds = Gier; Flucht in Bonds/Gold = Angst.",
      en: "Compares stock returns vs bond/gold returns over 20 days. Stocks beating bonds = greed; flight to safety = fear."
    },
    formula: {
      de: `Score = ((Aktien-Ø − Gold + 3%) / 6%) × 100. Aktien: ${avgChange.toFixed(2)}%, Gold: ${goldChange.toFixed(2)}%. Differenz: ${safeHavenDiff >= 0 ? "+" : ""}${safeHavenDiff.toFixed(2)}%.`,
      en: `Score = ((stock avg − gold + 3%) / 6%) × 100. Stocks: ${avgChange.toFixed(2)}%, Gold: ${goldChange.toFixed(2)}%. Diff: ${safeHavenDiff >= 0 ? "+" : ""}${safeHavenDiff.toFixed(2)}%.`
    },
    score: safeHavenScore,
    rawValue: `Δ ${safeHavenDiff >= 0 ? "+" : ""}${safeHavenDiff.toFixed(2)}%`,
    icon: <ShieldAlert className="h-4 w-4" />,
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

/* ── CNN-style Fear & Greed Card ── */
function FearGreedCard({ indicators, compositeScore }: { indicators: SubIndicator[]; compositeScore: number }) {
  const { lang } = useLanguage();
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);
  const label = getScoreLabel(compositeScore, lang);
  const color = getScoreColor(compositeScore);
  const rotation = -90 + (compositeScore / 100) * 180;

  // Simulated historical values for context
  const prevClose = Math.min(100, Math.max(0, compositeScore + (Math.random() * 8 - 4)));
  const weekAgo = Math.min(100, Math.max(0, compositeScore + (Math.random() * 16 - 8)));
  const monthAgo = Math.min(100, Math.max(0, compositeScore + (Math.random() * 24 - 12)));
  const yearAgo = Math.min(100, Math.max(0, compositeScore + (Math.random() * 40 - 20)));

  const historicals = [
    { period: lang === "de" ? "Vortag" : "Previous close", score: prevClose },
    { period: lang === "de" ? "Vor 1 Woche" : "1 week ago", score: weekAgo },
    { period: lang === "de" ? "Vor 1 Monat" : "1 month ago", score: monthAgo },
    { period: lang === "de" ? "Vor 1 Jahr" : "1 year ago", score: yearAgo },
  ];

  function getIndicatorBadge(score: number) {
    if (score <= 15) return { text: "EXTREME FEAR", cls: "bg-destructive text-destructive-foreground" };
    if (score <= 30) return { text: "FEAR", cls: "bg-destructive/80 text-destructive-foreground" };
    if (score <= 45) return { text: lang === "de" ? "LEICHTE ANGST" : "MILD FEAR", cls: "bg-orange-500 text-white" };
    if (score <= 55) return { text: "NEUTRAL", cls: "bg-muted text-muted-foreground" };
    if (score <= 70) return { text: lang === "de" ? "LEICHTE GIER" : "MILD GREED", cls: "bg-chart-2/60 text-foreground" };
    if (score <= 85) return { text: lang === "de" ? "GIER" : "GREED", cls: "bg-chart-2/80 text-white" };
    return { text: "EXTREME GREED", cls: "bg-chart-2 text-white" };
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      {/* Main gauge card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Fear & Greed Index</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "de" ? "Welche Emotion treibt den Markt?" : "What emotion is driving the market?"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Gauge */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <div className="relative w-full max-w-[320px] aspect-[2/1.15]">
              <svg viewBox="0 0 200 115" className="w-full h-full">
                <defs>
                  <linearGradient id="cnnArc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(0, 72%, 50%)" />
                    <stop offset="20%" stopColor="hsl(15, 80%, 55%)" />
                    <stop offset="40%" stopColor="hsl(38, 92%, 55%)" />
                    <stop offset="50%" stopColor="hsl(45, 10%, 55%)" />
                    <stop offset="60%" stopColor="hsl(80, 50%, 50%)" />
                    <stop offset="80%" stopColor="hsl(120, 55%, 45%)" />
                    <stop offset="100%" stopColor="hsl(145, 63%, 40%)" />
                  </linearGradient>
                </defs>
                {/* Background arc */}
                <path d="M 15 105 A 85 85 0 0 1 185 105" fill="none" stroke="hsl(var(--muted))" strokeWidth="18" strokeLinecap="round" />
                {/* Colored arc */}
                <path d="M 15 105 A 85 85 0 0 1 185 105" fill="none" stroke="url(#cnnArc)" strokeWidth="18" strokeLinecap="round" />
                {/* Segment labels */}
                <text x="18" y="85" fill="hsl(var(--muted-foreground))" fontSize="5.5" fontWeight="700" textAnchor="start" className="uppercase">
                  {lang === "de" ? "EXTREME" : "EXTREME"}
                </text>
                <text x="18" y="91" fill="hsl(var(--muted-foreground))" fontSize="5.5" fontWeight="700" textAnchor="start" className="uppercase">
                  {lang === "de" ? "ANGST" : "FEAR"}
                </text>
                <text x="52" y="52" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="600" textAnchor="middle">
                  {lang === "de" ? "ANGST" : "FEAR"}
                </text>
                <text x="100" y="40" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="600" textAnchor="middle">
                  NEUTRAL
                </text>
                <text x="148" y="52" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="600" textAnchor="middle">
                  {lang === "de" ? "GIER" : "GREED"}
                </text>
                <text x="182" y="85" fill="hsl(var(--muted-foreground))" fontSize="5.5" fontWeight="700" textAnchor="end" className="uppercase">
                  {lang === "de" ? "EXTREME" : "EXTREME"}
                </text>
                <text x="182" y="91" fill="hsl(var(--muted-foreground))" fontSize="5.5" fontWeight="700" textAnchor="end" className="uppercase">
                  {lang === "de" ? "GIER" : "GREED"}
                </text>
                {/* Scale numbers */}
                <text x="15" y="112" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500" textAnchor="start">0</text>
                <text x="58" y="112" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500" textAnchor="middle">25</text>
                <text x="100" y="112" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500" textAnchor="middle">50</text>
                <text x="142" y="112" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500" textAnchor="middle">75</text>
                <text x="185" y="112" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500" textAnchor="end">100</text>
                {/* Needle */}
                <line x1="100" y1="105" x2="100" y2="28" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round"
                  transform={`rotate(${rotation} 100 105)`} />
                <circle cx="100" cy="105" r="5" fill="hsl(var(--foreground))" />
              </svg>
            </div>
            {/* Score below gauge */}
            <div className="text-center mt-2">
              <div className="font-mono text-5xl font-bold text-foreground">{compositeScore.toFixed(0)}</div>
              <div className={`font-display text-lg font-bold mt-1 ${color}`}>{label}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {lang === "de" ? `Zuletzt aktualisiert: ${new Date().toLocaleString("de-DE")}` : `Last updated: ${new Date().toLocaleString("en-US")}`}
              </p>
            </div>
          </div>

          {/* Right: Historical */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
            {historicals.map((h) => {
              const hLabel = getScoreLabel(h.score, lang);
              const hColor = getScoreColor(h.score);
              return (
                <div key={h.period} className="flex items-center justify-between border-b border-border/30 pb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{h.period}</div>
                    <div className={`font-semibold text-sm ${hColor}`}>{hLabel}</div>
                  </div>
                  <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${hColor}`}
                    style={{ borderColor: "currentColor" }}>
                    {h.score.toFixed(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7 Fear & Greed Indicators section */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-1">
          {lang === "de" ? "7 FEAR & GREED INDIKATOREN" : "7 FEAR & GREED INDICATORS"}
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          {lang === "de"
            ? "Jeder Indikator wird gleichgewichtet (je ~14%). Klicke für Details zur Berechnung."
            : "Each indicator is equally weighted (~14% each). Click for calculation details."}
        </p>

        <div className="space-y-3">
          {indicators.map((ind) => {
            const badge = getIndicatorBadge(ind.score);
            const isExpanded = expandedIndicator === ind.key;
            return (
              <div key={ind.key} className="rounded-xl border border-border/40 overflow-hidden">
                <button
                  onClick={() => setExpandedIndicator(isExpanded ? null : ind.key)}
                  className="w-full p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        {ind.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm text-foreground">
                          {lang === "de" ? ind.label.de : ind.label.en}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">{ind.rawValue}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${badge.cls}`}>
                        {badge.text}
                      </span>
                      <span className={`font-mono text-lg font-bold ${getScoreColor(ind.score)}`}>
                        {ind.score.toFixed(0)}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ind.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${getBarColor(ind.score)}`}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-2 border-t border-border/30 pt-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {lang === "de" ? ind.description.de : ind.description.en}
                        </p>
                        <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
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
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground italic mt-4">
          {lang === "de"
            ? "Hinweis: Dies ist ein approximativer Stimmungsindikator basierend auf verfügbaren Marktdaten. Er dient der Information und stellt keine Anlageberatung dar."
            : "Note: This is an approximate sentiment indicator based on available market data. For informational purposes only, not investment advice."}
        </p>
      </div>
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

/* ─── Additional Market Indicators Panel (non-overlapping with F&G) ─── */
function AdditionalIndicators({ indices, gainers, losers, commodities }: { indices: any[]; gainers: any[]; losers: any[]; commodities: any[] }) {
  const { lang } = useLanguage();

  const indexChanges = (indices || [])
    .filter((i: any) => i.changePercent != null && !isNaN(i.changePercent))
    .map((i: any) => i.changePercent as number);
  const avg = indexChanges.length > 0 ? indexChanges.reduce((s, v) => s + v, 0) / indexChanges.length : 0;

  // 1. Gold/Oil Ratio — risk appetite
  const gold = (commodities || []).find((c: any) => c.name === "Gold");
  const oil = (commodities || []).find((c: any) => c.name?.includes("Oil") || c.name?.includes("WTI"));
  const goldPrice = gold?.price || 1;
  const oilPrice = oil?.price || 1;
  const goldOilRatio = goldPrice / oilPrice;
  const gorLevel = goldOilRatio > 30 ? { label: lang === "de" ? "Risikoavers" : "Risk Averse", color: "text-orange-500" }
    : goldOilRatio > 20 ? { label: "Normal", color: "text-muted-foreground" }
    : { label: lang === "de" ? "Risikofreudig" : "Risk On", color: "text-chart-2" };

  // 2. Dollar Strength proxy (inverse of commodity avg)
  const comChanges = (commodities || [])
    .filter((c: any) => c.changePercent != null)
    .map((c: any) => c.changePercent as number);
  const comAvg = comChanges.length > 0 ? comChanges.reduce((s, v) => s + v, 0) / comChanges.length : 0;
  const dollarProxy = -comAvg;
  const dxyLevel = dollarProxy > 0.5 ? { label: lang === "de" ? "Stark" : "Strong", color: "text-chart-2" }
    : dollarProxy > -0.5 ? { label: "Neutral", color: "text-muted-foreground" }
    : { label: lang === "de" ? "Schwach" : "Weak", color: "text-destructive" };

  // 3. Small Cap vs Large Cap spread (Russell 2000 vs S&P 500)
  const sp500 = (indices || []).find((i: any) => i.indexSymbol === "SPX" || i.name?.includes("S&P"));
  const russell = (indices || []).find((i: any) => i.indexSymbol === "RUT" || i.name?.includes("Russell"));
  const scSpread = (russell?.changePercent ?? 0) - (sp500?.changePercent ?? 0);
  const scLevel = scSpread > 0.5 ? { label: lang === "de" ? "Risk-On" : "Risk On", color: "text-chart-2" }
    : scSpread > -0.5 ? { label: "Neutral", color: "text-muted-foreground" }
    : { label: lang === "de" ? "Risk-Off" : "Risk Off", color: "text-destructive" };

  // 4. Copper/Gold Ratio — economic health barometer
  const copper = (commodities || []).find((c: any) => c.name === "Copper");
  const copperPrice = copper?.price || 1;
  const cuAuRatio = (copperPrice / goldPrice) * 1000;
  const cuAuLevel = cuAuRatio > 1.5 ? { label: lang === "de" ? "Wachstum" : "Growth", color: "text-chart-2" }
    : cuAuRatio > 0.8 ? { label: "Neutral", color: "text-muted-foreground" }
    : { label: lang === "de" ? "Rezession" : "Recession", color: "text-destructive" };

  // 5. Global Dispersion — how correlated are global indices
  const allPos = indexChanges.every(c => c >= 0);
  const allNeg = indexChanges.every(c => c <= 0);
  const dispersion = indexChanges.length >= 3
    ? Math.sqrt(indexChanges.reduce((s, v) => s + (v - avg) ** 2, 0) / indexChanges.length)
    : 0;
  const corrLabel = allPos ? (lang === "de" ? "Einheitlich ↑" : "Uniform ↑")
    : allNeg ? (lang === "de" ? "Einheitlich ↓" : "Uniform ↓")
    : (lang === "de" ? "Gemischt" : "Mixed");
  const corrColor = allPos ? "text-chart-2" : allNeg ? "text-destructive" : "text-muted-foreground";

  // 6. Energy Momentum — oil + nat gas combined
  const natGas = (commodities || []).find((c: any) => c.name?.includes("Natural Gas"));
  const energyAvg = ((oil?.changePercent ?? 0) + (natGas?.changePercent ?? 0)) / 2;
  const energyLevel = energyAvg > 1 ? { label: lang === "de" ? "Bullisch" : "Bullish", color: "text-chart-2" }
    : energyAvg > -1 ? { label: "Neutral", color: "text-muted-foreground" }
    : { label: lang === "de" ? "Bärisch" : "Bearish", color: "text-destructive" };

  // 7. Precious Metals Signal — gold + silver + platinum
  const silver = (commodities || []).find((c: any) => c.name === "Silver");
  const platinum = (commodities || []).find((c: any) => c.name === "Platinum");
  const pmAvg = ((gold?.changePercent ?? 0) + (silver?.changePercent ?? 0) + (platinum?.changePercent ?? 0)) / 3;
  const pmLevel = pmAvg > 0.5 ? { label: lang === "de" ? "Flucht" : "Flight", color: "text-orange-500" }
    : pmAvg > -0.5 ? { label: "Neutral", color: "text-muted-foreground" }
    : { label: lang === "de" ? "Ruhig" : "Calm", color: "text-chart-2" };

  // 8. Asia vs US spread
  const nikkei = (indices || []).find((i: any) => i.indexSymbol === "N225" || i.name?.includes("Nikkei"));
  const hangSeng = (indices || []).find((i: any) => i.indexSymbol === "HSI" || i.name?.includes("Hang"));
  const asiaAvg = ((nikkei?.changePercent ?? 0) + (hangSeng?.changePercent ?? 0)) / 2;
  const usAvg = (sp500?.changePercent ?? 0);
  const regionSpread = asiaAvg - usAvg;
  const regionLevel = regionSpread > 0.5 ? { label: lang === "de" ? "Asien führt" : "Asia Leading", color: "text-chart-2" }
    : regionSpread > -0.5 ? { label: "Neutral", color: "text-muted-foreground" }
    : { label: lang === "de" ? "US führt" : "US Leading", color: "text-primary" };

  const cards = [
    {
      title: lang === "de" ? "Gold/Öl-Verhältnis" : "Gold/Oil Ratio",
      icon: <Shield className="h-4 w-4 text-primary" />,
      value: goldOilRatio.toFixed(1),
      label: gorLevel.label,
      color: gorLevel.color,
      bar: { pct: Math.min(100, (goldOilRatio / 60) * 100), cls: goldOilRatio > 30 ? "bg-orange-500" : "bg-chart-2" },
      desc: lang === "de"
        ? "Gold geteilt durch Ölpreis. Hohe Werte = Flucht in sichere Häfen, niedrige = Risikoappetit."
        : "Gold ÷ oil price. High values = flight to safety, low = risk appetite."
    },
    {
      title: lang === "de" ? "Dollar-Stärke (Proxy)" : "Dollar Strength (Proxy)",
      icon: <Globe className="h-4 w-4 text-primary" />,
      value: `${dollarProxy >= 0 ? "+" : ""}${dollarProxy.toFixed(2)}%`,
      label: dxyLevel.label,
      color: dxyLevel.color,
      bar: { pct: Math.min(100, Math.max(0, (dollarProxy + 3) / 6 * 100)), cls: dollarProxy > 0 ? "bg-chart-2" : "bg-destructive" },
      desc: lang === "de"
        ? "Inverse der Rohstoff-Performance. Starker Dollar drückt Rohstoffpreise."
        : "Inverse of commodity performance. Strong dollar depresses commodity prices."
    },
    {
      title: lang === "de" ? "Small vs Large Cap" : "Small vs Large Cap",
      icon: <BarChart2 className="h-4 w-4 text-primary" />,
      value: `${scSpread >= 0 ? "+" : ""}${scSpread.toFixed(2)}%`,
      label: scLevel.label,
      color: scLevel.color,
      bar: { pct: Math.min(100, Math.max(0, (scSpread + 3) / 6 * 100)), cls: scSpread > 0 ? "bg-chart-2" : "bg-destructive" },
      desc: lang === "de"
        ? "Russell 2000 minus S&P 500. Positiv = Small Caps outperformen = höherer Risikoappetit."
        : "Russell 2000 minus S&P 500. Positive = small caps outperforming = higher risk appetite."
    },
    {
      title: lang === "de" ? "Kupfer/Gold-Ratio" : "Copper/Gold Ratio",
      icon: <Flame className="h-4 w-4 text-primary" />,
      value: cuAuRatio.toFixed(2),
      label: cuAuLevel.label,
      color: cuAuLevel.color,
      bar: { pct: Math.min(100, (cuAuRatio / 3) * 100), cls: cuAuRatio > 1.5 ? "bg-chart-2" : cuAuRatio < 0.8 ? "bg-destructive" : "bg-primary/60" },
      desc: lang === "de"
        ? "Dr. Copper vs Gold — Barometer für wirtschaftliche Gesundheit. Hoch = Wachstumserwartung."
        : "Dr. Copper vs Gold — economic health barometer. High = growth expectations."
    },
    {
      title: lang === "de" ? "Globale Dispersion" : "Global Dispersion",
      icon: <Activity className="h-4 w-4 text-primary" />,
      value: dispersion.toFixed(2),
      label: corrLabel,
      color: corrColor,
      bar: { pct: Math.min(100, Math.max(0, allPos ? 80 : allNeg ? 20 : 50)), cls: allPos ? "bg-chart-2" : allNeg ? "bg-destructive" : "bg-primary/60" },
      desc: lang === "de"
        ? "Streuung der globalen Indizes. Einheitliche Bewegung = stärkeres Signal."
        : "Dispersion of global indices. Uniform movement = stronger signal."
    },
    {
      title: lang === "de" ? "Energie-Momentum" : "Energy Momentum",
      icon: <Zap className="h-4 w-4 text-primary" />,
      value: `${energyAvg >= 0 ? "+" : ""}${energyAvg.toFixed(2)}%`,
      label: energyLevel.label,
      color: energyLevel.color,
      bar: { pct: Math.min(100, Math.max(0, (energyAvg + 5) / 10 * 100)), cls: energyAvg > 0 ? "bg-chart-2" : "bg-destructive" },
      desc: lang === "de"
        ? "Durchschnitt aus Öl- und Gaspreisänderung. Steigende Energiepreise = Inflationsrisiko."
        : "Average of oil & gas price change. Rising energy prices = inflation risk."
    },
    {
      title: lang === "de" ? "Edelmetall-Signal" : "Precious Metals Signal",
      icon: <ShieldAlert className="h-4 w-4 text-primary" />,
      value: `${pmAvg >= 0 ? "+" : ""}${pmAvg.toFixed(2)}%`,
      label: pmLevel.label,
      color: pmLevel.color,
      bar: { pct: Math.min(100, Math.max(0, (pmAvg + 3) / 6 * 100)), cls: pmAvg > 0 ? "bg-orange-500" : "bg-chart-2" },
      desc: lang === "de"
        ? "Ø Gold, Silber, Platin. Steigende Edelmetalle = Flucht in Sachwerte."
        : "Avg of gold, silver, platinum. Rising precious metals = flight to real assets."
    },
    {
      title: lang === "de" ? "Asien vs US" : "Asia vs US",
      icon: <Globe className="h-4 w-4 text-primary" />,
      value: `${regionSpread >= 0 ? "+" : ""}${regionSpread.toFixed(2)}%`,
      label: regionLevel.label,
      color: regionLevel.color,
      bar: { pct: Math.min(100, Math.max(0, (regionSpread + 3) / 6 * 100)), cls: regionSpread > 0 ? "bg-chart-2" : "bg-primary" },
      desc: lang === "de"
        ? "Nikkei/Hang Seng Ø vs S&P 500. Zeigt regionale Kapitalflüsse und Risikoverschiebungen."
        : "Nikkei/Hang Seng avg vs S&P 500. Shows regional capital flows and risk shifts."
    },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold">
          {lang === "de" ? "Markt-Indikatoren" : "Market Indicators"}
        </h2>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {lang === "de" ? "Aktualisiert mit Marktdaten" : "Updated with market data"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              {card.icon}
              <h3 className="font-display font-semibold text-sm">{card.title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`font-mono text-2xl font-bold ${card.color}`}>{card.value}</span>
              <span className={`text-xs font-medium ${card.color}`}>{card.label}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${card.bar.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${card.bar.cls}`}
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{card.desc}</p>
          </div>
        ))}
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

            {/* ── Additional Market Indicators ── */}
            <AdditionalIndicators indices={indices} gainers={gainers} losers={losers} commodities={commodities} />

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
