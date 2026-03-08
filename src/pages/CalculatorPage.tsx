import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { Calculator, TrendingUp, Percent, DollarSign, PiggyBank, BarChart3, Landmark, Target, Scale, ArrowLeftRight } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
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
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [formatMoney(v)]} />
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
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [formatMoney(v)]} />
              <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={2} strokeDasharray="6 3" name={t("calc.fireNumber")} />
              <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} name={t("calc.currentSavings")} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
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
        <ResultCard label={t("calc.riskAmount")} value={formatMoney(result.riskAmount)} color="text-destructive" />
        <ResultCard label={t("calc.sharesToBuy")} value={String(result.shares)} color="text-primary" />
        <ResultCard label={t("calc.positionValue")} value={formatMoney(result.positionValue)} />
        <ResultCard label={t("calc.ofPortfolio")} value={`${result.positionPercent.toFixed(1)}%`} />
      </div>
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
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [formatMoney(v)]} />
              <Bar dataKey="principal" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} name="Tilgung" />
              <Bar dataKey="interest" stackId="a" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} name="Zinsen" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
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
      {/* Visual ratio bar */}
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
          <div className="bg-[hsl(var(--success))]/80 flex items-center justify-center text-xs font-bold text-[hsl(var(--success-foreground))]" style={{ width: `${Math.max(50, (result.ratio / (1 + result.ratio)) * 100)}%` }}>
            {formatMoney(result.profit)}
          </div>
        </div>
      </div>
    </div>
  );
}

const CalculatorPage = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
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
            <TabsTrigger value="loan" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Landmark className="h-3.5 w-3.5" />{t("calc.loanCalc")}</TabsTrigger>
            <TabsTrigger value="riskreward" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Scale className="h-3.5 w-3.5" />{t("calc.riskReward")}</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio"><PortfolioGrowth /></TabsContent>
          <TabsContent value="compound"><CompoundInterest /></TabsContent>
          <TabsContent value="dividend"><DividendCalc /></TabsContent>
          <TabsContent value="fire"><FireCalc /></TabsContent>
          <TabsContent value="position"><PositionSize /></TabsContent>
          <TabsContent value="loan"><LoanCalc /></TabsContent>
          <TabsContent value="riskreward"><RiskRewardCalc /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CalculatorPage;
