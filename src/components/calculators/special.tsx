import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calculator, TrendingUp, Percent, DollarSign, PiggyBank, BarChart3, Landmark, Target, Scale, ArrowLeftRight, Crosshair, Scissors, Coins, TrendingDown, Wallet, RotateCcw, Activity, LayoutList } from "lucide-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useQuery } from "@tanstack/react-query";
import { getCurrencyRates } from "@/lib/stockApi";
import { formatMoney, ResultCard, chartStyle, tickStyle } from "@/components/calculators/shared";

export const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "KRW", "BRL", "MXN", "SEK", "NOK", "DKK", "PLN", "TRY", "ZAR", "SGD", "HKD"];

export function CurrencyConverter() {
  const t = useT();
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const { data: rates } = useQuery({ queryKey: ["currencyRates"], queryFn: getCurrencyRates, staleTime: 1000 * 60 * 60 });

  const result = useMemo(() => {
    if (!rates) return 0;
    const fromRate = from === "USD" ? 1 : (rates as Record<string, number>)[from] || 1;
    const toRate = to === "USD" ? 1 : (rates as Record<string, number>)[to] || 1;
    return (amount / fromRate) * toRate;
  }, [amount, from, to, rates]);

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <Label className="text-xs text-muted-foreground">{t("calc.amount")}</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {POPULAR_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={swap} className="flex items-center justify-center h-10 w-10 rounded-lg border border-border hover:bg-muted transition-colors mx-auto">
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <div>
          <Label className="text-xs text-muted-foreground">{t("calc.convertedAmount")}</Label>
          <div className="mt-1 h-10 flex items-center px-3 rounded-lg border border-border bg-muted/50 font-mono font-bold text-lg text-primary">
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {POPULAR_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ResultCard label={`1 ${from}`} value={`${(result / (amount || 1)).toFixed(4)} ${to}`} color="text-primary" />
        <ResultCard label={`1 ${to}`} value={`${((amount || 1) / (result || 1)).toFixed(4)} ${from}`} />
      </div>
    </div>
  );
}

export function DCASimulator() {
  const t = useT();
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [months, setMonths] = useState(36);
  const [avgReturn, setAvgReturn] = useState(10);
  const [volatility, setVolatility] = useState(15);

  const data = useMemo(() => {
    const points: { month: number; invested: number; dca: number; lumpSum: number }[] = [];
    let dcaValue = 0;
    const totalLumpSum = monthlyAmount * months;
    let lumpSumValue = totalLumpSum;
    const monthlyReturn = avgReturn / 100 / 12;
    const monthlyVol = volatility / 100 / Math.sqrt(12);
    for (let m = 0; m <= months; m++) {
      const invested = m * monthlyAmount;
      if (m > 0) {
        const variation = Math.sin(m * 0.5) * monthlyVol;
        dcaValue = dcaValue * (1 + monthlyReturn + variation) + monthlyAmount;
        lumpSumValue = lumpSumValue * (1 + monthlyReturn + variation);
      }
      points.push({ month: m, invested, dca: Math.round(dcaValue), lumpSum: Math.round(lumpSumValue) });
    }
    return points;
  }, [monthlyAmount, months, avgReturn, volatility]);

  const final = data[data.length - 1];
  const totalInvested = final?.invested || 0;
  const totalDCA = final?.dca || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.monthlyContribution")}</Label><Input type="number" value={monthlyAmount} onChange={(e) => setMonthlyAmount(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.dcaMonths")}</Label><Input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualReturn")}</Label><Input type="number" value={avgReturn} onChange={(e) => setAvgReturn(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.dcaVolatility")}</Label><Input type="number" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} className="mt-1" step="1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.totalInvested")} value={formatMoney(totalInvested)} />
        <ResultCard label="DCA" value={formatMoney(totalDCA)} color="text-primary" />
        <ResultCard label={t("calc.totalReturns")} value={formatMoney(totalDCA - totalInvested)} color={totalDCA >= totalInvested ? "text-gain" : "text-destructive"} />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(m) => `${m}m`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number, name: string) => [formatMoney(v), name === "dca" ? "DCA" : name === "lumpSum" ? "Lump Sum" : t("calc.totalInvested")]} />
            <Area type="monotone" dataKey="invested" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={2} fillOpacity={0.3} />
            <Area type="monotone" dataKey="lumpSum" stroke="hsl(var(--chart-2))" fill="none" strokeWidth={2} strokeDasharray="6 3" />
            <Area type="monotone" dataKey="dca" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TaxLossHarvesting() {
  const t = useT();
  const [positions] = useState([
    { symbol: "AAPL", shares: 10, avgCost: 180, currentPrice: 172 },
    { symbol: "TSLA", shares: 5, avgCost: 260, currentPrice: 245 },
    { symbol: "MSFT", shares: 15, avgCost: 380, currentPrice: 410 },
    { symbol: "NVDA", shares: 8, avgCost: 480, currentPrice: 520 },
  ]);
  const [taxRate, setTaxRate] = useState(26.375);

  const analysis = useMemo(() => {
    return positions.map(p => {
      const unrealized = (p.currentPrice - p.avgCost) * p.shares;
      const isLoss = unrealized < 0;
      return { ...p, unrealized, isLoss, taxSaving: isLoss ? Math.abs(unrealized) * (taxRate / 100) : 0 };
    });
  }, [positions, taxRate]);

  const totalLosses = analysis.filter(a => a.isLoss).reduce((s, a) => s + Math.abs(a.unrealized), 0);
  const totalSaving = totalLosses * (taxRate / 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <ResultCard label={t("calc.harvestableLosses")} value={formatMoney(totalLosses)} color="text-destructive" />
        <ResultCard label={t("calc.estTaxSavings")} value={formatMoney(totalSaving)} color="text-gain" />
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1"><Label className="text-xs text-muted-foreground">{t("calc.taxRate")}</Label><Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_4rem_5rem_5rem_5rem] gap-2 px-4 py-2 bg-muted/40 text-[10px] uppercase font-mono text-muted-foreground">
          <span>Symbol</span><span className="text-right">{t("calc.qty")}</span><span className="text-right">{t("calc.avgCost")}</span><span className="text-right">{t("calc.current")}</span><span className="text-right">P&L</span>
        </div>
        {analysis.map((a, i) => (
          <div key={i} className="grid grid-cols-[1fr_4rem_5rem_5rem_5rem] gap-2 px-4 py-2.5 border-t border-border/20 text-sm">
            <span className="font-mono font-bold">{a.symbol}</span>
            <span className="text-right text-muted-foreground">{a.shares}</span>
            <span className="text-right">${a.avgCost}</span>
            <span className="text-right">${a.currentPrice}</span>
            <span className={`text-right font-semibold ${a.isLoss ? "text-destructive" : "text-chart-2"}`}>{a.unrealized >= 0 ? "+" : ""}{formatMoney(a.unrealized)}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t("calc.editHint")}</p>
    </div>
  );
}

export function KellyCalc() {
  const t = useT();
  const [winRate, setWinRate] = useState(55);
  const [winLossRatio, setWinLossRatio] = useState(1.5);
  const [capital, setCapital] = useState(10000);
  const [trades, setTrades] = useState(20);

  const kellyFraction = useMemo(() => {
    const p = winRate / 100;
    const q = 1 - p;
    const b = winLossRatio;
    return Math.max(0, (b * p - q) / b);
  }, [winRate, winLossRatio]);

  const halfKelly = kellyFraction / 2;
  const quarterKelly = kellyFraction / 4;
  const betAmount = capital * halfKelly;

  const simData = useMemo(() => {
    const pts: { trade: number; full: number; half: number; quarter: number }[] = [{ trade: 0, full: capital, half: capital, quarter: capital }];
    let full = capital, half = capital, quarter = capital;
    for (let i = 1; i <= trades; i++) {
      const win = Math.sin(i * 1.3 + 0.5) > 0;
      const grow = (f: number, k: number) => win ? f * (1 + k * winLossRatio) : f * (1 - k);
      full = grow(full, kellyFraction);
      half = grow(half, halfKelly);
      quarter = grow(quarter, quarterKelly);
      pts.push({ trade: i, full: Math.round(full), half: Math.round(half), quarter: Math.round(quarter) });
    }
    return pts;
  }, [capital, trades, kellyFraction, halfKelly, quarterKelly, winLossRatio]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">Gewinnquote (%)</Label><Input type="number" value={winRate} onChange={(e) => setWinRate(Math.min(99, Math.max(1, Number(e.target.value))))} className="mt-1" step="1" /></div>
        <div><Label className="text-xs text-muted-foreground">Gewinn/Verlust-Ratio</Label><Input type="number" value={winLossRatio} onChange={(e) => setWinLossRatio(Number(e.target.value))} className="mt-1" step="0.1" min="0.1" /></div>
        <div><Label className="text-xs text-muted-foreground">Kapital ($)</Label><Input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">Simulierte Trades</Label><Input type="number" value={trades} onChange={(e) => setTrades(Math.min(100, Math.max(5, Number(e.target.value))))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <ResultCard label="Kelly-Anteil" value={`${(kellyFraction * 100).toFixed(1)}%`} color="text-primary" />
        <ResultCard label="Half-Kelly" value={`${(halfKelly * 100).toFixed(1)}%`} color="text-gain" />
        <ResultCard label="Quarter-Kelly" value={`${(quarterKelly * 100).toFixed(1)}%`} />
        <ResultCard label="Einsatz (Half-Kelly)" value={formatMoney(betAmount)} color="text-primary" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <div className="text-xs text-muted-foreground mb-2">Kapitalverlauf über {trades} simulierte Trades</div>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={simData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="trade" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `#${v}`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number, name: string) => [formatMoney(v), name === "full" ? "Full Kelly" : name === "half" ? "Half Kelly" : "Quarter Kelly"]} />
            <Line type="monotone" dataKey="full" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="full" />
            <Line type="monotone" dataKey="half" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} name="half" />
            <Line type="monotone" dataKey="quarter" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="quarter" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground">Half-Kelly reduziert die Volatilität erheblich bei nur leicht geringerem Erwartungswert.</p>
    </div>
  );
}

