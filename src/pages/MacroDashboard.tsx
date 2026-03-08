/**
 * MacroDashboard — Displays key macroeconomic indicators from FRED.
 * Shows GDP, CPI, Unemployment, Fed Funds Rate with interactive charts.
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useFredSeries } from "@/hooks/useStockData";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LineChart, BarChart3, TrendingUp, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { AISectorRotation } from "@/components/AISectorRotation";

interface FredIndicator {
  id: string;
  labelDe: string;
  labelEn: string;
  descDe: string;
  descEn: string;
  color: string;
  icon: typeof LineChart;
  unit: string;
}

const INDICATORS: FredIndicator[] = [
  { id: "GDP", labelDe: "BIP (Real)", labelEn: "Real GDP", descDe: "Bruttoinlandsprodukt (Mrd. USD)", descEn: "Gross Domestic Product (Bn USD)", color: "hsl(210, 80%, 55%)", icon: BarChart3, unit: "Bn $" },
  { id: "CPIAUCSL", labelDe: "Verbraucherpreise (CPI)", labelEn: "Consumer Price Index", descDe: "Inflation – Verbraucherpreisindex", descEn: "Inflation – Consumer Price Index", color: "hsl(0, 72%, 51%)", icon: TrendingUp, unit: "" },
  { id: "UNRATE", labelDe: "Arbeitslosenquote", labelEn: "Unemployment Rate", descDe: "Zivile Arbeitslosenquote (%)", descEn: "Civilian Unemployment Rate (%)", color: "hsl(38, 92%, 50%)", icon: Activity, unit: "%" },
  { id: "FEDFUNDS", labelDe: "Fed Funds Rate", labelEn: "Fed Funds Rate", descDe: "Leitzins der Federal Reserve (%)", descEn: "Federal Funds Effective Rate (%)", color: "hsl(145, 63%, 42%)", icon: LineChart, unit: "%" },
  { id: "T10Y2Y", labelDe: "Zinsstrukturkurve (10Y-2Y)", labelEn: "Yield Curve (10Y-2Y)", descDe: "Spread zwischen 10-jährigen und 2-jährigen Treasury Bonds", descEn: "10-Year minus 2-Year Treasury Constant Maturity", color: "hsl(280, 65%, 55%)", icon: TrendingUp, unit: "%" },
  { id: "M2SL", labelDe: "Geldmenge M2", labelEn: "M2 Money Supply", descDe: "Geldmenge M2 (Mrd. USD)", descEn: "M2 Money Supply (Bn USD)", color: "hsl(190, 70%, 45%)", icon: BarChart3, unit: "Bn $" },
];

function FredChart({ indicator }: { indicator: FredIndicator }) {
  const { data, isLoading } = useFredSeries(indicator.id);
  const { lang } = useLanguage();

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  const observations = ((data as any)?.observations || [])
    .filter((o: any) => o.value !== null)
    .slice(0, 120)
    .reverse();

  if (observations.length === 0) return null;

  const latest = observations[observations.length - 1];
  const previous = observations.length > 1 ? observations[observations.length - 2] : null;
  const change = previous ? latest.value - previous.value : 0;
  const Icon = indicator.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/60 bg-card overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4 border-b border-border/40 bg-muted/30">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${indicator.color}20` }}>
          <Icon className="h-4 w-4" style={{ color: indicator.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm truncate">
            {lang === "de" ? indicator.labelDe : indicator.labelEn}
          </h3>
          <p className="text-[10px] text-muted-foreground truncate">
            {lang === "de" ? indicator.descDe : indicator.descEn}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono font-bold text-sm">
            {latest?.value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[10px] font-mono ${change >= 0 ? "text-chart-2" : "text-destructive"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="p-3 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={observations} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${indicator.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={indicator.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={indicator.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(d: string) => d?.substring(0, 7) || ""}
              interval="preserveStartEnd"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              width={45}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              labelFormatter={(l: string) => l}
              formatter={(v: number) => [v.toLocaleString(undefined, { maximumFractionDigits: 2 }), lang === "de" ? indicator.labelDe : indicator.labelEn]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={indicator.color}
              fill={`url(#grad-${indicator.id})`}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default function MacroDashboard() {
  const t = useT();
  const { lang } = useLanguage();

  usePageTitle(
    lang === "de" ? "Makro-Dashboard" : "Macro Dashboard",
    lang === "de" ? "Wichtige Wirtschaftsindikatoren der US-Notenbank" : "Key economic indicators from the Federal Reserve"
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-8 px-3 sm:px-4 lg:px-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                {lang === "de" ? "Makro-Dashboard" : "Macro Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === "de" ? "Wirtschaftsindikatoren der Federal Reserve (FRED)" : "Economic indicators from the Federal Reserve (FRED)"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] mt-2">
            {lang === "de" ? "Quelle: Federal Reserve Bank of St. Louis" : "Source: Federal Reserve Bank of St. Louis"}
          </Badge>
        </motion.div>

        {/* AI Sector Rotation */}
        <AISectorRotation />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INDICATORS.map((indicator) => (
            <FredChart key={indicator.id} indicator={indicator} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
