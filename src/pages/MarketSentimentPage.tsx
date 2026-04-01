/**
 * MarketSentimentPage: Comprehensive market sentiment dashboard.
 *
 * The Fear & Greed Index uses 10 weighted indicators.
 * Each tracks deviation from average compared to normal divergence.
 * 0 = max fear, 100 = max greed.
 *
 * 1. Market Momentum (25%) — Average index daily performance
 * 2. Risk-On/Risk-Off Ratio (6%) — Cyclical commodities vs gold
 * 3. Volatility Proxy (17%) — Index spread dispersion
 * 4. Safe Haven Demand (7%) — Stocks vs gold performance
 * 5. Regional Divergence (10%) — US vs international indices
 * 6. Index Trend Strength (5%) — Conviction via magnitude of moves
 * 7. Sector Rotation (5%) — Cyclical vs defensive sectors
 * 8. Commodity Risk Appetite (10%) — Oil + copper average
 * 9. Index Correlation (8%) — Directional alignment of global indices
 * 10. Sector Breadth (8%) — How many sectors are positive vs negative
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useMarketIndices, useGainersLosers, useTopCompanies, useYahooSectors } from "@/hooks/useStockData";
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
// Polymarket sentiment hidden

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
  commodities: any[] | undefined,
  sectors: any[] | undefined,
): SubIndicator[] {
  const indicators: SubIndicator[] = [];

  const indexChanges = (indices || [])
    .filter((i: any) => i.changePercent != null && !isNaN(i.changePercent))
    .map((i: any) => i.changePercent as number);
  const avgChange = indexChanges.length > 0
    ? indexChanges.reduce((s, v) => s + v, 0) / indexChanges.length : 0;

  // Detect stale commodity data (all changes = 0 means market closed / weekend)
  const commodityChanges = (commodities || [])
    .filter((c: any) => c.changePercent != null)
    .map((c: any) => c.changePercent as number);
  const commoditiesStale = commodityChanges.length > 0 && commodityChanges.every(c => c === 0);

  /* 1. Market Momentum (25%) — ✅ Real index data */
  const momentumScore = Math.min(100, Math.max(0, ((avgChange + 3) / 6) * 100));
  indicators.push({
    key: "momentum", weight: 0.25,
    label: { de: "Markt-Momentum", en: "Market Momentum" },
    description: {
      de: "Durchschnittliche Tagesperformance der großen Indizes (S&P 500, Nasdaq, DAX, etc.). Basiert auf Echtzeit-Indexdaten.",
      en: "Average daily performance of major indices (S&P 500, Nasdaq, DAX, etc.). Based on real-time index data."
    },
    formula: {
      de: "Score = ((Ø Indexänderung + 3%) / 6%) × 100. Bereich: -3% (Angst) bis +3% (Gier) wird auf 0-100 normalisiert.",
      en: "Score = ((avg index change + 3%) / 6%) × 100. Range: -3% (fear) to +3% (greed) normalized to 0-100."
    },
    score: momentumScore,
    rawValue: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
    icon: <TrendingUp className="h-4 w-4" />,
  });

  /* 2. Risk-On / Risk-Off Ratio (6%) — Cyclical commodities vs gold */
  const oilInd = (commodities || []).find((c: any) => c.name?.includes("Oil") || c.name?.includes("WTI") || c.symbol === "CLUSD");
  const copperInd = (commodities || []).find((c: any) => c.name === "Copper" || c.symbol === "HGUSD");
  const goldInd = (commodities || []).find((c: any) => c.name === "Gold" || c.symbol === "GCUSD");
  const oilChg = oilInd?.changePercent ?? 0;
  const copperChg = copperInd?.changePercent ?? 0;
  const goldChgRisk = goldInd?.changePercent ?? 0;
  const cyclicAvg = (oilChg + copperChg) / 2;
  const riskOnOffDiff = cyclicAvg - goldChgRisk;
  const riskOnOffScore = commoditiesStale
    ? Math.min(100, Math.max(0, ((avgChange + 2) / 4) * 100))
    : Math.min(100, Math.max(0, ((riskOnOffDiff + 3) / 6) * 100));
  indicators.push({
    key: "risk_on_off", weight: 0.06,
    label: { de: "Risk-On/Risk-Off Ratio", en: "Risk-On / Risk-Off Ratio" },
    description: {
      de: commoditiesStale
        ? "Rohstoffdaten nicht verfügbar. Fallback auf Aktienmomentum."
        : "Vergleicht zyklische Rohstoffe (Öl, Kupfer) mit defensivem Gold. Wenn zyklische Assets stärker steigen als Gold, deutet das auf Risikoappetit (Gier) hin.",
      en: commoditiesStale
        ? "Commodity data unavailable. Falling back to stock momentum."
        : "Compares cyclical commodities (oil, copper) against defensive gold. When cyclicals outperform gold, it signals risk appetite (greed)."
    },
    formula: {
      de: commoditiesStale
        ? `Fallback: Score basiert auf Aktien-Momentum (${avgChange.toFixed(2)}%).`
        : `Score = ((Ø(Öl, Kupfer) − Gold + 3%) / 6%) × 100. Öl: ${oilChg.toFixed(2)}%, Kupfer: ${copperChg.toFixed(2)}%, Gold: ${goldChgRisk.toFixed(2)}%.`,
      en: commoditiesStale
        ? `Fallback: Score based on stock momentum (${avgChange.toFixed(2)}%).`
        : `Score = ((avg(oil, copper) − gold + 3%) / 6%) × 100. Oil: ${oilChg.toFixed(2)}%, Copper: ${copperChg.toFixed(2)}%, Gold: ${goldChgRisk.toFixed(2)}%.`
    },
    score: riskOnOffScore,
    rawValue: commoditiesStale ? "closed" : `${riskOnOffDiff >= 0 ? "+" : ""}${riskOnOffDiff.toFixed(2)}%`,
    icon: <Activity className="h-4 w-4" />,
  });

  /* 3. Volatility Signal (15%) — Proxy: index spread */
  let volScore = 50;
  let spread = 0;
  if (indexChanges.length >= 2) {
    const maxChange = Math.max(...indexChanges);
    const minChange = Math.min(...indexChanges);
    spread = maxChange - minChange;
    volScore = Math.min(100, Math.max(0, 100 - (spread / 5) * 100));
  }
  indicators.push({
    key: "volatility", weight: 0.17,
    label: { de: "Volatilität (Proxy)", en: "Volatility (Proxy)" },
    description: {
      de: "Approximation basierend auf der Streuung (Spread) zwischen den Tagesänderungen globaler Indizes. Kein direkter VIX-Wert, aber misst Marktunsicherheit.",
      en: "Approximation based on the spread between daily changes of global indices. Not a direct VIX reading, but measures market uncertainty."
    },
    formula: {
      de: `Score = 100 - (Spread / 5%) × 100. Spread: ${spread.toFixed(2)}%. Je größer die Streuung, desto mehr Unsicherheit.`,
      en: `Score = 100 - (spread / 5%) × 100. Spread: ${spread.toFixed(2)}%. Greater spread = more uncertainty.`
    },
    score: volScore,
    rawValue: `${spread.toFixed(2)}%`,
    icon: <Waves className="h-4 w-4" />,
  });

  /* 4. Safe Haven Demand (10%) — Gold vs stocks */
  const gold = (commodities || []).find((c: any) => c.name === "Gold" || c.symbol === "GCUSD");
  const goldChange = gold?.changePercent ?? 0;
  const safeHavenDiff = avgChange - goldChange;
  // When commodity data is stale, base score purely on how negative stocks are (more fear when stocks drop)
  const safeHavenScore = commoditiesStale
    ? Math.min(100, Math.max(0, ((avgChange + 2) / 4) * 100))
    : Math.min(100, Math.max(0, ((safeHavenDiff + 3) / 6) * 100));
  indicators.push({
    key: "safehaven", weight: 0.07,
    label: { de: "Sichere-Häfen-Nachfrage", en: "Safe Haven Demand" },
    description: {
      de: commoditiesStale
        ? "Rohstoffdaten aktuell nicht verfügbar (Markt geschlossen). Score basiert auf Aktienperformance als Fallback."
        : "Vergleicht Aktienrenditen mit Gold. Aktien schlagen Gold = Risikoappetit (Gier); Gold outperformt Aktien = Angst.",
      en: commoditiesStale
        ? "Commodity data currently unavailable (market closed). Score uses stock performance as fallback."
        : "Compares stock returns vs gold. Stocks beating gold = risk appetite (greed); gold outperforming stocks = fear."
    },
    formula: {
      de: commoditiesStale
        ? `Fallback: Score = ((Aktien-Ø + 2%) / 4%) × 100. Aktien: ${avgChange.toFixed(2)}%.`
        : `Score = ((Aktien-Ø − Gold + 3%) / 6%) × 100. Aktien: ${avgChange.toFixed(2)}%, Gold: ${goldChange.toFixed(2)}%.`,
      en: commoditiesStale
        ? `Fallback: Score = ((stock avg + 2%) / 4%) × 100. Stocks: ${avgChange.toFixed(2)}%.`
        : `Score = ((stock avg − gold + 3%) / 6%) × 100. Stocks: ${avgChange.toFixed(2)}%, Gold: ${goldChange.toFixed(2)}%.`
    },
    score: safeHavenScore,
    rawValue: commoditiesStale ? `${avgChange.toFixed(2)}% (stale)` : `Δ ${safeHavenDiff >= 0 ? "+" : ""}${safeHavenDiff.toFixed(2)}%`,
    icon: <ShieldAlert className="h-4 w-4" />,
  });

  /* 5a. Regional Divergence (10%) — US vs non-US indices */
  const usSymbols = ["SPX", "IXIC", "DJI"];
  const usIndices = (indices || []).filter((i: any) => usSymbols.includes(i.indexSymbol) || i.name?.includes("S&P") || i.name?.includes("Nasdaq") || i.name?.includes("Dow"));
  const intlIndices = (indices || []).filter((i: any) => !usSymbols.includes(i.indexSymbol) && !i.name?.includes("S&P") && !i.name?.includes("Nasdaq") && !i.name?.includes("Dow") && i.changePercent != null);
  const usAvgChg = usIndices.length > 0 ? usIndices.reduce((s: number, i: any) => s + (i.changePercent || 0), 0) / usIndices.length : 0;
  const intlAvgChg = intlIndices.length > 0 ? intlIndices.reduce((s: number, i: any) => s + (i.changePercent || 0), 0) / intlIndices.length : 0;
  const bothPositive = usAvgChg > 0 && intlAvgChg > 0;
  const alignmentBonus = bothPositive ? 10 : 0;
  const regionalScore = Math.min(100, Math.max(0, ((usAvgChg + intlAvgChg + 4) / 8) * 100 + alignmentBonus));
  indicators.push({
    key: "regional_divergence", weight: 0.10,
    label: { de: "Regionale Divergenz", en: "Regional Divergence" },
    description: {
      de: "Vergleicht US-Indizes (S&P, Nasdaq, Dow) mit internationalen Indizes (DAX, FTSE, Nikkei, etc.). Globale Einigkeit nach oben = Gier, Divergenz oder gemeinsamer Rückgang = Angst.",
      en: "Compares US indices (S&P, Nasdaq, Dow) with international indices (DAX, FTSE, Nikkei, etc.). Global alignment upward = greed, divergence or shared decline = fear."
    },
    formula: {
      de: `Score = ((US-Ø + Intl-Ø + 4%) / 8%) × 100${bothPositive ? " + 10 Bonus" : ""}. US: ${usAvgChg.toFixed(2)}% (${usIndices.length} Indizes), Intl: ${intlAvgChg.toFixed(2)}% (${intlIndices.length} Indizes).`,
      en: `Score = ((US avg + Intl avg + 4%) / 8%) × 100${bothPositive ? " + 10 bonus" : ""}. US: ${usAvgChg.toFixed(2)}% (${usIndices.length} indices), Intl: ${intlAvgChg.toFixed(2)}% (${intlIndices.length} indices).`
    },
    score: regionalScore,
    rawValue: `US ${usAvgChg >= 0 ? "+" : ""}${usAvgChg.toFixed(2)}% / Intl ${intlAvgChg >= 0 ? "+" : ""}${intlAvgChg.toFixed(2)}%`,
    icon: <Globe className="h-4 w-4" />,
  });

  /* 5b. Index Trend Strength (5%) — Conviction indicator */
  const trendMagnitude = Math.abs(avgChange);
  const trendScore = avgChange >= 0
    ? Math.min(100, 50 + (trendMagnitude / 3) * 50)
    : Math.max(0, 50 - (trendMagnitude / 3) * 50);
  indicators.push({
    key: "trend_strength", weight: 0.05,
    label: { de: "Index-Trendstärke", en: "Index Trend Strength" },
    description: {
      de: "Misst die Überzeugung des Marktes anhand der absoluten Größe der durchschnittlichen Indexbewegung. Große positive Bewegungen = starkes Gier-Signal, große negative = starkes Angst-Signal.",
      en: "Measures market conviction by the absolute magnitude of average index moves. Large positive moves = strong greed signal, large negative = strong fear signal."
    },
    formula: {
      de: `Score = ${avgChange >= 0 ? "50 + " : "50 − "}(|${avgChange.toFixed(2)}%| / 3%) × 50 = ${trendScore.toFixed(0)}. Je weiter vom Nullpunkt entfernt, desto stärkeres Signal.`,
      en: `Score = ${avgChange >= 0 ? "50 + " : "50 − "}(|${avgChange.toFixed(2)}%| / 3%) × 50 = ${trendScore.toFixed(0)}. The further from zero, the stronger the signal.`
    },
    score: trendScore,
    rawValue: `|${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%|`,
    icon: <Zap className="h-4 w-4" />,
  });

  /* 5c. Sector Rotation (5%) — Cyclical vs Defensive sector ETFs */
  const cyclicalSymbols = ["XLK", "XLY", "XLF", "XLE"];
  const defensiveSymbols = ["XLV", "XLP", "XLU", "XLRE"];
  const cyclicalSectors = (sectors || []).filter((s: any) => cyclicalSymbols.includes(s.symbol));
  const defensiveSectors = (sectors || []).filter((s: any) => defensiveSymbols.includes(s.symbol));
  const cyclicalAvgSec = cyclicalSectors.length > 0
    ? cyclicalSectors.reduce((s: number, sec: any) => s + (sec.changePercent || 0), 0) / cyclicalSectors.length : 0;
  const defensiveAvgSec = defensiveSectors.length > 0
    ? defensiveSectors.reduce((s: number, sec: any) => s + (sec.changePercent || 0), 0) / defensiveSectors.length : 0;
  const sectorSpread = cyclicalAvgSec - defensiveAvgSec;
  const sectorRotationScore = Math.min(100, Math.max(0, ((sectorSpread + 3) / 6) * 100));
  const hasSectorData = cyclicalSectors.length > 0 && defensiveSectors.length > 0;
  indicators.push({
    key: "sector_rotation", weight: 0.05,
    label: { de: "Sektorrotation", en: "Sector Rotation" },
    description: {
      de: hasSectorData
        ? "Vergleicht zyklische Sektoren (Technologie, Konsum, Finanzen, Energie) mit defensiven Sektoren (Gesundheit, Basiskonsumgüter, Versorger, Immobilien). Wenn zyklische Sektoren outperformen = Risikoappetit (Gier)."
        : "Sektordaten nicht verfügbar. Score auf Neutral gesetzt.",
      en: hasSectorData
        ? "Compares cyclical sectors (Tech, Discretionary, Financials, Energy) vs defensive sectors (Healthcare, Staples, Utilities, Real Estate). Cyclicals outperforming = risk appetite (greed)."
        : "Sector data unavailable. Score set to neutral."
    },
    formula: {
      de: hasSectorData
        ? `Score = ((Zyklisch-Ø − Defensiv-Ø + 3%) / 6%) × 100. Zyklisch: ${cyclicalAvgSec.toFixed(2)}% (${cyclicalSectors.length} Sektoren), Defensiv: ${defensiveAvgSec.toFixed(2)}% (${defensiveSectors.length} Sektoren).`
        : "Keine Daten verfügbar.",
      en: hasSectorData
        ? `Score = ((cyclical avg − defensive avg + 3%) / 6%) × 100. Cyclical: ${cyclicalAvgSec.toFixed(2)}% (${cyclicalSectors.length} sectors), Defensive: ${defensiveAvgSec.toFixed(2)}% (${defensiveSectors.length} sectors).`
        : "No data available."
    },
    score: hasSectorData ? sectorRotationScore : 50,
    rawValue: hasSectorData ? `${sectorSpread >= 0 ? "+" : ""}${sectorSpread.toFixed(2)}%` : "N/A",
    icon: <Target className="h-4 w-4" />,
  });

  /* 6. Commodity Risk Appetite (10%) — Oil + Copper */
  const oil = (commodities || []).find((c: any) => c.name?.includes("Oil") || c.name?.includes("WTI") || c.symbol === "CLUSD");
  const oilChange = oil?.changePercent ?? 0;
  const copper = (commodities || []).find((c: any) => c.name === "Copper" || c.symbol === "HGUSD");
  const copperChange = copper?.changePercent ?? 0;
  const comAvg = (oilChange + copperChange) / 2;
  // When stale, use a momentum-based fallback
  const commodityScore = commoditiesStale
    ? Math.min(100, Math.max(0, ((avgChange + 2) / 4) * 100))
    : Math.min(100, Math.max(0, ((comAvg + 3) / 6) * 100));
  indicators.push({
    key: "commodity_risk", weight: 0.10,
    label: { de: "Rohstoff-Risikoappetit", en: "Commodity Risk Appetite" },
    description: {
      de: commoditiesStale
        ? "Rohstoffmärkte aktuell geschlossen. Score basiert auf Aktienmarkt-Momentum als Fallback."
        : "Öl- und Kupferpreisänderungen als Proxy für wirtschaftliche Erwartungen. Steigende Rohstoffe = Wachstumsoptimismus.",
      en: commoditiesStale
        ? "Commodity markets currently closed. Score uses stock market momentum as fallback."
        : "Oil and copper price changes as proxy for economic expectations. Rising commodities = growth optimism."
    },
    formula: {
      de: commoditiesStale
        ? `Fallback: Score basiert auf Aktien-Momentum (${avgChange.toFixed(2)}%).`
        : `Score = ((Ø(Öl, Kupfer) + 3%) / 6%) × 100. Öl: ${oilChange.toFixed(2)}%, Kupfer: ${copperChange.toFixed(2)}%.`,
      en: commoditiesStale
        ? `Fallback: Score based on stock momentum (${avgChange.toFixed(2)}%).`
        : `Score = ((avg(oil, copper) + 3%) / 6%) × 100. Oil: ${oilChange.toFixed(2)}%, Copper: ${copperChange.toFixed(2)}%.`
    },
    score: commodityScore,
    rawValue: commoditiesStale ? "closed" : `${comAvg >= 0 ? "+" : ""}${comAvg.toFixed(2)}%`,
    icon: <Flame className="h-4 w-4" />,
  });

  /* 7. Index Correlation (8%) — deterministic, no randomness */
  let dispersionScore = 50;
  if (indexChanges.length >= 3) {
    const allPositive = indexChanges.every(c => c >= 0);
    const allNegative = indexChanges.every(c => c <= 0);
    const posRatio = indexChanges.filter(c => c >= 0).length / indexChanges.length;
    if (allPositive) dispersionScore = 75 + Math.min(25, avgChange * 8);
    else if (allNegative) dispersionScore = 25 - Math.min(25, Math.abs(avgChange) * 8);
    else {
      // Deterministic: use the ratio of positive indices as signal
      dispersionScore = posRatio * 100 * 0.6 + 20; // maps 0-100 range smoothly
    }
  }
  dispersionScore = Math.min(100, Math.max(0, dispersionScore));
  const posCount = indexChanges.filter(c => c >= 0).length;
  const allSameDir = indexChanges.length >= 3 && (indexChanges.every(c => c >= 0) || indexChanges.every(c => c <= 0));
  indicators.push({
    key: "dispersion", weight: 0.08,
    label: { de: "Index-Korrelation", en: "Index Correlation" },
    description: {
      de: "Misst, ob globale Indizes einheitlich in dieselbe Richtung gehen. Einheitlich positiv = Gier, einheitlich negativ = Angst, gemischt = Unsicherheit.",
      en: "Measures whether global indices move uniformly in the same direction. Uniform positive = greed, uniform negative = fear, mixed = uncertainty."
    },
    formula: {
      de: `${posCount} von ${indexChanges.length} Indizes positiv (${(posCount/Math.max(1,indexChanges.length)*100).toFixed(0)}%). ${allSameDir ? "Einheitliche Richtung = stärkeres Signal." : "Gemischte Signale."}`,
      en: `${posCount} of ${indexChanges.length} indices positive (${(posCount/Math.max(1,indexChanges.length)*100).toFixed(0)}%). ${allSameDir ? "Uniform direction = stronger signal." : "Mixed signals."}`
    },
    score: dispersionScore,
    rawValue: `${posCount}/${indexChanges.length} ↑`,
    icon: <BarChart2 className="h-4 w-4" />,
  });

  /* 10. Sector Breadth (7%) — How many sectors are positive vs negative */
  const sectorList = (sectors || []).filter((s: any) => s.changePercent != null && !isNaN(s.changePercent));
  const posSectors = sectorList.filter((s: any) => s.changePercent > 0).length;
  const negSectors = sectorList.filter((s: any) => s.changePercent <= 0).length;
  const totalSectors = sectorList.length;
  const breadthRatio = totalSectors > 0 ? posSectors / totalSectors : 0.5;
  const sectorBreadthScore = Math.min(100, Math.max(0, breadthRatio * 100));
  const hasBreadthData = totalSectors > 0;
  indicators.push({
    key: "sector_breadth", weight: 0.08,
    label: { de: "Sektorbreite", en: "Sector Breadth" },
    description: {
      de: hasBreadthData
        ? `Zählt, wie viele der ${totalSectors} Sektoren im Plus bzw. Minus sind. Viele positive Sektoren = breiter Aufschwung (Gier), wenige = schmale Rally oder Ausverkauf (Angst).`
        : "Sektordaten nicht verfügbar.",
      en: hasBreadthData
        ? `Counts how many of the ${totalSectors} sectors are positive vs negative. Many positive = broad rally (greed), few = narrow rally or sell-off (fear).`
        : "Sector data unavailable."
    },
    formula: {
      de: hasBreadthData
        ? `Score = (Positive Sektoren / Gesamt) × 100 = (${posSectors} / ${totalSectors}) × 100 = ${sectorBreadthScore.toFixed(0)}.`
        : "Keine Daten verfügbar.",
      en: hasBreadthData
        ? `Score = (positive sectors / total) × 100 = (${posSectors} / ${totalSectors}) × 100 = ${sectorBreadthScore.toFixed(0)}.`
        : "No data available."
    },
    score: hasBreadthData ? sectorBreadthScore : 50,
    rawValue: hasBreadthData ? `${posSectors}/${totalSectors} ↑` : "N/A",
    icon: <BarChart3 className="h-4 w-4" />,
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
                  <span className={`text-[10px] font-mono ${ind.rawValue.startsWith("+") || ind.rawValue.startsWith("Δ +") ? "text-chart-2" : ind.rawValue.startsWith("-") || ind.rawValue.startsWith("Δ -") ? "text-destructive" : "text-muted-foreground"}`}>{ind.rawValue}</span>
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

/* ─── Additional Market Indicators Panel (non-overlapping with F&G) ─── */
function AdditionalIndicators({ indices, gainers, losers, commodities }: { indices: any[]; gainers: any[]; losers: any[]; commodities: any[] }) {
  const { lang } = useLanguage();

  const commodityChanges = (commodities || []).filter((c: any) => c.changePercent != null).map((c: any) => c.changePercent as number);
  const commoditiesStale = commodityChanges.length > 0 && commodityChanges.every(c => c === 0);

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
        ? commoditiesStale ? "Rohstoffmärkte geschlossen — Wert zeigt 0%." : "Inverse der Rohstoff-Performance. Starker Dollar drückt Rohstoffpreise."
        : commoditiesStale ? "Commodity markets closed — showing 0%." : "Inverse of commodity performance. Strong dollar depresses commodity prices.",
      stale: commoditiesStale,
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
        ? commoditiesStale ? "Energiemärkte geschlossen — keine aktuellen Daten." : "Durchschnitt aus Öl- und Gaspreisänderung. Steigende Energiepreise = Inflationsrisiko."
        : commoditiesStale ? "Energy markets closed — no current data." : "Average of oil & gas price change. Rising energy prices = inflation risk.",
      stale: commoditiesStale,
    },
    {
      title: lang === "de" ? "Edelmetall-Signal" : "Precious Metals Signal",
      icon: <ShieldAlert className="h-4 w-4 text-primary" />,
      value: `${pmAvg >= 0 ? "+" : ""}${pmAvg.toFixed(2)}%`,
      label: pmLevel.label,
      color: pmLevel.color,
      bar: { pct: Math.min(100, Math.max(0, (pmAvg + 3) / 6 * 100)), cls: pmAvg > 0 ? "bg-orange-500" : "bg-chart-2" },
      desc: lang === "de"
        ? commoditiesStale ? "Edelmetallmärkte geschlossen — keine aktuellen Daten." : "Ø Gold, Silber, Platin. Steigende Edelmetalle = Flucht in Sachwerte."
        : commoditiesStale ? "Precious metals markets closed — no current data." : "Avg of gold, silver, platinum. Rising precious metals = flight to real assets.",
      stale: commoditiesStale,
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
        {cards.map((card: any) => (
          <div key={card.title} className={`rounded-2xl border border-border/60 bg-card p-5 space-y-3 ${card.stale ? "opacity-60" : ""}`}>
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
  const { data: sectors } = useYahooSectors();
  const { data: topCo } = useTopCompanies();
  // Polymarket sentiment hidden

  const gainers = glData?.gainers || [];
  const losers = glData?.losers || [];

  const indicators = useMemo(
    () => computeSubIndicators(indices, commodities, sectors),
    [indices, commodities, sectors]
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
              ? "8 Indikatoren mit transparenter Berechnungslogik — klicke auf jeden Indikator für Details"
              : "8 indicators with transparent calculations — click any indicator for details"}
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
            {/* Fear & Greed with sidebar */}
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
