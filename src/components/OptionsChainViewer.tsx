/**
 * Phase 17: Options Chain Viewer (component for StockDetail)
 */
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Layers, ChevronDown } from "lucide-react";

interface Props { symbol: string; currentPrice?: number }

export function OptionsChainViewer({ symbol, currentPrice = 180 }: Props) {
  const { lang } = useLanguage();
  const [showPuts, setShowPuts] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const strikes = useMemo(() => {
    const base = Math.round(currentPrice / 5) * 5;
    return Array.from({ length: 11 }, (_, i) => {
      const strike = base - 25 + i * 5;
      const itm = showPuts ? strike > currentPrice : strike < currentPrice;
      const dist = Math.abs(strike - currentPrice);
      const iv = 0.25 + Math.random() * 0.15;
      const delta = showPuts ? -(1 - dist / currentPrice * 2) * 0.5 : (1 - dist / currentPrice * 2) * 0.5;
      const theta = -(0.02 + Math.random() * 0.05);
      const gamma = 0.01 + Math.random() * 0.02;
      const bid = Math.max(0.01, (showPuts ? Math.max(0, strike - currentPrice) : Math.max(0, currentPrice - strike)) + Math.random() * 5);
      const ask = bid + 0.05 + Math.random() * 0.2;
      const vol = Math.floor(Math.random() * 5000);
      const oi = Math.floor(Math.random() * 20000);
      return { strike, bid: +bid.toFixed(2), ask: +ask.toFixed(2), vol, oi, iv: +(iv * 100).toFixed(1), delta: +delta.toFixed(3), theta: +theta.toFixed(3), gamma: +gamma.toFixed(3), itm };
    });
  }, [currentPrice, showPuts]);

  if (!expanded) {
    return (
      <button onClick={() => setExpanded(true)} className="w-full rounded-xl border border-border/60 bg-card p-4 text-left hover:bg-muted/30 transition-colors flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        <span className="font-display font-semibold text-sm">{lang === "de" ? "Optionskette anzeigen" : "Show Options Chain"}</span>
        <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Optionskette" : "Options Chain"} — {symbol}</h3>
        </div>
        <div className="flex gap-1 rounded-lg border border-border/60 p-0.5">
          <button onClick={() => setShowPuts(false)} className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${!showPuts ? "bg-chart-2 text-white" : "text-muted-foreground"}`}>Calls</button>
          <button onClick={() => setShowPuts(true)} className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${showPuts ? "bg-destructive text-white" : "text-muted-foreground"}`}>Puts</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left">Strike</th>
              <th className="px-3 py-2 text-right">Bid</th>
              <th className="px-3 py-2 text-right">Ask</th>
              <th className="px-3 py-2 text-right">Vol</th>
              <th className="px-3 py-2 text-right">OI</th>
              <th className="px-3 py-2 text-right">IV</th>
              <th className="px-3 py-2 text-right">Δ</th>
              <th className="px-3 py-2 text-right">Θ</th>
              <th className="px-3 py-2 text-right">Γ</th>
            </tr>
          </thead>
          <tbody>
            {strikes.map(s => (
              <tr key={s.strike} className={`border-b border-border/20 hover:bg-muted/30 transition-colors ${s.itm ? "bg-primary/5" : ""}`}>
                <td className="px-3 py-2 font-mono font-bold">${s.strike}{s.itm && <Badge variant="secondary" className="ml-1 text-[8px] px-1">ITM</Badge>}</td>
                <td className="px-3 py-2 text-right font-mono">${s.bid.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-mono">${s.ask.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-mono text-muted-foreground">{s.vol.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-mono text-muted-foreground">{s.oi.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-mono">{s.iv}%</td>
                <td className="px-3 py-2 text-right font-mono">{s.delta}</td>
                <td className="px-3 py-2 text-right font-mono text-destructive">{s.theta}</td>
                <td className="px-3 py-2 text-right font-mono">{s.gamma}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
