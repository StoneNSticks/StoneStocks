import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { TrendingUp, Newspaper, BarChart3, Calculator, Menu } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MarketClock } from "@/components/MarketClock";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { to: "/", label: "Markets", icon: TrendingUp },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/rankings", label: "Rankings", icon: BarChart3 },
  { to: "/calculators", label: "Tools", icon: Calculator },
];

export function Header() {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setShowSearch(true);
      return;
    }

    const handleScroll = () => {
      setShowSearch(window.scrollY > 180);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Close sheet on navigation
  useEffect(() => {
    setSheetOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center gap-4 md:gap-6">
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">
            S
          </div>
          <span className="font-display text-lg font-semibold tracking-tight hidden sm:inline">
            Stone<span className="text-primary">Stocks</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
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

        <div className="flex-1 flex items-center gap-2 justify-end">
          <div
            className={`max-w-sm flex-1 transition-all duration-300 ${
              showSearch ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <SearchBar compact />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <MarketClock />
            <CurrencyToggle />
          </div>
          <ThemeToggle />

          {/* Mobile hamburger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="flex md:hidden items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60">
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display">
                  Stone<span className="text-primary">Stocks</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-border/60 flex flex-col gap-3">
                <MarketClock />
                <CurrencyToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
