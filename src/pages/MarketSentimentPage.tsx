/**
 * MarketSentimentPage — "Pentagon Pizza Index" style market overview page.
 * 
 * Shows an at-a-glance view of overall market sentiment and conditions:
 * - Fear & Greed gauge (derived from index performance averages)
 * - Sector performance bars (computed from top companies grouped by sector)
 * - Market indices with change indicators
 * - Commodities performance grid
 * - Key metrics: VIX proxy, breadth (gainers vs losers ratio), momentum
 * 
 * Data sources:
 * - /stock-data?action=indices → market index prices & changes
 * - /stock-data?action=gainers_losers → breadth analysis
 * - /stock-data?action=commodities → commodity prices
 * - /stock-data?action=top_companies → sector grouping (approximate)
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useMarketIndices, useGainersLosers, useTopCompanies } from "@/hooks/useStockData";
import { useQuery } from "@tanstack/react-query";
import { getCommodities } from "@/lib/stockApi";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Gauge, TrendingUp, TrendingDown, Activity, BarChart3, Zap, Shield, Flame, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketHeatmap } from "@/components/MarketHeatmap";

const fadeIn = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/** Computes a 0-100 sentiment score from average index performance */
function computeSentiment(indices: any[]): { score: number; avgChange: number } | null {
  if (!indices?.length) return null;
  const changes = indices.filter((i: any) => i.changePercent != null).map((i: any) => i.changePercent);
  if (!changes.length) return null;
  const avg = changes.reduce((s: number, v: number) => s + v, 0) / changes.length;
  const score = Math.min(100, Math.max(0, ((avg + 3) / 6) * 100));
  return { score, avgChange: avg };
}

function SentimentMeter({ score }: { score: number }) {
  const { lang } = useLanguage();
  const label = score <= 15 ? (lang === "de" ? "Extreme Angst" : "Extreme Fear")
    : score <= 30 ? (lang === "de" ? "Angst" : "Fear")
    : score <= 45 ? (lang === "de" ? "Leichte Angst" : "Mild Fear")
    : score <= 55 ? (lang === "de" ? "Neutral" : "Neutral")
    : score <= 70 ? (lang === "de" ? "Leichte Gier" : "Mild Greed")
    : score <= 85 ? (lang === "de" ? "Gier" : "Greed")
    : (lang === "de" ? "Extreme Gier" : "Extreme Greed");

  const color = score <= 20 ? "text-destructive" : score <= 40 ? "text-orange-500"
    : score <= 60 ? "text-muted-foreground" : score <= 80 ? "text-chart-2" : "text-chart-2";

  const rotation = -90 + (score / 100) * 180;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Gauge className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Fear & Greed Index</h2>
          <p className="text-xs text-muted-foreground">Based on market index performance</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-48 h-28">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <defs>
              <linearGradient id="sentArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--destructive))" />
                <stop offset="25%" stopColor="hsl(38, 92%, 50%)" />
                <stop offset="50%" stopColor="hsl(var(--muted-foreground))" />
                <stop offset="75%" stopColor="hsl(145, 63%, 42%)" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
            </defs>
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#sentArc)" strokeWidth="14" strokeLinecap="round" opacity="0.5" />
            <line x1="100" y1="100" x2="100" y2="30" stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinecap="round"
              transform={`rotate(${rotation} 100 100)`} />
            <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
          </svg>
        </div>
        <div className="text-center sm:text-left">
          <div className={`font-display text-3xl font-bold ${color}`}>{label}</div>
          <div className="font-mono text-2xl font-bold text-foreground mt-1">{score.toFixed(0)}<span className="text-muted-foreground text-lg">/100</span></div>
        </div>
      </div>
    </motion.div>
  );
}

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

export default function MarketSentimentPage() {
  const { lang } = useLanguage();
  const { data: indices, isLoading: indicesLoading } = useMarketIndices();
  const { data: glData, isLoading: glLoading } = useGainersLosers();
  const { data: commodities, isLoading: comLoading } = useQuery({ queryKey: ["commodities"], queryFn: getCommodities, staleTime: 60_000 });
  const { data: topCo } = useTopCompanies();

  const sentiment = useMemo(() => computeSentiment(indices || []), [indices]);
  const gainers = glData?.gainers || [];
  const losers = glData?.losers || [];

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
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl col-span-full" />
          </div>
        ) : (
          <>
            {/* Fear & Greed + Market Breadth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sentiment && <SentimentMeter score={sentiment.score} />}
              <MarketBreadth gainers={gainers.length} losers={losers.length} />
            </div>

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
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks
        </div>
      </footer>
    </div>
  );
}
