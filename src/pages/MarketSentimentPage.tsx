/**
 * MarketSentimentPage: Comprehensive market sentiment dashboard.
 * 
 * The Fear & Greed Index is computed from 5 sub-indicators:
 * 1. Market Momentum: Average performance of major indices
 * 2. Market Breadth: Ratio of advancing vs declining stocks
 * 3. Volatility Signal: Derived from index spread (proxy for VIX)
 * 4. Safe Haven Demand: Gold performance vs stock market (flight to safety)
 * 5. Junk Bond Proxy: Energy/commodity momentum as risk appetite signal
 * 
 * Each indicator produces a 0-100 sub-score. The final score is a weighted average.
 * A methodology section explains each indicator transparently.
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useMarketIndices, useGainersLosers, useTopCompanies } from "@/hooks/useStockData";
import { useQuery } from "@tanstack/react-query";
import { getCommodities } from "@/lib/stockApi";
import { useLanguage } from "@/contexts/LanguageContext";
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
  score: number;
  icon: React.ReactNode;
  weight: number;
}

/**
 * Professional Fear & Greed Index — 7 sub-indicators.
 * Uses linear clamped normalization with market-calibrated ranges.
 * Each indicator maps a real-world metric to 0 (extreme fear) – 100 (extreme greed).
 */

