import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { StockChart } from "@/components/StockChart";
import { useMarketIndices } from "@/hooks/useStockData";
import { priceChangeColor } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";

function formatPoints(num: number): string {
  if (num == null || isNaN(num) || num === 0) return "—";
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Map index symbols to ETFs that have chart data
const INDEX_ETF_MAP: Record<string, string> = {
  SPX: "SPY", DJI: "DIA", IXIC: "QQQ", RUT: "IWM",
  GDAXI: "EWG", N225: "EWJ", FTSE: "EWU",
};

const IndexDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const upperSymbol = symbol?.toUpperCase() || "";
  const { data: indices, isLoading } = useMarketIndices();

  const index = indices?.find((i: any) => i.indexSymbol === upperSymbol || i.etfSymbol === upperSymbol);
  const chartSymbol = INDEX_ETF_MAP[upperSymbol] || index?.etfSymbol || upperSymbol;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Overview
        </Link>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
        ) : !index ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Index {upperSymbol} not found.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Index Header */}
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">{index.name}</h1>
                  <p className="text-sm text-muted-foreground">Market Index · {index.indexSymbol}</p>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="font-display text-4xl font-bold tabular-nums">
                  {formatPoints(index.price)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">pts</span>
                </div>
                <div className={`flex items-center gap-1 text-lg font-medium ${priceChangeColor(index.changePercent)}`}>
                  {index.changePercent >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {index.change >= 0 ? "+" : ""}{index.change?.toFixed(2)} ({index.changePercent >= 0 ? "+" : ""}{index.changePercent?.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Chart (using ETF proxy) */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Chart shows {chartSymbol} ETF as proxy for {index.name} performance
              </p>
              <StockChart symbol={chartSymbol} />
            </div>

            {/* Other Indices */}
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">Other Market Indices</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {indices?.filter((i: any) => i.indexSymbol !== upperSymbol).map((idx: any) => {
                  const isPositive = idx.changePercent >= 0;
                  return (
                    <Link
                      key={idx.indexSymbol}
                      to={`/index/${idx.indexSymbol}`}
                      className={`rounded-lg border px-3 py-2.5 transition-all hover:scale-[1.02] ${
                        isPositive
                          ? "border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.04)]"
                          : "border-destructive/30 bg-destructive/[0.04]"
                      }`}
                    >
                      <div className="text-xs font-semibold text-muted-foreground">{idx.name}</div>
                      <div className="font-display font-bold text-sm tabular-nums">{formatPoints(idx.price)}</div>
                      <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(idx.changePercent)}`}>
                        {idx.changePercent >= 0 ? "+" : ""}{idx.changePercent?.toFixed(2)}%
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} StoneStocks. Data by Finnhub, Twelve Data & Polygon.
        </div>
      </footer>
    </div>
  );
};

export default IndexDetail;
