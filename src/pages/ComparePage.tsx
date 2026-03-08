/**
 * ComparePage — Side-by-side stock comparison with key metrics.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useFullStock } from "@/hooks/useStockData";
import { useSearchStocks } from "@/hooks/useStockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, GitCompare, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { NormalizedChart } from "@/components/NormalizedChart";

function safeNum(val: unknown): number { const n = Number(val); return isNaN(n) ? 0 : n; }

function CompareStock({ symbol, onRemove }: { symbol: string; onRemove: () => void }) {
  const { data, isLoading } = useFullStock(symbol);
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (!data) return null;

  const { quote, overview, derived, profile, massiveTicker } = data;
  const name = profile?.name || overview?.Name || (massiveTicker?.name as string) || symbol;
  const logo = profile?.logo || (massiveTicker?.branding as any)?.icon_url;
  const price = quote?.c;
  const change = quote?.dp || 0;
  const isUp = change >= 0;

  const pe = safeNum(derived?.calculatedPE) || safeNum(overview?.PERatio);
  const pb = safeNum(derived?.calculatedPB) || safeNum(overview?.PriceToBookRatio);
  const mcap = safeNum(derived?.marketCap) || safeNum(overview?.MarketCapitalization);
  const divYield = safeNum(derived?.dividendYield) || (overview?.DividendYield ? safeNum(overview.DividendYield) * 100 : 0);
  const profitMargin = overview?.ProfitMargin ? safeNum(overview.ProfitMargin) * 100 : 0;
  const roe = overview?.ReturnOnEquityTTM ? safeNum(overview.ReturnOnEquityTTM) * 100 : 0;
  const eps = safeNum(overview?.EPS);
  const beta = safeNum(overview?.Beta);
  const revGrowth = overview?.QuarterlyRevenueGrowthYOY ? safeNum(overview.QuarterlyRevenueGrowthYOY) * 100 : 0;

  const fmtCur = (v: number) => v ? `${cSym}${(convert(v) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—";
  const fmtMcap = (v: number) => {
    if (!v) return "—";
    const c = convert(v) || 0;
    if (c >= 1e12) return `${cSym}${(c / 1e12).toFixed(2)}T`;
    if (c >= 1e9) return `${cSym}${(c / 1e9).toFixed(2)}B`;
    return `${cSym}${(c / 1e6).toFixed(0)}M`;
  };
  const fmtPct = (v: number) => v ? `${v.toFixed(2)}%` : "—";
  const fmtNum = (v: number) => v ? v.toFixed(2) : "—";
  const pctColor = (v: number) => v > 0 ? "text-chart-2" : v < 0 ? "text-destructive" : "";

  const metrics = [
    { label: t("compare.price"), value: fmtCur(price || 0), color: "" },
    { label: t("compare.change"), value: `${isUp ? "+" : ""}${change.toFixed(2)}%`, color: pctColor(change) },
    { label: t("compare.marketCap"), value: fmtMcap(mcap), color: "" },
    { label: "P/E", value: fmtNum(pe), color: "" },
    { label: "P/B", value: fmtNum(pb), color: "" },
    { label: "EPS", value: fmtCur(eps), color: "" },
    { label: "Beta", value: fmtNum(beta), color: "" },
    { label: t("compare.divYield"), value: fmtPct(divYield), color: pctColor(divYield) },
    { label: t("compare.profitMargin"), value: fmtPct(profitMargin), color: pctColor(profitMargin) },
    { label: "ROE", value: fmtPct(roe), color: pctColor(roe) },
    { label: t("compare.revGrowth"), value: fmtPct(revGrowth), color: pctColor(revGrowth) },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-border/40 bg-muted/30">
        {logo && <img src={logo} alt={name} className="h-8 w-8 rounded-lg object-contain bg-background border border-border/40 p-0.5" />}
        <div className="flex-1 min-w-0">
          <Link to={`/stock/${symbol}`} className="font-display font-bold text-sm hover:text-primary transition-colors">{name}</Link>
          <div className="text-xs text-muted-foreground font-mono">{symbol}</div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${pctColor(change)}`}>
          {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {isUp ? "+" : ""}{change.toFixed(2)}%
        </div>
        <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="divide-y divide-border/20">
        {metrics.map(m => (
          <div key={m.label} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-muted-foreground">{m.label}</span>
            <span className={`text-xs font-mono font-semibold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ComparePage() {
  const t = useT();
  const { lang } = useLanguage();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults } = useSearchStocks(searchQuery);

  const addSymbol = (sym: string) => {
    const upper = sym.toUpperCase();
    if (!symbols.includes(upper) && symbols.length < 4) {
      setSymbols([...symbols, upper]);
    }
    setSearchQuery("");
  };

  const removeSymbol = (sym: string) => setSymbols(symbols.filter(s => s !== sym));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-8 px-3 sm:px-4 lg:px-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <GitCompare className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {t("compare.title")} <span className="text-primary">{t("compare.titleHighlight")}</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("compare.subtitle")}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("compare.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl"
            disabled={symbols.length >= 4}
          />
          {searchResults && searchQuery.length >= 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border/60 bg-card shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
              {(searchResults as any[]).slice(0, 8).map((r: any) => (
                <button key={r.symbol} onClick={() => addSymbol(r.symbol || r.displaySymbol)} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left">
                  <span className="font-mono font-bold text-sm text-primary">{r.displaySymbol || r.symbol}</span>
                  <span className="text-xs text-muted-foreground truncate">{r.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Symbols */}
        {symbols.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
            {symbols.map(s => (
              <Badge key={s} variant="secondary" className="font-mono text-sm gap-1.5 px-3 py-1.5">
                {s}
                <button onClick={() => removeSymbol(s)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
              </Badge>
            ))}
            {symbols.length < 4 && (
              <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                <Plus className="h-3 w-3" />{4 - symbols.length} {t("compare.remaining")}
              </Badge>
            )}
          </div>
        )}

        {/* Compare Grid */}
        {symbols.length === 0 ? (
          <div className="text-center py-20">
            <GitCompare className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              {t("compare.emptyHint")}
            </p>
          </div>
        ) : (
          <>
            <NormalizedChart symbols={symbols} />
            <div className={`grid gap-4 mt-4 ${symbols.length === 1 ? "grid-cols-1 max-w-md mx-auto" : symbols.length === 2 ? "grid-cols-1 sm:grid-cols-2" : symbols.length === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
              {symbols.map(s => (
                <CompareStock key={s} symbol={s} onRemove={() => removeSymbol(s)} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
