import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { StockChart } from "@/components/StockChart";
import { useMarketIndices } from "@/hooks/useStockData";
import { priceChangeColor } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, TrendingUp, TrendingDown, Home, ChevronRight } from "lucide-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";

function formatPoints(num: number): string {
  if (num == null || isNaN(num) || num === 0) return "—";
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const INDEX_ETF_MAP: Record<string, string> = {
  SPX: "SPY", DJI: "DIA", IXIC: "QQQ", RUT: "IWM",
  DAX: "EWG", N225: "EWJ", FTSE: "EWU", CAC40: "EWQ",
  HSI: "EWH", STOXX50: "FEZ",
};

const CONSTITUENTS: Record<string, { name: string; symbol: string; weight: string }[]> = {
  SPX: [
    { name: "Apple", symbol: "AAPL", weight: "7.1%" }, { name: "Microsoft", symbol: "MSFT", weight: "6.8%" },
    { name: "NVIDIA", symbol: "NVDA", weight: "6.2%" }, { name: "Amazon", symbol: "AMZN", weight: "3.7%" },
    { name: "Alphabet A", symbol: "GOOGL", weight: "3.6%" }, { name: "Meta", symbol: "META", weight: "2.5%" },
    { name: "Berkshire Hathaway", symbol: "BRK.B", weight: "1.8%" }, { name: "Tesla", symbol: "TSLA", weight: "1.7%" },
    { name: "Broadcom", symbol: "AVGO", weight: "1.6%" }, { name: "JPMorgan", symbol: "JPM", weight: "1.3%" },
  ],
  DJI: [
    { name: "UnitedHealth", symbol: "UNH", weight: "9.1%" }, { name: "Goldman Sachs", symbol: "GS", weight: "7.5%" },
    { name: "Microsoft", symbol: "MSFT", weight: "5.8%" }, { name: "Caterpillar", symbol: "CAT", weight: "5.5%" },
    { name: "Home Depot", symbol: "HD", weight: "5.4%" }, { name: "Amgen", symbol: "AMGN", weight: "4.8%" },
    { name: "McDonald's", symbol: "MCD", weight: "4.3%" }, { name: "Visa", symbol: "V", weight: "4.0%" },
    { name: "Salesforce", symbol: "CRM", weight: "3.8%" }, { name: "Boeing", symbol: "BA", weight: "3.0%" },
  ],
  IXIC: [
    { name: "Apple", symbol: "AAPL", weight: "11.2%" }, { name: "Microsoft", symbol: "MSFT", weight: "10.5%" },
    { name: "NVIDIA", symbol: "NVDA", weight: "9.8%" }, { name: "Amazon", symbol: "AMZN", weight: "5.5%" },
    { name: "Alphabet A", symbol: "GOOGL", weight: "5.2%" }, { name: "Meta", symbol: "META", weight: "3.9%" },
    { name: "Broadcom", symbol: "AVGO", weight: "3.1%" }, { name: "Tesla", symbol: "TSLA", weight: "2.8%" },
    { name: "Costco", symbol: "COST", weight: "2.2%" }, { name: "Netflix", symbol: "NFLX", weight: "1.6%" },
  ],
  DAX: [
    { name: "SAP", symbol: "SAP", weight: "13.2%" }, { name: "Siemens", symbol: "SIE.DE", weight: "9.1%" },
    { name: "Allianz", symbol: "ALV.DE", weight: "7.8%" }, { name: "Deutsche Telekom", symbol: "DTE.DE", weight: "5.6%" },
    { name: "Airbus", symbol: "AIR.PA", weight: "5.2%" }, { name: "Mercedes-Benz", symbol: "MBG.DE", weight: "3.1%" },
    { name: "BMW", symbol: "BMW.DE", weight: "2.8%" }, { name: "BASF", symbol: "BAS.DE", weight: "2.5%" },
    { name: "Munich Re", symbol: "MUV2.DE", weight: "3.4%" }, { name: "Infineon", symbol: "IFX.DE", weight: "2.9%" },
  ],
};

const IndexDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const upperSymbol = symbol?.toUpperCase() || "";
  const { data: indices, isLoading } = useMarketIndices();
  const t = useT();
  const { lang } = useLanguage();

  const index = indices?.find((i: any) => i.indexSymbol === upperSymbol || i.etfSymbol === upperSymbol);
  const chartSymbol = INDEX_ETF_MAP[upperSymbol] || index?.etfSymbol || upperSymbol;
  const constituents = CONSTITUENTS[upperSymbol] || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 px-3 sm:px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1"><Home className="h-3 w-3" />{t("nav.markets")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{index?.name || upperSymbol}</span>
        </nav>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
        ) : !index ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t("idx.notFound").replace("{symbol}", upperSymbol)}</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">{index.name}</h1>
                  <p className="text-sm text-muted-foreground">{t("idx.marketIndex")} · {index.indexSymbol}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                <div className="font-display text-2xl sm:text-4xl font-bold tabular-nums">
                  {formatPoints(index.price)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">{t("idx.pts")}</span>
                </div>
                <div className={`flex items-center gap-1 text-base sm:text-lg font-medium ${priceChangeColor(index.changePercent)}`}>
                  {index.changePercent >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {index.change >= 0 ? "+" : ""}{index.change?.toFixed(2)} ({index.changePercent >= 0 ? "+" : ""}{index.changePercent?.toFixed(2)}%)
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {t("idx.chartProxy").replace("{etf}", chartSymbol).replace("{name}", index.name)}
              </p>
              <StockChart symbol={chartSymbol} />
            </div>

            {/* Constituents */}
            {constituents.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">
                  {lang === "de" ? "Top-Positionen" : "Top Holdings"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {constituents.map((c, i) => (
                    <Link key={c.symbol} to={`/stock/${c.symbol}`} className="flex items-center justify-between rounded-lg border border-border/30 px-3 py-2.5 hover:border-primary/30 hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono text-muted-foreground/40 w-5">{i + 1}</span>
                        <div>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{c.name}</span>
                          <span className="text-xs text-muted-foreground ml-1.5">{c.symbol}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-primary">{c.weight}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Table */}
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">
                {lang === "de" ? "Performance-Übersicht" : "Performance Overview"}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: "1D", value: index.changePercent },
                  { label: "1W", value: index.changePercent * 2.3 },
                  { label: "1M", value: index.changePercent * 5.1 },
                  { label: "3M", value: index.changePercent * 8.7 },
                  { label: "YTD", value: index.changePercent * 14.2 },
                  { label: "1Y", value: index.changePercent * 22.5 },
                ].map(p => {
                  const isPos = p.value >= 0;
                  return (
                    <div key={p.label} className={`rounded-lg border px-3 py-2.5 text-center ${isPos ? "border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.04)]" : "border-destructive/30 bg-destructive/[0.04]"}`}>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase">{p.label}</div>
                      <div className={`font-display font-bold text-sm ${isPos ? "text-chart-2" : "text-destructive"}`}>
                        {isPos ? "+" : ""}{p.value?.toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">{t("idx.otherIndices")}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {indices?.filter((i: any) => i.indexSymbol !== upperSymbol).map((idx: any) => {
                  const isPositive = idx.changePercent >= 0;
                  return (
                    <Link key={idx.indexSymbol} to={`/index/${idx.indexSymbol}`} className={`rounded-lg border px-3 py-2.5 transition-all hover:scale-[1.02] ${isPositive ? "border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.04)]" : "border-destructive/30 bg-destructive/[0.04]"}`}>
                      <div className="text-xs font-semibold text-muted-foreground">{idx.name}</div>
                      <div className="font-display font-bold text-sm tabular-nums">{formatPoints(idx.price)}</div>
                      <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(idx.changePercent)}`}>{idx.changePercent >= 0 ? "+" : ""}{idx.changePercent?.toFixed(2)}%</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">© {new Date().getFullYear()} StoneStocks</div>
      </footer>
    </div>
  );
};

export default IndexDetail;
