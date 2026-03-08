/**
 * ScreenerPage: Stock screener with filters for market cap, P/E, dividend yield, sector.
 * Fetches top companies from the edge function and filters client-side.
 * Uses useTopCompanies hook for data, useCurrency for price display.
 */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTopCompanies } from "@/hooks/useStockData";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Search, TrendingUp, TrendingDown, ArrowUpDown, RotateCcw, ChevronDown, Zap } from "lucide-react";
import { NLPScreener } from "@/components/NLPScreener";
import { MagicFormulaRanking } from "@/components/MagicFormulaRanking";
import { PiotroskiScore } from "@/components/PiotroskiScore";
import { MomentumScreener } from "@/components/MomentumScreener";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type SortKey = "marketCap" | "change" | "name" | "pe" | "yield";

const SECTORS = [
  "Technology", "Healthcare", "Financials", "Consumer Cyclical",
  "Consumer Defensive", "Energy", "Industrials", "Communication Services",
  "Basic Materials", "Utilities", "Real Estate",
];

const SECTOR_DE: Record<string, string> = {
  Technology: "Technologie", Healthcare: "Gesundheit", Financials: "Finanzen",
  "Consumer Cyclical": "Zyklischer Konsum", "Consumer Defensive": "Defensiver Konsum",
  Energy: "Energie", Industrials: "Industrie", "Communication Services": "Kommunikation",
  "Basic Materials": "Grundstoffe", Utilities: "Versorger", "Real Estate": "Immobilien",
};

export default function ScreenerPage() {
  const { data: companies, isLoading } = useTopCompanies();
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();
  const { lang } = useLanguage();

  usePageTitle(
    lang === "de" ? "Aktien-Screener" : "Stock Screener",
    lang === "de" ? "Aktien nach Kennzahlen filtern und analysieren" : "Filter and analyze stocks by key metrics"
  );

  const [search, setSearch] = useState("");
  const [minMcap, setMinMcap] = useState(0);
  const [maxPe, setMaxPe] = useState(200);
  const [minYield, setMinYield] = useState(0);
  const [selectedSector, setSelectedSector] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortAsc, setSortAsc] = useState(false);
  const [showSectors, setShowSectors] = useState(false);

  type Preset = { label: string; labelDe: string; minMcap: number; maxPe: number; minYield: number; sector: string };
  const PRESETS: Preset[] = [
    { label: "Value", labelDe: "Value", minMcap: 10, maxPe: 20, minYield: 2, sector: "" },
    { label: "Growth", labelDe: "Wachstum", minMcap: 5, maxPe: 200, minYield: 0, sector: "Technology" },
    { label: "Dividend", labelDe: "Dividende", minMcap: 10, maxPe: 200, minYield: 3, sector: "" },
    { label: "Large Cap", labelDe: "Large Cap", minMcap: 100, maxPe: 200, minYield: 0, sector: "" },
    { label: "Healthcare", labelDe: "Gesundheit", minMcap: 0, maxPe: 200, minYield: 0, sector: "Healthcare" },
    { label: "Energy", labelDe: "Energie", minMcap: 0, maxPe: 200, minYield: 0, sector: "Energy" },
  ];

  const applyPreset = (p: Preset) => {
    setMinMcap(p.minMcap);
    setMaxPe(p.maxPe);
    setMinYield(p.minYield);
    setSelectedSector(p.sector);
  };

  const hasFilters = search || minMcap > 0 || maxPe < 200 || minYield > 0 || selectedSector;

  const resetFilters = () => {
    setSearch("");
    setMinMcap(0);
    setMaxPe(200);
    setMinYield(0);
    setSelectedSector("");
  };

  const filtered = useMemo(() => {
    if (!companies) return [];
    let items = companies.filter((c: any) => {
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) && !c.ticker?.toLowerCase().includes(search.toLowerCase()) && !c.symbol?.toLowerCase().includes(search.toLowerCase())) return false;
      if (c.marketCap && c.marketCap < minMcap * 1e9) return false;
      if (c.pe && c.pe > maxPe) return false;
      if (minYield > 0 && (!c.dividendYield || c.dividendYield < minYield)) return false;
      if (selectedSector && c.sector && !c.sector.toLowerCase().includes(selectedSector.toLowerCase())) return false;
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
  }, [companies, search, minMcap, maxPe, minYield, selectedSector, sortKey, sortAsc]);

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

  // Extract unique sectors from data
  const availableSectors = useMemo(() => {
    if (!companies) return SECTORS;
    const sectorSet = new Set<string>();
    companies.forEach((c: any) => { if (c.sector) sectorSet.add(c.sector); });
    return sectorSet.size > 0 ? Array.from(sectorSet).sort() : SECTORS;
  }, [companies]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
            <Filter className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">{t("screener.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("screener.subtitle")}</p>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
              {lang === "de" ? "Zurücksetzen" : "Reset"}
            </Button>
          )}
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono uppercase mr-1"><Zap className="h-3 w-3" />{lang === "de" ? "Schnellfilter" : "Quick filters"}</span>
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => applyPreset(p)} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
              {lang === "de" ? p.labelDe : p.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
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

        {/* Sector Filter */}
        <div className="mb-4">
          <button
            onClick={() => setShowSectors(!showSectors)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
            {lang === "de" ? "Sektor-Filter" : "Sector Filter"}
            {selectedSector && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{lang === "de" ? SECTOR_DE[selectedSector] || selectedSector : selectedSector}</Badge>}
            <ChevronDown className={`h-3 w-3 transition-transform ${showSectors ? "rotate-180" : ""}`} />
          </button>
          {showSectors && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                onClick={() => setSelectedSector("")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${!selectedSector ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {lang === "de" ? "Alle" : "All"}
              </button>
              {availableSectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(selectedSector === sector ? "" : sector)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${selectedSector === sector ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  {lang === "de" ? SECTOR_DE[sector] || sector : sector}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="font-mono mr-1">{filtered.length}</Badge>
            {t("screener.results")}
          </div>
        </div>

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
              const ticker = c.ticker || c.symbol;
              return (
                <Link key={ticker || i} to={`/stock/${ticker}`} className="min-w-[500px] grid grid-cols-[1fr_5rem_5rem_4.5rem_4.5rem] sm:grid-cols-[1fr_7rem_6rem_5rem_5rem] gap-2 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors items-center min-h-[44px]">
                  <div className="flex items-center gap-2 min-w-0">
                    {c.logo ? (
                      <img src={c.logo} alt="" className="h-6 w-6 rounded-md object-contain bg-background border border-border/40 shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                        {(ticker || "").slice(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-sm truncate">{ticker}</div>
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
      <Footer />
    </div>
  );
}
