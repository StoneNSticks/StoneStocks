/**
 * BottomNav: Fixed mobile bottom navigation bar (visible only on <768px screens).
 * Shows 5 primary navigation items: Home, Sentiment, Rankings, Portfolio, Watchlist.
 */
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, BarChart3, Briefcase, Star, Gauge } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { to: "/", icon: TrendingUp, key: "nav.markets" },
  { to: "/sentiment", icon: Gauge, key: "nav.sentiment" },
  { to: "/rankings", icon: BarChart3, key: "nav.rankings" },
  { to: "/portfolio", icon: Briefcase, key: "nav.portfolio" },
  { to: "/watchlist", icon: Star, key: "nav.watchlist" },
];

export function BottomNav() {
  const location = useLocation();
  const t = useT();
  const { user } = useAuth();

  const { data: watchlistCount } = useQuery({
    queryKey: ["watchlist-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from("watchlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      return count || 0;
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  const { data: portfolioCount } = useQuery({
    queryKey: ["portfolio-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from("portfolio_positions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      return count || 0;
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl pb-safe">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          const badge = item.to === "/watchlist" ? watchlistCount : item.to === "/portfolio" ? portfolioCount : 0;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold px-1">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
