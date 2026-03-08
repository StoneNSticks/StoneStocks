/**
 * AdminPage — Dashboard with user stats, popular stocks, and cache info.
 * Only accessible to authenticated users (no admin role check for now, just stats).
 * Data: counts from watchlist, stock_votes, stock_comments, api_cache tables.
 */
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Users, Star, MessageSquare, Database, BarChart3 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useUserRole";

export default function AdminPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [watchlistRes, votesRes, commentsRes, cacheRes, alertsRes] = await Promise.all([
        supabase.from("watchlist").select("symbol", { count: "exact", head: true }),
        supabase.from("stock_votes").select("symbol", { count: "exact", head: true }),
        supabase.from("stock_comments").select("symbol", { count: "exact", head: true }),
        supabase.from("api_cache").select("source", { count: "exact", head: true }),
        supabase.from("price_alerts").select("symbol", { count: "exact", head: true }),
      ]);
      return {
        watchlistCount: watchlistRes.count || 0,
        votesCount: votesRes.count || 0,
        commentsCount: commentsRes.count || 0,
        cacheCount: cacheRes.count || 0,
        alertsCount: alertsRes.count || 0,
      };
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  const { data: popularStocks } = useQuery({
    queryKey: ["admin-popular"],
    queryFn: async () => {
      const { data } = await supabase.from("watchlist").select("symbol");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((w) => { counts[w.symbol] = (counts[w.symbol] || 0) + 1; });
      return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([symbol, count]) => ({ symbol, count }));
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  if (!user) return <Navigate to="/auth" />;

  const StatCard = ({ icon: Icon, label, value, color = "text-primary" }: { icon: any; label: string; value: number | string; color?: string }) => (
    <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
      <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-4xl px-3 sm:px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Dashboard" : "Dashboard"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Plattform-Übersicht" : "Platform overview"}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <StatCard icon={Star} label={lang === "de" ? "Watchlist-Einträge" : "Watchlist Entries"} value={stats?.watchlistCount || 0} />
              <StatCard icon={BarChart3} label={lang === "de" ? "Abstimmungen" : "Votes"} value={stats?.votesCount || 0} color="text-chart-2" />
              <StatCard icon={MessageSquare} label={lang === "de" ? "Kommentare" : "Comments"} value={stats?.commentsCount || 0} color="text-accent-foreground" />
              <StatCard icon={Database} label={lang === "de" ? "Cache-Einträge" : "Cache Entries"} value={stats?.cacheCount || 0} color="text-muted-foreground" />
              <StatCard icon={Users} label={lang === "de" ? "Kursalarme" : "Price Alerts"} value={stats?.alertsCount || 0} color="text-destructive" />
            </div>

            {popularStocks && popularStocks.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h3 className="font-display font-semibold text-sm mb-3">{lang === "de" ? "Beliebteste Aktien" : "Most Watched Stocks"}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {popularStocks.map((s) => (
                    <div key={s.symbol} className="rounded-lg bg-muted/40 p-3 text-center">
                      <div className="font-mono font-bold text-sm text-primary">{s.symbol}</div>
                      <div className="text-xs text-muted-foreground">{s.count}× {lang === "de" ? "beobachtet" : "tracked"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
