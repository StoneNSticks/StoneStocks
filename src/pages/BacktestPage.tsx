/**
 * BacktestPage — Strategy simulator with equity curve, trade log, and performance metrics.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSearchStocks } from "@/hooks/useStockData";
import { getTimeSeries } from "@/lib/stockApi";
import { useQuery } from "@tanstack/react-query";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Search, Play, TrendingUp, TrendingDown, Activity, BarChart3, Target, Zap, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { runBuyAndHold, runSMACrossover, runRSIStrategy, type OHLC, type BacktestResult } from "@/lib/backtestEngine";

type Strategy = "buy_hold" | "sma_crossover" | "rsi";

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
  const t = useT();
  const { lang } = useLanguage();

  usePageTitle(
    lang === "de" ? "Backtesting Simulator" : "Backtesting Simulator",
    lang === "de" ? "Strategien auf historischen Daten testen" : "Test strategies on historical data"
  );

  const [symbol, setSymbol] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("sma_crossover");
  const [capital, setCapital] = useState(10000);
  const [smaShort, setSmaShort] = useState(20);
  const [smaLong, setSmaLong] = useState(50);
  const [rsiOversold, setRsiOversold] = useState(30);
  const [rsiOverbought, setRsiOverbought] = useState(70);
  const [runKey, setRunKey] = useState(0);

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
      default: return null;
    }
  }, [ohlcData, strategy, capital, smaShort, smaLong, rsiOversold, rsiOverbought]);

  const selectSymbol = (sym: string) => {
    setSymbol(sym.toUpperCase());
    setSearchQuery("");
  };

  const runBacktest = () => {
    if (symbol) setRunKey(k => k + 1);
  };

  const m = result?.metrics;
  const strategyLabels: Record<Strategy, string> = {
    buy_hold: lang === "de" ? "Buy & Hold" : "Buy & Hold",
    sma_crossover: lang === "de" ? "SMA Crossover" : "SMA Crossover",
    rsi: lang === "de" ? "RSI Strategie" : "RSI Strategy",
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
              ? "Teste Trading-Strategien auf historischen Daten und vergleiche sie mit Buy & Hold."
              : "Test trading strategies on historical data and compare against Buy & Hold."}
          </p>
        </motion.div>

        {/* ── Config Panel ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border/60 bg-card p-5 mb-6 space-y-4">
          {/* Symbol search */}
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
                {lang === "de" ? "Strategie" : "Strategy"}
              </label>
              <Select value={strategy} onValueChange={(v) => setStrategy(v as Strategy)}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy_hold">Buy & Hold</SelectItem>
                  <SelectItem value="sma_crossover">SMA Crossover</SelectItem>
                  <SelectItem value="rsi">RSI Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Strategy params */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {lang === "de" ? "Startkapital ($)" : "Initial Capital ($)"}
              </label>
              <Input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value) || 10000)} className="h-9 rounded-lg text-sm" />
            </div>
            {strategy === "sma_crossover" && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">SMA Short</label>
                  <Input type="number" value={smaShort} onChange={(e) => setSmaShort(Number(e.target.value) || 20)} className="h-9 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">SMA Long</label>
                  <Input type="number" value={smaLong} onChange={(e) => setSmaLong(Number(e.target.value) || 50)} className="h-9 rounded-lg text-sm" />
                </div>
              </>
            )}
            {strategy === "rsi" && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{lang === "de" ? "Überverkauft" : "Oversold"}</label>
                  <Input type="number" value={rsiOversold} onChange={(e) => setRsiOversold(Number(e.target.value) || 30)} className="h-9 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{lang === "de" ? "Überkauft" : "Overbought"}</label>
                  <Input type="number" value={rsiOverbought} onChange={(e) => setRsiOverbought(Number(e.target.value) || 70)} className="h-9 rounded-lg text-sm" />
                </div>
              </>
            )}
          </div>

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
              <MetricCard
                label="Max Drawdown"
                value={`-${m.maxDrawdown.toFixed(1)}`}
                suffix="%"
                icon={AlertTriangle}
                color="text-destructive"
              />
              <MetricCard
                label="Sharpe Ratio"
                value={m.sharpeRatio.toFixed(2)}
                icon={Target}
                color="text-primary"
              />
              <MetricCard
                label={lang === "de" ? "Endkapital" : "Final Equity"}
                value={`$${m.finalEquity.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                icon={Zap}
                color="text-chart-2"
              />
              <MetricCard
                label="Win Rate"
                value={m.winRate.toFixed(0)}
                suffix="%"
                icon={Target}
                color={m.winRate >= 50 ? "text-chart-2" : "text-destructive"}
              />
              <MetricCard
                label={lang === "de" ? "Trades" : "Total Trades"}
                value={String(m.totalTrades)}
                icon={Activity}
                color="text-muted-foreground"
              />
              <MetricCard
                label="Buy & Hold"
                value={`${m.benchmarkReturn >= 0 ? "+" : ""}${m.benchmarkReturn.toFixed(1)}`}
                suffix="%"
                icon={TrendingUp}
                color="text-muted-foreground"
              />
            </div>

            {/* Equity curve */}
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">
                {lang === "de" ? "Equity-Kurve" : "Equity Curve"} — {symbol} ({strategyLabels[strategy]})
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
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(d: string) => d.slice(5, 10)}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(value: number, name: string) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, name === "equity" ? strategyLabels[strategy] : "Buy & Hold"]}
                      labelFormatter={(l: string) => l}
                    />
                    <ReferenceLine y={capital} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fill="url(#bmGrad)" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Buy & Hold" />
                    <Area type="monotone" dataKey="equity" stroke="hsl(145, 63%, 42%)" fill="url(#eqGrad)" strokeWidth={2} dot={false} name={strategyLabels[strategy]} />
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
