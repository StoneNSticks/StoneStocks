/**
 * FairValue — Estimates fair value using multiple methods:
 * P/E-based, P/B-based, analyst target, and simple DCF.
 * Shows a consolidated fair value gauge with breakdown.
 */
import { useMemo } from "react";
import { useT } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FairValueProps {
  quote: any;
  overview: any;
  derived: any;
  recommendation: any;
}

function safeNum(v: unknown): number {
  const n = Number(v);
  return isNaN(n) || !isFinite(n) ? 0 : n;
}

export function FairValue({ quote, overview, derived, recommendation }: FairValueProps) {
  const t = useT();
  const { convert, symbol: cSym } = useCurrency();

  const estimates = useMemo(() => {
    const currentPrice = safeNum(quote?.c);
    if (!currentPrice) return null;

    const eps = safeNum(overview?.EPS);
    const bvps = safeNum(overview?.BookValue);
    const sectorPE = 20; // reasonable market average P/E
    const sectorPB = 3;  // reasonable market average P/B

    const methods: { key: string; value: number; weight: number }[] = [];

    // P/E based: sector-average PE * EPS
    if (eps > 0) {
      const peEstimate = sectorPE * eps;
      if (peEstimate > 0 && peEstimate < currentPrice * 5) {
        methods.push({ key: "fv.peBased", value: peEstimate, weight: 0.25 });
      }
    }

    // P/B based: sector-average PB * BVPS
    if (bvps > 0) {
      const pbEstimate = sectorPB * bvps;
      if (pbEstimate > 0 && pbEstimate < currentPrice * 5) {
        methods.push({ key: "fv.pbBased", value: pbEstimate, weight: 0.2 });
      }
    }

    // Analyst target
    const recs = Array.isArray(recommendation) ? recommendation : [];
    const latestRec = recs[0];
    const analystTarget = safeNum(overview?.AnalystTargetPrice);
    if (analystTarget > 0) {
      methods.push({ key: "fv.analystTarget", value: analystTarget, weight: 0.35 });
    }

    // Simple DCF: EPS * (1 + growth)^5 / discount
    const growthRate = safeNum(overview?.QuarterlyEarningsGrowthYOY) || 0.1;
    if (eps > 0) {
      const projectedEPS = eps * Math.pow(1 + Math.abs(growthRate), 5);
      const dcfValue = projectedEPS * 15 / Math.pow(1.1, 5);
      if (dcfValue > 0 && dcfValue < currentPrice * 5) {
        methods.push({ key: "fv.dcf", value: dcfValue, weight: 0.2 });
      }
    }

    if (methods.length === 0) return null;

    const totalWeight = methods.reduce((s, m) => s + m.weight, 0);
    const weightedFV = methods.reduce((s, m) => s + (m.value * m.weight), 0) / totalWeight;
    const upside = ((weightedFV - currentPrice) / currentPrice) * 100;

    return { currentPrice, fairValue: weightedFV, upside, methods };
  }, [quote, overview, recommendation]);

  if (!estimates) return null;

  const { currentPrice, fairValue, upside, methods } = estimates;
  const isUndervalued = upside > 10;
  const isOvervalued = upside < -10;
  const verdictKey = isUndervalued ? "fv.undervalued" : isOvervalued ? "fv.overvalued" : "fv.fairlyValued";
  const verdictColor = isUndervalued ? "text-chart-2 bg-chart-2/10" : isOvervalued ? "text-destructive bg-destructive/10" : "text-amber-500 bg-amber-500/10";
  const VerdictIcon = isUndervalued ? TrendingUp : isOvervalued ? TrendingDown : Minus;

  const fmtPrice = (v: number) => {
    const c = convert(v) || v;
    return `${cSym}${c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Gauge position: map price relative to fair value
  const ratio = currentPrice / fairValue;
  const gaugePercent = Math.max(5, Math.min(95, (1 - (ratio - 1)) * 50 + 50));

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="font-display font-bold text-sm">{t("fv.title")}</h3>
        <Badge className={`ml-auto text-[10px] ${verdictColor}`}>
          <VerdictIcon className="h-3 w-3 mr-1" />
          {t(verdictKey)}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {/* Main gauge */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("fv.currentPrice")}</div>
            <div className="font-mono font-bold">{fmtPrice(currentPrice)}</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold font-mono ${upside >= 0 ? "text-chart-2" : "text-destructive"}`}>
              {upside >= 0 ? "+" : ""}{upside.toFixed(1)}%
            </div>
            <div className="text-[10px] text-muted-foreground">{t("fv.upside")}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("fv.fairValue")}</div>
            <div className="font-mono font-bold text-primary">{fmtPrice(fairValue)}</div>
          </div>
        </div>

        {/* Visual gauge bar */}
        <div className="relative h-3 rounded-full bg-gradient-to-r from-destructive/20 via-amber-500/20 to-chart-2/20 overflow-hidden">
          <div
            className="absolute top-0 h-full w-1 bg-foreground rounded-full shadow-lg"
            style={{ left: `${gaugePercent}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-primary/60"
            style={{ left: "50%" }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground">
          <span>{t("fv.overvalued")}</span>
          <span>{t("fv.fairlyValued")}</span>
          <span>{t("fv.undervalued")}</span>
        </div>

        {/* Methods breakdown */}
        <div className="divide-y divide-border/20">
          {methods.map((m) => {
            const mUpside = ((m.value - currentPrice) / currentPrice) * 100;
            return (
              <div key={m.key} className="flex items-center justify-between py-2">
                <span className="text-xs text-muted-foreground">{t(m.key)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold">{fmtPrice(m.value)}</span>
                  <span className={`text-[10px] font-mono ${mUpside >= 0 ? "text-chart-2" : "text-destructive"}`}>
                    {mUpside >= 0 ? "+" : ""}{mUpside.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
