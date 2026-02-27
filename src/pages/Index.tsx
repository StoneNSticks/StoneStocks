import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketNewsSection } from "@/components/MarketNewsSection";
import { TopCompanies } from "@/components/TopCompanies";
import { GainersLosers } from "@/components/GainersLosers";
import { MostActive } from "@/components/MostActive";
import { HiddenGems } from "@/components/HiddenGems";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        {/* Hero Search */}
        <section className="mb-8 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Stock Market <span className="text-primary">Overview</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-5">
            Real-time quotes, news, and market data
          </p>
          <SearchBar />
        </section>

        {/* Market Indices Bar */}
        <section className="mb-6">
          <MarketOverview />
        </section>

        {/* Main two-column layout: News left, Top Companies right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3">
            <MarketNewsSection limit={8} />
          </div>
          <div className="lg:col-span-2">
            <TopCompanies />
          </div>
        </div>

        {/* Second row: Gainers/Losers + Most Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GainersLosers />
          <MostActive />
        </div>

        {/* Hidden Gems / AI Picks */}
        <HiddenGems />
      </main>

      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks · Data: Finnhub, Alpha Vantage, Twelve Data, Polygon, Eulerpool, SimFin
        </div>
      </footer>
    </div>
  );
};

export default Index;
