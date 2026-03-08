/**
 * Header — Global navigation bar with responsive design.
 * 
 * Features:
 * - Desktop: horizontal nav links with icons + compact search (appears on scroll)
 * - Mobile (<768px): hamburger menu (Sheet) with full nav + settings
 * - Market clock, currency/language/theme toggles
 * - User dropdown (profile, watchlist, settings, logout) when authenticated
 * - Learn page link (HelpCircle icon)
 * 
 * Nav items are defined in `navKeys` array for easy extension.
 */
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { TrendingUp, Newspaper, BarChart3, Calculator, Menu, Star, LogIn, LogOut, User, Settings, ChevronDown, HelpCircle, Gauge, Briefcase, Wifi, WifiOff } from "lucide-react";
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

const navKeys = [
  { to: "/", key: "nav.markets", icon: TrendingUp },
  { to: "/sentiment", key: "nav.sentiment", icon: Gauge },
  { to: "/news", key: "nav.news", icon: Newspaper },
  { to: "/rankings", key: "nav.rankings", icon: BarChart3 },
  { to: "/portfolio", key: "nav.portfolio", icon: Briefcase },
  { to: "/calculators", key: "nav.tools", icon: Calculator },
  { to: "/watchlist", key: "nav.watchlist", icon: Star },
];

export function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const t = useT();
  const [showSearch, setShowSearch] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    if (location.pathname !== "/") { setShowSearch(true); return; }
    const handleScroll = () => setShowSearch(window.scrollY > 180);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => { setSheetOpen(false); }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center gap-4 md:gap-6">
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm">S</div>
          <span className="font-display text-lg font-semibold tracking-tight hidden sm:inline">
            Stone<span className="text-primary">Stocks</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navKeys.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <Icon className="h-3.5 w-3.5" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 flex items-center gap-2 justify-end">
          <div className={`max-w-sm flex-1 transition-all duration-300 ${showSearch ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
            <SearchBar compact />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <MarketClock />
            <CurrencyToggle />
            <LanguageToggle />
          </div>
          <ThemeToggle />
          <Link to="/learn" className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/60" title={t("nav.learn")}>
            <HelpCircle className="h-4 w-4" />
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors border border-border/60">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[100px] truncate">{username}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link to="/profile" className="flex items-center gap-2 cursor-pointer"><User className="h-4 w-4" />{t("nav.profile")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/watchlist" className="flex items-center gap-2 cursor-pointer"><Star className="h-4 w-4" />{t("nav.watchlist")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/settings" className="flex items-center gap-2 cursor-pointer"><Settings className="h-4 w-4" />{t("nav.settings")}</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"><LogOut className="h-4 w-4" />{t("nav.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="hidden md:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/60">
              <LogIn className="h-3.5 w-3.5" />
              {t("nav.login")}
            </Link>
          )}

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
              <nav className="flex flex-col gap-1 mt-6">
                {navKeys.map((item) => {
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                      <Icon className="h-4 w-4" />
                      {t(item.key)}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-border/60 flex flex-col gap-3">
                <MarketClock />
                <CurrencyToggle />
                <LanguageToggle />
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-foreground flex items-center gap-2"><User className="h-4 w-4" />{username}</div>
                    <Link to="/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><User className="h-4 w-4" />{t("nav.profile")}</Link>
                    <Link to="/settings" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Settings className="h-4 w-4" />{t("nav.settings")}</Link>
                    <button onClick={() => signOut()} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-muted transition-colors"><LogOut className="h-4 w-4" />{t("nav.logout")}</button>
                  </>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><LogIn className="h-4 w-4" />{t("nav.login")}</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
