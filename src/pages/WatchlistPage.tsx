import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist, useUpdateWatchlistItem } from "@/hooks/useWatchlist";
import { WatchlistStar } from "@/components/WatchlistStar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Star, LogIn, ArrowLeft, TrendingUp, TrendingDown, Clock, Sparkles, Search, SortAsc, SortDesc, LayoutGrid, List, ExternalLink, BarChart3, Activity, Zap, Download, StickyNote, FolderOpen, Tag, X, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getQuote, getProfile } from "@/lib/stockApi";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

type SortMode = "newest" | "oldest" | "alpha" | "performance";

function MiniSparkline({ data, isUp }: { data: number[]; isUp: boolean }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = isUp ? "hsl(var(--chart-2))" : "hsl(var(--destructive))";
  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`spark-${isUp}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} fill={`url(#spark-${isUp})`} strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function WatchlistQuote({ symbol, onQuoteLoaded }: { symbol: string; onQuoteLoaded?: (dp: number) => void }) {
  const { convert, symbol: cSym } = useCurrency();
  const { data: quote, isLoading } = useQuery({
    queryKey: ["watchlist-quote", symbol],
    queryFn: () => getQuote(symbol),
    staleTime: 60_000,
  });

  const { data: profileData } = useQuery({
    queryKey: ["watchlist-profile", symbol],
    queryFn: () => getProfile(symbol),
    staleTime: 5 * 60_000,
  });

  useMemo(() => {
    if (quote?.dp != null && onQuoteLoaded) onQuoteLoaded(quote.dp);
  }, [quote?.dp, onQuoteLoaded]);

  const isUp = (quote?.dp || 0) >= 0;
  const sparkData = useMemo(() => {
    if (!quote?.c) return [];
    const base = quote.pc || quote.c;
    const points: number[] = [];
    for (let i = 0; i < 20; i++) {
      const progress = i / 19;
      const value = base + (quote.c - base) * progress + (Math.random() - 0.5) * (quote.c * 0.005);
      points.push(value);
    }
    points[points.length - 1] = quote.c;
    return points;
  }, [quote?.c, quote?.pc]);

  if (isLoading) return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-20" />
      <div className="text-right">
        <Skeleton className="h-5 w-16 mb-1" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
  if (!quote?.c) return null;

  const companyName = profileData?.name || "";
  const logo = profileData?.logo || "";

  return (
    <div className="flex items-center gap-3">
      {logo && <img src={logo} alt="" className="h-6 w-6 rounded-md object-contain bg-background border border-border/40 shrink-0 hidden sm:block" />}
      {companyName && <span className="text-xs text-muted-foreground truncate max-w-[100px] hidden lg:block">{companyName}</span>}
      <MiniSparkline data={sparkData} isUp={isUp} />
      <div className="text-right shrink-0">
        <div className="font-mono font-bold text-sm tabular-nums">
          {cSym}{convert(quote.c)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center justify-end gap-1 text-xs font-bold tabular-nums ${isUp ? "text-chart-2" : "text-destructive"}`}>
          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isUp ? "+" : ""}{(quote.dp || 0).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

function DailyPLSummary({ quoteMap, count, lang }: { quoteMap: Record<string, number>; count: number; lang: string }) {
  const entries = Object.values(quoteMap);
  if (entries.length === 0) return null;
  const avg = entries.reduce((s, v) => s + v, 0) / entries.length;
  const gainers = entries.filter(v => v > 0).length;
  const losers = entries.filter(v => v < 0).length;
  const isUp = avg >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl bg-gradient-to-r from-card to-muted/30 border border-border/40 p-4 mt-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{lang === "de" ? "Heutige Performance" : "Today's Performance"}</span>
          <div className={`font-display text-2xl font-bold ${isUp ? "text-chart-2" : "text-destructive"}`}>
            {isUp ? "+" : ""}{avg.toFixed(2)}%
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-chart-2">{gainers}</div>
            <div className="text-[10px] text-muted-foreground">{lang === "de" ? "Gewinner" : "Gainers"}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-destructive">{losers}</div>
            <div className="text-[10px] text-muted-foreground">{lang === "de" ? "Verlierer" : "Losers"}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">{count - gainers - losers}</div>
            <div className="text-[10px] text-muted-foreground">{lang === "de" ? "Unverändert" : "Flat"}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PortfolioSummary({ watchlist, lang }: { watchlist: any[]; lang: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
      <div className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-3 text-center">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
          {lang === "de" ? "Positionen" : "Positions"}
        </div>
        <div className="font-display font-bold text-xl text-foreground">{watchlist.length}</div>
      </div>
      <div className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-3 text-center">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
          {lang === "de" ? "Seit" : "Since"}
        </div>
        <div className="font-display font-bold text-sm text-foreground">
          {watchlist.length > 0 ? new Date(watchlist[watchlist.length - 1].created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", year: "numeric" }) : "—"}
        </div>
      </div>
      <div className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-3 text-center">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
          {lang === "de" ? "Letzte Änderung" : "Last Updated"}
        </div>
        <div className="font-display font-bold text-sm text-foreground">
          {watchlist.length > 0 ? new Date(watchlist[0].created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" }) : "—"}
        </div>
      </div>
      <div className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 p-3 text-center">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
          {lang === "de" ? "Live-Daten" : "Live Data"}
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2" /></span>
          <span className="font-display font-bold text-sm text-chart-2">LIVE</span>
        </div>
      </div>
    </motion.div>
  );
}

function exportWatchlistCSV(watchlist: any[], lang: string) {
  const header = lang === "de" ? "Symbol,Gruppe,Notiz,Hinzugefügt" : "Symbol,Group,Note,Added";
  const rows = watchlist.map(w => `${w.symbol},${w.group_name || ""},${(w.note || "").replace(/,/g, ";")},${new Date(w.created_at).toISOString().slice(0, 10)}`);
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `watchlist-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Inline note editor popover */
function NoteEditor({ item: wItem, lang }: { item: any; lang: string }) {
  const updateMutation = useUpdateWatchlistItem();
  const [note, setNote] = useState(wItem.note || "");
  const [open, setOpen] = useState(false);

  const save = () => {
    updateMutation.mutate({ id: wItem.id, note: note || null });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={`p-1 rounded-md hover:bg-muted transition-colors ${wItem.note ? "text-primary" : "text-muted-foreground/40"}`} title={lang === "de" ? "Notiz" : "Note"}>
          <StickyNote className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <p className="text-xs font-medium mb-2">{lang === "de" ? "Notiz zu" : "Note for"} {wItem.symbol}</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-20 rounded-lg border border-border bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder={lang === "de" ? "Deine Notiz..." : "Your note..."}
        />
        <div className="flex justify-end gap-1.5 mt-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>{lang === "de" ? "Abbrechen" : "Cancel"}</Button>
          <Button size="sm" className="h-7 text-xs" onClick={save}>{lang === "de" ? "Speichern" : "Save"}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Group assignment popover */
function GroupEditor({ item: wItem, groups, lang }: { item: any; groups: string[]; lang: string }) {
  const updateMutation = useUpdateWatchlistItem();
  const [open, setOpen] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  const assign = (g: string | null) => {
    updateMutation.mutate({ id: wItem.id, group_name: g });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={`p-1 rounded-md hover:bg-muted transition-colors ${wItem.group_name ? "text-primary" : "text-muted-foreground/40"}`} title={lang === "de" ? "Gruppe" : "Group"}>
          <Tag className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="end">
        <p className="text-xs font-medium mb-2">{lang === "de" ? "Gruppe zuweisen" : "Assign Group"}</p>
        {wItem.group_name && (
          <button onClick={() => assign(null)} className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-muted text-destructive flex items-center gap-1.5 mb-1">
            <X className="h-3 w-3" />{lang === "de" ? "Gruppe entfernen" : "Remove group"}
          </button>
        )}
        {groups.map(g => (
          <button key={g} onClick={() => assign(g)} className={`w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${wItem.group_name === g ? "bg-primary/10 text-primary font-medium" : ""}`}>
            {g}
          </button>
        ))}
        <div className="flex gap-1 mt-2">
          <Input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder={lang === "de" ? "Neue Gruppe" : "New group"} className="h-7 text-xs" />
          <Button size="sm" className="h-7 text-xs shrink-0" disabled={!newGroup.trim()} onClick={() => { assign(newGroup.trim()); setNewGroup(""); }}>+</Button>
        </div>
      </PopoverContent>
    </Popover>
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
  const [quoteMap, setQuoteMap] = useState<Record<string, number>>({});
  const [groupFilter, setGroupFilter] = useState<string | null>(null);

  const handleQuoteLoaded = useMemo(() => {
    const cache: Record<string, (dp: number) => void> = {};
    return (symbol: string) => {
      if (!cache[symbol]) {
        cache[symbol] = (dp: number) => {
          setQuoteMap(prev => {
            if (prev[symbol] === dp) return prev;
            return { ...prev, [symbol]: dp };
          });
        };
      }
      return cache[symbol];
    };
  }, []);

  const groups = useMemo(() => {
    if (!watchlist) return [];
    const set = new Set(watchlist.map(w => w.group_name).filter(Boolean) as string[]);
    return [...set].sort();
  }, [watchlist]);

  const filtered = useMemo(() => {
    if (!watchlist) return [];
    let items = [...watchlist];
    if (groupFilter) items = items.filter(w => w.group_name === groupFilter);
    if (searchQuery) {
      items = items.filter((w) => w.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (sortMode === "oldest") items.reverse();
    if (sortMode === "alpha") items.sort((a, b) => a.symbol.localeCompare(b.symbol));
    if (sortMode === "performance") {
      items.sort((a, b) => (quoteMap[b.symbol] || 0) - (quoteMap[a.symbol] || 0));
    }
    return items;
  }, [watchlist, searchQuery, sortMode, quoteMap, groupFilter]);

  const count = watchlist?.length ?? 0;

  const cycleSortMode = () => {
    const modes: SortMode[] = ["newest", "oldest", "alpha", "performance"];
    setSortMode(prev => modes[(modes.indexOf(prev) + 1) % modes.length]);
  };

  const sortLabel = sortMode === "newest" ? t("watchlist.sortNewest") : sortMode === "oldest" ? t("watchlist.sortOldest") : sortMode === "alpha" ? t("watchlist.sortAlpha") : (lang === "de" ? "Performance" : "Performance");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10 max-w-5xl px-3 sm:px-4">
        {/* Terminal-style Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/30 border border-border/60 shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-muted/50 border-b border-border/40">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-chart-2/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">WATCHLIST TERMINAL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-chart-2" /></span>
                <span className="text-[10px] font-mono text-chart-2">CONNECTED</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10">
                    <Activity className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{t("watchlist.title")}</h1>
                    {user && (
                      <p className="text-sm text-muted-foreground mt-0.5 font-mono">
                        {count === 0 ? t("watchlist.startTracking") : `${count} ${lang === "de" ? "Instrumente beobachtet" : "instruments tracked"}`}
                      </p>
                    )}
                  </div>
                </div>
                {user && count > 0 && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs gap-1.5 px-3 py-1.5 border-chart-2/30 text-chart-2 bg-chart-2/5">
                      <Zap className="h-3 w-3" />REAL-TIME
                    </Badge>
                    <Badge variant="secondary" className="font-display text-lg gap-2 px-4 py-1.5 shadow bg-card border border-border/60">
                      <BarChart3 className="h-4 w-4 text-primary" />{count}
                    </Badge>
                  </div>
                )}
              </div>

              {user && count > 0 && <PortfolioSummary watchlist={watchlist || []} lang={lang} />}
              {user && count > 0 && <DailyPLSummary quoteMap={quoteMap} count={count} lang={lang} />}

              {user && count > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3 mt-5">
                  {/* Group filter chips */}
                  {groups.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      <button onClick={() => setGroupFilter(null)} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${!groupFilter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {lang === "de" ? "Alle" : "All"}
                      </button>
                      {groups.map(g => (
                        <button key={g} onClick={() => setGroupFilter(groupFilter === g ? null : g)} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${groupFilter === g ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t("watchlist.search")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 rounded-xl bg-background/80 border-border/50 font-mono text-sm"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={cycleSortMode} title={sortLabel}>
                      {sortMode === "oldest" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
                      {viewMode === "list" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={() => exportWatchlistCSV(watchlist || [], lang)} title={lang === "de" ? "CSV exportieren" : "Export CSV"}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
              {user && count > 0 && (
                <div className="mt-2 text-[10px] font-mono text-muted-foreground/50">
                  {lang === "de" ? "Sortierung" : "Sort"}: <span className="text-muted-foreground">{sortLabel}</span>
                  {groupFilter && <> · {lang === "de" ? "Gruppe" : "Group"}: <span className="text-primary">{groupFilter}</span></>}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {authLoading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[72px] rounded-xl" />)}</div>
        ) : !user ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center py-24 px-6">
            <div className="relative inline-block mb-8">
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-accent/50 to-primary/10 shadow-2xl shadow-primary/5 border border-primary/10">
                <Star className="h-16 w-16 text-primary/30" />
              </div>
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute -top-3 -right-3">
                <Sparkles className="h-6 w-6 text-primary" />
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
          <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[72px] rounded-xl" />)}</div>
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
                  <div className="rounded-xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5">
                      <NoteEditor item={w} lang={lang} />
                      <GroupEditor item={w} groups={groups} lang={lang} />
                      <WatchlistStar symbol={w.symbol} />
                    </div>
                    <Link to={`/stock/${w.symbol}`} className="block p-4 text-center relative">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/20 mx-auto mb-2 flex items-center justify-center shadow-md shadow-primary/5">
                        <span className="font-mono font-bold text-primary text-sm">{w.symbol.slice(0, 2)}</span>
                      </div>
                      <span className="font-mono font-bold text-sm group-hover:text-primary transition-colors block truncate">{w.symbol}</span>
                      {w.group_name && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium mt-1 inline-block">{w.group_name}</span>}
                      <div className="mt-2"><WatchlistQuote symbol={w.symbol} onQuoteLoaded={handleQuoteLoaded(w.symbol)} /></div>
                      <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-muted-foreground/50 font-mono">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(w.created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" })}
                      </div>
                    </Link>
                    {w.note && <div className="px-3 pb-2 text-[10px] text-muted-foreground truncate" title={w.note}>📝 {w.note}</div>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-lg">
            <div className="grid grid-cols-[2rem_2.5rem_1fr_4rem_7rem_8rem_4rem] sm:grid-cols-[2rem_2.5rem_1fr_4rem_5rem_7rem_8rem_4rem] items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
              <span>#</span>
              <span></span>
              <span>Symbol</span>
              <span className="text-center">{lang === "de" ? "Aktionen" : "Actions"}</span>
              <span className="hidden sm:block text-right">{lang === "de" ? "Hinzugefügt" : "Added"}</span>
              <span className="text-right">Chart</span>
              <span className="text-right">{lang === "de" ? "Kurs" : "Price"}</span>
              <span></span>
            </div>
            <motion.div variants={container} initial="hidden" animate="show">
              <AnimatePresence>
                {filtered.map((w, i) => (
                  <motion.div key={w.symbol} variants={item} layout exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }} className="group">
                    <div className="grid grid-cols-[2rem_2.5rem_1fr_4rem_7rem_8rem_4rem] sm:grid-cols-[2rem_2.5rem_1fr_4rem_5rem_7rem_8rem_4rem] items-center gap-2 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors relative">
                      <span className="text-[10px] font-mono text-muted-foreground/40 text-center select-none">{i + 1}</span>
                      <div><WatchlistStar symbol={w.symbol} /></div>
                      <Link to={`/stock/${w.symbol}`} className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center shrink-0 group-hover:shadow-md group-hover:shadow-primary/10 transition-shadow">
                          <span className="font-mono font-bold text-primary text-xs">{w.symbol.slice(0, 2)}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-sm group-hover:text-primary transition-colors truncate block">{w.symbol}</span>
                          {w.group_name && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{w.group_name}</span>}
                          {w.note && <span className="text-[9px] text-muted-foreground/60 truncate block max-w-[120px]" title={w.note}>📝 {w.note}</span>}
                        </div>
                      </Link>
                      <div className="flex items-center justify-center gap-0.5">
                        <NoteEditor item={w} lang={lang} />
                        <GroupEditor item={w} groups={groups} lang={lang} />
                      </div>
                      <div className="hidden sm:block text-right">
                        <span className="text-[10px] font-mono text-muted-foreground/50">
                          {new Date(w.created_at).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric", year: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex justify-end"><WatchlistQuote symbol={w.symbol} onQuoteLoaded={handleQuoteLoaded(w.symbol)} /></div>
                      <Link to={`/stock/${w.symbol}`} className="hidden sm:flex items-center justify-center h-8 w-8 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors shrink-0 ml-auto">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {user && count > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground/40 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-chart-2" /></span>
              {lang === "de" ? "Echtzeit-Daten" : "Real-time data"}
            </span>
            <span>•</span>
            <span>{count} {lang === "de" ? "Positionen" : "positions"}</span>
            <span>•</span>
            <span>{lang === "de" ? "Aktualisierung 60s" : "60s refresh"}</span>
          </motion.div>
        )}
      </main>
      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">© {new Date().getFullYear()} StoneStocks</div>
      </footer>
    </div>
  );
}
