import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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

        {/* Sentiment + Market Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="md:col-span-3"><SentimentGauge /></div>
          <div className="md:col-span-2"><SectorPerformance /></div>
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
      <Footer />
    </div>
  );
};

export default Index;
