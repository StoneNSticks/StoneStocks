import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketNewsSection } from "@/components/MarketNewsSection";
import { TopCompanies } from "@/components/TopCompanies";
import { GainersLosers } from "@/components/GainersLosers";
import { MostActive } from "@/components/MostActive";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero + Search */}
        <section className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Market <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
            Real-time data, fundamentals & analytics for every stock.
          </p>
          <SearchBar />
        </section>

        {/* Market Indices Bar */}
        <section className="mb-8">
          <MarketOverview />
        </section>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column - News */}
          <div className="lg:col-span-3 space-y-6">
            <MarketNewsSection />
          </div>

          {/* Right column - Top Companies */}
          <div className="lg:col-span-2 space-y-6">
            <TopCompanies />
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <GainersLosers />
          <MostActive />
        </div>
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks. Data provided by Alpha Vantage, Twelve Data, Finnhub & Polygon.
        </div>
      </footer>
    </div>
  );
};

export default Index;
