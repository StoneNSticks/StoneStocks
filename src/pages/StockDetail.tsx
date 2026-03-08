/**
 * StockDetail — The main stock analysis page.
 */
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WatchlistStar } from "@/components/WatchlistStar";
import { SearchBar } from "@/components/SearchBar";
import { StockChart } from "@/components/StockChart";
import { MetricsGrid } from "@/components/MetricsGrid";
import { FinancialChart, extractFinancialSeries } from "@/components/FinancialChart";
import { NewsList } from "@/components/NewsList";
import { PeersList } from "@/components/PeersList";
import { AnalystConsensus } from "@/components/AnalystConsensus";
import { StockPerformance } from "@/components/StockPerformance";
import { CompanyIntelligence } from "@/components/CompanyIntelligence";
import { WeekRangeBar } from "@/components/WeekRangeBar";
import { TechnicalIndicators } from "@/components/TechnicalIndicators";
import { EarningsCard } from "@/components/EarningsCard";
import { CommunitySection } from "@/components/CommunitySection";
import { InsiderTrades } from "@/components/InsiderTrades";
import { MetricBars } from "@/components/MetricBars";
import { PeerComparison } from "@/components/PeerComparison";
import { EarningsCalendar } from "@/components/EarningsCalendar";
import { SecFilings } from "@/components/SecFilings";
import { FairValue } from "@/components/FairValue";
import { DCFCalculator } from "@/components/DCFCalculator";
import { AIStockSummary } from "@/components/AIStockSummary";
// AdvancedAlertBuilder removed — integrated into PriceAlertForm bell icon
import { useFullStock } from "@/hooks/useStockData";
import { formatCurrency, formatPercent, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceAlertForm } from "@/components/PriceAlertForm";
import { DividendGrowth } from "@/components/DividendGrowth";
import { OptionsChainViewer } from "@/components/OptionsChainViewer";
import { ShortInterestCard } from "@/components/ShortInterestCard";
import { EarningsWhisper } from "@/components/EarningsWhisper";
import { Building2, Globe, ChevronRight, Home } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { useMemo } from "react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useQuery } from "@tanstack/react-query";
import { getEarnings } from "@/lib/stockApi";

/**
 * EarningsCardWrapper — Fetches historical earnings data separately.
 * The main useFullStock doesn't include detailed earnings history,
 * so this component fetches it independently.
 */
function EarningsCardWrapper({ symbol }: { symbol: string }) {
  const { data: earnings } = useQuery({
    queryKey: ["earnings", symbol],
    queryFn: () => getEarnings(symbol),
    enabled: !!symbol,
    staleTime: 1000 * 60 * 60 * 24 * 7, // Cache for 7 days — earnings don't change often
  });
  return <EarningsCard earnings={earnings} />;
}

