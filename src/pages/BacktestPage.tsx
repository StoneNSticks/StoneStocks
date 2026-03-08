/**
 * BacktestPage — Strategy simulator with equity curve, trade log, and performance metrics.
 * Supports 15 strategies with configurable parameters.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSearchStocks } from "@/hooks/useStockData";
import { getTimeSeries } from "@/lib/stockApi";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Search, Play, TrendingUp, TrendingDown, Activity, BarChart3, Target, Zap, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  runBuyAndHold, runSMACrossover, runRSIStrategy, runMACDStrategy,
  runBollingerStrategy, runDualMomentumStrategy, runMeanReversionStrategy,
  runBreakoutStrategy, runTripleSMAStrategy, runVolumeWeightedMomentum,
  runMomentumStrategy, runStochasticStrategy, runVWAPStrategy,
  runChandelierStrategy, runKeltnerStrategy,
  type OHLC, type BacktestResult,
} from "@/lib/backtestEngine";

type Strategy =
  | "buy_hold" | "sma_crossover" | "rsi" | "macd" | "bollinger"
  | "dual_momentum" | "mean_reversion" | "breakout" | "triple_sma"
  | "volume_momentum" | "momentum" | "stochastic" | "vwap" | "chandelier" | "keltner";

interface StrategyInfo {
  key: Strategy;
  label: string;
  labelDe: string;
  category: "trend" | "mean_reversion" | "momentum" | "volatility";
  description: string;
  descriptionDe: string;
}

const STRATEGIES: StrategyInfo[] = [
  { key: "buy_hold", label: "Buy & Hold", labelDe: "Buy & Hold", category: "trend", description: "Buy at start, hold until end. The benchmark.", descriptionDe: "Kaufen und bis zum Ende halten. Die Benchmark." },
  { key: "sma_crossover", label: "SMA Crossover", labelDe: "SMA Crossover", category: "trend", description: "Buy on golden cross (short SMA > long SMA), sell on death cross.", descriptionDe: "Kaufen bei Golden Cross, verkaufen bei Death Cross." },
  { key: "triple_sma", label: "Triple SMA", labelDe: "Triple SMA", category: "trend", description: "Buy when fast > mid > slow SMA alignment. Stronger trend confirmation.", descriptionDe: "Kaufen wenn schneller > mittlerer > langsamer SMA. Stärkere Trendbestätigung." },
  { key: "macd", label: "MACD Crossover", labelDe: "MACD Crossover", category: "trend", description: "Buy when MACD crosses above signal line, sell on cross below.", descriptionDe: "Kaufen wenn MACD die Signallinie von unten kreuzt." },
  { key: "dual_momentum", label: "Dual Momentum", labelDe: "Dual Momentum", category: "momentum", description: "Combines absolute momentum (ROC > 0) with trend filter (price > 200 SMA).", descriptionDe: "Kombiniert absolutes Momentum mit Trendfilter (Kurs > 200 SMA)." },
  { key: "momentum", label: "Rate of Change", labelDe: "Rate of Change", category: "momentum", description: "Buy when price gained >5% over lookback, sell on reversal.", descriptionDe: "Kaufen bei >5% Kursanstieg, verkaufen bei Umkehr." },
  { key: "volume_momentum", label: "Volume + Momentum", labelDe: "Volumen + Momentum", category: "momentum", description: "Buy on high volume breakouts (1.5x avg volume + uptrend).", descriptionDe: "Kaufen bei hohem Volumen-Ausbrüchen (1.5x Durchschnitt + Aufwärtstrend)." },
  { key: "rsi", label: "RSI Strategy", labelDe: "RSI Strategie", category: "mean_reversion", description: "Buy when RSI signals oversold, sell when overbought.", descriptionDe: "Kaufen bei RSI überverkauft, verkaufen bei überkauft." },
  { key: "bollinger", label: "Bollinger Bands", labelDe: "Bollinger Bänder", category: "mean_reversion", description: "Buy below lower band, sell above upper band. Mean reversion.", descriptionDe: "Kaufen unter unterem Band, verkaufen über oberem Band." },
  { key: "mean_reversion", label: "Mean Reversion", labelDe: "Mean Reversion", category: "mean_reversion", description: "Buy when price drops X% below SMA, sell when returns to SMA.", descriptionDe: "Kaufen wenn Kurs X% unter SMA fällt, verkaufen bei Rückkehr." },
  { key: "stochastic", label: "Stochastic Oscillator", labelDe: "Stochastik Oszillator", category: "mean_reversion", description: "Buy when %K drops below 20, sell above 80.", descriptionDe: "Kaufen wenn %K unter 20, verkaufen über 80." },
  { key: "vwap", label: "VWAP Reversion", labelDe: "VWAP Reversion", category: "mean_reversion", description: "Buy below VWAP, sell when price returns above.", descriptionDe: "Kaufen unter VWAP, verkaufen bei Rückkehr darüber." },
  { key: "breakout", label: "Donchian Breakout", labelDe: "Donchian Ausbruch", category: "volatility", description: "Buy on new highs (Donchian channel), sell on new lows.", descriptionDe: "Kaufen bei neuen Hochs, verkaufen bei neuen Tiefs." },
  { key: "chandelier", label: "Chandelier Exit", labelDe: "Chandelier Exit", category: "volatility", description: "ATR-based trailing stop. Enter on trend, exit on volatility spike.", descriptionDe: "ATR-basierter Trailing Stop. Einstieg bei Trend, Ausstieg bei Volatilität." },
  { key: "keltner", label: "Keltner Channel", labelDe: "Keltner Kanal", category: "volatility", description: "Buy on upper channel breakout, sell on lower channel breakdown.", descriptionDe: "Kaufen bei Ausbruch über oberen Kanal, verkaufen bei Durchbruch unter unteren." },
];

const CATEGORY_LABELS = {
  trend: { en: "Trend Following", de: "Trendfolge" },
  momentum: { en: "Momentum", de: "Momentum" },
  mean_reversion: { en: "Mean Reversion", de: "Mean Reversion" },
  volatility: { en: "Volatility / Breakout", de: "Volatilität / Ausbruch" },
};

function MetricCard({ label, value, suffix, icon: Icon, color }: { label: string; value: string; suffix?: string; icon: any; color: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="font-display font-bold text-lg">
        {value}{suffix && <span className="text-sm text-muted-foreground ml-0.5">{suffix}</span>}
      </div>
    </div>
  );
}

export default function BacktestPage() {
  const { lang } = useLanguage();

  usePageTitle(
    lang === "de" ? "Backtesting Simulator" : "Backtesting Simulator",
    lang === "de" ? "15 Strategien auf historischen Daten testen" : "Test 15 strategies on historical data"
  );

  const [symbol, setSymbol] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("sma_crossover");
  const [capital, setCapital] = useState(10000);
  const [runKey, setRunKey] = useState(0);

  // Strategy-specific params
  const [smaShort, setSmaShort] = useState(20);
  const [smaLong, setSmaLong] = useState(50);
  const [rsiOversold, setRsiOversold] = useState(30);
  const [rsiOverbought, setRsiOverbought] = useState(70);
  const [macdFast, setMacdFast] = useState(12);
  const [macdSlow, setMacdSlow] = useState(26);
  const [macdSignal, setMacdSignal] = useState(9);
  const [bbPeriod, setBbPeriod] = useState(20);
  const [bbStdDev, setBbStdDev] = useState(2);
  const [breakoutPeriod, setBreakoutPeriod] = useState(20);
  const [tripleFast, setTripleFast] = useState(10);
  const [tripleMid, setTripleMid] = useState(30);
  const [tripleSlow, setTripleSlow] = useState(50);
  const [mrPeriod, setMrPeriod] = useState(20);
  const [mrDeviation, setMrDeviation] = useState(5);
  const [momLookback, setMomLookback] = useState(20);
  const [stochPeriod, setStochPeriod] = useState(14);
  const [vwapDeviation, setVwapDeviation] = useState(2);
  const [chandAtrPeriod, setChandAtrPeriod] = useState(22);
  const [chandMultiplier, setChandMultiplier] = useState(3);
  const [keltnerEma, setKeltnerEma] = useState(20);
  const [keltnerMultiplier, setKeltnerMultiplier] = useState(2);

  const { data: searchResults } = useSearchStocks(searchQuery);

  const { data: rawSeries, isLoading: seriesLoading } = useQuery({
    queryKey: ["backtest-series", symbol, runKey],
    queryFn: () => getTimeSeries(symbol, "1day", "1000"),
    enabled: !!symbol && runKey > 0,
    staleTime: 1000 * 60 * 60,
  });

  const ohlcData: OHLC[] = useMemo(() => {
    if (!rawSeries) return [];
    let points: any[] = [];
    if (Array.isArray(rawSeries)) points = rawSeries;
    else if (rawSeries.values) points = rawSeries.values;
    else if (rawSeries.results) points = rawSeries.results;

    return points
      .map((p: any) => ({
        date: p.datetime || p.date || p.t || "",
        open: Number(p.open || p.o || 0),
        high: Number(p.high || p.h || 0),
        low: Number(p.low || p.l || 0),
        close: Number(p.close || p.c || 0),
        volume: Number(p.volume || p.v || 0),
      }))
      .filter(p => p.date && p.close > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [rawSeries]);

  const result: BacktestResult | null = useMemo(() => {
    if (ohlcData.length < 2) return null;
    switch (strategy) {
      case "buy_hold": return runBuyAndHold(ohlcData, capital);
      case "sma_crossover": return runSMACrossover(ohlcData, capital, smaShort, smaLong);
      case "rsi": return runRSIStrategy(ohlcData, capital, rsiOversold, rsiOverbought);
      case "macd": return runMACDStrategy(ohlcData, capital, macdFast, macdSlow, macdSignal);
      case "bollinger": return runBollingerStrategy(ohlcData, capital, bbPeriod, bbStdDev);
      case "dual_momentum": return runDualMomentumStrategy(ohlcData, capital);
      case "mean_reversion": return runMeanReversionStrategy(ohlcData, capital, mrPeriod, mrDeviation);
      case "breakout": return runBreakoutStrategy(ohlcData, capital, breakoutPeriod);
      case "triple_sma": return runTripleSMAStrategy(ohlcData, capital, tripleFast, tripleMid, tripleSlow);
      case "volume_momentum": return runVolumeWeightedMomentum(ohlcData, capital);
      case "momentum": return runMomentumStrategy(ohlcData, capital, momLookback);
      case "stochastic": return runStochasticStrategy(ohlcData, capital, stochPeriod);
      case "vwap": return runVWAPStrategy(ohlcData, capital, vwapDeviation);
      case "chandelier": return runChandelierStrategy(ohlcData, capital, chandAtrPeriod, chandMultiplier);
      case "keltner": return runKeltnerStrategy(ohlcData, capital, keltnerEma, 10, keltnerMultiplier);
      default: return null;
    }
  }, [ohlcData, strategy, capital, smaShort, smaLong, rsiOversold, rsiOverbought, macdFast, macdSlow, macdSignal, bbPeriod, bbStdDev, breakoutPeriod, tripleFast, tripleMid, tripleSlow, mrPeriod, mrDeviation, momLookback, stochPeriod, vwapDeviation, chandAtrPeriod, chandMultiplier, keltnerEma, keltnerMultiplier]);

  const selectSymbol = (sym: string) => { setSymbol(sym.toUpperCase()); setSearchQuery(""); };
  const runBacktest = () => { if (symbol) setRunKey(k => k + 1); };

  const m = result?.metrics;
  const activeStrategy = STRATEGIES.find(s => s.key === strategy)!;

  const renderParams = () => {
    const P = ({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) => (
      <div>
        <label className="text-[10px] font-medium text-muted-foreground mb-1 block">{label}</label>
        <Input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="h-8 rounded-lg text-xs" min={min} max={max} step={step} />
      </div>
    );

    switch (strategy) {
      case "sma_crossover": return <><P label="SMA Short" value={smaShort} onChange={setSmaShort} /><P label="SMA Long" value={smaLong} onChange={setSmaLong} /></>;
      case "rsi": return <><P label={lang === "de" ? "Überverkauft" : "Oversold"} value={rsiOversold} onChange={setRsiOversold} /><P label={lang === "de" ? "Überkauft" : "Overbought"} value={rsiOverbought} onChange={setRsiOverbought} /></>;
      case "macd": return <><P label="Fast" value={macdFast} onChange={setMacdFast} /><P label="Slow" value={macdSlow} onChange={setMacdSlow} /><P label="Signal" value={macdSignal} onChange={setMacdSignal} /></>;
      case "bollinger": return <><P label="Period" value={bbPeriod} onChange={setBbPeriod} /><P label="Std Dev" value={bbStdDev} onChange={setBbStdDev} step={0.5} /></>;
      case "breakout": return <P label="Period" value={breakoutPeriod} onChange={setBreakoutPeriod} />;
      case "triple_sma": return <><P label="Fast" value={tripleFast} onChange={setTripleFast} /><P label="Mid" value={tripleMid} onChange={setTripleMid} /><P label="Slow" value={tripleSlow} onChange={setTripleSlow} /></>;
      case "mean_reversion": return <><P label="SMA Period" value={mrPeriod} onChange={setMrPeriod} /><P label="Deviation %" value={mrDeviation} onChange={setMrDeviation} step={0.5} /></>;
      case "momentum": return <P label="Lookback" value={momLookback} onChange={setMomLookback} />;
      case "stochastic": return <P label="Period" value={stochPeriod} onChange={setStochPeriod} />;
      case "vwap": return <P label="Deviation %" value={vwapDeviation} onChange={setVwapDeviation} step={0.5} />;
      case "chandelier": return <><P label="ATR Period" value={chandAtrPeriod} onChange={setChandAtrPeriod} /><P label="Multiplier" value={chandMultiplier} onChange={setChandMultiplier} step={0.5} /></>;
      case "keltner": return <><P label="EMA Period" value={keltnerEma} onChange={setKeltnerEma} /><P label="Multiplier" value={keltnerMultiplier} onChange={setKeltnerMultiplier} step={0.5} /></>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-8 px-3 sm:px-4 lg:px-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {lang === "de" ? "Backtesting" : "Backtesting"} <span className="text-primary">Simulator</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            {lang === "de"
              ? "15 Trading-Strategien auf historischen Daten testen und vergleichen."
              : "Test and compare 15 trading strategies on historical data."}
          </p>
        </motion.div>

        {/* ── Config Panel ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border/60 bg-card p-5 mb-6 space-y-4">
          {/* Symbol + Capital */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {lang === "de" ? "Aktie" : "Stock"}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={lang === "de" ? "Symbol suchen..." : "Search symbol..."}
                  value={symbol || searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); if (symbol) setSymbol(""); }}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>
              {searchResults && searchQuery.length >= 1 && !symbol && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border/60 bg-card shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                  {(searchResults as any[]).slice(0, 6).map((r: any) => (
                    <button key={r.symbol} onClick={() => selectSymbol(r.symbol || r.displaySymbol)} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left">
                      <span className="font-mono font-bold text-sm text-primary">{r.displaySymbol || r.symbol}</span>
                      <span className="text-xs text-muted-foreground truncate">{r.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {lang === "de" ? "Startkapital ($)" : "Initial Capital ($)"}
              </label>
              <Input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value) || 10000)} className="h-10 rounded-xl text-sm" />
            </div>
          </div>

          {/* Strategy selector — grouped by category */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              {lang === "de" ? "Strategie wählen" : "Select Strategy"}
            </label>
            <div className="space-y-3">
              {(["trend", "momentum", "mean_reversion", "volatility"] as const).map(cat => {
                const catStrategies = STRATEGIES.filter(s => s.category === cat);
                return (
                  <div key={cat}>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
                      {CATEGORY_LABELS[cat][lang === "de" ? "de" : "en"]}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {catStrategies.map(s => (
                        <button
                          key={s.key}
                          onClick={() => setStrategy(s.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            strategy === s.key
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          }`}
                        >
                          {lang === "de" ? s.labelDe : s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategy description */}
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-foreground">{lang === "de" ? activeStrategy.labelDe : activeStrategy.label}</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {lang === "de" ? activeStrategy.descriptionDe : activeStrategy.description}
              </p>
            </div>
          </div>

          {/* Strategy params */}
          {renderParams() && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {renderParams()}
            </div>
          )}

          <Button onClick={runBacktest} disabled={!symbol || seriesLoading} className="w-full sm:w-auto gap-2 rounded-xl">
            <Play className="h-4 w-4" />
            {seriesLoading ? (lang === "de" ? "Laden..." : "Loading...") : (lang === "de" ? "Backtest starten" : "Run Backtest")}
          </Button>
        </motion.div>

        {/* ── Disclaimer ── */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border/40 p-3 mb-6 text-xs text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          {lang === "de"
            ? "Vergangene Performance ist kein Indikator für zukünftige Ergebnisse. Dies ist nur eine Simulation."
            : "Past performance is not indicative of future results. This is a simulation only."}
        </div>

        {/* ── Results ── */}
        {seriesLoading && <Skeleton className="h-96 rounded-xl" />}

        {result && m && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard
                label={lang === "de" ? "Gesamtrendite" : "Total Return"}
                value={`${m.totalReturn >= 0 ? "+" : ""}${m.totalReturn.toFixed(1)}`}
                suffix="%"
                icon={m.totalReturn >= 0 ? TrendingUp : TrendingDown}
                color={m.totalReturn >= 0 ? "text-chart-2" : "text-destructive"}
              />
              <MetricCard
                label={lang === "de" ? "Jährl. Rendite" : "Annual Return"}
                value={`${m.annualizedReturn >= 0 ? "+" : ""}${m.annualizedReturn.toFixed(1)}`}
                suffix="%"
                icon={BarChart3}
                color="text-primary"
              />
              <MetricCard label="Max Drawdown" value={`-${m.maxDrawdown.toFixed(1)}`} suffix="%" icon={AlertTriangle} color="text-destructive" />
              <MetricCard label="Sharpe Ratio" value={m.sharpeRatio.toFixed(2)} icon={Target} color="text-primary" />
              <MetricCard
                label={lang === "de" ? "Endkapital" : "Final Equity"}
                value={`$${m.finalEquity.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                icon={Zap}
                color="text-chart-2"
              />
              <MetricCard label="Win Rate" value={m.winRate.toFixed(0)} suffix="%" icon={Target} color={m.winRate >= 50 ? "text-chart-2" : "text-destructive"} />
              <MetricCard label={lang === "de" ? "Trades" : "Total Trades"} value={String(m.totalTrades)} icon={Activity} color="text-muted-foreground" />
              <MetricCard
                label="Buy & Hold"
                value={`${m.benchmarkReturn >= 0 ? "+" : ""}${m.benchmarkReturn.toFixed(1)}`}
                suffix="%"
                icon={TrendingUp}
                color="text-muted-foreground"
              />
            </div>

            {/* Alpha badge */}
            {m.totalReturn !== m.benchmarkReturn && (
              <div className="flex items-center gap-2">
                <Badge variant={m.totalReturn > m.benchmarkReturn ? "default" : "secondary"} className={`text-xs ${m.totalReturn > m.benchmarkReturn ? "bg-chart-2/15 text-chart-2 border-chart-2/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>
                  Alpha: {m.totalReturn > m.benchmarkReturn ? "+" : ""}{(m.totalReturn - m.benchmarkReturn).toFixed(1)}%
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {m.totalReturn > m.benchmarkReturn
                    ? (lang === "de" ? "Strategie schlägt Buy & Hold" : "Strategy beats Buy & Hold")
                    : (lang === "de" ? "Buy & Hold war besser" : "Buy & Hold performed better")}
                </span>
              </div>
            )}

            {/* Equity curve */}
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">
                {lang === "de" ? "Equity-Kurve" : "Equity Curve"} — {symbol} ({lang === "de" ? activeStrategy.labelDe : activeStrategy.label})
              </h3>
              <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.equity}>
                    <defs>
                      <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="bmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(d: string) => d.slice(5, 10)} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(value: number, name: string) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, name === "benchmark" ? "Buy & Hold" : (lang === "de" ? activeStrategy.labelDe : activeStrategy.label)]}
                    />
                    <ReferenceLine y={capital} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fill="url(#bmGrad)" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Buy & Hold" />
                    <Area type="monotone" dataKey="equity" stroke="hsl(145, 63%, 42%)" fill="url(#eqGrad)" strokeWidth={2} dot={false} name={lang === "de" ? activeStrategy.labelDe : activeStrategy.label} />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trade log */}
            {result.trades.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="text-sm font-semibold mb-3">
                  {lang === "de" ? "Trade-Protokoll" : "Trade Log"} ({result.trades.length})
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {result.trades.map((tr, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 text-xs">
                      <Badge variant={tr.type === "buy" ? "default" : "secondary"} className={`text-[10px] px-2 py-0.5 ${tr.type === "buy" ? "bg-chart-2/15 text-chart-2 border-chart-2/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>
                        {tr.type.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-muted-foreground">{tr.date}</span>
                      <span className="font-mono font-semibold">${tr.price.toFixed(2)}</span>
                      <span className="text-muted-foreground">{tr.shares.toFixed(2)} shares</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {!seriesLoading && !result && runKey === 0 && (
          <div className="text-center py-20">
            <Activity className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              {lang === "de"
                ? "Wähle eine Aktie und Strategie, dann starte den Backtest."
                : "Select a stock and strategy, then run the backtest."}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
