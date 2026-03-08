/**
 * PortfolioAnalytics — Sector allocation, diversification score, risk metrics.
 * Renders below the main portfolio positions table.
 */
import { useMemo } from "react";
import { useT } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { ShieldCheck, Target, BarChart3, AlertTriangle } from "lucide-react";

const COLORS = [
  "hsl(210, 80%, 55%)", "hsl(145, 63%, 42%)", "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 55%)", "hsl(0, 72%, 51%)", "hsl(190, 70%, 45%)",
  "hsl(330, 65%, 50%)", "hsl(80, 60%, 45%)", "hsl(25, 95%, 53%)",
  "hsl(160, 60%, 40%)",
];

interface PositionData {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  sector?: string;
  name?: string;
}

interface PortfolioAnalyticsProps {
  positions: PositionData[];
}

export function PortfolioAnalytics({ positions }: PortfolioAnalyticsProps) {
  const t = useT();
  const { convert, symbol: cSym } = useCurrency();

  const analytics = useMemo(() => {
    if (positions.length === 0) return null;

    const totalValue = positions.reduce((s, p) => s + p.currentPrice * p.shares, 0);
    const totalCost = positions.reduce((s, p) => s + p.avgCost * p.shares, 0);
    const totalPnl = totalValue - totalCost;
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

    // Sector allocation
    const sectorMap: Record<string, number> = {};
    positions.forEach((p) => {
      const sector = p.sector || "Unknown";
      sectorMap[sector] = (sectorMap[sector] || 0) + p.currentPrice * p.shares;
    });
    const sectorData = Object.entries(sectorMap)
      .map(([name, value]) => ({ name, value, pct: (value / totalValue) * 100 }))
      .sort((a, b) => b.value - a.value);

    // Concentration (top position weight)
    const posWeights = positions.map((p) => ({
      symbol: p.symbol,
      weight: (p.currentPrice * p.shares) / totalValue * 100,
      pnlPct: p.avgCost > 0 ? ((p.currentPrice - p.avgCost) / p.avgCost) * 100 : 0,
    })).sort((a, b) => b.weight - a.weight);

    const topWeight = posWeights[0]?.weight || 0;

    // Diversification score (0-100)
    // Based on: number of positions, sector count, concentration
    const posCount = Math.min(positions.length / 15, 1) * 30; // max 30 for 15+ positions
    const sectorCount = Math.min(Object.keys(sectorMap).length / 8, 1) * 30; // max 30 for 8+ sectors
    const concentration = Math.max(0, (1 - topWeight / 50)) * 40; // max 40 when top < 50%
    const diversificationScore = Math.round(posCount + sectorCount + concentration);

    const scoreLabel = diversificationScore >= 70 ? "excellent" : diversificationScore >= 50 ? "good" : diversificationScore >= 30 ? "moderate" : "poor";

    return { totalValue, totalCost, totalPnl, totalPnlPct, sectorData, posWeights, diversificationScore, scoreLabel, topWeight };
  }, [positions]);

  if (!analytics) return null;

  const scoreColor = analytics.diversificationScore >= 70 ? "text-chart-2" : analytics.diversificationScore >= 50 ? "text-amber-500" : "text-destructive";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
      {/* Diversification Score */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h4 className="font-display font-bold text-sm">{t("pa.diversification")}</h4>
        </div>
        <div className="text-center py-4">
          <div className={`text-4xl font-bold font-mono ${scoreColor}`}>{analytics.diversificationScore}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">/ 100</div>
          <Badge className={`mt-2 text-[10px] ${analytics.diversificationScore >= 50 ? "bg-chart-2/10 text-chart-2" : "bg-amber-500/10 text-amber-500"}`}>
            {t(`pa.${analytics.scoreLabel}`)}
          </Badge>
        </div>
        <div className="space-y-2 text-xs mt-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pa.positions")}</span>
            <span className="font-mono">{positions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pa.sectors")}</span>
            <span className="font-mono">{analytics.sectorData.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pa.topConcentration")}</span>
            <span className="font-mono">{analytics.topWeight.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Sector Allocation Pie */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h4 className="font-display font-bold text-sm">{t("pa.sectorAlloc")}</h4>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analytics.sectorData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={2}>
                {analytics.sectorData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
                formatter={(v: number) => [`${cSym}${(convert(v) || v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1 mt-1">
          {analytics.sectorData.slice(0, 5).map((s, i) => (
            <div key={s.name} className="flex items-center gap-2 text-[10px]">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-muted-foreground truncate flex-1">{s.name}</span>
              <span className="font-mono">{s.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Position Weights Bar */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h4 className="font-display font-bold text-sm">{t("pa.posWeights")}</h4>
        </div>
        <div className="space-y-2">
          {analytics.posWeights.slice(0, 8).map((p) => (
            <div key={p.symbol} className="flex items-center gap-2">
              <span className="text-[10px] font-mono w-10 shrink-0">{p.symbol}</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/60"
                  style={{ width: `${Math.min(p.weight, 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono w-10 text-right">{p.weight.toFixed(1)}%</span>
              <span className={`text-[9px] font-mono w-12 text-right ${p.pnlPct >= 0 ? "text-chart-2" : "text-destructive"}`}>
                {p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