/** Clamp a value into 0–100 by linearly mapping [low, high] → [0, 100] */
function linearScore(value: number, fearEnd: number, greedEnd: number): number {
  return Math.min(100, Math.max(0, ((value - fearEnd) / (greedEnd - fearEnd)) * 100));
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
    ? indexChanges.reduce((s, v) => s + v, 0) / indexChanges.length
    : 0;

  /* 1. Market Momentum (25%)
     Average daily % change of major indices.
     Range: -2% (extreme fear) to +2% (extreme greed). 0% = neutral (50). */
  indicators.push({
    key: "momentum",
    label: { de: "Markt-Momentum", en: "Market Momentum" },
    description: {
      de: "Durchschnittliche Tagesperformance der großen Indizes (S&P 500, Nasdaq, DAX, etc.). -2% = extreme Angst, 0% = neutral, +2% = extreme Gier.",
      en: "Average daily performance of major indices. -2% maps to extreme fear, 0% to neutral, +2% to extreme greed."
    },
    score: linearScore(avgChange, -2, 2),
    icon: <TrendingUp className="h-4 w-4" />,
    weight: 0.25,
  });

  /* 2. Market Breadth (20%)
     Advance/Decline ratio. 
     Range: 30% advancers (fear) to 70% advancers (greed). 50% = neutral. */
  const totalStocks = gainers.length + losers.length;
  const advancePct = totalStocks > 0 ? (gainers.length / totalStocks) * 100 : 50;
  indicators.push({
    key: "breadth",
    label: { de: "Marktbreite (A/D)", en: "Market Breadth (A/D)" },
    description: {
      de: "Verhältnis steigender zu fallender Aktien. 30% Gewinner = Angst, 50% = neutral, 70% = Gier. Basiert auf dem Advance/Decline-Prinzip.",
      en: "Ratio of advancing stocks. 30% advancers = fear, 50% = neutral, 70% = greed. Based on Advance/Decline breadth."
    },
    score: linearScore(advancePct, 30, 70),
    icon: <Activity className="h-4 w-4" />,
    weight: 0.20,
  });

  /* 3. Volatility (15%)
     Standard deviation of index returns as VIX proxy.
     Range: 2.5% stddev (fear, high vol) to 0.3% stddev (greed, calm). Inverted. */
  let stdDev = 0.8; // default moderate
  if (indexChanges.length >= 2) {
    const variance = indexChanges.reduce((s, v) => s + Math.pow(v - avgChange, 2), 0) / indexChanges.length;
    stdDev = Math.sqrt(variance);
  }
  indicators.push({
    key: "volatility",
    label: { de: "Volatilität (VIX-Proxy)", en: "Volatility (VIX Proxy)" },
    description: {
      de: "Standardabweichung der Index-Renditen. Hohe Schwankung (>2%) = Angst, geringe (<0.5%) = Ruhe/Gier. Invertierte Skala.",
      en: "Std deviation of index returns. High volatility (>2%) = fear, low (<0.5%) = calm/greed. Inverted scale."
    },
    score: linearScore(stdDev, 2.5, 0.3), // inverted: high vol = low score
    icon: <Waves className="h-4 w-4" />,
    weight: 0.15,
  });

  /* 4. Safe Haven Demand (10%)
     Stocks vs Gold relative performance.
     If stocks outperform gold by +2% → greed. If gold outperforms by +2% → fear. */
  const gold = (commodities || []).find((c: any) => c.name === "Gold" || c.symbol === "GCUSD");
  const goldChange = gold?.changePercent ?? 0;
  const stockVsGold = avgChange - goldChange;
  indicators.push({
    key: "safehaven",
    label: { de: "Sichere-Häfen-Nachfrage", en: "Safe Haven Demand" },
    description: {
      de: "Aktien vs. Gold Relative Performance. Gold schlägt Aktien = Flucht in sichere Häfen (Angst). Aktien schlagen Gold = Risikobereitschaft (Gier).",
      en: "Stocks vs gold relative performance. Gold outperforming = flight to safety (fear). Stocks outperforming = risk appetite (greed)."
    },
    score: linearScore(stockVsGold, -2, 2),
    icon: <ShieldAlert className="h-4 w-4" />,
    weight: 0.10,
  });

  /* 5. Price Strength (10%)
     Avg magnitude of top gainers vs top losers.
     If gainers are much stronger than losers → greed. Ratio 0.3–0.7 maps to 0–100. */
  const top10G = gainers.slice(0, 10);
  const top10L = losers.slice(0, 10);
  const gainerMag = top10G.length > 0 ? top10G.reduce((s: number, g: any) => s + Math.abs(g.changePercent || 0), 0) / top10G.length : 0;
  const loserMag = top10L.length > 0 ? top10L.reduce((s: number, l: any) => s + Math.abs(l.changePercent || 0), 0) / top10L.length : 0;
  const strengthRatio = (gainerMag + loserMag) > 0 ? gainerMag / (gainerMag + loserMag) : 0.5;
  indicators.push({
    key: "strength",
    label: { de: "Kurs-Stärke", en: "Price Strength" },
    description: {
      de: "Durchschnittliche Stärke der Top-10-Gewinner vs. -Verlierer. Wenn Gewinner dominieren (Ratio >0.6) = Gier, Verlierer dominieren (<0.4) = Angst.",
      en: "Avg magnitude of top 10 gainers vs losers. Gainers dominating (ratio >0.6) = greed, losers dominating (<0.4) = fear."
    },
    score: linearScore(strengthRatio, 0.3, 0.7),
    icon: <Target className="h-4 w-4" />,
    weight: 0.10,
  });

  /* 6. Cyclical Demand (10%)
     Oil + Copper performance as economic growth proxy.
     Range: -2% (recession fear) to +2% (growth optimism). */
  const oil = (commodities || []).find((c: any) => c.name?.includes("Oil") || c.name?.includes("WTI") || c.name?.includes("Crude"));
  const copper = (commodities || []).find((c: any) => c.name === "Copper" || c.symbol?.includes("COPPER"));
  const cyclicals = [oil?.changePercent, copper?.changePercent].filter((v): v is number => v != null && !isNaN(v));
  const cyclicalAvg = cyclicals.length > 0 ? cyclicals.reduce((s, v) => s + v, 0) / cyclicals.length : 0;
  indicators.push({
    key: "risk",
    label: { de: "Zyklische Nachfrage", en: "Cyclical Demand" },
    description: {
      de: "Performance von Öl und Kupfer als Konjunkturbarometer. Steigende Preise = Wachstumsoptimismus (Gier), fallende = Rezessionsangst.",
      en: "Oil and copper performance as economic growth proxy. Rising prices = growth optimism (greed), falling = recession fear."
    },
    score: linearScore(cyclicalAvg, -2, 2),
    icon: <Flame className="h-4 w-4" />,
    weight: 0.10,
  });

  /* 7. Global Consensus (10%)
     % of indices moving in same positive direction.
     All up = extreme greed, all down = extreme fear, mixed = neutral. */
  let consensusScore = 50;
  if (indexChanges.length >= 3) {
    const positiveCount = indexChanges.filter(c => c > 0).length;
    const positivePct = positiveCount / indexChanges.length;
    // 100% positive = 100, 50% positive = 50, 0% positive = 0
    consensusScore = positivePct * 100;
  }
  indicators.push({
    key: "consensus",
    label: { de: "Globaler Konsens", en: "Global Consensus" },
    description: {
      de: "Anteil der Indizes mit positiver Tagesperformance. 100% positiv = starker Konsens (Gier), 0% = einheitlich negativ (Angst).",
      en: "Percentage of indices with positive daily return. 100% positive = strong consensus (greed), 0% = uniformly negative (fear)."
    },
    score: consensusScore,
    icon: <BarChart2 className="h-4 w-4" />,
    weight: 0.10,
  });

  return indicators;
}

