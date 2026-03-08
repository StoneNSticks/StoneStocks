/**
 * Header: 2-row desktop navigation with prominent search bar.
 * Row 1: Logo | Search | Theme + Notifications + User
 * Row 2: All main pages as flat links + Tools dropdown
 * Mobile: Logo + Search + Hamburger
 */
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  TrendingUp, Newspaper, BarChart3, Calculator, Menu, Star, LogIn, LogOut,
  User, Settings, ChevronDown, Gauge, Briefcase,
  GitCompare, Filter, BookOpen, GraduationCap
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { SearchBar } from "@/components/SearchBar";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MarketClock } from "@/components/MarketClock";
import { useAuth } from "@/contexts/AuthContext";
import { useT } from "@/contexts/LanguageContext";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNav = [
  { to: "/", key: "nav.markets", icon: TrendingUp },
  { to: "/sentiment", key: "nav.sentiment", icon: Gauge },
  { to: "/rankings", key: "nav.rankings", icon: BarChart3 },
  { to: "/news", key: "nav.news", icon: Newspaper },
  { to: "/screener", key: "nav.screener", icon: Filter, fallback: "Screener" },
  { to: "/portfolio", key: "nav.portfolio", icon: Briefcase },
  { to: "/watchlist", key: "nav.watchlist", icon: Star },
];

const toolsNav = [
  { to: "/calculators", key: "nav.tools", icon: Calculator },
  { to: "/compare", key: "nav.compare", icon: GitCompare, fallback: "Compare" },
  { to: "/glossary", key: "nav.glossary", icon: BookOpen, fallback: "Glossary" },
  { to: "/learn", key: "nav.learn", icon: GraduationCap },
];

const allNav = [...mainNav, ...toolsNav];

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const t = useT();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => { setSheetOpen(false); }, [location.pathname]);

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "User";

  const label = (item: { key: string; fallback?: string }) => {
    const translated = t(item.key);
    return translated !== item.key ? translated : (item.fallback || item.key);
  };

  const isToolsActive = toolsNav.some(n => location.pathname === n.to);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Row 1: Logo | Search | Actions */}
      <div className="container flex h-12 items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-xs">S</div>
          <span className="font-display text-base font-semibold tracking-tight hidden sm:inline">
            Stone<span className="text-primary">Stocks</span>
          </span>
        </Link>

        {/* Search - always visible, takes available space */}
        <div className="flex-1 max-w-lg">
          <SearchBar compact />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors border border-border/60">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[80px] truncate hidden sm:inline">{username}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
                <div className="px-2 py-1.5 space-y-2">
                  <MarketClock />
                  <div className="flex items-center gap-2">
                    <CurrencyToggle />
                    <LanguageToggle />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />{t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/60">
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("nav.login")}</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="flex md:hidden items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60">
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display">Stone<span className="text-primary">Stocks</span></SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-0.5 mt-6">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("nav.markets")}</p>
                {mainNav.map((item) => {
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                      <Icon className="h-4 w-4" />
                      {label(item)}
                    </Link>
                  );
                })}
                <p className="px-3 py-1 mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tools</p>
                {toolsNav.map((item) => {
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                      <Icon className="h-4 w-4" />
                      {label(item)}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-border/60 flex flex-col gap-2">
                <MarketClock />
                <div className="flex items-center gap-2">
                  <CurrencyToggle />
                  <LanguageToggle />
                </div>
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-foreground flex items-center gap-2"><User className="h-4 w-4" />{username}</div>
                    <Link to="/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><User className="h-4 w-4" />{t("nav.profile")}</Link>
                    <Link to="/settings" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Settings className="h-4 w-4" />{t("nav.settings")}</Link>
                    <button onClick={() => signOut()} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-muted transition-colors"><LogOut className="h-4 w-4" />{t("nav.logout")}</button>
                  </>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><LogIn className="h-4 w-4" />{t("nav.login")}</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Row 2: Navigation tabs - desktop only */}
      <nav className="hidden md:block border-t border-border/30">
        <div className="container flex h-9 items-center gap-0.5 overflow-x-auto">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium whitespace-nowrap transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label(item)}
              </Link>
            );
          })}

          {/* Tools dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[13px] font-medium whitespace-nowrap transition-colors ${isToolsActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                Tools
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {toolsNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to} className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-primary font-medium" : ""}`}>
                      <Icon className="h-4 w-4" />
                      {label(item)}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
