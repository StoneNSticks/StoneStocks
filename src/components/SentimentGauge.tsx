import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketIndices } from "@/lib/stockApi";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";

export function SentimentGauge() {
  const t = useT();
  const { lang } = useLanguage();
  const { data: indices } = useQuery({
    queryKey: ["indices"],
    queryFn: getMarketIndices,
    staleTime: 60_000,
  });

  const sentiment = useMemo(() => {
    if (!indices || !Array.isArray(indices) || indices.length === 0) return null;
    const changes = indices
      .filter((idx: any) => idx.changePercent != null && !isNaN(idx.changePercent))
      .map((idx: any) => idx.changePercent);
    if (changes.length === 0) return null;
    const avg = changes.reduce((s: number, v: number) => s + v, 0) / changes.length;
    // Map avg change to 0-100 scale: -3% = 0 (Extreme Fear), +3% = 100 (Extreme Greed)
    const score = Math.min(100, Math.max(0, ((avg + 3) / 6) * 100));
    return { score, avg };
  }, [indices]);

  if (!sentiment) return null;

  const { score } = sentiment;
  const label = score <= 20
    ? (lang === "de" ? "Extreme Angst" : "Extreme Fear")
    : score <= 40
    ? (lang === "de" ? "Angst" : "Fear")
    : score <= 60
    ? (lang === "de" ? "Neutral" : "Neutral")
    : score <= 80
    ? (lang === "de" ? "Gier" : "Greed")
    : (lang === "de" ? "Extreme Gier" : "Extreme Greed");

  const color = score <= 20
    ? "text-destructive"
    : score <= 40
    ? "text-orange-500"
    : score <= 60
    ? "text-muted-foreground"
    : score <= 80
    ? "text-chart-2"
    : "text-chart-2";

  const rotation = -90 + (score / 100) * 180; // -90 to 90 degrees

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
          {lang === "de" ? "Marktstimmung" : "Market Sentiment"}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* Mini gauge arc */}
        <div className="relative w-20 h-12">
          <svg viewBox="0 0 100 55" className="w-full h-full">
            {/* Background arc */}
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" />
            {/* Gradient arc */}
            <defs>
              <linearGradient id="sentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--destructive))" />
                <stop offset="50%" stopColor="hsl(var(--muted-foreground))" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
            </defs>
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#sentGrad)" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
            {/* Needle */}
            <line
              x1="50" y1="50" x2="50" y2="18"
              stroke="hsl(var(--foreground))"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${rotation} 50 50)`}
            />
            <circle cx="50" cy="50" r="3" fill="hsl(var(--foreground))" />
          </svg>
        </div>
        <div>
          <div className={`font-display text-lg font-bold ${color}`}>{label}</div>
          <div className="text-[10px] font-mono text-muted-foreground">{score.toFixed(0)}/100</div>
        </div>
      </div>
    </motion.div>
  );
}
