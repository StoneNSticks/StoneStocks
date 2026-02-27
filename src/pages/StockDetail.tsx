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
import { CompanyInfoCard } from "@/components/CompanyInfoCard";
import { useFullStock } from "@/hooks/useStockData";
import { formatCurrency, formatPercent, priceChangeColor } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Globe } from "lucide-react";
import { useMemo } from "react";

function formatDividendValue(num: number): string {
  return `$${num.toFixed(2)}`;
}

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
  
  const grossProfitData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "gross_profit", "income_statement"), [massiveFinancials]);
  
  const ebitdaData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials
      .filter((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined;
        return fin?.income_statement?.operating_income_loss?.value != null;
      })
      .map((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>;
        const opIncome = Number(fin.income_statement.operating_income_loss?.value || 0);
        const dna = Number(fin.cash_flow_statement?.depreciation_and_amortization?.value || 0);
        const period = f.fiscal_period as string;
        const year = f.fiscal_year as string;
        return { label: period ? `${period} ${year?.slice(-2)}` : "", value: opIncome + Math.abs(dna) };
      })
      .reverse();
  }, [massiveFinancials]);

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

  // Dividend growth as chart data
  const dividendData = useMemo(() => {
    if (!massiveDividends || !Array.isArray(massiveDividends) || massiveDividends.length === 0) return [];
    const byYear: Record<string, number> = {};
    massiveDividends.forEach((d: any) => {
      const year = (d.pay_date || d.ex_dividend_date || "")?.slice(0, 4);
      if (year) byYear[year] = (byYear[year] || 0) + Number(d.cash_amount || 0);
    });
    return Object.entries(byYear)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, total]) => ({ label: year, value: Math.round(total * 100) / 100 }));
  }, [massiveDividends]);

  // EPS data from overview
  const epsData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials
      .filter((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined;
        return fin?.income_statement?.basic_earnings_per_share?.value != null || fin?.income_statement?.diluted_earnings_per_share?.value != null;
      })
      .map((f: Record<string, unknown>) => {
        const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>;
        const eps = Number(fin.income_statement.diluted_earnings_per_share?.value || fin.income_statement.basic_earnings_per_share?.value || 0);
        const period = f.fiscal_period as string;
        const year = f.fiscal_year as string;
        return { label: period ? `${period} ${year?.slice(-2)}` : "", value: eps };
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={companyName}
                    className="h-12 w-12 rounded-xl object-contain bg-background border border-border/60 p-1.5 flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-bold truncate">{companyName}</h1>
                  <p className="text-sm text-muted-foreground">{exchange}: {upperSymbol}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.finnhubIndustry && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {profile.finnhubIndustry}
                  </span>
                )}
                {profile?.weburl && (
                  <a href={profile.weburl as string} target="_blank" rel="noopener noreferrer"
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
              <FinancialChart title="Gross Profit" data={grossProfitData} dataKey="value" color="hsl(280, 65%, 55%)" />
              <FinancialChart title="Net Income" data={netIncomeData} dataKey="value" color="hsl(38, 92%, 50%)" />
              <FinancialChart title="Operating Income" data={opIncomeData} dataKey="value" color="hsl(25, 95%, 53%)" />
              <FinancialChart title="EBITDA" data={ebitdaData} dataKey="value" color="hsl(190, 70%, 45%)" />
              <FinancialChart title="Free Cash Flow" data={capexData} dataKey="value" color="hsl(145, 63%, 42%)" />
              <FinancialChart title="Operating Cash Flow" data={ocfData} dataKey="value" color="hsl(80, 60%, 45%)" />
              <FinancialChart title="EPS (Diluted)" data={epsData} dataKey="value" color="hsl(330, 65%, 50%)" formatValue={formatDividendValue} />
              <FinancialChart
                title="Dividend per Share"
                data={dividendData}
                dataKey="value"
                color="hsl(145, 63%, 42%)"
                formatValue={formatDividendValue}
                badge={derived?.dividendYield && derived.dividendYield > 0 ? `${derived.dividendYield.toFixed(2)}% Yield` : undefined}
                badgeColor="hsl(145, 63%, 42%)"
              />
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

            {/* Company Info Card (like Eulerpool) */}
            <CompanyInfoCard
              profile={profile}
              overview={overview}
              massiveTicker={massiveTicker}
              symbol={upperSymbol}
            />

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
