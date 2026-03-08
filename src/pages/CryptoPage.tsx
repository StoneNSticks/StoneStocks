/**
 * Phase 23: Crypto Section — Top cryptocurrencies with prices and sparklines
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bitcoin, Search, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin", price: 67234.50, change: 2.34, mcap: 1.32e12, volume: 28.5e9, color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", price: 3456.78, change: -1.12, mcap: 415e9, volume: 14.2e9, color: "#627EEA" },
  { symbol: "BNB", name: "BNB", price: 589.23, change: 0.87, mcap: 88e9, volume: 1.8e9, color: "#F3BA2F" },
  { symbol: "SOL", name: "Solana", price: 142.67, change: 5.43, mcap: 62e9, volume: 3.2e9, color: "#9945FF" },
  { symbol: "XRP", name: "XRP", price: 0.5234, change: -0.45, mcap: 28e9, volume: 1.1e9, color: "#23292F" },
  { symbol: "ADA", name: "Cardano", price: 0.4567, change: 1.23, mcap: 16e9, volume: 450e6, color: "#0033AD" },
  { symbol: "AVAX", name: "Avalanche", price: 35.78, change: 3.21, mcap: 13e9, volume: 520e6, color: "#E84142" },
  { symbol: "DOT", name: "Polkadot", price: 7.23, change: -2.34, mcap: 9.5e9, volume: 280e6, color: "#E6007A" },
  { symbol: "MATIC", name: "Polygon", price: 0.7234, change: 0.56, mcap: 6.7e9, volume: 380e6, color: "#8247E5" },
  { symbol: "LINK", name: "Chainlink", price: 14.56, change: 1.89, mcap: 8.5e9, volume: 620e6, color: "#2A5ADA" },
  { symbol: "UNI", name: "Uniswap", price: 7.89, change: -0.78, mcap: 5.9e9, volume: 180e6, color: "#FF007A" },
  { symbol: "ATOM", name: "Cosmos", price: 9.12, change: 2.45, mcap: 3.5e9, volume: 150e6, color: "#2E3148" },
];

function MiniSparkline({ isUp }: { isUp: boolean }) {
  const data = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ i, v: 50 + Math.random() * 30 + (isUp ? i * 0.8 : -i * 0.5) })), [isUp]);
  const color = isUp ? "hsl(var(--chart-2))" : "hsl(var(--destructive))";
  return (
    <div className="w-24 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}><Area type="monotone" dataKey="v" stroke={color} fill="none" strokeWidth={1.5} dot={false} /></AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function CryptoPage() {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"mcap" | "change" | "volume">("mcap");
  const [sortAsc, setSortAsc] = useState(false);
  usePageTitle(lang === "de" ? "Kryptowährungen" : "Cryptocurrencies");

  const fmtNum = (v: number) => {
    const c = convert(v) ?? v;
    if (c >= 1e12) return `${cSym}${(c / 1e12).toFixed(2)}T`;
    if (c >= 1e9) return `${cSym}${(c / 1e9).toFixed(1)}B`;
    if (c >= 1e6) return `${cSym}${(c / 1e6).toFixed(0)}M`;
    return `${cSym}${c.toFixed(2)}`;
  };

  const filtered = useMemo(() => {
    let items = CRYPTOS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()));
    items.sort((a, b) => {
      const va = sortKey === "mcap" ? a.mcap : sortKey === "change" ? a.change : a.volume;
      const vb = sortKey === "mcap" ? b.mcap : sortKey === "change" ? b.change : b.volume;
      return sortAsc ? va - vb : vb - va;
    });
    return items;
  }, [search, sortKey, sortAsc]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><Bitcoin className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Kryptowährungen" : "Cryptocurrencies"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Top Coins nach Marktkapitalisierung" : "Top coins by market cap"}</p>
          </div>
        </div>
        <div className="relative mb-4 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="BTC, Ethereum..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
          <div className="grid grid-cols-[2fr_1fr_5rem_5rem_6rem] gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            <span>{lang === "de" ? "Coin" : "Coin"}</span>
            <span className="text-right">{lang === "de" ? "Kurs" : "Price"}</span>
            <button onClick={() => toggleSort("change")} className="text-right flex items-center justify-end gap-0.5 hover:text-foreground">24h <ArrowUpDown className="h-3 w-3" /></button>
            <button onClick={() => toggleSort("mcap")} className="text-right flex items-center justify-end gap-0.5 hover:text-foreground">MCap <ArrowUpDown className="h-3 w-3" /></button>
            <span className="text-right">Chart</span>
          </div>
          {filtered.map((c, i) => {
            const isUp = c.change >= 0;
            return (
              <div key={c.symbol} className="grid grid-cols-[2fr_1fr_5rem_5rem_6rem] gap-2 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors items-center">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-[10px] font-mono w-8 justify-center" style={{ borderColor: c.color + "40" }}>{i + 1}</Badge>
                  <div>
                    <div className="font-mono font-bold text-sm">{c.symbol}</div>
                    <div className="text-[10px] text-muted-foreground">{c.name}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-sm font-semibold">{cSym}{convert(c.price)?.toLocaleString(undefined, { maximumFractionDigits: c.price < 1 ? 4 : 2 })}</div>
                <div className={`text-right font-mono text-xs font-semibold flex items-center justify-end gap-0.5 ${isUp ? "text-chart-2" : "text-destructive"}`}>
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isUp ? "+" : ""}{c.change.toFixed(2)}%
                </div>
                <div className="text-right font-mono text-xs text-muted-foreground">{fmtNum(c.mcap)}</div>
                <div className="flex justify-end"><MiniSparkline isUp={isUp} /></div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
