/**
 * Phase 35: Tax Loss Harvesting — Identify losing positions to realize losses
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Receipt, TrendingDown } from "lucide-react";

interface Position { symbol: string; shares: number; avgCost: number; currentPrice: number }

export function TaxLossHarvesting({ positions }: { positions: Position[] }) {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();

  const losers = useMemo(() => {
    return positions
      .map(p => ({
        ...p,
        loss: (p.currentPrice - p.avgCost) * p.shares,
        lossPct: ((p.currentPrice - p.avgCost) / p.avgCost) * 100,
      }))
      .filter(p => p.loss < 0)
      .sort((a, b) => a.loss - b.loss);
  }, [positions]);

  const totalLoss = losers.reduce((sum, p) => sum + p.loss, 0);

  if (losers.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Tax Loss Harvesting" : "Tax Loss Harvesting"}</h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase">{lang === "de" ? "Gesamt realisierbar" : "Total Harvestable"}</div>
          <div className="font-mono font-bold text-destructive">{cSym}{convert(Math.abs(totalLoss))?.toFixed(0)}</div>
        </div>
      </div>
      <div className="space-y-2">
        {losers.map(p => (
          <div key={p.symbol} className="flex items-center justify-between rounded-lg bg-destructive/5 p-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="font-mono font-bold text-sm">{p.symbol}</span>
              <span className="text-[11px] text-muted-foreground">{p.shares} shares</span>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-sm text-destructive">{cSym}{convert(Math.abs(p.loss))?.toFixed(0)}</div>
              <div className="text-[10px] text-muted-foreground">{p.lossPct.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
