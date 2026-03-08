/**
 * VixIndicator — Shows a simulated VIX-like volatility indicator
 * based on the spread/dispersion of market index changes.
 */
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketIndices } from "@/lib/stockApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function VixIndicator() {
  const { lang } = useLanguage();
  const { data: indices } = useQuery({
    queryKey: ["indices"],
    queryFn: getMarketIndices,
    staleTime: 60_000,
  });

  const vixData = useMemo(() => {
    if (!indices || !Array.isArray(indices) || indices.length < 3) return null;
    const changes = indices
      .filter((idx: any) => idx.changePercent != null && !isNaN(idx.changePercent))
      .map((idx: any) => idx.changePercent);
    if (changes.length < 3) return null;

    const avg = changes.reduce((s: number, v: number) => s + v, 0) / changes.length;
    // Standard deviation as volatility proxy
    const variance = changes.reduce((s: number, v: number) => s + (v - avg) ** 2, 0) / changes.length;
    const stdDev = Math.sqrt(variance);

    // Map stdDev to a VIX-like scale: 0-0.5 = low (12-15), 0.5-1.5 = moderate (15-25), 1.5+ = high (25-40+)
    const vixEstimate = Math.min(50, 12 + stdDev * 15);
    return { vix: vixEstimate, stdDev };
  }, [indices]);

  if (!vixData) return null;

  const { vix } = vixData;
  const level = vix <= 15
    ? { label: lang === "de" ? "Niedrig" : "Low", color: "text-chart-2", bg: "bg-chart-2/15" }
    : vix <= 20
    ? { label: lang === "de" ? "Normal" : "Normal", color: "text-muted-foreground", bg: "bg-muted/20" }
    : vix <= 30
    ? { label: lang === "de" ? "Erhöht" : "Elevated", color: "text-orange-500", bg: "bg-orange-500/15" }
    : { label: lang === "de" ? "Hoch" : "High", color: "text-destructive", bg: "bg-destructive/15" };

  // Progress bar percentage (VIX 10-50 range)
  const pct = Math.min(100, Math.max(0, ((vix - 10) / 40) * 100));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
          {lang === "de" ? "Volatilitätsindex" : "Volatility Index"}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`font-display text-2xl font-bold ${level.color}`}>
              {vix.toFixed(1)}
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${level.bg} ${level.color}`}>
              {level.label}
            </span>
          </div>
          {/* Volatility bar */}
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, hsl(var(--chart-2)), hsl(var(--destructive)))`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-muted-foreground/60">{lang === "de" ? "Ruhig" : "Calm"}</span>
            <span className="text-[9px] text-muted-foreground/60">{lang === "de" ? "Volatil" : "Volatile"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
