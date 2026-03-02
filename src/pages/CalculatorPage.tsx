import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Calculator, TrendingUp, Percent, DollarSign, PiggyBank, BarChart3 } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

function formatMoney(n: number): string {
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
}

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
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.totalInvested")}</div><div className="font-display font-bold text-lg text-foreground">{formatMoney(final?.invested || 0)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.portfolioValue")}</div><div className="font-display font-bold text-lg text-primary">{formatMoney(final?.portfolio || 0)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.totalReturns")}</div><div className="font-display font-bold text-lg text-gain">{formatMoney((final?.portfolio || 0) - (final?.invested || 0))}</div></div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(value: number, name: string) => [formatMoney(value), name === "portfolio" ? t("calc.portfolioValue") : t("calc.totalInvested")]} />
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

  const result = useMemo(() => {
    const r = rate / 100;
    const amount = principal * Math.pow(1 + r / compounding, compounding * years);
    return { amount, interest: amount - principal };
  }, [principal, rate, compounding, years]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.principal")}</Label><Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualRate")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.compoundingYear")}</Label><Input type="number" value={compounding} onChange={(e) => setCompounding(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.years")}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.finalAmount")}</div><div className="font-display font-bold text-xl text-primary">{formatMoney(result.amount)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.totalInterest")}</div><div className="font-display font-bold text-xl text-gain">{formatMoney(result.interest)}</div></div>
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
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.yieldOnCost")} (Yr {years})</div><div className="font-display font-bold text-lg text-primary">{final?.yieldOnCost.toFixed(2)}%</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.annualIncome")} (Yr {years})</div><div className="font-display font-bold text-lg text-gain">{formatMoney(final?.annualDividend || 0)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.totalDividends")}</div><div className="font-display font-bold text-lg">{formatMoney(final?.totalDividends || 0)}</div></div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [formatMoney(v)]} />
            <Area type="monotone" dataKey="annualDividend" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} name={t("calc.totalDividends")} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FireCalc() {
  const t = useT();
  const [expenses, setExpenses] = useState(40000);
  const [savings, setSavings] = useState(500000);
  const [rate, setRate] = useState(7);
  const [withdrawal, setWithdrawal] = useState(4);

  const result = useMemo(() => {
    const needed = expenses / (withdrawal / 100);
    const gap = needed - savings;
    if (gap <= 0) return { needed, yearsToFire: 0, gap: 0 };
    const monthlyRate = rate / 100 / 12;
    let balance = savings; let months = 0;
    while (balance < needed && months < 600) { balance *= (1 + monthlyRate); months++; }
    return { needed, yearsToFire: months / 12, gap };
  }, [expenses, savings, rate, withdrawal]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualExpenses")}</Label><Input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.currentSavings")}</Label><Input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.expectedReturn")}</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.withdrawalRate")}</Label><Input type="number" value={withdrawal} onChange={(e) => setWithdrawal(Number(e.target.value))} className="mt-1" step="0.5" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.fireNumber")}</div><div className="font-display font-bold text-xl text-primary">{formatMoney(result.needed)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.gap")}</div><div className="font-display font-bold text-xl">{formatMoney(result.gap)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.yearsToFire")}</div><div className="font-display font-bold text-xl text-gain">{result.yearsToFire.toFixed(1)}</div></div>
      </div>
    </div>
  );
}

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
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.riskAmount")}</div><div className="font-display font-bold text-lg text-destructive">{formatMoney(result.riskAmount)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.sharesToBuy")}</div><div className="font-display font-bold text-lg text-primary">{result.shares}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.positionValue")}</div><div className="font-display font-bold text-lg">{formatMoney(result.positionValue)}</div></div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center"><div className="text-xs text-muted-foreground mb-1">{t("calc.ofPortfolio")}</div><div className="font-display font-bold text-lg">{result.positionPercent.toFixed(1)}%</div></div>
      </div>
    </div>
  );
}

const CalculatorPage = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold">{t("calc.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("calc.subtitle")}</p>
          </div>
        </div>
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList className="bg-card border border-border/60 p-1 rounded-xl flex-wrap h-auto gap-1">
            <TabsTrigger value="portfolio" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><TrendingUp className="h-3.5 w-3.5" />{t("calc.portfolioGrowth")}</TabsTrigger>
            <TabsTrigger value="compound" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Percent className="h-3.5 w-3.5" />{t("calc.compoundInterest")}</TabsTrigger>
            <TabsTrigger value="dividend" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><DollarSign className="h-3.5 w-3.5" />{t("calc.dividendGrowth")}</TabsTrigger>
            <TabsTrigger value="fire" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><PiggyBank className="h-3.5 w-3.5" />{t("calc.fireCalc")}</TabsTrigger>
            <TabsTrigger value="position" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><BarChart3 className="h-3.5 w-3.5" />{t("calc.positionSize")}</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio"><PortfolioGrowth /></TabsContent>
          <TabsContent value="compound"><CompoundInterest /></TabsContent>
          <TabsContent value="dividend"><DividendCalc /></TabsContent>
          <TabsContent value="fire"><FireCalc /></TabsContent>
          <TabsContent value="position"><PositionSize /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CalculatorPage;
