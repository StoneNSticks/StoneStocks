import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistStar } from "@/components/WatchlistStar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, LogIn, ArrowLeft, TrendingUp, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: watchlist, isLoading } = useWatchlist();
  const t = useT();
  const { lang } = useLanguage();
  const count = watchlist?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent"><Star className="h-5 w-5 text-accent-foreground" /></div>
            <div>
              <h1 className="font-display text-2xl font-bold">{t("watchlist.title")}</h1>
              {user && <p className="text-sm text-muted-foreground">{count === 0 ? t("watchlist.startTracking") : t("watchlist.tracking").replace("{count}", String(count))}</p>}
            </div>
          </div>
          {user && count > 0 && <Badge variant="secondary" className="font-display text-xs gap-1.5 px-3 py-1"><TrendingUp className="h-3 w-3" />{count}</Badge>}
        </motion.div>

        {authLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[72px] rounded-xl" />)}</div>
        ) : !user ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center py-20 px-6">
            <div className="relative inline-block mb-6">
              <div className="p-5 rounded-2xl bg-accent/50"><Star className="h-10 w-10 text-accent-foreground/40" /></div>
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1"><Sparkles className="h-4 w-4 text-primary" /></motion.div>
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">{t("watchlist.signInTitle")}</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">{t("watchlist.signInDesc")}</p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline" size="lg"><Link to="/"><ArrowLeft className="h-4 w-4 mr-1.5" />{t("nav.markets")}</Link></Button>
              <Button asChild size="lg"><Link to="/auth"><LogIn className="h-4 w-4 mr-1.5" />{t("auth.signIn")}</Link></Button>
            </div>
          </motion.div>
        ) : isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[72px] rounded-xl" />)}</div>
        ) : count === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center py-20 px-6">
            <div className="relative inline-block mb-6">
              <div className="p-5 rounded-2xl bg-muted"><Star className="h-10 w-10 text-muted-foreground/30" /></div>
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="absolute -top-1 -right-1"><Sparkles className="h-4 w-4 text-primary" /></motion.div>
            </div>
            <h2 className="font-display text-lg font-semibold mb-2">{t("watchlist.empty")}</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">{t("watchlist.emptyHint")}</p>
            <Button asChild variant="outline" className="mt-6"><Link to="/"><TrendingUp className="h-4 w-4 mr-1.5" />{t("watchlist.exploreMarkets")}</Link></Button>
          </motion.div>
        ) : (
          <motion.ul variants={container} initial="hidden" animate="show" className="space-y-2">
            <AnimatePresence>
              {watchlist.map((w, i) => (
                <motion.li key={w.symbol} variants={item} layout exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}>
                  <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200">
                    <span className="text-xs font-mono text-muted-foreground/50 w-5 text-center select-none">{i + 1}</span>
                    <WatchlistStar symbol={w.symbol} />
                    <Link to={`/stock/${w.symbol}`} className="flex-1 flex items-center gap-3 min-w-0">
                      <div className="flex flex-col min-w-0"><span className="font-display font-bold text-sm group-hover:text-primary transition-colors truncate">{w.symbol}</span></div>
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
