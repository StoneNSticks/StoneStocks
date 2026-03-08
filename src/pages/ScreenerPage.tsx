/**
 * ScreenerPage — Stock screener with filters for market cap, P/E, dividend yield, sector.
 * Fetches top companies from the edge function and filters client-side.
 * Uses useTopCompanies hook for data, useCurrency for price display.
 */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTopCompanies } from "@/hooks/useStockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Search, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";

type SortKey = "marketCap" | "change" | "name" | "pe" | "yield";

export default function ScreenerPage() {
  const { data: companies, isLoading } = useTopCompanies();
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();

  const [search, setSearch] = useState("");
  const [minMcap, setMinMcap] = useState(0);
  const [maxPe, setMaxPe] = useState(200);
  const [minYield, setMinYield] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    if (!companies) return [];
    let items = companies.filter((c: any) => {
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) && !c.ticker?.toLowerCase().includes(search.toLowerCase())) return false;
      if (c.marketCap && c.marketCap < minMcap * 1e9) return false;
      if (c.pe && c.pe > maxPe) return false;
      if (minYield > 0 && (!c.dividendYield || c.dividendYield < minYield)) return false;
      return true;
    });

    items.sort((a: any, b: any) => {
      let va: number, vb: number;
      switch (sortKey) {
        case "marketCap": va = a.marketCap || 0; vb = b.marketCap || 0; break;
        case "change": va = a.changePercent || 0; vb = b.changePercent || 0; break;
        case "name": return sortAsc ? (a.name || "").localeCompare(b.name || "") : (b.name || "").localeCompare(a.name || "");
        case "pe": va = a.pe || 999; vb = b.pe || 999; break;
        case "yield": va = a.dividendYield || 0; vb = b.dividendYield || 0; break;
        default: va = 0; vb = 0;
      }
      return sortAsc ? va - vb : vb - va;
    });

    return items;
  }, [companies, search, minMcap, maxPe, minYield, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const fmtMcap = (v: number) => {
    const c = convert(v) ?? v;
    if (c >= 1e12) return `${cSym}${(c / 1e12).toFixed(2)}T`;
    if (c >= 1e9) return `${cSym}${(c / 1e9).toFixed(1)}B`;
    return `${cSym}${(c / 1e6).toFixed(0)}M`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
            <Filter className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{t("screener.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("screener.subtitle")}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="col-span-2 sm:col-span-1">
            <Label className="text-xs text-muted-foreground">{t("screener.search")}</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="AAPL, Apple..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("screener.minMcap")}</Label>
            <Input type="number" value={minMcap} onChange={(e) => setMinMcap(Number(e.target.value))} className="mt-1" placeholder="0" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("screener.maxPe")}</Label>
            <Input type="number" value={maxPe} onChange={(e) => setMaxPe(Number(e.target.value))} className="mt-1" placeholder="200" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t("screener.minYield")}</Label>
            <Input type="number" value={minYield} onChange={(e) => setMinYield(Number(e.target.value))} className="mt-1" step="0.5" placeholder="0" />
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3">{filtered.length} {t("screener.results")}</div>

        {/* Results Table */}
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card scroll-x-touch">
          <div className="min-w-[500px] grid grid-cols-[1fr_5rem_5rem_4.5rem_4.5rem] sm:grid-cols-[1fr_7rem_6rem_5rem_5rem] gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            <button onClick={() => toggleSort("name")} className="text-left flex items-center gap-1 hover:text-foreground"><span>{t("screener.company")}</span><ArrowUpDown className="h-3 w-3" /></button>
            <button onClick={() => toggleSort("marketCap")} className="text-right flex items-center justify-end gap-1 hover:text-foreground"><span>{t("screener.mcap")}</span><ArrowUpDown className="h-3 w-3" /></button>
            <button onClick={() => toggleSort("change")} className="text-right flex items-center justify-end gap-1 hover:text-foreground"><span>{t("screener.change")}</span><ArrowUpDown className="h-3 w-3" /></button>
            <button onClick={() => toggleSort("pe")} className="text-right flex items-center justify-end gap-1 hover:text-foreground"><span>P/E</span><ArrowUpDown className="h-3 w-3" /></button>
            <button onClick={() => toggleSort("yield")} className="text-right flex items-center justify-end gap-1 hover:text-foreground"><span>{t("screener.yield")}</span><ArrowUpDown className="h-3 w-3" /></button>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-2">{[...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t("screener.noResults")}</div>
          ) : (
            filtered.slice(0, 100).map((c: any, i: number) => {
              const isUp = (c.changePercent || 0) >= 0;
              return (
                <Link key={c.ticker || i} to={`/stock/${c.ticker}`} className="min-w-[500px] grid grid-cols-[1fr_5rem_5rem_4.5rem_4.5rem] sm:grid-cols-[1fr_7rem_6rem_5rem_5rem] gap-2 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors items-center min-h-[44px]">
                  <div className="flex items-center gap-2 min-w-0">
                    {c.logo && <img src={c.logo} alt="" className="h-6 w-6 rounded-md object-contain bg-background border border-border/40 shrink-0" loading="lazy" />}
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-sm truncate">{c.ticker}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{c.name}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">{c.marketCap ? fmtMcap(c.marketCap) : "—"}</div>
                  <div className={`text-right font-mono text-xs font-semibold flex items-center justify-end gap-0.5 ${isUp ? "text-chart-2" : "text-destructive"}`}>
                    {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isUp ? "+" : ""}{(c.changePercent || 0).toFixed(2)}%
                  </div>
                  <div className="text-right font-mono text-xs text-muted-foreground">{c.pe ? c.pe.toFixed(1) : "—"}</div>
                  <div className="text-right font-mono text-xs text-muted-foreground">{c.dividendYield ? `${c.dividendYield.toFixed(2)}%` : "—"}</div>
                </Link>
              );
            })
          )}
        </div>
      </main>
      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">© {new Date().getFullYear()} StoneStocks</div>
      </footer>
    </div>
  );
}
