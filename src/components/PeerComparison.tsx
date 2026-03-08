/**
 * PeerComparison — Side-by-side comparison table of current stock vs top peers.
 * 
 * HOW IT WORKS:
 * - Fetches overview and quote data for the current stock + up to 3 peers
 * - Shows a comparison table with key financial metrics
 * - Highlights the current stock in the table
 * 
 * CONNECTED TO:
 * - StockDetail page → renders when peer data is available
 * - CurrencyContext → converts all prices and market caps to selected currency
 * - LanguageContext → translates metric labels (German/English)
 * - stockApi → fetches overview + quote data for each peer symbol
 * 
 * DATA SOURCE: Alpha Vantage (overview) + Finnhub (quote) via stock-data edge function
 */
import { useEffect, useState } from "react";
import { getOverview, getQuote } from "@/lib/stockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PeerMetrics {
  symbol: string;
  price: number;
  change: number;
  pe: number;
  marketCap: number; // raw number for currency conversion
  profitMargin: string;
  revGrowth: string;
  dividendYield: string;
  beta: string;
}

export function PeerComparison({ currentSymbol, peers }: { currentSymbol: string; peers: string[] }) {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();
  const [data, setData] = useState<PeerMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Symbols to compare: current stock + top 3 peers ──
  const symbols = [currentSymbol, ...peers.filter(p => p !== currentSymbol).slice(0, 3)];

  // ── Currency-aware market cap formatter ──
  // Converts raw USD market cap → selected currency, then formats as T/B/M
  const formatMcap = (n: number): string => {
    const converted = convert(n) ?? n;
    if (converted >= 1e12) return `${cSym}${(converted / 1e12).toFixed(1)}T`;
    if (converted >= 1e9) return `${cSym}${(converted / 1e9).toFixed(0)}B`;
    if (converted >= 1e6) return `${cSym}${(converted / 1e6).toFixed(0)}M`;
    return `${cSym}${converted.toFixed(0)}`;
  };

  // ── Price formatter with currency conversion ──
  const formatPrice = (n: number): string => {
    const converted = convert(n) ?? n;
    return `${cSym}${converted.toFixed(2)}`;
  };

  // ── Fetch peer data on mount ──
  // Loads overview (fundamentals) + quote (price) for each symbol in parallel
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        symbols.map(async (sym) => {
          try {
            const [ov, q] = await Promise.all([getOverview(sym).catch(() => null), getQuote(sym).catch(() => null)]);
            return {
              symbol: sym,
              price: q?.c || 0,
              change: q?.dp || 0,
              pe: parseFloat(ov?.PERatio || "0"),
              marketCap: parseFloat(ov?.MarketCapitalization || "0"),
              profitMargin: ov?.ProfitMargin ? `${(parseFloat(ov.ProfitMargin) * 100).toFixed(1)}%` : "–",
              revGrowth: ov?.QuarterlyRevenueGrowthYOY ? `${(parseFloat(ov.QuarterlyRevenueGrowthYOY) * 100).toFixed(1)}%` : "–",
              dividendYield: ov?.DividendYield ? `${(parseFloat(ov.DividendYield) * 100).toFixed(2)}%` : "–",
              beta: ov?.Beta || "–",
            } as PeerMetrics;
          } catch { return null; }
        })
      );
      if (!cancelled) {
        setData(results.filter(Boolean) as PeerMetrics[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSymbol, peers?.length]);

  if (!peers?.length || peers.length === 0) return null;

  // ── Metric definitions for the table rows ──
  const metrics = [
    { key: "price", label: lang === "de" ? "Kurs" : "Price" },
    { key: "pe", label: "P/E" },
    { key: "marketCap", label: lang === "de" ? "Marktk." : "Mkt Cap" },
    { key: "profitMargin", label: lang === "de" ? "Marge" : "Margin" },
    { key: "revGrowth", label: lang === "de" ? "Umsatzw." : "Rev Gr." },
    { key: "dividendYield", label: lang === "de" ? "Div." : "Div." },
    { key: "beta", label: "Beta" },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      {/* ── Section header ── */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-muted-foreground">
          {lang === "de" ? "Peer-Vergleich" : "Peer Comparison"}
        </h3>
      </div>

      {loading ? (
        <Skeleton className="h-40 rounded-lg" />
      ) : (
        /* ── Comparison table: scrollable on mobile ── */
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs">
            {/* Column headers = stock symbols */}
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">{lang === "de" ? "Kennzahl" : "Metric"}</th>
                {data.map((d) => (
                  <th key={d.symbol} className="text-right py-2 px-2">
                    <Link to={`/stock/${d.symbol}`} className={`font-bold hover:text-primary transition-colors ${d.symbol === currentSymbol ? "text-primary" : "text-foreground"}`}>
                      {d.symbol}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Each row = one metric across all stocks */}
              {metrics.map((m) => (
                <tr key={m.key} className="border-b border-border/20 last:border-0">
                  <td className="py-2 px-2 text-muted-foreground font-medium">{m.label}</td>
                  {data.map((d) => {
                    let val: string;
                    // Format each metric value appropriately
                    if (m.key === "price") val = formatPrice(d.price);
                    else if (m.key === "pe") val = d.pe > 0 ? d.pe.toFixed(1) : "–";
                    else if (m.key === "marketCap") val = d.marketCap > 0 ? formatMcap(d.marketCap) : "–";
                    else val = (d as any)[m.key] || "–";
                    
                    return (
                      <td key={d.symbol} className={`py-2 px-2 text-right tabular-nums ${d.symbol === currentSymbol ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Day change row with color coding */}
              <tr>
                <td className="py-2 px-2 text-muted-foreground font-medium">{lang === "de" ? "Tagesänd." : "Day Chg"}</td>
                {data.map((d) => (
                  <td key={d.symbol} className={`py-2 px-2 text-right tabular-nums font-medium ${d.change >= 0 ? "text-chart-2" : "text-destructive"}`}>
                    {d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
