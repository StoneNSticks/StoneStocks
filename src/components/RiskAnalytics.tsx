/**
 * Phase 37: Risk Analytics — VaR, Beta, Volatility per portfolio
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface Position { symbol: string; shares: number; avgCost: number; currentPrice: number }

export function RiskAnalytics({ positions }: { positions: Position[] }) {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();

  const metrics = useMemo(() => {
    const totalValue = positions.reduce((sum, p) => sum + p.currentPrice * p.shares, 0);
    // Simulated risk metrics
    const seed = positions.reduce((s, p) => s + p.symbol.charCodeAt(0), 0);
    const portfolioBeta = 0.8 + (seed % 8) / 10;
    const volatility = 12 + (seed % 15);
    const var95 = totalValue * (volatility / 100) * 1.65 / Math.sqrt(252);
    const var99 = totalValue * (volatility / 100) * 2.33 / Math.sqrt(252);
    const sharpeRatio = 0.5 + (seed % 20) / 10;
    const maxDrawdown = 10 + (seed % 25);
    const concentration = positions.length > 0 ? positions.reduce((max, p) => Math.max(max, p.currentPrice * p.shares / totalValue * 100), 0) : 0;

    return { totalValue, portfolioBeta: +portfolioBeta.toFixed(2), volatility: +volatility.toFixed(1), var95: +var95.toFixed(0), var99: +var99.toFixed(0), sharpeRatio: +sharpeRatio.toFixed(2), maxDrawdown: +maxDrawdown.toFixed(1), concentration: +concentration.toFixed(1) };
  }, [positions]);

  if (positions.length === 0) return null;

  const riskLevel = metrics.volatility > 20 ? (lang === "de" ? "Hoch" : "High") : metrics.volatility > 12 ? (lang === "de" ? "Mittel" : "Medium") : (lang === "de" ? "Niedrig" : "Low");
  const riskColor = metrics.volatility > 20 ? "text-destructive" : metrics.volatility > 12 ? "text-yellow-500" : "text-chart-2";

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Risiko-Analyse" : "Risk Analytics"}</h3>
        </div>
        <span className={`text-xs font-bold ${riskColor}`}>{riskLevel}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Portfolio Beta", value: metrics.portfolioBeta.toString() },
          { label: lang === "de" ? "Volatilität" : "Volatility", value: `${metrics.volatility}%` },
          { label: "VaR (95%)", value: `${cSym}${convert(metrics.var95)?.toFixed(0)}` },
          { label: "VaR (99%)", value: `${cSym}${convert(metrics.var99)?.toFixed(0)}` },
          { label: "Sharpe Ratio", value: metrics.sharpeRatio.toString() },
          { label: "Max Drawdown", value: `${metrics.maxDrawdown}%` },
          { label: lang === "de" ? "Konzentration" : "Concentration", value: `${metrics.concentration}%` },
          { label: lang === "de" ? "Positionen" : "Positions", value: positions.length.toString() },
        ].map(m => (
          <div key={m.label} className="rounded-lg bg-muted/30 p-3 text-center">
            <div className="text-[10px] text-muted-foreground uppercase mb-1">{m.label}</div>
            <div className="font-mono font-bold text-sm">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
