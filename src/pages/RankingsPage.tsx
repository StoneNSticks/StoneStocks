import { Header } from "@/components/Header";
import { TopCompanies } from "@/components/TopCompanies";
import { GainersLosers } from "@/components/GainersLosers";
import { MostActive } from "@/components/MostActive";
import { MarketOverview } from "@/components/MarketOverview";

const RankingsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <section className="mb-4 sm:mb-6">
          <MarketOverview />
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <TopCompanies />
          <GainersLosers />
        </div>
        <MostActive />
      </main>
    </div>
  );
};

export default RankingsPage;
