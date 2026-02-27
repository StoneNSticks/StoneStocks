import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { StockChart } from "@/components/StockChart";
import { MetricsGrid } from "@/components/MetricsGrid";
import { FinancialChart, extractFinancialSeries } from "@/components/FinancialChart";
import { NewsList } from "@/components/NewsList";
import { PeersList } from "@/components/PeersList";
import { RecommendationChart } from "@/components/RecommendationChart";
import { StockPerformance } from "@/components/StockPerformance";
import { DividendGrowth } from "@/components/DividendGrowth";
import { useFullStock } from "@/hooks/useStockData";
import { formatCurrency, formatPercent, priceChangeColor } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Globe } from "lucide-react";
import { useMemo } from "react";

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
  const massiveFinancials = data?.massiveFinancials;
  const massiveTicker = data?.massiveTicker;
  const massiveDividends = data?.massiveDividends;
  const massiveSnapshot = data?.massiveSnapshot;

  // Extract financial chart data
  const revenueData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "revenues", "income_statement"), [massiveFinancials]);
  const netIncomeData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "net_income_loss", "income_statement"), [massiveFinancials]);
  const opIncomeData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "operating_income_loss", "income_statement"), [massiveFinancials]);
  const ocfData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "net_cash_flow_from_operating_activities", "cash_flow_statement"), [massiveFinancials]);
  
  const capexData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials
      .filter((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined;
        return fin?.cash_flow_statement?.net_cash_flow_from_operating_activities?.value != null;
      })
      .map((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>;
        const ocf = Number(fin.cash_flow_statement.net_cash_flow_from_operating_activities?.value || 0);
        const capex = Math.abs(Number(fin.cash_flow_statement?.net_cash_flow_from_investing_activities?.value || 0));
        const fcf = ocf - capex;
        const period = f.fiscal_period as string;
        const year = f.fiscal_year as string;
        return { label: period ? `${period} ${year?.slice(-2)}` : "", value: fcf };
      })
      .reverse();
  }, [massiveFinancials]);

  const assetsData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials
      .filter((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined;
        return fin?.balance_sheet?.assets?.value != null;
      })
      .map((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>;
        const assets = Number(fin.balance_sheet.assets?.value || 0);
        const liabilities = Number(fin.balance_sheet.liabilities?.value || 0);
        const period = f.fiscal_period as string;
        const year = f.fiscal_year as string;
        return { label: period ? `${period} ${year?.slice(-2)}` : "", assets, liabilities };
      })
      .reverse();
  }, [massiveFinancials]);

  const companyName = profile?.name || overview?.Name || (massiveTicker?.name as string) || upperSymbol;
  const exchange = profile?.exchange || (massiveTicker?.primary_exchange as string) || "";
  const logoUrl = profile?.logo || (massiveTicker?.branding as Record<string, string>)?.icon_url;

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
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
            <Skeleton className="h-72 rounded-xl" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Failed to load data for {upperSymbol}.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Company Header */}
            <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-12 w-12 rounded-xl object-contain bg-background border border-border/60 p-1.5"
                />
              )}
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold">{companyName}</h1>
                <p className="text-sm text-muted-foreground">{exchange}: {upperSymbol}</p>
              </div>
              <div className="flex gap-2">
                {profile?.finnhubIndustry && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {profile.finnhubIndustry}
                  </span>
                )}
                {profile?.weburl && (
                  <a href={profile.weburl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="h-3 w-3" />
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <MetricsGrid
              overview={overview}
              quote={quote}
              derived={derived}
              profile={profile}
              massiveTicker={massiveTicker}
            />

            {/* Price Chart + Performance side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <StockChart symbol={upperSymbol} />
              </div>
              <StockPerformance quote={quote} overview={overview} massiveSnapshot={massiveSnapshot} />
            </div>

            {/* Financial Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FinancialChart title="Revenue" data={revenueData} dataKey="value" color="hsl(210, 80%, 55%)" />
              <FinancialChart title="Net Income" data={netIncomeData} dataKey="value" color="hsl(38, 92%, 50%)" />
              <FinancialChart title="Operating Income" data={opIncomeData} dataKey="value" color="hsl(25, 95%, 53%)" />
              <FinancialChart title="Free Cash Flow" data={capexData} dataKey="value" color="hsl(145, 63%, 42%)" />
              <FinancialChart title="Operating Cash Flow" data={ocfData} dataKey="value" color="hsl(80, 60%, 45%)" />
              <FinancialChart
                title="Assets & Liabilities"
                data={assetsData}
                dataKey="assets"
                secondaryKey="liabilities"
                secondaryLabel="Liabilities"
                color="hsl(210, 80%, 55%)"
                secondaryColor="hsl(0, 72%, 51%)"
              />
            </div>

            {/* Dividend Growth */}
            {massiveDividends && massiveDividends.length > 0 && (
              <DividendGrowth
                dividends={massiveDividends}
                dividendYield={derived?.dividendYield || 0}
              />
            )}

            {/* About */}
            {overview?.Description && (
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h3 className="font-display font-semibold text-sm text-muted-foreground mb-2">About</h3>
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
                  {overview.Description}
                </p>
              </div>
            )}

            {/* Two column layout: Recommendations + Peers */}
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
          © {new Date().getFullYear()} StoneStocks. Data by Alpha Vantage, Twelve Data, Finnhub & Massive.
        </div>
      </footer>
    </div>
  );
};

export default StockDetail;
