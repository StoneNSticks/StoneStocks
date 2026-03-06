import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistStar } from "@/components/WatchlistStar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, LogIn, ArrowLeft, TrendingUp, TrendingDown, Clock, Sparkles, Search, SortAsc, SortDesc, LayoutGrid, List, ExternalLink, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getQuote } from "@/lib/stockApi";
import { useCurrency } from "@/contexts/CurrencyContext";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } } };

type SortMode = "newest" | "oldest" | "alpha" | "performance";

function WatchlistQuote({ symbol }: { symbol: string }) {
  const { convert, symbol: cSym } = useCurrency();
  const { data: quote, isLoading } = useQuery({
    queryKey: ["watchlist-quote", symbol],
    queryFn: () => getQuote(symbol),
    staleTime: 60_000,
  });

  if (isLoading) return <div className="text-right"><Skeleton className="h-5 w-16 ml-auto mb-1" /><Skeleton className="h-4 w-12 ml-auto" /></div>;
  if (!quote?.c) return null;

  const isUp = (quote.dp || 0) >= 0;
  return (
    <div className="text-right shrink-0">
      <div className="font-display font-bold text-sm">{cSym}{convert(quote.c).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${isUp ? "text-chart-2" : "text-destructive"}`}>
        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isUp ? "+" : ""}{(quote.dp || 0).toFixed(2)}%
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: watchlist, isLoading } = useWatchlist();
  const t = useT();
  const { lang } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filtered = useMemo(() => {
    if (!watchlist) return [];
    let items = [...watchlist];
    if (searchQuery) {
      items = items.filter((w) => w.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortMode === "oldest") items.reverse();
    if (sortMode === "alpha") items.sort((a, b) => a.symbol.localeCompare(b.symbol));
    return items;
  }, [watchlist, searchQuery, sortMode]);

  const count = watchlist?.length ?? 0;

  const cycleSortMode = () => {
    setSortMode((prev) => prev === "newest" ? "oldest" : prev === "oldest" ? "alpha" : "newest");
  };

  const sortLabel = sortMode === "newest" ? t("watchlist.sortNewest") : sortMode === "oldest" ? t("watchlist.sortOldest") : t("watchlist.sortAlpha");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10 max-w-4xl px-3 sm:px-4">
        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/10 p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-xl shadow-primary/10 backdrop-blur-sm border border-primary/20">
                  <Star className="h-7 w-7 text-primary fill-primary/20" />
                </div>
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{t("watchlist.title")}</h1>
                  {user && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {count === 0 ? t("watchlist.startTracking") : t("watchlist.tracking").replace("{count}", String(count))}
                    </p>
                  )}
                </div>
              </div>
              {user && count > 0 && (
                <Badge variant="secondary" className="font-display text-base gap-2 px-5 py-2 shadow-md bg-background/80 backdrop-blur-sm border border-border/60">
                  <BarChart3 className="h-4 w-4 text-primary" />{count}
                </Badge>
              )}
            </div>

            {/* Search & Controls */}
            {user && count > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex items-center gap-2 mt-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("watchlist.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-background/80 backdrop-blur-sm border-border/50 shadow-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0 bg-background/80 backdrop-blur-sm" onClick={cycleSortMode} title={sortLabel}>
                  {sortMode === "oldest" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0 bg-background/80 backdrop-blur-sm" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
                  {viewMode === "list" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {authLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}</div>
        ) : !user ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center py-24 px-6">
            <div className="relative inline-block mb-8">
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-accent/50 to-primary/10 shadow-2xl shadow-primary/5 border border-primary/10">
                <Star className="h-16 w-16 text-primary/30" />
              </div>
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute -top-3 -right-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} className="absolute -bottom-2 -left-2">
                <Sparkles className="h-4 w-4 text-primary/60" />
              </motion.div>
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">{t("watchlist.signInTitle")}</h2>
            <p className="text-muted-foreground text-sm mb-10 max-w-sm mx-auto leading-relaxed">{t("watchlist.signInDesc")}</p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-6"><Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />{t("nav.markets")}</Link></Button>
              <Button asChild size="lg" className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20"><Link to="/auth"><LogIn className="h-4 w-4 mr-2" />{t("auth.signIn")}</Link></Button>
            </div>
          </motion.div>
        ) : isLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}</div>
        ) : count === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center py-24 px-6">
            <div className="relative inline-block mb-8">
              <div className="p-8 rounded-[2rem] bg-muted shadow-xl border border-border/40"><Star className="h-16 w-16 text-muted-foreground/20" /></div>
              <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} className="absolute -top-3 -right-3"><Sparkles className="h-6 w-6 text-primary" /></motion.div>
            </div>
            <h2 className="font-display text-xl font-bold mb-3">{t("watchlist.empty")}</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">{t("watchlist.emptyHint")}</p>
            <Button asChild variant="outline" className="mt-8 rounded-xl h-11 px-6"><Link to="/"><TrendingUp className="h-4 w-4 mr-2" />{t("watchlist.exploreMarkets")}</Link></Button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">{t("watchlist.noSearchResults")}</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence>
              {filtered.map((w) => (
                <motion.div key={w.symbol} variants={item} layout exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}>
                  <div className="rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 z-10"><WatchlistStar symbol={w.symbol} /></div>
                    <Link to={`/stock/${w.symbol}`} className="block p-5 text-center relative">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 mx-auto mb-3 flex items-center justify-center shadow-md shadow-primary/5">
                        <span className="font-display font-bold text-primary text-base">{w.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="font-display font-bold text-sm group-hover:text-primary transition-colors block truncate">{w.symbol}</span>
                      <div className="mt-3"><WatchlistQuote symbol={w.symbol} /></div>
                      <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-muted-foreground/60">
                        <Clock className="h-3 w-3" />
                        {new Date(w.created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" })}
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.ul variants={container} initial="hidden" animate="show" className="space-y-2.5">
            <AnimatePresence>
              {filtered.map((w, i) => (
                <motion.li key={w.symbol} variants={item} layout exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}>
                  <div className="group flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 sm:p-5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-mono text-muted-foreground/30 w-6 text-center select-none relative">{i + 1}</span>
                    <div className="relative"><WatchlistStar symbol={w.symbol} /></div>
                    <Link to={`/stock/${w.symbol}`} className="flex-1 flex items-center gap-3 min-w-0 relative">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0 shadow-sm shadow-primary/5 group-hover:shadow-md group-hover:shadow-primary/10 transition-shadow">
                        <span className="font-display font-bold text-primary text-sm">{w.symbol.slice(0, 2)}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-sm group-hover:text-primary transition-colors truncate">{w.symbol}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 mt-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(w.created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </div>
                    </Link>
                    <div className="relative"><WatchlistQuote symbol={w.symbol} /></div>
                    <Link to={`/stock/${w.symbol}`} className="relative hidden sm:flex items-center justify-center h-9 w-9 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors shrink-0">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {/* Quick stats footer */}
        {user && count > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center text-xs text-muted-foreground/50">
            {lang === "de" ? `${count} Aktie(n) in deiner Watchlist · Kurse werden alle 60 Sekunden aktualisiert` : `${count} stock(s) in your watchlist · Prices refresh every 60 seconds`}
          </motion.div>
        )}
      </main>
    </div>
  );
}
