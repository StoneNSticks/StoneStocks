/**
 * MacroDashboard — Comprehensive macroeconomic indicators from FRED.
 * Shows GDP, CPI, Unemployment, Fed Funds Rate, Yield Curve, M2,
 * Industrial Production, Consumer Sentiment, Housing, Retail Sales,
 * ISM Manufacturing, and Trade Balance with interactive charts.
 */
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useFredSeries } from "@/hooks/useStockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LineChart, BarChart3, TrendingUp, TrendingDown, Activity, DollarSign, Home, ShoppingCart, Factory, Users, Landmark, Scale, Info, ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
// PolymarketMacroModule hidden

interface FredIndicator {
  id: string;
  labelDe: string;
  labelEn: string;
  descDe: string;
  descEn: string;
  methodDe: string;
  methodEn: string;
  color: string;
  icon: any;
  unit: string;
  category: "growth" | "inflation" | "employment" | "monetary" | "consumer" | "trade";
}

const INDICATORS: FredIndicator[] = [
  // Growth
  { id: "GDP", labelDe: "BIP (Real)", labelEn: "Real GDP", descDe: "Bruttoinlandsprodukt (Mrd. USD)", descEn: "Gross Domestic Product (Bn USD)", methodDe: "Quartalswerte des realen BIP, inflationsbereinigt auf Basis 2017. Misst die gesamte wirtschaftliche Leistung.", methodEn: "Quarterly real GDP values, inflation-adjusted to 2017 base. Measures total economic output.", color: "hsl(210, 80%, 55%)", icon: BarChart3, unit: "Bn $", category: "growth" },
  { id: "INDPRO", labelDe: "Industrieproduktion", labelEn: "Industrial Production", descDe: "Index der Industrieproduktion (2017=100)", descEn: "Industrial Production Index (2017=100)", methodDe: "Monatlicher Index der Produktion in Bergbau, Verarbeitung und Versorgung. Basis 2017=100.", methodEn: "Monthly index of output in mining, manufacturing, and utilities. Base 2017=100.", color: "hsl(190, 70%, 45%)", icon: Factory, unit: "", category: "growth" },
  { id: "RSAFS", labelDe: "Einzelhandelsumsätze", labelEn: "Retail Sales", descDe: "Gesamte Einzelhandelsumsätze (Mio. USD)", descEn: "Total Retail Sales (Mn USD)", methodDe: "Monatliche Gesamtumsätze im Einzelhandel. Ein Schlüsselindikator für Konsumausgaben.", methodEn: "Monthly total retail trade sales. A key indicator of consumer spending.", color: "hsl(280, 65%, 55%)", icon: ShoppingCart, unit: "Mn $", category: "growth" },

  // Inflation
  { id: "CPIAUCSL", labelDe: "Verbraucherpreise (CPI)", labelEn: "Consumer Price Index", descDe: "Inflation – Verbraucherpreisindex", descEn: "Inflation – Consumer Price Index", methodDe: "Monatlicher CPI für alle städtischen Verbraucher. Misst die durchschnittliche Preisänderung für Waren und Dienstleistungen.", methodEn: "Monthly CPI for all urban consumers. Measures average price change for goods and services.", color: "hsl(0, 72%, 51%)", icon: TrendingUp, unit: "", category: "inflation" },
  { id: "PCEPI", labelDe: "PCE Preisindex", labelEn: "PCE Price Index", descDe: "Persönliche Konsumausgaben – Preisindex", descEn: "Personal Consumption Expenditures Price Index", methodDe: "Der bevorzugte Inflationsindikator der Fed. Breiter als CPI, da er auch indirekte Kosten berücksichtigt.", methodEn: "The Fed's preferred inflation measure. Broader than CPI, as it includes indirect costs.", color: "hsl(15, 85%, 55%)", icon: DollarSign, unit: "", category: "inflation" },

  // Employment
  { id: "UNRATE", labelDe: "Arbeitslosenquote", labelEn: "Unemployment Rate", descDe: "Zivile Arbeitslosenquote (%)", descEn: "Civilian Unemployment Rate (%)", methodDe: "Prozentsatz der Erwerbsbevölkerung ohne Beschäftigung. Veröffentlicht im monatlichen Arbeitsmarktbericht.", methodEn: "Percentage of labor force without employment. Released in monthly jobs report.", color: "hsl(38, 92%, 50%)", icon: Users, unit: "%", category: "employment" },
  { id: "PAYEMS", labelDe: "Beschäftigte (Non-Farm)", labelEn: "Nonfarm Payrolls", descDe: "Gesamte Beschäftigte außerhalb der Landwirtschaft (Tsd.)", descEn: "Total Nonfarm Employees (Thousands)", methodDe: "Monatliche Gesamtzahl der Beschäftigten außerhalb der Landwirtschaft. Der wichtigste Arbeitsmarktindikator.", methodEn: "Monthly total nonfarm employees. The most watched employment indicator.", color: "hsl(25, 80%, 50%)", icon: Activity, unit: "K", category: "employment" },

  // Monetary
  { id: "FEDFUNDS", labelDe: "Fed Funds Rate", labelEn: "Fed Funds Rate", descDe: "Leitzins der Federal Reserve (%)", descEn: "Federal Funds Effective Rate (%)", methodDe: "Der Zinssatz, zu dem Banken untereinander über Nacht leihen. Wird vom FOMC festgelegt und beeinflusst alle Zinssätze.", methodEn: "The rate banks charge each other for overnight loans. Set by the FOMC, influences all interest rates.", color: "hsl(145, 63%, 42%)", icon: Landmark, unit: "%", category: "monetary" },
  { id: "T10Y2Y", labelDe: "Zinsstrukturkurve (10Y-2Y)", labelEn: "Yield Curve (10Y-2Y)", descDe: "Spread zwischen 10J und 2J Treasury Bonds", descEn: "10-Year minus 2-Year Treasury Constant Maturity", methodDe: "Differenz zwischen 10- und 2-jährigen US-Staatsanleiherenditen. Negative Werte (Inversion) signalisieren oft eine bevorstehende Rezession.", methodEn: "Difference between 10-year and 2-year US Treasury yields. Negative values (inversion) often signal upcoming recession.", color: "hsl(280, 65%, 55%)", icon: TrendingDown, unit: "%", category: "monetary" },
  { id: "M2SL", labelDe: "Geldmenge M2", labelEn: "M2 Money Supply", descDe: "Geldmenge M2 (Mrd. USD)", descEn: "M2 Money Supply (Bn USD)", methodDe: "Umfasst Bargeld, Sichteinlagen, Spareinlagen und Geldmarktfonds. Wachstum deutet auf lockere Geldpolitik hin.", methodEn: "Includes cash, checking deposits, savings, and money market funds. Growth indicates loose monetary policy.", color: "hsl(330, 65%, 50%)", icon: DollarSign, unit: "Bn $", category: "monetary" },

  // Consumer
  { id: "UMCSENT", labelDe: "Verbraucherstimmung", labelEn: "Consumer Sentiment", descDe: "University of Michigan Consumer Sentiment Index", descEn: "University of Michigan Consumer Sentiment Index", methodDe: "Monatliche Umfrage unter Verbrauchern zur wirtschaftlichen Lage. Werte über 80 = optimistisch, unter 60 = pessimistisch.", methodEn: "Monthly consumer survey about economic conditions. Above 80 = optimistic, below 60 = pessimistic.", color: "hsl(50, 90%, 45%)", icon: Users, unit: "", category: "consumer" },
  { id: "HOUST", labelDe: "Baubeginne", labelEn: "Housing Starts", descDe: "Neue Wohnungsbaubeginne (Tsd.)", descEn: "New Housing Starts (Thousands)", methodDe: "Monatliche Anzahl der begonnenen Wohnungsbauprojekte. Ein Frühindikator für wirtschaftliche Aktivität.", methodEn: "Monthly number of new housing construction projects started. A leading economic indicator.", color: "hsl(170, 60%, 45%)", icon: Home, unit: "K", category: "consumer" },

  // Trade
  { id: "BOPGSTB", labelDe: "Handelsbilanz", labelEn: "Trade Balance", descDe: "Güter- und Dienstleistungshandelsbilanz (Mio. USD)", descEn: "Goods and Services Trade Balance (Mn USD)", methodDe: "Differenz zwischen Exporten und Importen. Negative Werte = Handelsdefizit, positive = Überschuss.", methodEn: "Difference between exports and imports. Negative = trade deficit, positive = surplus.", color: "hsl(200, 70%, 50%)", icon: Scale, unit: "Mn $", category: "trade" },
];

