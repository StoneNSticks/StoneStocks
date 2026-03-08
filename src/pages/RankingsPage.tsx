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
import { Button } from "@/components/ui/button";
import { useT } from "@/contexts/LanguageContext";
import { Filter } from "lucide-react";

const RankingsPage = () => {
  const t = useT();
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <MostActive />
          <SectorPerformance />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RankingsPage;
