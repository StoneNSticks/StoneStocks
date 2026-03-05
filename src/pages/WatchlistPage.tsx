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
import { Star, LogIn, ArrowLeft, TrendingUp, Clock, Sparkles, Search, SortAsc, SortDesc, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

type SortMode = "newest" | "oldest" | "alpha";

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
      <main className="container py-6 sm:py-8 max-w-3xl px-3 sm:px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/30 shadow-lg shadow-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">{t("watchlist.title")}</h1>
                {user && <p className="text-sm text-muted-foreground">{count === 0 ? t("watchlist.startTracking") : t("watchlist.tracking").replace("{count}", String(count))}</p>}
              </div>
            </div>
            {user && count > 0 && (
              <Badge variant="secondary" className="font-display text-sm gap-1.5 px-4 py-1.5 shadow-sm">
                <TrendingUp className="h-3.5 w-3.5" />{count}
              </Badge>
            )}
          </div>

          {/* Search & Controls */}
          {user && count > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("watchlist.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-muted/50 border-border/40"
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={cycleSortMode} title={sortLabel}>
                {sortMode === "oldest" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
                {viewMode === "list" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        {authLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[76px] rounded-2xl" />)}</div>
        ) : !user ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center py-20 px-6">
            <div className="relative inline-block mb-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-accent/50 to-primary/10 shadow-xl shadow-primary/5">
                <Star className="h-12 w-12 text-primary/40" />
              </div>
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </motion.div>
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">{t("watchlist.signInTitle")}</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">{t("watchlist.signInDesc")}</p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline" size="lg" className="rounded-xl"><Link to="/"><ArrowLeft className="h-4 w-4 mr-1.5" />{t("nav.markets")}</Link></Button>
              <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/20"><Link to="/auth"><LogIn className="h-4 w-4 mr-1.5" />{t("auth.signIn")}</Link></Button>
            </div>
          </motion.div>
        ) : isLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[76px] rounded-2xl" />)}</div>
        ) : count === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center py-20 px-6">
            <div className="relative inline-block mb-6">
              <div className="p-6 rounded-3xl bg-muted shadow-lg"><Star className="h-12 w-12 text-muted-foreground/30" /></div>
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="absolute -top-2 -right-2"><Sparkles className="h-5 w-5 text-primary" /></motion.div>
            </div>
            <h2 className="font-display text-lg font-semibold mb-2">{t("watchlist.empty")}</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">{t("watchlist.emptyHint")}</p>
            <Button asChild variant="outline" className="mt-6 rounded-xl"><Link to="/"><TrendingUp className="h-4 w-4 mr-1.5" />{t("watchlist.exploreMarkets")}</Link></Button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">{t("watchlist.noSearchResults")}</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence>
              {filtered.map((w) => (
                <motion.div key={w.symbol} variants={item} layout exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}>
                  <Link to={`/stock/${w.symbol}`} className="block group">
                    <div className="rounded-2xl border border-border/60 bg-card p-5 text-center hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 relative overflow-hidden">
                      <div className="absolute top-2 right-2"><WatchlistStar symbol={w.symbol} /></div>
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-3 flex items-center justify-center">
                        <span className="font-display font-bold text-primary text-sm">{w.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="font-display font-bold text-sm group-hover:text-primary transition-colors block truncate">{w.symbol}</span>
                      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(w.created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.ul variants={container} initial="hidden" animate="show" className="space-y-2">
            <AnimatePresence>
              {filtered.map((w, i) => (
                <motion.li key={w.symbol} variants={item} layout exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}>
                  <div className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
                    <span className="text-xs font-mono text-muted-foreground/40 w-5 text-center select-none">{i + 1}</span>
                    <WatchlistStar symbol={w.symbol} />
                    <Link to={`/stock/${w.symbol}`} className="flex-1 flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
                        <span className="font-display font-bold text-primary text-xs">{w.symbol.slice(0, 2)}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-sm group-hover:text-primary transition-colors truncate">{w.symbol}</span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(w.created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </main>
    </div>
  );
}
