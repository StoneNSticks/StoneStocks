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

export function PortfolioGrowth() {
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

export function CompoundInterest() {
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

export function DividendCalc() {
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

export function InflationCalc() {
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

export function ROICalc() {
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

