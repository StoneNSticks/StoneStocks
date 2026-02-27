import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Newspaper, BarChart3, Activity } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

const navItems = [
  { to: "/", label: "Markets", icon: TrendingUp },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/rankings", label: "Rankings", icon: BarChart3 },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center gap-6">
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">
            S
          </div>
          <span className="font-display text-lg font-semibold tracking-tight hidden sm:inline">
            Stone<span className="text-primary">Stocks</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 max-w-sm ml-auto">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
