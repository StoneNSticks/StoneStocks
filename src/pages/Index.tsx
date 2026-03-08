import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketNewsSection } from "@/components/MarketNewsSection";
import { TopCompanies } from "@/components/TopCompanies";
import { GainersLosers } from "@/components/GainersLosers";
import { MostActive } from "@/components/MostActive";
import { HiddenGems } from "@/components/HiddenGems";
import { CommoditiesSection } from "@/components/CommoditiesSection";
import { SentimentGauge } from "@/components/SentimentGauge";
import { SectorPerformance } from "@/components/SectorPerformance";
import { useT } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { GitCompare, ArrowRight, Gauge } from "lucide-react";

const Index = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <section className="mb-6 sm:mb-8 text-center px-2 sm:px-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {t("index.title")} <span className="text-primary">{t("index.titleHighlight")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5">{t("index.subtitle")}</p>
          <SearchBar />
        </section>
        <section className="mb-4 sm:mb-6"><MarketOverview /></section>

        {/* Market Pulse Row: Sentiment + Sectors + Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <SentimentGauge />
          <SectorPerformance />
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />Quick Actions
            </h3>
            <Link to="/sentiment" className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium">
              <Gauge className="h-4 w-4 text-primary" />Market Pulse
              <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
            </Link>
            <Link to="/compare" className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium">
              <GitCompare className="h-4 w-4 text-primary" />Stock Compare
              <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
            </Link>
            <Link to="/rankings" className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium">
              <ArrowRight className="h-4 w-4 text-primary" />Rankings
              <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* News + Top Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="lg:col-span-3"><MarketNewsSection limit={8} /></div>
          <div className="lg:col-span-2"><TopCompanies /></div>
        </div>

        <div className="mb-4 sm:mb-6"><CommoditiesSection /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <GainersLosers />
          <MostActive />
        </div>
        <HiddenGems />
      </main>
      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks · {t("index.footer")}
        </div>
      </footer>
    </div>
  );
};

export default Index;
