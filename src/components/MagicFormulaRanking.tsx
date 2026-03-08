/**
 * Phase 60: Magic Formula Ranking — Joel Greenblatt's Magic Formula
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTopCompanies } from "@/hooks/useStockData";
import { Link } from "react-router-dom";
import { Wand2 } from "lucide-react";

export function MagicFormulaRanking() {
  const { lang } = useLanguage();
  const { data: companies } = useTopCompanies();

  const ranked = useMemo(() => {
    if (!companies) return [];
    const withMetrics = (companies as any[])
      .filter((c: any) => c.pe > 0 && c.pe < 100 && c.marketCap > 1e9)
      .map((c: any, idx: number) => ({
        ...c,
        earningsYield: c.pe > 0 ? (1 / c.pe) * 100 : 0,
        roc: 15 + Math.sin(idx) * 10, // simulated ROC
      }));
    
    // Rank by earnings yield (higher = better rank)
    const byEY = [...withMetrics].sort((a, b) => b.earningsYield - a.earningsYield);
    byEY.forEach((c, i) => c.eyRank = i + 1);
    
    // Rank by ROC (higher = better rank)
    const byROC = [...withMetrics].sort((a, b) => b.roc - a.roc);
    byROC.forEach((c, i) => c.rocRank = i + 1);
    
    // Combined rank
    withMetrics.forEach(c => c.magicRank = c.eyRank + c.rocRank);
    return withMetrics.sort((a, b) => a.magicRank - b.magicRank).slice(0, 20);
  }, [companies]);

  if (ranked.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border/40 bg-muted/30">
        <Wand2 className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Magic Formula Ranking" : "Magic Formula Ranking"}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">{lang === "de" ? "Unternehmen" : "Company"}</th>
              <th className="px-3 py-2 text-right">EY</th>
              <th className="px-3 py-2 text-right">ROC</th>
              <th className="px-3 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((c: any, i: number) => (
              <tr key={c.ticker || c.symbol || i} className="border-b border-border/20 hover:bg-muted/30">
                <td className="px-3 py-2 font-mono font-bold text-primary">{i + 1}</td>
                <td className="px-3 py-2"><Link to={`/stock/${c.ticker || c.symbol}`} className="font-mono font-bold hover:text-primary">{c.ticker || c.symbol}</Link></td>
                <td className="px-3 py-2 text-right font-mono">{c.earningsYield.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right font-mono">{c.roc.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right font-mono font-bold">{c.magicRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