const StockDetail = () => {
  // ── URL parameter: get the stock symbol from the URL ──
  const { symbol } = useParams<{ symbol: string }>();
  const upperSymbol = symbol?.toUpperCase() || "";

  // ── Fetch ALL data about this stock in one call ──
  // useFullStock combines: profile, quote, overview, news, peers,
  // recommendation, financials, ticker details, dividends, snapshot
  const { data, isLoading, error } = useFullStock(upperSymbol);
  const t = useT();
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();
  const profileName = data?.profile?.name;
  usePageTitle(
    profileName ? `${profileName} (${upperSymbol})` : upperSymbol,
    profileName ? `${profileName} stock price, charts, financials and analysis` : undefined
  );

  // ── Currency-aware formatter for small values (EPS, dividends) ──
  const formatDividendValue = (num: number): string => {
    const converted = convert(num) ?? num;
    return `${cSym}${converted.toFixed(2)}`;
  };

  // ── Destructure all data sources from the API response ──
  const profile = data?.profile;           // Company info: name, logo, industry, website
  const quote = data?.quote;               // Current price, change, volume
  const overview = data?.overview;         // Fundamentals: P/E, market cap, EPS, etc.
  const derived = data?.derived;           // Computed metrics: calculated P/E, FCF yield, etc.
  const news = data?.news;                 // Recent news articles about this company
  const peers = data?.peers;               // Related/similar stock symbols
  const recommendation = data?.recommendation; // Analyst buy/sell recommendations
  const massiveFinancials = data?.massiveFinancials; // Quarterly financial statements
  const massiveTicker = data?.massiveTicker;         // Detailed ticker info from Polygon
  const massiveDividends = data?.massiveDividends;   // Historical dividend payments
  const massiveSnapshot = data?.massiveSnapshot;     // Latest snapshot from Polygon
  const massiveRelated = data?.massiveRelated;       // Related companies from Polygon

  // ── FINANCIAL DATA EXTRACTION ──
  // These useMemo calls extract specific financial metrics from quarterly reports
  // Each creates an array of {label: "Q1 24", value: 123456789} for chart display

  // Revenue: Total sales income (top line of income statement)
  const revenueData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "revenues", "income_statement"), [massiveFinancials]);

  // Net Income: Bottom-line profit after all expenses and taxes
  const netIncomeData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "net_income_loss", "income_statement"), [massiveFinancials]);

  // Operating Income: Profit from core business operations (before interest/taxes)
  const opIncomeData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "operating_income_loss", "income_statement"), [massiveFinancials]);

  // Operating Cash Flow: Actual cash generated from business operations
  const ocfData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "net_cash_flow_from_operating_activities", "cash_flow_statement"), [massiveFinancials]);

  // Gross Profit: Revenue minus cost of goods sold
  const grossProfitData = useMemo(() => extractFinancialSeries(massiveFinancials || [], "gross_profit", "income_statement"), [massiveFinancials]);

  // EBITDA: Earnings Before Interest, Taxes, Depreciation & Amortization
  // A measure of profitability that ignores accounting choices
  const ebitdaData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials.filter((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined; return fin?.income_statement?.operating_income_loss?.value != null; }).map((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>; const opIncome = Number(fin.income_statement.operating_income_loss?.value || 0); const dna = Number(fin.cash_flow_statement?.depreciation_and_amortization?.value || 0); const period = f.fiscal_period as string; const year = f.fiscal_year as string; return { label: period ? `${period} ${year?.slice(-2)}` : "", value: opIncome + Math.abs(dna) }; }).reverse();
  }, [massiveFinancials]);

  // Free Cash Flow: Operating cash flow minus capital expenditures
  // Shows how much cash the company generates after investing in itself
  const capexData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials.filter((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined; return fin?.cash_flow_statement?.net_cash_flow_from_operating_activities?.value != null; }).map((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>; const ocf = Number(fin.cash_flow_statement.net_cash_flow_from_operating_activities?.value || 0); const capex = Math.abs(Number(fin.cash_flow_statement?.net_cash_flow_from_investing_activities?.value || 0)); const fcf = ocf - capex; const period = f.fiscal_period as string; const year = f.fiscal_year as string; return { label: period ? `${period} ${year?.slice(-2)}` : "", value: fcf }; }).reverse();
  }, [massiveFinancials]);

  // Assets vs Liabilities: Shows what the company owns vs what it owes
  const assetsData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials.filter((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined; return fin?.balance_sheet?.assets?.value != null; }).map((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>; const assets = Number(fin.balance_sheet.assets?.value || 0); const liabilities = Number(fin.balance_sheet.liabilities?.value || 0); const period = f.fiscal_period as string; const year = f.fiscal_year as string; return { label: period ? `${period} ${year?.slice(-2)}` : "", assets, liabilities }; }).reverse();
  }, [massiveFinancials]);

  // Dividend per share: Annual dividend payments aggregated by year
  const dividendData = useMemo(() => {
    if (!massiveDividends || !Array.isArray(massiveDividends) || massiveDividends.length === 0) return [];
    const byYear: Record<string, number> = {};
    massiveDividends.forEach((d: any) => { const year = (d.pay_date || d.ex_dividend_date || "")?.slice(0, 4); if (year) byYear[year] = (byYear[year] || 0) + Number(d.cash_amount || 0); });
    return Object.entries(byYear).sort(([a], [b]) => a.localeCompare(b)).map(([year, total]) => ({ label: year, value: Math.round(total * 100) / 100 }));
  }, [massiveDividends]);

  // EPS (Earnings Per Share): Profit divided by shares outstanding
  // Higher EPS = more profitable per share
  const epsData = useMemo(() => {
    if (!massiveFinancials || !Array.isArray(massiveFinancials)) return [];
    return massiveFinancials.filter((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined; return fin?.income_statement?.basic_earnings_per_share?.value != null || fin?.income_statement?.diluted_earnings_per_share?.value != null; }).map((f: Record<string, unknown>) => { const fin = f.financials as Record<string, Record<string, Record<string, unknown>>>; const eps = Number(fin.income_statement.diluted_earnings_per_share?.value || fin.income_statement.basic_earnings_per_share?.value || 0); const period = f.fiscal_period as string; const year = f.fiscal_year as string; return { label: period ? `${period} ${year?.slice(-2)}` : "", value: eps }; }).reverse();
  }, [massiveFinancials]);

  // ── Company display info ──
  const companyName = profile?.name || overview?.Name || (massiveTicker?.name as string) || upperSymbol;
  const exchange = profile?.exchange || (massiveTicker?.primary_exchange as string) || "";
  const logoUrl = profile?.logo || (massiveTicker?.branding as Record<string, string>)?.icon_url;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-8 px-3 sm:px-4 lg:px-8">
        {/* ── Breadcrumb navigation: Markets > AAPL ── */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1"><Home className="h-3 w-3" />{t("nav.markets")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{upperSymbol}</span>
        </nav>

        {/* ── Search bar ── */}
        <div className="mb-6"><SearchBar /></div>

        {/* ── Loading state: show skeleton placeholders while data loads ── */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 rounded-xl" />
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
            <Skeleton className="h-72 rounded-xl" />
          </div>
        ) : error ? (
          /* ── Error state: show message if data failed to load ── */
          <div className="text-center py-20"><p className="text-muted-foreground">{t("sd.failedToLoad")} {upperSymbol}.</p></div>
        ) : (
          <div className="space-y-4 sm:space-y-5">

            {/* ══════════════════════════════════════════════════════════
                SECTION 1: Company Header Card
                Shows: logo, name, exchange, industry badge, website link
                ══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {logoUrl && <img src={logoUrl} alt={companyName} className="h-12 w-12 rounded-xl object-contain bg-background border border-border/60 p-1.5 flex-shrink-0" loading="lazy" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-xl sm:text-2xl font-bold truncate">{companyName}</h1>
                    <WatchlistStar symbol={upperSymbol} />
                    <PriceAlertForm symbol={upperSymbol} currentPrice={quote?.c} />
                    <ShareButton title={`${companyName} (${upperSymbol}) — StoneStocks`} text={`Check out ${companyName} on StoneStocks`} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{exchange}: {upperSymbol}</span>
                    {overview?.PERatio && parseFloat(overview.PERatio) > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs font-medium">
                        KGV <span className="text-foreground font-semibold">{parseFloat(overview.PERatio).toFixed(1)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.finnhubIndustry && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground"><Building2 className="h-3 w-3" />{profile.finnhubIndustry}</span>
                )}
                {profile?.weburl && (
                  <a href={profile.weburl as string} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs text-muted-foreground hover:text-primary transition-colors"><Globe className="h-3 w-3" />{t("sd.website")}</a>
                )}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                SECTION 2: Key Metrics Grid
                Shows: Price, Market Cap, P/E, EPS, Dividend Yield, etc.
                ══════════════════════════════════════════════════════════ */}
            <MetricsGrid overview={overview} quote={quote} derived={derived} profile={profile} massiveTicker={massiveTicker} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 3: 52-Week Range Bar
                Shows where the current price sits between yearly low and high
                ══════════════════════════════════════════════════════════ */}
            {overview?.["52WeekHigh"] && overview?.["52WeekLow"] && quote?.c && (
              <WeekRangeBar low52={Number(overview["52WeekLow"])} high52={Number(overview["52WeekHigh"])} current={quote.c} />
            )}

            {/* ══════════════════════════════════════════════════════════
                SECTION 4: Metric Range Bars
                Visual bars for P/E, RSI, Operating Margin vs typical ranges
                ══════════════════════════════════════════════════════════ */}
            <MetricBars overview={overview} quote={quote} derived={derived} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 5: Price Chart + Performance Summary
                Left: Interactive price chart (1D, 1W, 1M, 3M, 1Y, 5Y)
                Right: Day range, 52-week range, beta, analyst target price
                ══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2"><StockChart symbol={upperSymbol} /></div>
              <StockPerformance quote={quote} overview={overview} massiveSnapshot={massiveSnapshot} />
            </div>

            {/* Analyst Consensus moved to after Company Intelligence */}

            {/* Advanced Alerts now integrated into PriceAlertForm bell icon */}

            {/* ══════════════════════════════════════════════════════════
                SECTION 6b: Fair Value Estimate + DCF Calculator
                Multiple valuation methods + interactive DCF with sensitivity
                ══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              <FairValue quote={quote} overview={overview} derived={derived} recommendation={recommendation} />
              <DCFCalculator overview={overview} quote={quote} derived={derived} />
            </div>

            {/* ══════════════════════════════════════════════════════════
                SECTION 7: Financial Charts (10 charts)
                Each shows quarterly data from financial statements:
                - Revenue, Gross Profit, Net Income, Operating Income
                - EBITDA, Free Cash Flow, Operating Cash Flow
                - EPS, Dividend per Share, Assets vs Liabilities
                ══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-hidden">
              <FinancialChart title={t("sd.revenue")} data={revenueData} dataKey="value" color="hsl(210, 80%, 55%)" />
              <FinancialChart title={t("sd.grossProfit")} data={grossProfitData} dataKey="value" color="hsl(280, 65%, 55%)" />
              <FinancialChart title={t("sd.netIncome")} data={netIncomeData} dataKey="value" color="hsl(38, 92%, 50%)" />
              <FinancialChart title={t("sd.operatingIncome")} data={opIncomeData} dataKey="value" color="hsl(25, 95%, 53%)" />
              <FinancialChart title={t("sd.ebitda")} data={ebitdaData} dataKey="value" color="hsl(190, 70%, 45%)" />
              <FinancialChart title={t("sd.freeCashFlow")} data={capexData} dataKey="value" color="hsl(145, 63%, 42%)" />
              <FinancialChart title={t("sd.operatingCashFlow")} data={ocfData} dataKey="value" color="hsl(80, 60%, 45%)" />
              <FinancialChart title={t("sd.epsDiluted")} data={epsData} dataKey="value" color="hsl(330, 65%, 50%)" formatValue={formatDividendValue} />
              <FinancialChart title={t("sd.dividendPerShare")} data={dividendData} dataKey="value" color="hsl(145, 63%, 42%)" formatValue={formatDividendValue} badge={derived?.dividendYield && derived.dividendYield > 0 ? `${derived.dividendYield.toFixed(2)}% ${t("div.yield")}` : undefined} badgeColor="hsl(145, 63%, 42%)" />
              <FinancialChart title={t("sd.assetsLiabilities")} data={assetsData} dataKey="assets" secondaryKey="liabilities" secondaryLabel={t("sd.liabilities")} color="hsl(210, 80%, 55%)" secondaryColor="hsl(0, 72%, 51%)" />
            </div>

            {/* ══════════════════════════════════════════════════════════
                SECTION 7b: AI-Powered Stock Summary
                ══════════════════════════════════════════════════════════ */}
            <AIStockSummary symbol={upperSymbol} profile={profile} quote={quote} overview={overview} derived={derived} recommendation={recommendation} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 8: Company Intelligence
                Deep analysis: products/services, risk score, market position,
                key business relationships, geographic presence
                ══════════════════════════════════════════════════════════ */}
            <CompanyIntelligence
              profile={profile}
              overview={overview}
              massiveTicker={massiveTicker}
              peers={peers}
              massiveRelated={massiveRelated}
              currentSymbol={upperSymbol}
            />

            {/* Analyst Consensus — directly under Company Intelligence */}
            <AnalystConsensus recommendation={recommendation} overview={overview} quote={quote} />


            {/* ══════════════════════════════════════════════════════════
                SECTION 10: Technical Indicators + Earnings History
                Left: RSI, SMA, EMA, MACD and other technicals
                Right: Historical EPS (actual vs estimated) per quarter
                ══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <TechnicalIndicators symbol={upperSymbol} />
              <EarningsCardWrapper symbol={upperSymbol} />
            </div>

            {/* ══════════════════════════════════════════════════════════
                SECTION 11: Earnings Calendar (Compact Mode)
                Shows upcoming quarterly report dates for this stock
                ══════════════════════════════════════════════════════════ */}
            <EarningsCalendar symbols={[upperSymbol]} compact />

            {/* Short Interest + Earnings Whisper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <ShortInterestCard symbol={upperSymbol} />
              <EarningsWhisper symbol={upperSymbol} />
            </div>

            {/* Options Chain */}
            <OptionsChainViewer symbol={upperSymbol} currentPrice={quote?.c} />

            {/* Insider Trades */}
            <InsiderTrades symbol={upperSymbol} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 12b: SEC Filings
                Recent 10-K, 10-Q, 8-K filings from SEC EDGAR
                ══════════════════════════════════════════════════════════ */}
            <SecFilings symbol={upperSymbol} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 13: Community: Sentiment Vote + Threaded Comments
                ══════════════════════════════════════════════════════════ */}
            <CommunitySection symbol={upperSymbol} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 14: Similar Stocks List
                Clickable links to related companies
                ══════════════════════════════════════════════════════════ */}
            <PeersList peers={peers} currentSymbol={upperSymbol} />

            {/* ══════════════════════════════════════════════════════════
                SECTION 15: Dividend Growth Chart
                Annual dividend history with CAGR and 5-year forecast
                Only shown for stocks that pay dividends
                ══════════════════════════════════════════════════════════ */}
            {massiveDividends && massiveDividends.length > 0 && (
              <DividendGrowth dividends={massiveDividends} dividendYield={derived?.dividendYield || 0} />
            )}

            {/* ══════════════════════════════════════════════════════════
                SECTION 16: News Articles
                Recent news articles about this company
                ══════════════════════════════════════════════════════════ */}
            <NewsList news={news} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default StockDetail;
