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

function formatMoney(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

const ResultCard = ({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) => (
  <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className={`font-display font-bold text-lg ${color}`}>{value}</div>
  </div>
);

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" };
const tickStyle = { fontSize: 11, fill: "hsl(var(--muted-foreground))" };

// ═══════════════════════════════════════════════════
// BASICS CATEGORY
// ═══════════════════════════════════════════════════

function PortfolioGrowth() {
  const t = useT();
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    const points: { year: number; portfolio: number; invested: number }[] = [];
    let balance = initial; let invested = initial;
    const monthlyRate = rate / 100 / 12;
    for (let y = 0; y <= years; y++) {
      points.push({ year: y, portfolio: Math.round(balance), invested: Math.round(invested) });
      for (let m = 0; m < 12; m++) { balance = balance * (1 + monthlyRate) + monthly; invested += monthly; }
    }
    return points;
  }, [initial, monthly, rate, years]);
  const final = data[data.length - 1];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.initialInvestment")}</Label><Input type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.monthlyContribution")}</Label><Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualReturn")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.timeHorizon")}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.totalInvested")} value={formatMoney(final?.invested || 0)} />
        <ResultCard label={t("calc.portfolioValue")} value={formatMoney(final?.portfolio || 0)} color="text-primary" />
        <ResultCard label={t("calc.totalReturns")} value={formatMoney((final?.portfolio || 0) - (final?.invested || 0))} color="text-gain" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(value: number, name: string) => [formatMoney(value), name === "portfolio" ? t("calc.portfolioValue") : t("calc.totalInvested")]} />
            <Area type="monotone" dataKey="invested" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={2} fillOpacity={0.3} />
            <Area type="monotone" dataKey="portfolio" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CompoundInterest() {
  const t = useT();
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(7);
  const [compounding, setCompounding] = useState(12);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const r = rate / 100;
    const points: { year: number; value: number }[] = [];
    for (let y = 0; y <= years; y++) {
      points.push({ year: y, value: Math.round(principal * Math.pow(1 + r / compounding, compounding * y)) });
    }
    return points;
  }, [principal, rate, compounding, years]);
  const final = data[data.length - 1]?.value || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.principal")}</Label><Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualRate")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.compoundingYear")}</Label><Input type="number" value={compounding} onChange={(e) => setCompounding(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.years")}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ResultCard label={t("calc.finalAmount")} value={formatMoney(final)} color="text-primary" />
        <ResultCard label={t("calc.totalInterest")} value={formatMoney(final - principal)} color="text-gain" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} name={t("calc.finalAmount")} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DividendCalc() {
  const t = useT();
  const [price, setPrice] = useState(150);
  const [dividend, setDividend] = useState(3.6);
  const [growth, setGrowth] = useState(5);
  const [years, setYears] = useState(10);
  const [shares, setShares] = useState(100);

  const data = useMemo(() => {
    const points: { year: number; annualDividend: number; yieldOnCost: number; totalDividends: number }[] = [];
    let d = dividend; let totalDiv = 0;
    for (let y = 0; y <= years; y++) {
      totalDiv += d * shares;
      points.push({ year: y, annualDividend: Math.round(d * shares), yieldOnCost: (d / price) * 100, totalDividends: Math.round(totalDiv) });
      d *= 1 + growth / 100;
    }
    return points;
  }, [price, dividend, growth, years, shares]);
  const final = data[data.length - 1];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.sharePrice")}</Label><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualDividendShare")}</Label><Input type="number" value={dividend} onChange={(e) => setDividend(Number(e.target.value))} className="mt-1" step="0.1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.dividendGrowthRate")}</Label><Input type="number" value={growth} onChange={(e) => setGrowth(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.years")}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.shares")}</Label><Input type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={`${t("calc.yieldOnCost")} (Yr ${years})`} value={`${final?.yieldOnCost.toFixed(2)}%`} color="text-primary" />
        <ResultCard label={`${t("calc.annualIncome")} (Yr ${years})`} value={formatMoney(final?.annualDividend || 0)} color="text-gain" />
        <ResultCard label={t("calc.totalDividends")} value={formatMoney(final?.totalDividends || 0)} />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
            <Area type="monotone" dataKey="annualDividend" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} name={t("calc.totalDividends")} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function InflationCalc() {
  const t = useT();
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    const points: { year: number; nominal: number; real: number }[] = [];
    for (let y = 0; y <= years; y++) {
      const real = amount / Math.pow(1 + rate / 100, y);
      points.push({ year: y, nominal: amount, real: Math.round(real) });
    }
    return points;
  }, [amount, rate, years]);
  const finalReal = data[data.length - 1]?.real || 0;
  const loss = amount - finalReal;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.inflationAmount")}</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.inflationRate")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.years")}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.inflationAmount")} value={formatMoney(amount)} />
        <ResultCard label={t("calc.realValue")} value={formatMoney(finalReal)} color="text-primary" />
        <ResultCard label={t("calc.purchasingPowerLoss")} value={`-${formatMoney(loss)}`} color="text-destructive" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number, name: string) => [formatMoney(v), name === "nominal" ? "Nominal" : t("calc.realValue")]} />
            <Area type="monotone" dataKey="nominal" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={2} strokeDasharray="6 3" />
            <Area type="monotone" dataKey="real" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" strokeWidth={2} fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ROICalc() {
  const t = useT();
  const [buyPrice, setBuyPrice] = useState(50);
  const [sellPrice, setSellPrice] = useState(75);
  const [holdYears, setHoldYears] = useState(3);

  const totalROI = buyPrice > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0;
  const annualizedROI = holdYears > 0 ? (Math.pow(sellPrice / buyPrice, 1 / holdYears) - 1) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.buyPrice")}</Label><Input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.sellPrice")}</Label><Input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.holdingPeriod")}</Label><Input type="number" value={holdYears} onChange={(e) => setHoldYears(Number(e.target.value))} className="mt-1" step="0.5" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.potentialProfit")} value={formatMoney(sellPrice - buyPrice)} color={sellPrice >= buyPrice ? "text-gain" : "text-destructive"} />
        <ResultCard label={t("calc.totalROI")} value={`${totalROI >= 0 ? "+" : ""}${totalROI.toFixed(2)}%`} color={totalROI >= 0 ? "text-gain" : "text-destructive"} />
        <ResultCard label={t("calc.annualizedROI")} value={`${annualizedROI >= 0 ? "+" : ""}${annualizedROI.toFixed(2)}%`} color="text-primary" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// TRADING CATEGORY
