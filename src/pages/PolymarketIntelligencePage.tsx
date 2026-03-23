/**
 * PolymarketIntelligencePage — Central hub for Polymarket prediction market data.
 * Shows political & financial markets, category filters, detail panels with charts.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePolymarketEvents, usePolymarketSearch, usePolymarketTimeSeries, usePolymarketOrderbook } from "@/hooks/usePolymarket";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { categorizeMarket } from "@/lib/polymarketApi";
import type { PolymarketEvent, PolymarketMarket } from "@/lib/polymarketApi";
import { Search, TrendingUp, TrendingDown, BarChart3, Clock, ExternalLink, ChevronRight, Activity, Users, DollarSign, ArrowUp, ArrowDown, Landmark, Globe, Flame, Coins, Zap, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, BarChart, Bar } from "recharts";

const CATEGORIES = [
  { key: "All", de: "Alle", en: "All", icon: Filter },
  { key: "Politics", de: "Politik", en: "Politics", icon: Landmark },
  { key: "Finance", de: "Finanzen", en: "Finance", icon: DollarSign },
  { key: "Crypto", de: "Krypto", en: "Crypto", icon: Coins },
  { key: "Sports", de: "Sport", en: "Sports", icon: Activity },
  { key: "Science", de: "Wissenschaft", en: "Science", icon: Zap },
  { key: "Culture", de: "Kultur", en: "Culture", icon: Globe },
  { key: "Business", de: "Wirtschaft", en: "Business", icon: Flame },
];

function parseOutcomes(market: PolymarketMarket): { outcomes: string[]; prices: number[] } {
  try {
    const outcomes = JSON.parse(market.outcomes || "[]");
    const prices = JSON.parse(market.outcomePrices || "[]").map(Number);
    return { outcomes, prices };
  } catch {
    return { outcomes: [], prices: [] };
  }
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/* ── Market Card ── */
function MarketCard({ market, onSelect, compact }: { market: PolymarketMarket; onSelect: (m: PolymarketMarket) => void; compact?: boolean }) {
  const { outcomes, prices } = parseOutcomes(market);
  const change = market.oneDayPriceChange || 0;
  const cat = categorizeMarket(market.question);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onSelect(market)}
    >
      <div className={`${compact ? "p-3" : "p-4"} space-y-2.5`}>
        <div className="flex items-start gap-2.5">
          {!compact && market.icon && (
            <img src={market.icon} alt="" className="h-9 w-9 rounded-lg object-cover flex-shrink-0 bg-muted" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`${compact ? "text-xs" : "text-sm"} font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors`}>
              {market.question}
            </h3>
          </div>
          <Badge variant="outline" className="text-[8px] shrink-0 capitalize">{cat}</Badge>
        </div>

        {outcomes.length >= 2 && (
          <div className="space-y-1">
            {outcomes.slice(0, 2).map((outcome, i) => {
              const pct = (prices[i] || 0) * 100;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-medium w-7 text-muted-foreground">{outcome}</span>
                  <div className="flex-1 h-4 rounded-full bg-muted/50 overflow-hidden relative">
                    <div className={`h-full rounded-full transition-all ${i === 0 ? "bg-chart-2/70" : "bg-destructive/50"}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">{pct.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><DollarSign className="h-2.5 w-2.5" />{formatVolume(Number(market.volume || 0))}</span>
          {market.volume24hr > 0 && <span className="flex items-center gap-0.5"><Activity className="h-2.5 w-2.5" />{formatVolume(market.volume24hr)} 24h</span>}
          {change !== 0 && (
            <span className={`flex items-center gap-0.5 font-medium ${change > 0 ? "text-chart-2" : "text-destructive"}`}>
              {change > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
              {Math.abs(change * 100).toFixed(1)}%
            </span>
          )}
          {!compact && market.endDate && <span className="flex items-center gap-0.5 ml-auto"><Clock className="h-2.5 w-2.5" />{formatDate(market.endDate)}</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Event Card ── */
function EventCard({ event, onSelectMarket }: { event: PolymarketEvent; onSelectMarket: (m: PolymarketMarket) => void }) {
  const [expanded, setExpanded] = useState(false);
  const displayMarkets = expanded ? event.markets : event.markets.slice(0, 3);

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="p-4 border-b border-border/30 flex items-start gap-3">
        {event.icon && (
          <img src={event.icon} alt="" className="h-11 w-11 rounded-lg object-cover flex-shrink-0 bg-muted" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-sm text-foreground">{event.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><BarChart3 className="h-3 w-3" />{formatVolume(event.volume)}</span>
            <span className="flex items-center gap-0.5"><Activity className="h-3 w-3" />{formatVolume(event.volume24hr)} 24h</span>
            <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{event.commentCount}</span>
          </div>
        </div>
        {event.category && <Badge variant="secondary" className="text-[9px] shrink-0">{event.category}</Badge>}
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {displayMarkets.map((m) => <MarketCard key={m.id} market={m} onSelect={onSelectMarket} compact />)}
      </div>
      {event.markets.length > 3 && (
        <button onClick={() => setExpanded(!expanded)} className="w-full py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1">
          {expanded ? "Show less" : `Show all ${event.markets.length} markets`}
          <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      )}
    </div>
  );
}

/* ── Detail Panel ── */
function MarketDetailPanel({ market, onClose }: { market: PolymarketMarket; onClose: () => void }) {
  let tokenId: string | null = null;
  try { const ids = JSON.parse(market.clobTokenIds || "[]"); tokenId = ids[0] || null; } catch { /* */ }

  const { data: tsData, isLoading: tsLoading } = usePolymarketTimeSeries(tokenId);
  const { data: bookData } = usePolymarketOrderbook(tokenId);
  const { outcomes, prices } = parseOutcomes(market);

  const chartData = useMemo(() => {
    if (!tsData?.history) return [];
    return tsData.history.map((p) => ({
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
    const bestBid = +bookData.bids[0].price;
    const bestAsk = +bookData.asks[0].price;
    return { bid: bestBid, ask: bestAsk, spread: bestAsk - bestBid };
  }, [bookData]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="font-display font-bold text-base text-foreground">{market.question}</h2>
          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
            <span>{formatVolume(Number(market.volume || 0))} total</span>
            {market.endDate && <span>Ends {formatDate(market.endDate)}</span>}
            {spread && <Badge variant="outline" className="text-[8px]">Spread: {(spread.spread * 100).toFixed(1)}¢</Badge>}
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
      </div>

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

      {/* Chart */}
      {tokenId && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-foreground">Price History</h3>
          {tsLoading ? <Skeleton className="h-40 w-full rounded-lg" /> : chartData.length > 0 ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="pmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number) => [`${v}%`, "Probability"]}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#pmGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-[10px] text-muted-foreground">No history available</p>}
        </div>
      )}

      {/* Orderbook snapshot */}
      {orderbookData.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-foreground">Orderbook Depth</h3>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderbookData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="price" type="category" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(+v * 100).toFixed(0)}¢`} width={35} />
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

      <a href={`https://polymarket.com/event/${market.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
        View on Polymarket <ExternalLink className="h-3 w-3" />
      </a>
    </motion.div>
  );
}

/* ── Stats Dashboard ── */
function MarketStats({ events }: { events: PolymarketEvent[] }) {
  const { lang } = useLanguage();
  const stats = useMemo(() => {
    const allMarkets = events.flatMap(e => e.markets || []);
    const totalVol = events.reduce((s, e) => s + (e.volume || 0), 0);
    const totalVol24 = events.reduce((s, e) => s + (e.volume24hr || 0), 0);
    const biggestMover = allMarkets.sort((a, b) => Math.abs(b.oneDayPriceChange || 0) - Math.abs(a.oneDayPriceChange || 0))[0];
    
    const catCounts: Record<string, number> = {};
    allMarkets.forEach(m => { const c = categorizeMarket(m.question); catCounts[c] = (catCounts[c] || 0) + 1; });
    
    return { totalVol, totalVol24, biggestMover, totalMarkets: allMarkets.length, catCounts };
  }, [events]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
        <div className="text-[10px] text-muted-foreground mb-1">{lang === "de" ? "Gesamtvolumen" : "Total Volume"}</div>
        <div className="font-display font-bold text-lg">{formatVolume(stats.totalVol)}</div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
        <div className="text-[10px] text-muted-foreground mb-1">24h Volume</div>
        <div className="font-display font-bold text-lg">{formatVolume(stats.totalVol24)}</div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
        <div className="text-[10px] text-muted-foreground mb-1">{lang === "de" ? "Aktive Märkte" : "Active Markets"}</div>
        <div className="font-display font-bold text-lg">{stats.totalMarkets}</div>
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
        <div className="text-[10px] text-muted-foreground mb-1">{lang === "de" ? "Größter Mover" : "Biggest Mover"}</div>
        {stats.biggestMover ? (
          <div className={`font-display font-bold text-lg ${(stats.biggestMover.oneDayPriceChange || 0) > 0 ? "text-chart-2" : "text-destructive"}`}>
            {((stats.biggestMover.oneDayPriceChange || 0) * 100).toFixed(1)}%
          </div>
        ) : <div className="text-muted-foreground text-sm">—</div>}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function PolymarketIntelligencePage() {
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Polymarket Intelligence" : "Polymarket Intelligence",
    lang === "de" ? "Live-Prognosemärkte für Politik, Finanzen & Makro" : "Live prediction markets for politics, finance & macro"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMarket, setSelectedMarket] = useState<PolymarketMarket | null>(null);

  const eventsParams = useMemo(() => {
    const p: Record<string, string> = {};
    if (selectedCategory !== "All") p.tag = selectedCategory.toLowerCase();
    return p;
  }, [selectedCategory]);

  const { data: events, isLoading: eventsLoading } = usePolymarketEvents(eventsParams);
  const { data: searchResults, isLoading: searchLoading } = usePolymarketSearch(searchQuery);

  const displayEvents = searchQuery.length >= 2 ? searchResults : events;
  const isLoading = searchQuery.length >= 2 ? searchLoading : eventsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-8 space-y-5 px-3 sm:px-4 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Polymarket <span className="text-primary">Intelligence</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === "de"
                  ? "Live-Wahrscheinlichkeiten und Analysen aus Prognosemärkten"
                  : "Live probabilities and analytics from prediction markets"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {!isLoading && displayEvents && displayEvents.length > 0 && (
          <MarketStats events={displayEvents} />
        )}

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={lang === "de" ? "Märkte durchsuchen..." : "Search markets..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => { setSelectedCategory(cat.key); setSearchQuery(""); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CatIcon className="h-3 w-3" />
                  {lang === "de" ? cat.de : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className={`space-y-4 ${selectedMarket ? "lg:col-span-2" : "lg:col-span-3"}`}>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-56 w-full rounded-xl" />)}
              </div>
            ) : displayEvents && displayEvents.length > 0 ? (
              displayEvents.map((event) => (
                <EventCard key={event.id} event={event} onSelectMarket={setSelectedMarket} />
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{lang === "de" ? "Keine Märkte gefunden" : "No markets found"}</p>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selectedMarket && (
              <div className="lg:col-span-1">
                <div className="sticky top-28">
                  <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

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
