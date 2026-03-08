/**
 * RankingsPage — Market rankings with Top Companies, Gainers/Losers,
 * Most Active, Sector Performance, and link to Stock Screener.
 */
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TopCompanies } from "@/components/TopCompanies";
import { GainersLosers } from "@/components/GainersLosers";
import { MostActive } from "@/components/MostActive";
import { MarketOverview } from "@/components/MarketOverview";
import { SectorPerformance } from "@/components/SectorPerformance";
import { ScreenerHeatmap } from "@/components/ScreenerHeatmap";
import { Button } from "@/components/ui/button";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Filter, Trophy, Medal, Crown, TrendingUp as TrendingUpIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LEADERS = [
  { rank: 1, name: "TraderX", return: 42.5, trades: 156, winRate: 68, streak: 12 },
  { rank: 2, name: "AlphaInvestor", return: 38.2, trades: 89, winRate: 72, streak: 8 },
  { rank: 3, name: "MarketWolf", return: 35.8, trades: 234, winRate: 61, streak: 15 },
  { rank: 4, name: "BullRunner", return: 31.4, trades: 67, winRate: 75, streak: 6 },
  { rank: 5, name: "StockSage", return: 28.9, trades: 112, winRate: 64, streak: 9 },
  { rank: 6, name: "DividendKing", return: 25.3, trades: 45, winRate: 78, streak: 4 },
  { rank: 7, name: "TechTrader", return: 22.7, trades: 189, winRate: 58, streak: 7 },
  { rank: 8, name: "ValueHunter", return: 19.5, trades: 34, winRate: 82, streak: 3 },
  { rank: 9, name: "SwingMaster", return: 17.2, trades: 201, winRate: 55, streak: 11 },
  { rank: 10, name: "CalmInvestor", return: 15.8, trades: 28, winRate: 85, streak: 2 },
];

const rankIcon = (r: number) => {
  if (r === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (r === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (r === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="font-mono font-bold text-sm text-muted-foreground w-5 text-center">{r}</span>;
};

const RankingsPage = () => {
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Rankings & Bestenlisten" : "Rankings & Leaderboards",
    lang === "de" ? "Top-Unternehmen, Gewinner, Verlierer und Sektorperformance" : "Top companies, gainers, losers, and sector performance"
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <section className="mb-4 sm:mb-6">
          <MarketOverview />
        </section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">{t("nav.rankings")}</h2>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link to="/screener"><Filter className="h-3.5 w-3.5" />{t("screener.title")}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <TopCompanies />
          <GainersLosers />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <MostActive />
          <SectorPerformance />
        </div>
        <ScreenerHeatmap />
      </main>
      <Footer />
    </div>
  );
};

export default RankingsPage;
