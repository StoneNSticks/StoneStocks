/**
 * Phase 24: Forex Pairs Dashboard
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";

const PAIRS = [
  { pair: "EUR/USD", bid: 1.0845, ask: 1.0847, change: 0.12, spread: 0.2 },
  { pair: "GBP/USD", bid: 1.2634, ask: 1.2636, change: -0.08, spread: 0.2 },
  { pair: "USD/JPY", bid: 154.23, ask: 154.26, change: 0.34, spread: 3.0 },
  { pair: "USD/CHF", bid: 0.8912, ask: 0.8914, change: -0.15, spread: 0.2 },
  { pair: "AUD/USD", bid: 0.6523, ask: 0.6525, change: 0.45, spread: 0.2 },
  { pair: "USD/CAD", bid: 1.3567, ask: 1.3569, change: -0.22, spread: 0.2 },
  { pair: "NZD/USD", bid: 0.6012, ask: 0.6014, change: 0.18, spread: 0.2 },
  { pair: "EUR/GBP", bid: 0.8584, ask: 0.8586, change: 0.05, spread: 0.2 },
  { pair: "EUR/JPY", bid: 167.23, ask: 167.27, change: 0.47, spread: 4.0 },
  { pair: "GBP/JPY", bid: 194.78, ask: 194.83, change: 0.28, spread: 5.0 },
];

export default function ForexPage() {
  const { lang } = useLanguage();
  usePageTitle(lang === "de" ? "Forex" : "Forex");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent"><Globe className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Devisenmarkt" : "Forex Market"}</h1>
            <p className="text-sm text-muted-foreground">{lang === "de" ? "Währungspaare mit Live-Kursen" : "Currency pairs with live rates"}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_5rem_5rem] gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            <span>Pair</span><span className="text-right">Bid</span><span className="text-right">Ask</span><span className="text-right">Spread</span><span className="text-right">24h</span>
          </div>
          {PAIRS.map(p => {
            const isUp = p.change >= 0;
            return (
              <div key={p.pair} className="grid grid-cols-[1.5fr_1fr_1fr_5rem_5rem] gap-2 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-colors items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm">{p.pair}</span>
                </div>
                <div className="text-right font-mono text-sm">{p.bid.toFixed(p.bid > 100 ? 2 : 4)}</div>
                <div className="text-right font-mono text-sm text-muted-foreground">{p.ask.toFixed(p.ask > 100 ? 2 : 4)}</div>
                <div className="text-right font-mono text-xs text-muted-foreground">{p.spread.toFixed(1)}</div>
                <div className={`text-right font-mono text-xs font-semibold flex items-center justify-end gap-0.5 ${isUp ? "text-chart-2" : "text-destructive"}`}>
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isUp ? "+" : ""}{p.change.toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
