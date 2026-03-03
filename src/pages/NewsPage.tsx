import { Header } from "@/components/Header";
import { MarketNewsSection } from "@/components/MarketNewsSection";
import { MarketOverview } from "@/components/MarketOverview";

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <section className="mb-4 sm:mb-6">
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
