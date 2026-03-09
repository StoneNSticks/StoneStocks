import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketIndices } from "@/lib/stockApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, ChevronDown, ChevronUp, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

export function SentimentGauge() {
  const { lang } = useLanguage();
  const [showFormula, setShowFormula] = useState(false);

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
    const score = Math.min(100, Math.max(0, ((avg + 3) / 6) * 100));
    return { score, avg, count: changes.length };
  }, [indices]);

  if (!sentiment) return null;

  const { score, avg, count } = sentiment;

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
    : "text-chart-2";

  const rotation = -90 + (score / 100) * 180;

  const step1 = `(${avg >= 0 ? "+" : ""}${avg.toFixed(2)}% + 3%) / 6%`;
  const step2 = `${(((avg + 3) / 6) * 100).toFixed(1)}`;
  const clampedStep = score.toFixed(0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/60 bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            {lang === "de" ? "Marktstimmung" : "Market Sentiment"}
          </span>
        </div>
        <Link
          to="/sentiment"
          className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors font-medium"
        >
          {lang === "de" ? "Vollanalyse" : "Full analysis"}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Gauge + Label */}
      <div className="flex items-center gap-4 mb-3">
        <div className="relative w-20 h-12 shrink-0">
          <svg viewBox="0 0 100 55" className="w-full h-full">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" />
            <defs>
              <linearGradient id="sentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--destructive))" />
                <stop offset="50%" stopColor="hsl(var(--muted-foreground))" />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" />
              </linearGradient>
            </defs>
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#sentGrad)" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
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

      {/* Formula toggle */}
      <button
        onClick={() => setShowFormula(v => !v)}
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <Info className="h-3 w-3" />
        <span>{lang === "de" ? "Wie wird das berechnet?" : "How is this calculated?"}</span>
        {showFormula ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
      </button>

      <AnimatePresence>
        {showFormula && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pt-2 border-t border-border/40 space-y-2">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {lang === "de"
                  ? `Dieser Indikator misst das Momentum von ${count} globalen Indizes (S&P 500, Nasdaq, DAX, etc.) und normalisiert den Durchschnitt auf eine 0–100 Skala.`
                  : `This indicator measures the momentum of ${count} global indices (S&P 500, Nasdaq, DAX, etc.) and normalizes the average to a 0–100 scale.`}
              </p>

              {/* Formula box */}
              <div className="rounded-md bg-muted/40 p-2 font-mono text-[10px] space-y-1">
                <div className="text-muted-foreground">
                  {lang === "de" ? "Formel:" : "Formula:"}
                </div>
                <div className="text-foreground">
                  Score = ((Ø + 3%) / 6%) × 100
                </div>
                <div className="text-muted-foreground border-t border-border/30 pt-1 mt-1">
                  {lang === "de" ? "Aktuell:" : "Current:"}
                </div>
                <div className="text-foreground">
                  = ({step1}) × 100
                </div>
                <div className="text-foreground">
                  = {step2} → <span className={`font-bold ${color}`}>{clampedStep}/100</span>
                </div>
              </div>

              <p className="text-[9px] text-muted-foreground/70 leading-relaxed">
                {lang === "de"
                  ? "⚠ Dies ist ein reiner Momentum-Indikator. Die Vollanalyse auf der Stimmungsseite nutzt ein 7-Indikatoren-Modell (Marktbreite, Volatilität, Sichere Häfen, etc.)."
                  : "⚠ This is a momentum-only signal. The full analysis on the Sentiment page uses a 7-indicator model (breadth, volatility, safe havens, etc.)."}
              </p>

              <Link
                to="/sentiment"
                className="flex items-center gap-1 text-[10px] text-primary hover:underline font-medium"
              >
                {lang === "de" ? "Vollständige Methodik ansehen" : "View full methodology"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
