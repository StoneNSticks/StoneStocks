import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePolymarketEvents, usePolymarketSearch, usePolymarketTimeSeries } from "@/hooks/usePolymarket";
import { useT } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Search, TrendingUp, BarChart3, Clock, ExternalLink, ChevronRight, Activity, Users, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { PolymarketEvent, PolymarketMarket } from "@/lib/polymarketApi";

const CATEGORIES = ["All", "Politics", "Crypto", "Sports", "Science", "Culture", "Business"];

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
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function MarketCard({ market, onSelect }: { market: PolymarketMarket; onSelect: (m: PolymarketMarket) => void }) {
  const { outcomes, prices } = parseOutcomes(market);
  const yesPrice = prices[0] || 0;
  const noPrice = prices[1] || 0;
  const change = market.oneDayPriceChange || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onSelect(market)}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {market.icon && (
            <img
              src={market.icon}
              alt=""
              className="h-10 w-10 rounded-lg object-cover flex-shrink-0 bg-muted"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {market.question}
            </h3>
          </div>
        </div>

        {/* Outcome bars */}
        {outcomes.length >= 2 && (
          <div className="space-y-1.5">
            {outcomes.slice(0, 2).map((outcome, i) => {
              const pct = (prices[i] || 0) * 100;
              const isYes = i === 0;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[11px] font-medium w-8 text-muted-foreground">{outcome}</span>
                  <div className="flex-1 h-5 rounded-full bg-muted/50 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all ${isYes ? "bg-emerald-500/80" : "bg-rose-500/60"}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatVolume(Number(market.volume || 0))}</span>
          {market.volume24hr > 0 && (
            <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{formatVolume(market.volume24hr)} 24h</span>
          )}
          {change !== 0 && (
            <span className={`flex items-center gap-0.5 font-medium ${change > 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(change * 100).toFixed(1)}%
            </span>
          )}
          {market.endDate && (
            <span className="flex items-center gap-1 ml-auto"><Clock className="h-3 w-3" />{formatDate(market.endDate)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({ event, onSelectMarket }: { event: PolymarketEvent; onSelectMarket: (m: PolymarketMarket) => void }) {
  const [expanded, setExpanded] = useState(false);
  const displayMarkets = expanded ? event.markets : event.markets.slice(0, 3);

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="p-4 border-b border-border/30 flex items-start gap-3">
        {event.icon && (
          <img
            src={event.icon}
            alt=""
            className="h-12 w-12 rounded-lg object-cover flex-shrink-0 bg-muted"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-base text-foreground">{event.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{formatVolume(event.volume)}</span>
            <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{formatVolume(event.volume24hr)} 24h</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.commentCount} comments</span>
          </div>
        </div>
        {event.category && (
          <Badge variant="secondary" className="text-[10px]">{event.category}</Badge>
        )}
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {displayMarkets.map((m) => (
          <MarketCard key={m.id} market={m} onSelect={onSelectMarket} />
        ))}
      </div>
      {event.markets.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? "Show less" : `Show all ${event.markets.length} markets`}
          <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      )}
    </div>
  );
}

function MarketDetailPanel({ market, onClose }: { market: PolymarketMarket; onClose: () => void }) {
  // Try to get first clobTokenId for time series
  let tokenId: string | null = null;
  try {
    const ids = JSON.parse(market.clobTokenIds || "[]");
    tokenId = ids[0] || null;
  } catch { /* ignore */ }

  const { data: tsData, isLoading: tsLoading } = usePolymarketTimeSeries(tokenId);
  const { outcomes, prices } = parseOutcomes(market);

  const chartData = useMemo(() => {
    if (!tsData?.history) return [];
    return tsData.history.map((p) => ({
      time: new Date(p.t * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      price: +(p.p * 100).toFixed(1),
    }));
  }, [tsData]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border border-border bg-card p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="font-display font-bold text-lg text-foreground">{market.question}</h2>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{formatVolume(Number(market.volume || 0))} total volume</span>
            {market.endDate && <span>Ends {formatDate(market.endDate)}</span>}
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">×</button>
      </div>

      {/* Current prices */}
      {outcomes.length >= 2 && (
        <div className="grid grid-cols-2 gap-3">
          {outcomes.map((o, i) => (
            <div key={i} className={`rounded-lg p-3 text-center ${i === 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20"}`}>
              <div className="text-xs font-medium text-muted-foreground mb-1">{o}</div>
              <div className={`text-2xl font-bold ${i === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {((prices[i] || 0) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price history chart */}
      {tokenId && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Price History</h3>
          {tsLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : chartData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <RechartsTooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, "Probability"]}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#priceGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No price history available</p>
          )}
        </div>
      )}

      {/* Link to Polymarket */}
      <a
        href={`https://polymarket.com/event/${market.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        View on Polymarket <ExternalLink className="h-3 w-3" />
      </a>
    </motion.div>
  );
}

export default function PredictionsPage() {
  const { lang } = useLanguage();
  const t = useT();
  usePageTitle(
    lang === "de" ? "Prognosemärkte" : "Prediction Markets",
    lang === "de" ? "Live-Wahrscheinlichkeiten für Politik, Finanzen & mehr" : "Live probabilities for politics, finance & more"
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
      <main className="container py-6 md:py-10 space-y-6 px-3 sm:px-4 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <TrendingUp className="h-4 w-4" />
            {lang === "de" ? "Prognosemärkte" : "Prediction Markets"}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {lang === "de" ? "Polymarket Live-Daten" : "Polymarket Live Data"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {lang === "de"
              ? "Echtzeit-Wahrscheinlichkeiten aus den größten Prognosemärkten der Welt. Verfolge politische Ereignisse, Krypto-Preise, Sport-Ergebnisse und mehr."
              : "Real-time probabilities from the world's largest prediction markets. Track political events, crypto prices, sports outcomes and more."}
          </p>
        </motion.div>

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
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSearchQuery(""); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`space-y-4 ${selectedMarket ? "lg:col-span-2" : "lg:col-span-3"}`}>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl" />
                ))}
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
          {selectedMarket && (
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />
              </div>
            </div>
          )}
        </div>

        {/* Attribution */}
        <div className="text-center py-6 border-t border-border/30">
          <p className="text-[11px] text-muted-foreground">
            Data powered by{" "}
            <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Polymarket
            </a>
            {" "}• {lang === "de" ? "Keine Anlageberatung" : "Not financial advice"}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