const CATEGORIES = [
  { key: "growth", labelDe: "Wachstum", labelEn: "Growth", icon: TrendingUp },
  { key: "inflation", labelDe: "Inflation", labelEn: "Inflation", icon: DollarSign },
  { key: "employment", labelDe: "Arbeitsmarkt", labelEn: "Employment", icon: Users },
  { key: "monetary", labelDe: "Geldpolitik", labelEn: "Monetary Policy", icon: Landmark },
  { key: "consumer", labelDe: "Verbraucher", labelEn: "Consumer", icon: ShoppingCart },
  { key: "trade", labelDe: "Handel", labelEn: "Trade", icon: Scale },
];

function FredChart({ indicator }: { indicator: FredIndicator }) {
  const { data, isLoading } = useFredSeries(indicator.id);
  const { lang } = useLanguage();
  const [showMethod, setShowMethod] = useState(false);
  const Icon = indicator.icon;

  if (isLoading) return <Skeleton className="h-72 rounded-xl" />;

  const observations = ((data as any)?.observations || [])
    .filter((o: any) => o.value !== null)
    .slice(0, 120)
    .reverse();

  if (!data || observations.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-6 text-center">
        <Icon className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium">{lang === "de" ? indicator.labelDe : indicator.labelEn}</p>
        <p className="text-xs text-muted-foreground mt-1">{lang === "de" ? "Daten nicht verfügbar" : "Data unavailable"}</p>
      </div>
    );
  }

  const latest = observations[observations.length - 1];
  const previous = observations.length > 1 ? observations[observations.length - 2] : null;
  const change = previous ? latest.value - previous.value : 0;
  const changePct = previous && previous.value !== 0 ? (change / previous.value) * 100 : 0;

  // Compute simple trend (last 4 datapoints)
  const recentSlice = observations.slice(-4);
  const trendUp = recentSlice.length >= 2 && recentSlice[recentSlice.length - 1].value > recentSlice[0].value;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/60 bg-card overflow-hidden">
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
          <div className="flex items-center gap-1 justify-end">
            <span className={`text-[10px] font-mono ${change >= 0 ? "text-chart-2" : "text-destructive"}`}>
              {change >= 0 ? "+" : ""}{change.toFixed(2)}
            </span>
            <Badge variant="secondary" className={`text-[9px] px-1 py-0 ${changePct >= 0 ? "text-chart-2" : "text-destructive"}`}>
              {changePct >= 0 ? "+" : ""}{changePct.toFixed(1)}%
            </Badge>
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
              width={50}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(1)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
              labelFormatter={(l: string) => l}
              formatter={(v: number) => [v.toLocaleString(undefined, { maximumFractionDigits: 2 }), lang === "de" ? indicator.labelDe : indicator.labelEn]}
            />
            <Area type="monotone" dataKey="value" stroke={indicator.color} fill={`url(#grad-${indicator.id})`} strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Methodology toggle */}
      <div className="border-t border-border/30">
        <button
          onClick={() => setShowMethod(!showMethod)}
          className="w-full flex items-center gap-1.5 px-4 py-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-3 w-3" />
          {lang === "de" ? "Methodik" : "Methodology"}
          {showMethod ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
        </button>
        <AnimatePresence>
          {showMethod && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden">
              <p className="px-4 pb-3 text-[11px] text-muted-foreground leading-relaxed">
                {lang === "de" ? indicator.methodDe : indicator.methodEn}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function MacroDashboard() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  usePageTitle(
    lang === "de" ? "Makro-Dashboard" : "Macro Dashboard",
    lang === "de" ? "13 Wirtschaftsindikatoren der US-Notenbank" : "13 key economic indicators from the Federal Reserve"
  );

  const filteredIndicators = activeCategory === "all"
    ? INDICATORS
    : INDICATORS.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-8 px-3 sm:px-4 lg:px-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                {lang === "de" ? "Makro" : "Macro"} <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === "de"
                  ? "13 Wirtschaftsindikatoren — mit Methodik-Erklärung"
                  : "13 economic indicators — with methodology explanations"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary" className="text-[10px]">
              {lang === "de" ? "Quelle: Federal Reserve Bank of St. Louis (FRED)" : "Source: Federal Reserve Bank of St. Louis (FRED)"}
            </Badge>
          </div>
        </motion.div>

        {/* Category filter pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {lang === "de" ? "Alle" : "All"} ({INDICATORS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = INDICATORS.filter(i => i.category === cat.key).length;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <CatIcon className="h-3 w-3" />
                {lang === "de" ? cat.labelDe : cat.labelEn} ({count})
              </button>
            );
          })}
        </div>

        {/* Polymarket Macro Expectations */}
        <PolymarketMacroModule />

        {/* Indicator grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIndicators.map((indicator) => (
            <FredChart key={indicator.id} indicator={indicator} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg bg-muted/40 border border-border/40 p-4 text-xs text-muted-foreground">
          <p>
            {lang === "de"
              ? "Alle Daten stammen von der Federal Reserve Bank of St. Louis (FRED). Die Aktualisierungsfrequenz variiert je nach Indikator (täglich, monatlich, vierteljährlich). Dies dient nur der Information und stellt keine Anlageberatung dar."
              : "All data sourced from the Federal Reserve Bank of St. Louis (FRED). Update frequency varies by indicator (daily, monthly, quarterly). This is for informational purposes only and does not constitute investment advice."}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
