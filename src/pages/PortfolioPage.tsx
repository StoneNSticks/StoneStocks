import { useState, useMemo, useCallback } from "react";
import { PortfolioAnalytics } from "@/components/PortfolioAnalytics";
import { AIRecommendations } from "@/components/AIRecommendations";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuote, getProfile } from "@/lib/stockApi";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, Plus, Trash2, TrendingUp, TrendingDown, LogIn, PieChart as PieChartIcon, DollarSign, Percent, BarChart3, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, formatPercent } from "@/lib/formatters";

const COLORS = [
  "hsl(210, 80%, 55%)", "hsl(145, 63%, 42%)", "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 55%)", "hsl(0, 72%, 51%)", "hsl(190, 70%, 45%)",
  "hsl(330, 65%, 50%)", "hsl(80, 60%, 45%)", "hsl(25, 95%, 53%)",
  "hsl(160, 60%, 40%)",
];

function usePortfolio() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("portfolio_positions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Hook to fetch quote for a position and report values upward
function usePositionData(position: any) {
  const { data: quote } = useQuery({
    queryKey: ["portfolio-quote", position.symbol],
    queryFn: () => getQuote(position.symbol),
    staleTime: 60_000,
  });
  const { data: profile } = useQuery({
    queryKey: ["portfolio-profile", position.symbol],
    queryFn: () => getProfile(position.symbol),
    staleTime: 5 * 60_000,
  });

  const currentPrice = quote?.c || 0;
  const shares = Number(position.shares);
  const avgCost = Number(position.avg_cost);
  const totalCost = shares * avgCost;
  const currentValue = shares * currentPrice;
  const pnl = currentValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const dayChange = (quote?.dp || 0) / 100 * currentValue;

  return { currentPrice, shares, avgCost, totalCost, currentValue, pnl, pnlPct, dayChange, profile, isLoaded: !!quote };
}

function PositionRow({ position, onDelete }: { position: any; onDelete: (id: string) => void }) {
  const { convert, symbol: cSym } = useCurrency();
  const { currentPrice, shares, avgCost, totalCost, currentValue, pnl, pnlPct, profile } = usePositionData(position);
  const isUp = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 hover:bg-muted/30 transition-colors"
    >
      <Link to={`/stock/${position.symbol}`} className="flex items-center gap-3 flex-1 min-w-0">
        {profile?.logo ? (
          <img src={profile.logo} alt="" className="h-8 w-8 rounded-lg object-contain bg-background border border-border/40 p-1 shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {position.symbol.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <div className="font-display font-bold text-sm">{position.symbol}</div>
          <div className="text-[11px] text-muted-foreground truncate">{profile?.name || ""}</div>
        </div>
      </Link>
      <div className="text-right text-sm hidden sm:block">
        <div className="text-muted-foreground text-[11px]">{shares} shares @ {cSym}{convert(avgCost)?.toFixed(2)}</div>
      </div>
      <div className="text-right shrink-0 min-w-[90px]">
        <div className="font-mono font-bold text-sm">{cSym}{convert(currentValue)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div className={`text-xs font-bold ${isUp ? "text-chart-2" : "text-destructive"}`}>
          {isUp ? "+" : ""}{formatPercent(pnlPct)} ({cSym}{convert(Math.abs(pnl))?.toFixed(0)})
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => onDelete(position.id)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}

/** Wrapper that fetches quote data for each position to feed PortfolioAnalytics */
function PortfolioAnalyticsWrapper({ positions }: { positions: any[] }) {
  const quoteQueries = positions.map(pos =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["portfolio-quote", pos.symbol],
      queryFn: () => getQuote(pos.symbol),
      staleTime: 60_000,
    })
  );
  const profileQueries = positions.map(pos =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["portfolio-profile", pos.symbol],
      queryFn: () => getProfile(pos.symbol),
      staleTime: 5 * 60_000,
    })
  );

  const allLoaded = quoteQueries.every(q => q.data);
  if (!allLoaded) return null;

  const posData = positions.map((pos, i) => ({
    symbol: pos.symbol,
    shares: Number(pos.shares),
    avgCost: Number(pos.avg_cost),
    currentPrice: quoteQueries[i]?.data?.c || 0,
    sector: profileQueries[i]?.data?.finnhubIndustry || undefined,
    name: profileQueries[i]?.data?.name || pos.symbol,
  }));

  return <PortfolioAnalytics positions={posData} />;
}

