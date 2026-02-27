import { Header } from "@/components/Header";
import { MarketNewsSection } from "@/components/MarketNewsSection";
import { MarketOverview } from "@/components/MarketOverview";

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <section className="mb-6">
          <MarketOverview />
        </section>
        <div className="max-w-4xl">
          <MarketNewsSection limit={25} />
        </div>
      </main>
    </div>
  );
};

export default NewsPage;
