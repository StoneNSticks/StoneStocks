/**
 * Header: Professional finance-style navigation.
 * Row 1: Logo | Search (wide) | Currency, Language, Theme, Notifications, User
 * Row 2: All 11 pages as flat links with divider between main and tools
 * Mobile: Logo + Search + Hamburger → Sheet
 */
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, LogIn, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { NotificationBell } from "@/components/NotificationBell";
import { SearchBar } from "@/components/SearchBar";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MarketClock } from "@/components/MarketClock";
import { TickerTape } from "@/components/TickerTape";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";
import { useElementVisible } from "@/hooks/useScrollVisibility";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem { to: string; key: string; fallback?: string; group?: string }

const navItems: NavItem[] = [
  { to: "/", key: "nav.markets", group: "main" },
  { to: "/sentiment", key: "nav.sentiment", group: "main" },
  { to: "/rankings", key: "nav.rankings", group: "main" },
  { to: "/news", key: "nav.news", group: "main" },
  { to: "/screener", key: "nav.screener", fallback: "Screener", group: "main" },
  { to: "/portfolio", key: "nav.portfolio", group: "main" },
  { to: "/watchlist", key: "nav.watchlist", group: "main" },
  { to: "/backtest", key: "nav.backtest", fallback: "Backtest", group: "main" },
  { to: "/learn", key: "nav.learn", group: "main" },
];

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const t = useT();
  const [sheetOpen, setSheetOpen] = useState(false);
  const isHome = location.pathname === "/";
  const mainSearchVisible = useElementVisible("main-search-bar");
  const mainIndicesVisible = useElementVisible("main-market-overview");

  useEffect(() => { setSheetOpen(false); }, [location.pathname]);

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "User";

  const label = (item: NavItem) => {
    const translated = t(item.key);
    return translated !== item.key ? translated : (item.fallback || item.key);
  };

  const mainItems = navItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl">
      {/* Row 1: Utility bar */}
      <div className="border-b border-border/40">
        <div className="container flex h-12 items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-xs">S</div>
            <span className="font-display text-base font-semibold tracking-tight hidden sm:inline">
              Stone<span className="text-primary">Stocks</span>
            </span>
          </Link>

          {/* Show compact search: always on non-home pages, on home only when main search scrolled away */}
          {(!isHome || !mainSearchVisible) ? (
            <div className="flex-1 max-w-xl mx-auto animate-slide-down" key="header-search">
              <SearchBar compact />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-1.5">
            <div className="hidden lg:block"><MarketClock /></div>
            <CurrencyToggle />
            <LanguageToggle />
            <ThemeToggle />
            <NotificationCenter />
            <NotificationBell />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="max-w-[80px] truncate hidden lg:inline text-xs">{username}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b border-border/40">
                    <p className="text-sm font-medium text-foreground">{username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />{t("nav.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />{t("nav.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/compare" className="flex items-center gap-2 cursor-pointer">Compare</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/macro" className="flex items-center gap-2 cursor-pointer">Macro</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators" className="flex items-center gap-2 cursor-pointer">{t("nav.tools")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />{t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("nav.login")}</span>
              </Link>
            )}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="flex md:hidden items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="font-display text-left">
                    Stone<span className="text-primary">Stocks</span>
                  </SheetTitle>
                </SheetHeader>
                <MobileNav items={navItems} location={location} label={label} user={user} username={username} t={t} signOut={signOut} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Row 2: All nav links flat — desktop only */}
      <div className="hidden md:block border-b border-border/30 bg-card/50">
        <div className="container">
          <nav className="flex items-center h-10 gap-0 -mb-px overflow-x-auto scrollbar-hide">
            {mainItems.map((item) => {
              const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} className={`relative px-3.5 h-10 flex items-center text-[13px] font-medium whitespace-nowrap transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {label(item)}
                  {isActive && <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-primary rounded-full" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Row 3: Ticker tape — on home, only show when main indices scrolled away */}
      {(!isHome || !mainIndicesVisible) && (
        <div className="animate-slide-down">
          <TickerTape />
        </div>
      )}
    </header>
  );
}

/* ── Mobile navigation inside Sheet ── */
function MobileNav({ items, location, label, user, username, t, signOut }: {
  items: NavItem[]; location: any; label: (item: NavItem) => string; user: any; username: string; t: (key: string) => string; signOut: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col h-full">
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              {label(item)}
            </Link>
          );
        })}
        <div className="mt-4 mb-2 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tools</p>
        </div>
        {[
          { to: "/compare", label: "Compare" },
          { to: "/calculators", label: t("nav.tools") },
          { to: "/macro", label: "Macro" },
          { to: "/dashboard", label: "Dashboard" },
          { to: "/crypto", label: "Crypto" },
          { to: "/forex", label: "Forex" },
          { to: "/bonds", label: "Bonds" },
        ].map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-border/60 space-y-3 pb-6">
        <MarketClock />
        <div className="flex items-center gap-2">
          <CurrencyToggle />
          <LanguageToggle />
        </div>
        {user ? (
          <div className="space-y-1 pt-2 border-t border-border/40">
            <p className="px-3 py-1.5 text-sm font-medium text-foreground">{username}</p>
            <Link to="/profile" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">{t("nav.profile")}</Link>
            <Link to="/settings" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">{t("nav.settings")}</Link>
            <button onClick={signOut} className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted rounded-lg transition-colors">{t("nav.logout")}</button>
          </div>
        ) : (
          <Link to="/auth" className="flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <LogIn className="h-4 w-4 mr-2" />{t("nav.login")}
          </Link>
        )}
      </div>
    </div>
  );
}