/** Portfolio Summary Cards */
function PortfolioSummary({ positions }: { positions: any[] }) {
  const { convert, symbol: cSym } = useCurrency();
  const { lang } = useLanguage();

  // Fetch all quotes in parallel
  const quoteQueries = positions.map(pos =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["portfolio-quote", pos.symbol],
      queryFn: () => getQuote(pos.symbol),
      staleTime: 60_000,
    })
  );

  const allLoaded = quoteQueries.every(q => q.data);

  const totals = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    let totalDayChange = 0;

    positions.forEach((pos, i) => {
      const quote = quoteQueries[i]?.data;
      const price = quote?.c || 0;
      const shares = Number(pos.shares);
      const avgCost = Number(pos.avg_cost);
      totalValue += shares * price;
      totalCost += shares * avgCost;
      totalDayChange += (quote?.dp || 0) / 100 * shares * price;
    });

    const totalPnl = totalValue - totalCost;
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
    const dayChangePct = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0;

    return { totalValue, totalCost, totalPnl, totalPnlPct, totalDayChange, dayChangePct };
  }, [positions, quoteQueries.map(q => q.data)]);

  if (!allLoaded) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }

  const cards = [
    {
      label: lang === "de" ? "Gesamtwert" : "Total Value",
      value: `${cSym}${convert(totals.totalValue)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <DollarSign className="h-4 w-4" />,
      color: "text-foreground",
    },
    {
      label: lang === "de" ? "Investiert" : "Invested",
      value: `${cSym}${convert(totals.totalCost)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <Briefcase className="h-4 w-4" />,
      color: "text-muted-foreground",
    },
    {
      label: lang === "de" ? "Gesamt P&L" : "Total P&L",
      value: `${totals.totalPnl >= 0 ? "+" : ""}${cSym}${convert(Math.abs(totals.totalPnl))?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      sub: `${totals.totalPnlPct >= 0 ? "+" : ""}${totals.totalPnlPct.toFixed(2)}%`,
      icon: <Percent className="h-4 w-4" />,
      color: totals.totalPnl >= 0 ? "text-chart-2" : "text-destructive",
    },
    {
      label: lang === "de" ? "Tagesänderung" : "Day Change",
      value: `${totals.totalDayChange >= 0 ? "+" : ""}${cSym}${convert(Math.abs(totals.totalDayChange))?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      sub: `${totals.dayChangePct >= 0 ? "+" : ""}${totals.dayChangePct.toFixed(2)}%`,
      icon: <BarChart3 className="h-4 w-4" />,
      color: totals.totalDayChange >= 0 ? "text-chart-2" : "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            {card.icon}
            <span className="text-[11px] font-medium">{card.label}</span>
          </div>
          <div className={`font-mono font-bold text-lg ${card.color}`}>{card.value}</div>
          {card.sub && <div className={`text-xs font-mono ${card.color}`}>{card.sub}</div>}
        </motion.div>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: positions, isLoading } = usePortfolio();
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();
  const { lang } = useLanguage();
  const queryClient = useQueryClient();

  usePageTitle(
    lang === "de" ? "Mein Portfolio" : "My Portfolio",
    lang === "de" ? "Verwalte deine Investments und verfolge P&L in Echtzeit" : "Manage your investments and track P&L in real-time"
  );

  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newCost, setNewCost] = useState("");

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const sym = newSymbol.toUpperCase().trim();
      if (!sym || !newShares || !newCost) throw new Error("Fill all fields");
      const { error } = await supabase.from("portfolio_positions").upsert({
        user_id: user.id,
        symbol: sym,
        shares: Number(newShares),
        avg_cost: Number(newCost),
      }, { onConflict: "user_id,symbol" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      setNewSymbol("");
      setNewShares("");
      setNewCost("");
      setShowAdd(false);
      toast.success(lang === "de" ? "Position hinzugefügt" : "Position added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_positions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      toast.success(lang === "de" ? "Position entfernt" : "Position removed");
    },
  });

  const count = positions?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10 max-w-4xl px-3 sm:px-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{lang === "de" ? "Mein Portfolio" : "My Portfolio"}</h1>
              <p className="text-sm text-muted-foreground">
                {count > 0 ? `${count} ${lang === "de" ? "Positionen" : "positions"}` : (lang === "de" ? "Starte mit dem Aufbau deines Portfolios" : "Start building your portfolio")}
              </p>
            </div>
          </div>
        </motion.div>

        {authLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : !user ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24">
            <Briefcase className="h-16 w-16 text-primary/30 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold mb-3">{lang === "de" ? "Anmelden um Portfolio zu verwalten" : "Sign in to manage portfolio"}</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">{lang === "de" ? "Verfolge deine Investments und Performance in Echtzeit." : "Track your investments and performance in real time."}</p>
            <Button asChild size="lg" className="rounded-xl"><Link to="/auth"><LogIn className="h-4 w-4 mr-2" />{t("auth.signIn")}</Link></Button>
          </motion.div>
        ) : (
          <>
            {/* Portfolio Summary Dashboard */}
            {count > 0 && !isLoading && <PortfolioSummary positions={positions!} />}

            {/* Add position button / form */}
            <div className="mb-5 flex items-center gap-2">
              {!showAdd ? (
                <>
                  <Button onClick={() => setShowAdd(true)} variant="outline" className="rounded-xl gap-2">
                    <Plus className="h-4 w-4" />
                    {lang === "de" ? "Position hinzufügen" : "Add Position"}
                  </Button>
                  {count > 0 && (
                    <>
                      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => {
                        const header = "Symbol,Shares,Avg Cost,Date";
                        const rows = positions!.map((p: any) => `${p.symbol},${p.shares},${p.avg_cost},${new Date(p.created_at).toISOString().slice(0, 10)}`);
                        const csv = [header, ...rows].join("\n");
                        const blob = new Blob([csv], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => {
                        const symbols = positions!.map((p: any) => p.symbol).join(",");
                        const url = `${window.location.origin}/shared-watchlist?symbols=${symbols}`;
                        if (navigator.share) {
                          navigator.share({ title: "My Portfolio", url });
                        } else {
                          navigator.clipboard.writeText(url);
                          toast.success(lang === "de" ? "Link kopiert!" : "Link copied!");
                        }
                      }}>
                        <Share2 className="h-3.5 w-3.5" />
                        {lang === "de" ? "Teilen" : "Share"}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border/60 bg-card p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Symbol</Label>
                      <Input placeholder="AAPL" value={newSymbol} onChange={e => setNewSymbol(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{lang === "de" ? "Aktien" : "Shares"}</Label>
                      <Input type="number" placeholder="10" value={newShares} onChange={e => setNewShares(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{lang === "de" ? "Ø Kaufkurs" : "Avg Cost"}</Label>
                      <Input type="number" placeholder="150.00" value={newCost} onChange={e => setNewCost(e.target.value)} className="mt-1" step="0.01" />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending} className="flex-1">
                        {addMutation.isPending ? "..." : (lang === "de" ? "Hinzufügen" : "Add")}
                      </Button>
                      <Button variant="ghost" onClick={() => setShowAdd(false)}>{lang === "de" ? "Abbrechen" : "Cancel"}</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
            ) : count === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="font-display text-lg font-semibold mb-2">{lang === "de" ? "Noch keine Positionen" : "No positions yet"}</p>
                <p className="text-sm">{lang === "de" ? "Füge deine erste Aktie hinzu um loszulegen." : "Add your first stock to get started."}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {positions!.map((pos: any) => (
                    <PositionRow key={pos.id} position={pos} onDelete={(id) => deleteMutation.mutate(id)} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Allocation pie chart */}
            {count > 0 && count <= 20 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 rounded-xl border border-border/60 bg-card p-5">
                <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">{lang === "de" ? "Allokation" : "Allocation"}</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={positions!.map((p: any) => ({
                          name: p.symbol,
                          value: Number(p.shares) * Number(p.avg_cost),
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {positions!.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${cSym}${convert(v)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Portfolio Analytics */}
            {count > 1 && (
              <PortfolioAnalyticsWrapper positions={positions!} />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
