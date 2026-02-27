import { Header } from "@/components/Header";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketNewsSection } from "@/components/MarketNewsSection";
import { TopCompanies } from "@/components/TopCompanies";
import { GainersLosers } from "@/components/GainersLosers";
import { MostActive } from "@/components/MostActive";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GainersLosers />
          <MostActive />
        </div>
      </main>

      <footer className="border-t border-border/50 py-6 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks · Data: Finnhub, Alpha Vantage, Twelve Data, Polygon
        </div>
      </footer>
    </div>
  );
};

export default Index;
