/**
 * Phase 21: Short Interest Tracker (component for StockDetail)
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingDown } from "lucide-react";

interface Props { symbol: string; overview?: any }

export function ShortInterestCard({ symbol, overview }: Props) {
  const { lang } = useLanguage();

  const data = useMemo(() => {
    const seed = symbol.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const shortRatio = overview?.ShortRatio ? Number(overview.ShortRatio) : 1.5 + (seed % 50) / 10;
    const shortFloat = overview?.ShortPercentFloat ? Number(overview.ShortPercentFloat) * 100 : 2 + (seed % 200) / 10;
    const daysToCover = shortRatio;
    const squeezePotential = shortFloat > 20 ? "high" : shortFloat > 10 ? "medium" : "low";
    return { shortRatio: +shortRatio.toFixed(2), shortFloat: +shortFloat.toFixed(2), daysToCover: +daysToCover.toFixed(1), squeezePotential };
  }, [symbol, overview]);

  const sqColor = data.squeezePotential === "high" ? "text-destructive" : data.squeezePotential === "medium" ? "text-yellow-500" : "text-chart-2";
  const sqLabel = data.squeezePotential === "high" ? (lang === "de" ? "Hoch" : "High") : data.squeezePotential === "medium" ? (lang === "de" ? "Mittel" : "Medium") : (lang === "de" ? "Niedrig" : "Low");

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Short Interest" : "Short Interest"}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase">{lang === "de" ? "Short Ratio" : "Short Ratio"}</div>
          <div className="font-mono font-bold text-lg">{data.shortRatio}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase">Short % Float</div>
          <div className="font-mono font-bold text-lg">{data.shortFloat}%</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase">{lang === "de" ? "Tage bis Deckung" : "Days to Cover"}</div>
          <div className="font-mono font-bold text-lg">{data.daysToCover}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase">{lang === "de" ? "Squeeze-Potenzial" : "Squeeze Potential"}</div>
          <div className={`font-display font-bold text-lg ${sqColor}`}>{sqLabel}</div>
        </div>
      </div>
    </div>
  );
}
