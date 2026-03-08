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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl pb-safe">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
