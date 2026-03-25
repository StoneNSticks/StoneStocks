/**
 * PolymarketIntelligencePage — Analytics dashboard for Polymarket prediction markets.
 * Shows aggregated statistics, category breakdown, trend analysis, and detail panels.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePolymarketMarkets, usePolymarketTimeSeries, usePolymarketOrderbook } from "@/hooks/usePolymarket";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useIsMobile } from "@/hooks/use-mobile";
import { categorizeMarket, computePolymarketSentiment } from "@/lib/polymarketApi";
import type { PolymarketMarket } from "@/lib/polymarketApi";
import {
  Search, TrendingUp, TrendingDown, BarChart3, Clock, ExternalLink,
  Activity, DollarSign, ArrowUp, ArrowDown, Landmark, Globe, Coins, Zap, Filter, Gauge, X,
  ChevronDown, ChevronUp, Flame
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

const CATEGORIES = [
  { key: "all", de: "Alle", en: "All", icon: Filter },
  { key: "politics", de: "Politik", en: "Politics", icon: Landmark },
  { key: "finance", de: "Finanzen", en: "Finance", icon: DollarSign },
  { key: "crypto", de: "Krypto", en: "Crypto", icon: Coins },
  { key: "other", de: "Sonstige", en: "Other", icon: Globe },
];

const CAT_COLORS: Record<string, string> = {
  politics: "hsl(var(--chart-1))",
  finance: "hsl(var(--chart-2))",
  crypto: "hsl(var(--chart-3))",
  other: "hsl(var(--chart-4))",
};

function parseOutcomes(m: PolymarketMarket) {
  try {
    return { outcomes: JSON.parse(m.outcomes || "[]") as string[], prices: JSON.parse(m.outcomePrices || "[]").map(Number) as number[] };
  } catch { return { outcomes: [] as string[], prices: [] as number[] }; }
}

function fmtVol(v: number) {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function getSentimentLabel(score: number, lang: string) {
  if (score <= 25) return lang === "de" ? "Sehr Bärisch" : "Very Bearish";
  if (score <= 40) return lang === "de" ? "Bärisch" : "Bearish";
  if (score <= 60) return lang === "de" ? "Neutral" : "Neutral";
  if (score <= 75) return lang === "de" ? "Bullisch" : "Bullish";
  return lang === "de" ? "Sehr Bullisch" : "Very Bullish";
}

function getSentimentColor(score: number) {
  if (score <= 25) return "text-destructive";
  if (score <= 40) return "text-orange-500";
  if (score <= 60) return "text-muted-foreground";
  if (score <= 75) return "text-chart-2";
  return "text-chart-2";
}

/* ── Stat Card ── */
function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-3 md:p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] md:text-xs text-muted-foreground truncate">{label}</div>
        <div className="font-display font-bold text-base md:text-lg">{value}</div>
        {sub && <div className="text-[9px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

/* ── Sentiment Gauge ── */
function SentimentGaugeCard({ score, lang }: { score: number; lang: string }) {
  const pct = Math.round(score);
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 md:p-5 flex flex-col items-center gap-2">
      <div className="text-[10px] md:text-xs text-muted-foreground">{lang === "de" ? "Prognosemarkt-Stimmung" : "Prediction Market Sentiment"}</div>
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
            strokeDasharray={`${pct * 2.51} 251`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-lg md:text-xl">{pct}</span>
        </div>
      </div>
      <div className={`text-xs font-semibold ${getSentimentColor(score)}`}>{getSentimentLabel(score, lang)}</div>
      <div className="text-[9px] text-muted-foreground text-center">
        {lang === "de" ? "Basierend auf Finanz- & Politik-Märkten" : "Based on finance & politics markets"}
      </div>
    </div>
  );
}

/* ── Market Row ── */
function MarketRow({ market, onSelect }: { market: PolymarketMarket; onSelect: (m: PolymarketMarket) => void }) {
  const { outcomes, prices } = parseOutcomes(market);
  const change = market.oneDayPriceChange || 0;
  const yesPct = (prices[0] || 0) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border/40 bg-card hover:border-primary/30 hover:shadow-md transition-all cursor-pointer p-3 md:p-4"
      onClick={() => onSelect(market)}
    >
      <div className="flex items-start gap-3">
        {market.icon && (
          <img src={market.icon} alt="" className="h-8 w-8 md:h-10 md:w-10 rounded-lg object-cover shrink-0 bg-muted hidden sm:block"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs md:text-sm font-semibold text-foreground leading-tight line-clamp-2">{market.question}</h3>
          <div className="flex items-center gap-2 md:gap-3 mt-1.5 text-[9px] md:text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-0.5"><DollarSign className="h-2.5 w-2.5" />{fmtVol(Number(market.volume || 0))}</span>
            {market.volume24hr > 0 && <span className="flex items-center gap-0.5"><Activity className="h-2.5 w-2.5" />{fmtVol(market.volume24hr)} 24h</span>}
            {market.endDate && <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{fmtDate(market.endDate)}</span>}
          </div>
        </div>
        <div className="shrink-0 text-right space-y-1">
          <div className="font-display font-bold text-sm md:text-base text-foreground">{yesPct.toFixed(0)}%</div>
          {change !== 0 && (
            <div className={`flex items-center gap-0.5 text-[10px] font-medium justify-end ${change > 0 ? "text-chart-2" : "text-destructive"}`}>
              {change > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
              {Math.abs(change * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
      {/* Mini probability bar */}
      {outcomes.length >= 2 && (
        <div className="mt-2 h-2 rounded-full bg-muted/50 overflow-hidden flex">
          <div className="h-full bg-chart-2/60 transition-all" style={{ width: `${Math.max(yesPct, 1)}%` }} />
          <div className="h-full bg-destructive/40 transition-all" style={{ width: `${Math.max(100 - yesPct, 1)}%` }} />
        </div>
      )}
    </motion.div>
  );
}

/* ── Detail Panel Content ── */
function DetailContent({ market }: { market: PolymarketMarket }) {
  let tokenId: string | null = null;
  try { const ids = JSON.parse(market.clobTokenIds || "[]"); tokenId = ids[0] || null; } catch { /* */ }

  const { data: tsData, isLoading: tsLoading } = usePolymarketTimeSeries(tokenId);
  const { data: bookData } = usePolymarketOrderbook(tokenId);
  const { outcomes, prices } = parseOutcomes(market);

  const chartData = useMemo(() => {
    if (!tsData?.history) return [];
    return tsData.history.map(p => ({
      time: new Date(p.t * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      price: +(p.p * 100).toFixed(1),
    }));
  }, [tsData]);

  const orderbookData = useMemo(() => {
    if (!bookData) return [];
    const bids = (bookData.bids || []).slice(0, 5).map(b => ({ price: +b.price, size: +b.size, type: "bid" as const }));
    const asks = (bookData.asks || []).slice(0, 5).map(a => ({ price: +a.price, size: +a.size, type: "ask" as const }));
    return [...bids.reverse(), ...asks];
  }, [bookData]);

  const spread = useMemo(() => {
    if (!bookData?.bids?.length || !bookData?.asks?.length) return null;
    return { bid: +bookData.bids[0].price, ask: +bookData.asks[0].price, spread: +bookData.asks[0].price - +bookData.bids[0].price };
  }, [bookData]);

  return (
    <div className="space-y-4 py-2">
      {/* Outcomes */}
      {outcomes.length >= 2 && (
        <div className="grid grid-cols-2 gap-2">
          {outcomes.map((o, i) => (
            <div key={i} className={`rounded-lg p-3 text-center ${i === 0 ? "bg-chart-2/10 border border-chart-2/20" : "bg-destructive/10 border border-destructive/20"}`}>
              <div className="text-[10px] font-medium text-muted-foreground mb-0.5">{o}</div>
              <div className={`text-xl font-bold ${i === 0 ? "text-chart-2" : "text-destructive"}`}>{((prices[i] || 0) * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <Badge variant="outline" className="text-[9px]">{fmtVol(Number(market.volume || 0))} total</Badge>
        {market.endDate && <Badge variant="outline" className="text-[9px]">Ends {fmtDate(market.endDate)}</Badge>}
        {spread && <Badge variant="outline" className="text-[9px]">Spread: {(spread.spread * 100).toFixed(1)}¢</Badge>}
      </div>

      {/* Chart */}
      {tokenId && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-foreground">Price History</h3>
          {tsLoading ? <Skeleton className="h-40 md:h-56 w-full rounded-lg" /> : chartData.length > 0 ? (
            <div className="h-40 md:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="pmDetailGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number) => [`${v}%`, "Probability"]}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#pmDetailGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-[10px] text-muted-foreground">No history available</p>}
        </div>
      )}

      {/* Orderbook */}
      {orderbookData.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-foreground">Orderbook Depth</h3>
          <div className="h-28 md:h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderbookData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="price" type="category" tick={{ fontSize: 9 }} tickLine={false} axisLine={false}
                  tickFormatter={v => `${(+v * 100).toFixed(0)}¢`} width={35} />
                <RechartsTooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                  formatter={(v: number, _: string, props: any) => [v.toFixed(2), props.payload.type === "bid" ? "Bid" : "Ask"]}
                />
                <Bar dataKey="size" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Description */}
      {market.description && (
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-4">{market.description}</p>
      )}

      <a href={`https://polymarket.com/event/${market.slug}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
        View on Polymarket <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

/* ── Main Page ── */
export default function PolymarketIntelligencePage() {
  const { lang } = useLanguage();
  const isMobile = useIsMobile();
  usePageTitle(
    lang === "de" ? "Polymarket Intelligence" : "Polymarket Intelligence",
    lang === "de" ? "Statistiken & Analysen aus Prognosemärkten" : "Statistics & analytics from prediction markets"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarket, setSelectedMarket] = useState<PolymarketMarket | null>(null);
  const [showMovers, setShowMovers] = useState(false);

  const { data: allMarkets, isLoading } = usePolymarketMarkets({ limit: "50" });

  // Categorize and filter
  const categorized = useMemo(() => {
    if (!allMarkets) return { all: [], politics: [], finance: [], crypto: [], other: [] };
    const result: Record<string, PolymarketMarket[]> = { all: allMarkets, politics: [], finance: [], crypto: [], other: [] };
    for (const m of allMarkets) {
      const cat = categorizeMarket(m.question);
      result[cat]?.push(m);
    }
    return result;
  }, [allMarkets]);

  const filtered = useMemo(() => {
    let markets = selectedCategory === "all" ? categorized.all : (categorized[selectedCategory] || []);
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      markets = markets.filter(m => m.question.toLowerCase().includes(q));
    }
    return markets;
  }, [categorized, selectedCategory, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    if (!allMarkets || allMarkets.length === 0) return null;
    const totalVol = allMarkets.reduce((s, m) => s + Number(m.volume || 0), 0);
    const totalVol24 = allMarkets.reduce((s, m) => s + (m.volume24hr || 0), 0);
    const sentimentScore = computePolymarketSentiment(allMarkets);
    
    // Biggest movers
    const movers = [...allMarkets]
      .filter(m => m.oneDayPriceChange != null && m.oneDayPriceChange !== 0)
      .sort((a, b) => Math.abs(b.oneDayPriceChange) - Math.abs(a.oneDayPriceChange))
      .slice(0, 8);

    // Category distribution
    const catDist = Object.entries(categorized)
      .filter(([k]) => k !== "all")
      .map(([k, v]) => ({ name: k, value: v.length, fill: CAT_COLORS[k] || "hsl(var(--muted))" }))
      .filter(d => d.value > 0);

    // Average liquidity
    const avgLiq = allMarkets.reduce((s, m) => s + Number(m.liquidity || 0), 0) / allMarkets.length;

    return { totalVol, totalVol24, sentimentScore, movers, catDist, avgLiq, total: allMarkets.length };
  }, [allMarkets, categorized]);

  const handleSelect = (m: PolymarketMarket) => setSelectedMarket(m);
  const closeDetail = () => setSelectedMarket(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 md:py-8 space-y-4 md:space-y-6 px-3 sm:px-4 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
              <Gauge className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-display font-bold">
                Polymarket <span className="text-primary">Intelligence</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {lang === "de"
                  ? "Aggregierte Statistiken & Analysen aus Prognosemärkten"
                  : "Aggregated statistics & analytics from prediction markets"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
            <SentimentGaugeCard score={stats.sentimentScore} lang={lang} />
            <div className="space-y-2 md:space-y-3">
              <StatCard label={lang === "de" ? "Gesamtvolumen" : "Total Volume"} value={fmtVol(stats.totalVol)} icon={<DollarSign className="h-4 w-4" />} />
              <StatCard label="24h Volume" value={fmtVol(stats.totalVol24)} icon={<Activity className="h-4 w-4" />} />
            </div>
            <div className="space-y-2 md:space-y-3">
              <StatCard label={lang === "de" ? "Aktive Märkte" : "Active Markets"} value={String(stats.total)} icon={<BarChart3 className="h-4 w-4" />} />
              <StatCard label={lang === "de" ? "Ø Liquidität" : "Avg Liquidity"} value={fmtVol(stats.avgLiq)} icon={<Zap className="h-4 w-4" />} />
            </div>

            {/* Category distribution */}
            <div className="rounded-xl border border-border/50 bg-card p-3 md:p-4 col-span-2 lg:col-span-2">
              <div className="text-[10px] md:text-xs text-muted-foreground mb-2">{lang === "de" ? "Kategorie-Verteilung" : "Category Distribution"}</div>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 md:h-24 md:w-24 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.catDist} dataKey="value" cx="50%" cy="50%" innerRadius="55%" outerRadius="90%" paddingAngle={2}>
                        {stats.catDist.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1">
                  {stats.catDist.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-[10px] md:text-xs">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill }} />
                      <span className="capitalize text-muted-foreground">{d.name}</span>
                      <span className="font-medium text-foreground ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Biggest Movers */}
        {stats && stats.movers.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <button onClick={() => setShowMovers(!showMovers)} className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                <span className="text-xs md:text-sm font-semibold">{lang === "de" ? "Größte Beweger (24h)" : "Biggest Movers (24h)"}</span>
              </div>
              {showMovers ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {showMovers && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="p-3 md:p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {stats.movers.map(m => {
                      const { prices } = parseOutcomes(m);
                      const yesPct = (prices[0] || 0) * 100;
                      const ch = m.oneDayPriceChange * 100;
                      return (
                        <div key={m.id} onClick={() => handleSelect(m)}
                          className="flex items-center gap-3 rounded-lg border border-border/30 p-2.5 hover:border-primary/30 cursor-pointer transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] md:text-xs font-medium line-clamp-1">{m.question}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold">{yesPct.toFixed(0)}%</div>
                            <div className={`text-[9px] font-medium ${ch > 0 ? "text-chart-2" : "text-destructive"}`}>
                              {ch > 0 ? "+" : ""}{ch.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Search & Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={lang === "de" ? "Märkte durchsuchen..." : "Search markets..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 md:h-10"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CatIcon className="h-3 w-3" />
                  {lang === "de" ? cat.de : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-[10px] text-muted-foreground">{filtered.length} {lang === "de" ? "Märkte" : "markets"}</p>

        {/* Market list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
            {filtered.map(m => <MarketRow key={m.id} market={m} onSelect={handleSelect} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{lang === "de" ? "Keine Märkte gefunden" : "No markets found"}</p>
          </div>
        )}

        {/* Detail: Sheet on desktop, Drawer on mobile */}
        {isMobile ? (
          <Drawer open={!!selectedMarket} onOpenChange={(open) => { if (!open) closeDetail(); }}>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <DrawerTitle className="text-sm leading-tight">{selectedMarket?.question}</DrawerTitle>
                <DrawerDescription className="text-[10px]">{categorizeMarket(selectedMarket?.question || "")}</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-6 overflow-y-auto">
                {selectedMarket && <DetailContent market={selectedMarket} />}
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Sheet open={!!selectedMarket} onOpenChange={(open) => { if (!open) closeDetail(); }}>
            <SheetContent className="w-[460px] sm:max-w-[460px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-sm leading-tight pr-6">{selectedMarket?.question}</SheetTitle>
                <SheetDescription className="text-[10px]">{categorizeMarket(selectedMarket?.question || "")}</SheetDescription>
              </SheetHeader>
              {selectedMarket && <DetailContent market={selectedMarket} />}
            </SheetContent>
          </Sheet>
        )}

        {/* Attribution */}
        <div className="text-center py-4 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground">
            Data powered by{" "}
            <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Polymarket</a>
            {" "}• {lang === "de" ? "Keine Anlageberatung" : "Not financial advice"}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