export function DividendProjector() {
  const t = useT();
  const [holdings] = useState([
    { symbol: "AAPL", shares: 50, annualDiv: 3.92 },
    { symbol: "JNJ", shares: 30, annualDiv: 4.96 },
    { symbol: "KO", shares: 100, annualDiv: 1.94 },
    { symbol: "MSFT", shares: 20, annualDiv: 3.32 },
  ]);
  const [growthRate, setGrowthRate] = useState(5);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const pts: { year: number; income: number; cumulative: number }[] = [];
    let cumulative = 0;
    for (let y = 0; y <= years; y++) {
      const income = holdings.reduce((s, h) => s + h.shares * h.annualDiv * Math.pow(1 + growthRate / 100, y), 0);
      cumulative += y > 0 ? income : 0;
      pts.push({ year: y, income: Math.round(income), cumulative: Math.round(cumulative) });
    }
    return pts;
  }, [holdings, growthRate, years]);

  const finalIncome = data[data.length - 1]?.income || 0;
  const totalCum = data[data.length - 1]?.cumulative || 0;
  const currentIncome = data[0]?.income || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.currentAnnualDiv")} value={formatMoney(currentIncome)} />
        <ResultCard label={`${t("calc.divInYear")} ${years}`} value={formatMoney(finalIncome)} color="text-primary" />
        <ResultCard label={t("calc.cumulativeTotal")} value={formatMoney(totalCum)} color="text-gain" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.divGrowthPerYear")}</Label><Input type="number" value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.projectionYears")}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
            <Bar dataKey="income" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name={t("calc.annualDividends")} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_4rem_5rem] gap-2 px-4 py-2 bg-muted/40 text-[10px] uppercase font-mono text-muted-foreground">
          <span>Symbol</span><span className="text-right">{t("calc.qty")}</span><span className="text-right">{t("calc.divPerShare")}</span>
        </div>
        {holdings.map((h, i) => (
          <div key={i} className="grid grid-cols-[1fr_4rem_5rem] gap-2 px-4 py-2.5 border-t border-border/20 text-sm">
            <span className="font-mono font-bold">{h.symbol}</span>
            <span className="text-right text-muted-foreground">{h.shares}</span>
            <span className="text-right">${h.annualDiv.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN PAGE WITH CATEGORY GROUPING
// ═══════════════════════════════════════════════════

type CalcCategory = "all" | "basics" | "trading" | "planning" | "special";

interface CalcTab {
  value: string;
  label: string;
  icon: React.ReactNode;
  category: CalcCategory;
  component: React.ReactNode;
}

