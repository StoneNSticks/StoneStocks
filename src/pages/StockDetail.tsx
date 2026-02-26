import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { StockChart } from "@/components/StockChart";
import { KeyMetrics } from "@/components/KeyMetrics";
import { NewsList } from "@/components/NewsList";
import { PeersList } from "@/components/PeersList";
import { RecommendationChart } from "@/components/RecommendationChart";
import { useFullStock } from "@/hooks/useStockData";
import { formatCurrency, formatPercent, priceChangeColor } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Globe, MapPin } from "lucide-react";

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const upperSymbol = symbol?.toUpperCase() || "";
  const { data, isLoading, error } = useFullStock(upperSymbol);

  const profile = data?.profile;
  const quote = data?.quote;
  const overview = data?.overview;
  const derived = data?.derived;
  const news = data?.news;
  const peers = data?.peers;
  const recommendation = data?.recommendation;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-6">
          <SearchBar />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Failed to load data for {upperSymbol}.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                {profile?.logo && (
                  <img
                    src={profile.logo}
                    alt={profile.name}
                    className="h-12 w-12 rounded-xl object-contain bg-card border border-border/60 p-1.5"
                  />
                )}
                <div>
                  <div className="flex items-baseline gap-2">
                    <h1 className="font-display text-3xl font-bold">{upperSymbol}</h1>
                    <span className="text-sm text-muted-foreground">{profile?.exchange}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile?.name || overview?.Name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-bold">
                  {formatCurrency(quote?.c)}
                </div>
                <div className={`text-sm font-medium ${priceChangeColor(quote?.d)}`}>
                  {formatCurrency(quote?.d)} ({formatPercent(quote?.dp)})
                </div>
              </div>
            </div>

            {/* Company info chips */}
            {(profile?.finnhubIndustry || profile?.country || profile?.weburl) && (
              <div className="flex flex-wrap gap-2">
                {profile.finnhubIndustry && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {profile.finnhubIndustry}
                  </span>
                )}
                {profile.country && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {profile.country}
                  </span>
                )}
                {profile.weburl && (
                  <a
                    href={profile.weburl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    Website
                  </a>
                )}
              </div>
            )}

            {/* Description */}
            {overview?.Description && (
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h3 className="font-display font-semibold text-sm text-muted-foreground mb-2">About</h3>
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
                  {overview.Description}
                </p>
              </div>
            )}

            {/* Chart */}
            <StockChart symbol={upperSymbol} />

            {/* Key Metrics */}
            <KeyMetrics overview={overview} quote={quote} derived={derived} />

            {/* Two column layout */}
            <div className="grid md:grid-cols-2 gap-5">
              <RecommendationChart data={recommendation} />
              <PeersList peers={peers} currentSymbol={upperSymbol} />
            </div>

            {/* News */}
            <NewsList news={news} />
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks. Data provided by Alpha Vantage, Twelve Data & Finnhub.
        </div>
      </footer>
    </div>
  );
};

export default StockDetail;
