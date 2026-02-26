import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { MarketOverview } from "@/components/MarketOverview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <section className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Market <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            Real-time data, fundamentals & analytics for every stock.
          </p>
          <SearchBar />
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-4">Market Overview</h2>
          <MarketOverview />
        </section>
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks. Data provided by Alpha Vantage, Twelve Data & Finnhub.
        </div>
      </footer>
    </div>
  );
};

export default Index;
