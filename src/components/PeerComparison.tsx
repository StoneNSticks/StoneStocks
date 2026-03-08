/**
 * PeerComparison — Side-by-side comparison table of current stock vs peers.
 * Shows key metrics: P/E, Market Cap, Profit Margin, Revenue Growth, etc.
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
  marketCap: string;
  profitMargin: string;
  revGrowth: string;
  dividendYield: string;
  beta: string;
}

function formatMcap(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(0)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n}`;
}

export function PeerComparison({ currentSymbol, peers }: { currentSymbol: string; peers: string[] }) {
  const { lang } = useLanguage();
  const { symbol: cSym } = useCurrency();
  const [data, setData] = useState<PeerMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  const symbols = [currentSymbol, ...peers.filter(p => p !== currentSymbol).slice(0, 3)];

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
              marketCap: formatMcap(parseFloat(ov?.MarketCapitalization || "0")),
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
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-muted-foreground">
          {lang === "de" ? "Peer-Vergleich" : "Peer Comparison"}
        </h3>
      </div>

      {loading ? (
        <Skeleton className="h-40 rounded-lg" />
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs">
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
              {metrics.map((m) => (
                <tr key={m.key} className="border-b border-border/20 last:border-0">
                  <td className="py-2 px-2 text-muted-foreground font-medium">{m.label}</td>
                  {data.map((d) => {
                    let val: string;
                    if (m.key === "price") val = `${cSym}${d.price.toFixed(2)}`;
                    else if (m.key === "pe") val = d.pe > 0 ? d.pe.toFixed(1) : "–";
                    else val = (d as any)[m.key] || "–";
                    
                    return (
                      <td key={d.symbol} className={`py-2 px-2 text-right tabular-nums ${d.symbol === currentSymbol ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
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
