/**
 * Phase 36: Portfolio Rebalancing — Target vs actual allocation
 */
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Scale, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Position { symbol: string; shares: number; avgCost: number; currentPrice: number }

export function PortfolioRebalancing({ positions }: { positions: Position[] }) {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();
  const totalValue = positions.reduce((sum, p) => sum + p.currentPrice * p.shares, 0);

  const [targets, setTargets] = useState<Record<string, number>>(() => {
    const equal = 100 / positions.length;
    return Object.fromEntries(positions.map(p => [p.symbol, +equal.toFixed(1)]));
  });

  const data = useMemo(() => {
    return positions.map(p => {
      const currentPct = totalValue > 0 ? (p.currentPrice * p.shares / totalValue) * 100 : 0;
      const targetPct = targets[p.symbol] || 0;
      const diff = targetPct - currentPct;
      const diffValue = (diff / 100) * totalValue;
      return { symbol: p.symbol, currentPct: +currentPct.toFixed(1), targetPct, diff: +diff.toFixed(1), diffValue };
    });
  }, [positions, targets, totalValue]);

  if (positions.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Portfolio Rebalancing" : "Portfolio Rebalancing"}</h3>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_4rem_4rem_4rem_5rem] gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-mono px-2">
          <span>{lang === "de" ? "Aktie" : "Stock"}</span>
          <span className="text-right">{lang === "de" ? "Ist" : "Current"}</span>
          <span className="text-right">{lang === "de" ? "Ziel" : "Target"}</span>
          <span className="text-right">Diff</span>
          <span className="text-right">{lang === "de" ? "Handeln" : "Trade"}</span>
        </div>
        {data.map(d => (
          <div key={d.symbol} className="grid grid-cols-[1fr_4rem_4rem_4rem_5rem] gap-2 items-center rounded-lg bg-muted/20 p-2">
            <span className="font-mono font-bold text-sm">{d.symbol}</span>
            <span className="text-right font-mono text-xs">{d.currentPct}%</span>
            <Input
              type="number"
              value={targets[d.symbol]}
              onChange={e => setTargets(t => ({ ...t, [d.symbol]: Number(e.target.value) }))}
              className="h-7 text-xs text-right p-1 font-mono"
              min={0} max={100} step={1}
            />
            <span className={`text-right font-mono text-xs font-bold ${d.diff > 0 ? "text-chart-2" : d.diff < 0 ? "text-destructive" : ""}`}>
              {d.diff > 0 ? "+" : ""}{d.diff}%
            </span>
            <span className={`text-right font-mono text-[11px] ${d.diffValue > 0 ? "text-chart-2" : d.diffValue < 0 ? "text-destructive" : ""}`}>
              {d.diffValue > 0 ? "Buy " : d.diffValue < 0 ? "Sell " : ""}{cSym}{convert(Math.abs(d.diffValue))?.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