/* ── Composite score from weighted indicators ── */
function computeCompositeScore(indicators: SubIndicator[]): number {
  if (indicators.length === 0) return 50;
  const totalWeight = indicators.reduce((s, i) => s + i.weight, 0);
  const weighted = indicators.reduce((s, i) => s + i.score * i.weight, 0);
  return totalWeight > 0 ? weighted / totalWeight : 50;
}

/* ── Score label & color helpers ── */
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

/* ── Main Fear & Greed Card with sub-indicators ── */
function FearGreedCard({ indicators, compositeScore }: { indicators: SubIndicator[]; compositeScore: number }) {
  const { lang } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
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
            {lang === "de" ? "Zusammengesetzt aus 5 Indikatoren" : "Composite of 5 indicators"}
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
        </div>
      </div>

      {/* Sub-indicator bars */}
      <div className="space-y-3 mb-4">
        {indicators.map((ind) => (
          <div key={ind.key}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                {ind.icon}
                {lang === "de" ? ind.label.de : ind.label.en}
                <span className="text-muted-foreground font-normal">({(ind.weight * 100).toFixed(0)}%)</span>
              </span>
              <span className={`font-mono font-bold ${getScoreColor(ind.score)}`}>
                {ind.score.toFixed(0)}
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
          </div>
        ))}
      </div>

      {/* Toggle methodology */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <Info className="h-3.5 w-3.5" />
        {lang === "de" ? "Wie wird der Index berechnet?" : "How is the index calculated?"}
        {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/40 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "de"
                  ? "Der Fear & Greed Index kombiniert 5 Marktindikatoren zu einem gewichteten Gesamtwert von 0 (extreme Angst) bis 100 (extreme Gier). Jeder Indikator misst einen anderen Aspekt der Marktstimmung:"
                  : "The Fear & Greed Index combines 5 market indicators into a weighted composite score from 0 (extreme fear) to 100 (extreme greed). Each indicator measures a different aspect of market sentiment:"}
              </p>
              {indicators.map((ind) => (
                <div key={ind.key} className="flex gap-3">
                  <div className="mt-0.5 shrink-0">{ind.icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      {lang === "de" ? ind.label.de : ind.label.en}
                      <span className="font-normal text-muted-foreground ml-1">
                        ({lang === "de" ? "Gewichtung" : "Weight"}: {(ind.weight * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      {lang === "de" ? ind.description.de : ind.description.en}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border/40">
                <p className="text-[10px] text-muted-foreground italic">
                  {lang === "de"
                    ? "Hinweis: Dies ist ein approximativer Stimmungsindikator basierend auf Echtzeit-Marktdaten. Er dient der Information und stellt keine Anlageberatung dar."
                    : "Note: This is an approximate sentiment indicator based on real-time market data. It is for informational purposes only and does not constitute investment advice."}
                </p>
              </div>
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
  const { data: indices, isLoading: indicesLoading } = useMarketIndices();
  const { data: glData, isLoading: glLoading } = useGainersLosers();
  const { data: commodities, isLoading: comLoading } = useQuery({ queryKey: ["commodities"], queryFn: getCommodities, staleTime: 60_000 });
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
        {/* Page Title */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center px-2 sm:px-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
            {lang === "de" ? "Markt" : "Market"} <span className="text-primary">{lang === "de" ? "Stimmung" : "Pulse"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {lang === "de" ? "Echtzeit-Überblick über die aktuelle Marktlage" : "Real-time overview of current market conditions"}
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
            {/* Fear & Greed (with sub-indicators) + Market Breadth */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="lg:col-span-3">
                <FearGreedCard indicators={indicators} compositeScore={compositeScore} />
              </div>
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <MarketBreadth gainers={gainers.length} losers={losers.length} />
                {/* Score summary mini card */}
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
                { to: "/rankings", label: lang === "de" ? "Rankings" : "Rankings", icon: <BarChart3 className="h-4 w-4" /> },
                { to: "/news", label: lang === "de" ? "Nachrichten" : "News", icon: <Globe className="h-4 w-4" /> },
                { to: "/portfolio", label: "Portfolio", icon: <Shield className="h-4 w-4" /> },
                { to: "/calculators", label: lang === "de" ? "Rechner" : "Tools", icon: <Zap className="h-4 w-4" /> },
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
