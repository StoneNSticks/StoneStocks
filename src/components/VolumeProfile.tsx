/**
 * Phase 31: Volume Profile — Volume distribution by price levels
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart3 } from "lucide-react";

interface Props { symbol: string; currentPrice?: number }

export function VolumeProfile({ symbol, currentPrice = 180 }: Props) {
  const { lang } = useLanguage();

  const levels = useMemo(() => {
    const seed = symbol.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    const range = currentPrice * 0.15;
    const low = currentPrice - range;
    const step = (range * 2) / 15;
    return Array.from({ length: 15 }, (_, i) => {
      const price = low + i * step;
      const distFromCurrent = Math.abs(price - currentPrice) / currentPrice;
      const vol = Math.max(10, 100 - distFromCurrent * 300 + Math.sin(seed + i) * 20);
      return { price: +price.toFixed(2), volume: +vol.toFixed(0), isCurrent: Math.abs(price - currentPrice) < step / 2 };
    });
  }, [symbol, currentPrice]);

  const maxVol = Math.max(...levels.map(l => l.volume));

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Volumenprofil" : "Volume Profile"}</h3>
      </div>
      <div className="space-y-0.5">
        {levels.map((l, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <span className="text-[10px] font-mono text-muted-foreground w-14 text-right shrink-0">${l.price.toFixed(0)}</span>
            <div className="flex-1 h-4 relative">
              <div
                className={`h-full rounded-r transition-all ${l.isCurrent ? "bg-primary" : "bg-primary/30 group-hover:bg-primary/50"}`}
                style={{ width: `${(l.volume / maxVol) * 100}%` }}
              />
            </div>
            {l.isCurrent && <span className="text-[9px] text-primary font-bold">◄</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