// ═══════════════════════════════════════════════════

function PositionSize() {
  const t = useT();
  const [capital, setCapital] = useState(50000);
  const [risk, setRisk] = useState(2);
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(95);

  const result = useMemo(() => {
    const riskAmount = capital * (risk / 100);
    const riskPerShare = Math.abs(entry - stop);
    const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
    const positionValue = shares * entry;
    return { riskAmount, shares, positionValue, positionPercent: (positionValue / capital) * 100 };
  }, [capital, risk, entry, stop]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.portfolioValueLabel")}</Label><Input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.riskPerTrade")}</Label><Input type="number" value={risk} onChange={(e) => setRisk(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.entryPrice")}</Label><Input type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.stopLoss")}</Label><Input type="number" value={stop} onChange={(e) => setStop(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label={t("calc.riskAmount")} value={formatMoney(result.riskAmount)} color="text-destructive" />
        <ResultCard label={t("calc.sharesToBuy")} value={String(result.shares)} color="text-primary" />
        <ResultCard label={t("calc.positionValue")} value={formatMoney(result.positionValue)} />
        <ResultCard label={t("calc.ofPortfolio")} value={`${result.positionPercent.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function RiskRewardCalc() {
  const t = useT();
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(95);
  const [target, setTarget] = useState(115);
  const [shares, setShares] = useState(100);

  const result = useMemo(() => {
    const loss = Math.abs(entry - stop) * shares;
    const profit = Math.abs(target - entry) * shares;
    const ratio = loss > 0 ? profit / loss : 0;
    return { loss, profit, ratio };
  }, [entry, stop, target, shares]);

  const verdict = result.ratio >= 2 ? t("calc.favorable") : result.ratio >= 1 ? t("calc.neutral") : t("calc.unfavorable");
  const verdictColor = result.ratio >= 2 ? "text-gain" : result.ratio >= 1 ? "text-foreground" : "text-destructive";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.entryPrice")}</Label><Input type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.stopLoss")}</Label><Input type="number" value={stop} onChange={(e) => setStop(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.targetPrice")}</Label><Input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.shares")}</Label><Input type="number" value={shares} onChange={(e) => setShares(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label={t("calc.potentialProfit")} value={formatMoney(result.profit)} color="text-gain" />
        <ResultCard label={t("calc.potentialLoss")} value={formatMoney(result.loss)} color="text-destructive" />
        <ResultCard label={t("calc.riskRewardRatio")} value={`1:${result.ratio.toFixed(2)}`} color="text-primary" />
        <ResultCard label={t("calc.verdict")} value={verdict} color={verdictColor} />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-medium text-destructive">{t("calc.potentialLoss")}</span>
          <div className="flex-1" />
          <span className="text-xs font-medium text-gain">{t("calc.potentialProfit")}</span>
        </div>
        <div className="flex rounded-lg overflow-hidden h-8">
          <div className="bg-destructive/80 flex items-center justify-center text-xs font-bold text-destructive-foreground" style={{ width: `${Math.min(50, (1 / (1 + result.ratio)) * 100)}%` }}>
            {formatMoney(result.loss)}
          </div>
          <div className="bg-primary/60 flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ width: `${Math.max(50, (result.ratio / (1 + result.ratio)) * 100)}%` }}>
            {formatMoney(result.profit)}
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionsCalc() {
  const t = useT();
  const [stockPrice, setStockPrice] = useState(100);
  const [strike, setStrike] = useState(105);
  const [premium, setPremium] = useState(3);
  const [contracts, setContracts] = useState(1);
  const [optionType, setOptionType] = useState<"call" | "put">("call");

  const data = useMemo(() => {
    const points: { price: number; pnl: number }[] = [];
    const low = stockPrice * 0.7;
    const high = stockPrice * 1.3;
    const step = (high - low) / 40;
    for (let p = low; p <= high; p += step) {
      let intrinsic = optionType === "call" ? Math.max(0, p - strike) : Math.max(0, strike - p);
      const pnl = (intrinsic - premium) * contracts * 100;
      points.push({ price: Math.round(p * 100) / 100, pnl: Math.round(pnl) });
    }
    return points;
  }, [stockPrice, strike, premium, contracts, optionType]);

  const breakeven = optionType === "call" ? strike + premium : strike - premium;
  const maxLoss = premium * contracts * 100;
  const maxGainPut = formatMoney((strike - premium) * contracts * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.sharePrice")}</Label><Input type="number" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.strikePrice")}</Label><Input type="number" value={strike} onChange={(e) => setStrike(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.premium")}</Label><Input type="number" value={premium} onChange={(e) => setPremium(Number(e.target.value))} className="mt-1" step="0.1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.contracts")}</Label><Input type="number" value={contracts} onChange={(e) => setContracts(Number(e.target.value))} className="mt-1" /></div>
        <div>
          <Label className="text-xs text-muted-foreground">{t("calc.optionType")}</Label>
          <div className="flex gap-1 mt-1">
            <button onClick={() => setOptionType("call")} className={`flex-1 rounded-lg py-2 text-xs font-medium ${optionType === "call" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Call</button>
            <button onClick={() => setOptionType("put")} className={`flex-1 rounded-lg py-2 text-xs font-medium ${optionType === "put" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Put</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.breakEven")} value={`$${breakeven.toFixed(2)}`} color="text-primary" />
        <ResultCard label={t("calc.potentialLoss")} value={formatMoney(maxLoss)} color="text-destructive" />
        <ResultCard label={t("calc.potentialProfit")} value={optionType === "call" ? "∞" : maxGainPut} color="text-gain" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="price" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v), "P&L"]} />
            <Area type="monotone" dataKey="pnl" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MarginCalc() {
  const t = useT();
  const [equity, setEquity] = useState(10000);
  const [leverage, setLeverage] = useState(2);
  const [entryPrice, setEntryPrice] = useState(100);
  const [maintenance, setMaintenance] = useState(25);

  const positionSize = equity * leverage;
  const shares = Math.floor(positionSize / entryPrice);
  const marginRequired = positionSize - equity;
  const liquidationPrice = entryPrice * (1 - (1 - maintenance / 100) / leverage);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.equity")}</Label><Input type="number" value={equity} onChange={(e) => setEquity(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.leverage")}</Label><Input type="number" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} className="mt-1" step="0.5" min="1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.entryPrice")}</Label><Input type="number" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.maintenanceMargin")}</Label><Input type="number" value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value))} className="mt-1" step="1" /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label={t("calc.positionSizeResult")} value={formatMoney(positionSize)} color="text-primary" />
        <ResultCard label={t("calc.sharesToBuy")} value={String(shares)} />
        <ResultCard label={t("calc.marginRequired")} value={formatMoney(marginRequired)} />
        <ResultCard label={t("calc.liquidationPrice")} value={`$${liquidationPrice.toFixed(2)}`} color="text-destructive" />
      </div>
    </div>
  );
}

function BreakEvenCalc() {
  const t = useT();
  const [loss, setLoss] = useState(20);

  const tableData = useMemo(() => {
    const losses = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90];
    return losses.map(l => ({ loss: l, recovery: ((1 / (1 - l / 100)) - 1) * 100 }));
  }, []);

  const customRecovery = ((1 / (1 - loss / 100)) - 1) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.lossPercent")}</Label><Input type="number" value={loss} onChange={(e) => setLoss(Math.min(99, Math.max(0, Number(e.target.value))))} className="mt-1" step="1" /></div>
        <ResultCard label={t("calc.recoveryNeeded")} value={`+${customRecovery.toFixed(2)}%`} color="text-gain" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="grid grid-cols-2 gap-2 px-4 py-2 bg-muted/40 text-[10px] uppercase font-mono text-muted-foreground">
          <span>{t("calc.potentialLoss")}</span><span className="text-right">{t("calc.recoveryNeeded")}</span>
        </div>
        {tableData.map((row) => (
          <div key={row.loss} className={`grid grid-cols-2 gap-2 px-4 py-2 border-t border-border/20 text-sm ${row.loss === loss ? "bg-primary/5" : ""}`}>
            <span className="text-destructive font-medium">-{row.loss}%</span>
            <span className="text-right text-gain font-semibold">+{row.recovery.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// PLANNING CATEGORY
// ═══════════════════════════════════════════════════

function FireCalc() {
  const t = useT();
  const [expenses, setExpenses] = useState(40000);
  const [savings, setSavings] = useState(500000);
  const [rate, setRate] = useState(7);
  const [withdrawal, setWithdrawal] = useState(4);
  const [monthlySavings, setMonthlySavings] = useState(2000);

  const result = useMemo(() => {
    const needed = expenses / (withdrawal / 100);
    const gap = needed - savings;
    if (gap <= 0) return { needed, yearsToFire: 0, gap: 0, data: [{ year: 0, balance: savings, target: needed }] };
    const monthlyRate = rate / 100 / 12;
    let balance = savings; let months = 0;
    const data: { year: number; balance: number; target: number }[] = [];
    while (balance < needed && months < 600) {
      if (months % 12 === 0) data.push({ year: months / 12, balance: Math.round(balance), target: Math.round(needed) });
      balance = balance * (1 + monthlyRate) + monthlySavings;
      months++;
    }
    data.push({ year: Math.ceil(months / 12), balance: Math.round(balance), target: Math.round(needed) });
    return { needed, yearsToFire: months / 12, gap, data };
  }, [expenses, savings, rate, withdrawal, monthlySavings]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualExpenses")}</Label><Input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.currentSavings")}</Label><Input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.monthlyContribution")}</Label><Input type="number" value={monthlySavings} onChange={(e) => setMonthlySavings(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.expectedReturn")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.withdrawalRate")}</Label><Input type="number" value={withdrawal} onChange={(e) => setWithdrawal(Number(e.target.value))} className="mt-1" step="0.5" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.fireNumber")} value={formatMoney(result.needed)} color="text-primary" />
        <ResultCard label={t("calc.gap")} value={formatMoney(result.gap)} />
        <ResultCard label={t("calc.yearsToFire")} value={result.yearsToFire.toFixed(1)} color="text-gain" />
      </div>
      {result.data.length > 1 && (
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
              <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
              <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={2} strokeDasharray="6 3" name={t("calc.fireNumber")} />
              <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} name={t("calc.currentSavings")} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function LoanCalc() {
  const t = useT();
  const [amount, setAmount] = useState(250000);
  const [rate, setRate] = useState(3.5);
  const [termYears, setTermYears] = useState(30);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const n = termYears * 12;
    if (monthlyRate === 0) return { monthly: amount / n, total: amount, interest: 0, data: [] };
    const monthly = amount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const total = monthly * n;
    const data: { year: number; principal: number; interest: number }[] = [];
    let balance = amount;
    for (let y = 1; y <= termYears; y++) {
      let yearPrincipal = 0, yearInterest = 0;
      for (let m = 0; m < 12; m++) {
        const intPart = balance * monthlyRate;
        const prinPart = monthly - intPart;
        yearInterest += intPart;
        yearPrincipal += prinPart;
        balance -= prinPart;
      }
      data.push({ year: y, principal: Math.round(yearPrincipal), interest: Math.round(yearInterest) });
    }
    return { monthly, total, interest: total - amount, data };
  }, [amount, rate, termYears]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.loanAmount")}</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.interestRate")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.loanTerm")}</Label><Input type="number" value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.monthlyPayment")} value={formatMoney(result.monthly)} color="text-primary" />
        <ResultCard label={t("calc.totalPayment")} value={formatMoney(result.total)} />
        <ResultCard label={t("calc.totalInterestPaid")} value={formatMoney(result.interest)} color="text-destructive" />
      </div>
      {result.data.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
              <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
              <Bar dataKey="principal" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} name="Principal" />
              <Bar dataKey="interest" stackId="a" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} name="Interest" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function RetirementWithdrawal() {
  const t = useT();
  const [capital, setCapital] = useState(500000);
  const [monthlyW, setMonthlyW] = useState(3000);
  const [rate, setRate] = useState(5);
  const [simYears, setSimYears] = useState(30);

  const data = useMemo(() => {
    const points: { year: number; balance: number }[] = [];
    let balance = capital;
    const monthlyRate = rate / 100 / 12;
    let depleted = false;
    for (let y = 0; y <= simYears; y++) {
      points.push({ year: y, balance: Math.max(0, Math.round(balance)) });
      if (depleted) continue;
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) - monthlyW;
        if (balance <= 0) { balance = 0; depleted = true; break; }
      }
    }
    return points;
  }, [capital, monthlyW, rate, simYears]);

  const depletionYear = data.find(d => d.balance === 0)?.year;
  const remaining = data[data.length - 1]?.balance || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.startingCapital")}</Label><Input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.monthlyWithdrawal")}</Label><Input type="number" value={monthlyW} onChange={(e) => setMonthlyW(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.expectedReturn")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.years")}</Label><Input type="number" value={simYears} onChange={(e) => setSimYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.monthlyWithdrawal")} value={formatMoney(monthlyW)} />
        <ResultCard label={t("calc.monthsUntilDepletion")} value={depletionYear != null ? `${depletionYear * 12}` : t("calc.neverDepleted")} color={depletionYear != null ? "text-destructive" : "text-gain"} />
        <ResultCard label={t("calc.remainingAfter")} value={formatMoney(remaining)} color="text-primary" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
            <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SavingsGoalCalc() {
  const t = useT();
  const [goal, setGoal] = useState(50000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);

  const data = useMemo(() => {
    const points: { month: number; balance: number; goal: number }[] = [];
    let balance = 0;
    const monthlyRate = rate / 100 / 12;
    const maxMonths = 600;
    let reached = false;
    for (let m = 0; m <= maxMonths; m++) {
      points.push({ month: m, balance: Math.round(balance), goal });
      if (balance >= goal && !reached) { reached = true; }
      if (reached && m > 10) break;
      balance = balance * (1 + monthlyRate) + monthly;
    }
    return points;
  }, [goal, monthly, rate]);

  const monthsToGoal = data.findIndex(d => d.balance >= goal);
  const progress = Math.min(100, (data[Math.min(data.length - 1, 12)]?.balance / goal) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.goalAmount")}</Label><Input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.monthlySaving")}</Label><Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualReturn")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultCard label={t("calc.monthsToGoal")} value={monthsToGoal >= 0 ? `${monthsToGoal} (${(monthsToGoal / 12).toFixed(1)}y)` : "600+"} color="text-primary" />
        <ResultCard label={t("calc.goalAmount")} value={formatMoney(goal)} />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(m) => `${m}m`} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
            <Area type="monotone" dataKey="goal" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={2} strokeDasharray="6 3" />
            <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SPECIAL CATEGORY
// ═══════════════════════════════════════════════════

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "KRW", "BRL", "MXN", "SEK", "NOK", "DKK", "PLN", "TRY", "ZAR", "SGD", "HKD"];

function CurrencyConverter() {
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

function DCASimulator() {
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

function TaxLossHarvesting() {
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

function DividendProjector() {
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

const CalculatorPage = () => {
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Finanzrechner" : "Financial Calculators",
    lang === "de" ? "Zinseszins, Dividenden, FIRE und mehr berechnen" : "Compound interest, dividends, FIRE and more"
  );
  const [activeCategory, setActiveCategory] = useState<CalcCategory>("all");

  const tabs: CalcTab[] = [
    { value: "portfolio", label: t("calc.portfolioGrowth"), icon: <TrendingUp className="h-3.5 w-3.5" />, category: "basics", component: <PortfolioGrowth /> },
    { value: "compound", label: t("calc.compoundInterest"), icon: <Percent className="h-3.5 w-3.5" />, category: "basics", component: <CompoundInterest /> },
    { value: "dividend", label: t("calc.dividendGrowth"), icon: <DollarSign className="h-3.5 w-3.5" />, category: "basics", component: <DividendCalc /> },
    { value: "inflation", label: t("calc.inflationCalc"), icon: <TrendingDown className="h-3.5 w-3.5" />, category: "basics", component: <InflationCalc /> },
    { value: "roi", label: t("calc.roiCalc"), icon: <BarChart3 className="h-3.5 w-3.5" />, category: "basics", component: <ROICalc /> },
    { value: "position", label: t("calc.positionSize"), icon: <BarChart3 className="h-3.5 w-3.5" />, category: "trading", component: <PositionSize /> },
    { value: "riskreward", label: t("calc.riskReward"), icon: <Scale className="h-3.5 w-3.5" />, category: "trading", component: <RiskRewardCalc /> },
    { value: "options", label: t("calc.optionsCalc"), icon: <Crosshair className="h-3.5 w-3.5" />, category: "trading", component: <OptionsCalc /> },
    { value: "margin", label: t("calc.marginCalc"), icon: <Wallet className="h-3.5 w-3.5" />, category: "trading", component: <MarginCalc /> },
    { value: "breakeven", label: t("calc.breakEvenCalc"), icon: <RotateCcw className="h-3.5 w-3.5" />, category: "trading", component: <BreakEvenCalc /> },
    { value: "fire", label: t("calc.fireCalc"), icon: <PiggyBank className="h-3.5 w-3.5" />, category: "planning", component: <FireCalc /> },
    { value: "loan", label: t("calc.loanCalc"), icon: <Landmark className="h-3.5 w-3.5" />, category: "planning", component: <LoanCalc /> },
    { value: "retirement", label: t("calc.retirementCalc"), icon: <Wallet className="h-3.5 w-3.5" />, category: "planning", component: <RetirementWithdrawal /> },
    { value: "savingsgoal", label: t("calc.savingsGoal"), icon: <Target className="h-3.5 w-3.5" />, category: "planning", component: <SavingsGoalCalc /> },
    { value: "dca", label: t("calc.dcaSimulator"), icon: <Target className="h-3.5 w-3.5" />, category: "special", component: <DCASimulator /> },
    { value: "currency", label: t("calc.currencyConverter"), icon: <ArrowLeftRight className="h-3.5 w-3.5" />, category: "special", component: <CurrencyConverter /> },
    { value: "taxloss", label: t("calc.taxLossHarvesting"), icon: <Scissors className="h-3.5 w-3.5" />, category: "special", component: <TaxLossHarvesting /> },
    { value: "divproject", label: t("calc.divProjector"), icon: <Coins className="h-3.5 w-3.5" />, category: "special", component: <DividendProjector /> },
  ];

  const filteredTabs = activeCategory === "all" ? tabs : tabs.filter(tab => tab.category === activeCategory);

  const categories: { key: CalcCategory; label: string }[] = [
    { key: "all", label: t("calc.catAll") },
    { key: "basics", label: t("calc.catBasics") },
    { key: "trading", label: t("calc.catTrading") },
    { key: "planning", label: t("calc.catPlanning") },
    { key: "special", label: t("calc.catSpecial") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{t("calc.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("calc.subtitle")}</p>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-4 scroll-x-touch pb-1">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.label} {cat.key !== "all" && <span className="ml-1 opacity-60">({tabs.filter(t => t.category === cat.key).length})</span>}
            </button>
          ))}
        </div>

        <Tabs defaultValue="portfolio" className="space-y-5">
          {/* Category-grouped calculator grid */}
          <div className="space-y-4">
            {(activeCategory === "all" ? ["basics", "trading", "planning", "special"] as const : [activeCategory]).map(catKey => {
              const catTabs = tabs.filter(t => t.category === catKey);
              if (catTabs.length === 0) return null;
              const catLabel = categories.find(c => c.key === catKey)?.label || catKey;
              return (
                <div key={catKey}>
                  {activeCategory === "all" && (
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">{catLabel}</h2>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {catTabs.map(tab => (
                      <TabsList key={tab.value} className="bg-transparent p-0 h-auto w-full">
                        <TabsTrigger
                          value={tab.value}
                          className="w-full flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-card px-2 py-3 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm"
                        >
                          <span className="p-1.5 rounded-lg bg-muted/50">{tab.icon}</span>
                          <span className="text-center leading-tight">{tab.label}</span>
                        </TabsTrigger>
                      </TabsList>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {filteredTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>{tab.component}</TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default CalculatorPage;
