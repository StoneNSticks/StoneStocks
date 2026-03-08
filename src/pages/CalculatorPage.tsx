import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { Calculator, TrendingUp, Percent, DollarSign, PiggyBank, BarChart3, Landmark, Target, Scale, ArrowLeftRight, Crosshair, Scissors, Coins } from "lucide-react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
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

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "KRW", "BRL", "MXN", "SEK", "NOK", "DKK", "PLN", "TRY", "ZAR", "SGD", "HKD"];

function CurrencyConverter() {
  const t = useT();
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const { data: rates } = useQuery({
    queryKey: ["currencyRates"],
    queryFn: getCurrencyRates,
    staleTime: 1000 * 60 * 60,
  });

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
          <Label className="text-xs text-muted-foreground">{t("calc.amount") || "Amount"}</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {POPULAR_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={swap} className="flex items-center justify-center h-10 w-10 rounded-lg border border-border hover:bg-muted transition-colors mx-auto">
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <div>
          <Label className="text-xs text-muted-foreground">{t("calc.convertedAmount") || "Converted"}</Label>
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

/** Options Profit Calculator — Shows P&L at various stock prices for calls/puts */
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
  const maxGainCall = "∞";
  const maxGainPut = formatMoney((strike - premium) * contracts * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.sharePrice")}</Label><Input type="number" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.strikePrice") || "Strike"}</Label><Input type="number" value={strike} onChange={(e) => setStrike(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.premium") || "Premium"}</Label><Input type="number" value={premium} onChange={(e) => setPremium(Number(e.target.value))} className="mt-1" step="0.1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.contracts") || "Contracts"}</Label><Input type="number" value={contracts} onChange={(e) => setContracts(Number(e.target.value))} className="mt-1" /></div>
        <div>
          <Label className="text-xs text-muted-foreground">{t("calc.optionType") || "Type"}</Label>
          <div className="flex gap-1 mt-1">
            <button onClick={() => setOptionType("call")} className={`flex-1 rounded-lg py-2 text-xs font-medium ${optionType === "call" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Call</button>
            <button onClick={() => setOptionType("put")} className={`flex-1 rounded-lg py-2 text-xs font-medium ${optionType === "put" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Put</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.breakEven")} value={`$${breakeven.toFixed(2)}`} color="text-primary" />
        <ResultCard label={t("calc.potentialLoss")} value={formatMoney(maxLoss)} color="text-destructive" />
        <ResultCard label={t("calc.potentialProfit")} value={optionType === "call" ? maxGainCall : maxGainPut} color="text-gain" />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="price" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [formatMoney(v), "P&L"]} />
            <Area type="monotone" dataKey="pnl" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** DCA Simulator — Simulates dollar-cost averaging into an investment */
function DCASimulator() {
  const t = useT();
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [months, setMonths] = useState(36);
  const [avgReturn, setAvgReturn] = useState(10);
  const [volatility, setVolatility] = useState(15);

  const data = useMemo(() => {
    const points: { month: number; invested: number; value: number }[] = [];
    let value = 0;
    const monthlyReturn = avgReturn / 100 / 12;
    const monthlyVol = volatility / 100 / Math.sqrt(12);
    // Deterministic simulation with slight variation pattern
    for (let m = 0; m <= months; m++) {
      const invested = m * monthlyAmount;
      if (m > 0) {
        const variation = Math.sin(m * 0.5) * monthlyVol;
        value = value * (1 + monthlyReturn + variation) + monthlyAmount;
      }
      points.push({ month: m, invested, value: Math.round(value) });
    }
    return points;
  }, [monthlyAmount, months, avgReturn, volatility]);

  const final = data[data.length - 1];
  const totalInvested = final?.invested || 0;
  const totalValue = final?.value || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs text-muted-foreground">{t("calc.monthlyContribution")}</Label><Input type="number" value={monthlyAmount} onChange={(e) => setMonthlyAmount(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.dcaMonths") || "Months"}</Label><Input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="mt-1" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.annualReturn")}</Label><Input type="number" value={avgReturn} onChange={(e) => setAvgReturn(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{t("calc.dcaVolatility") || "Volatility (%)"}</Label><Input type="number" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} className="mt-1" step="1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label={t("calc.totalInvested")} value={formatMoney(totalInvested)} />
        <ResultCard label={t("calc.portfolioValue")} value={formatMoney(totalValue)} color="text-primary" />
        <ResultCard label={t("calc.totalReturns")} value={formatMoney(totalValue - totalInvested)} color={totalValue >= totalInvested ? "text-gain" : "text-destructive"} />
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(m) => `${m}m`} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number, name: string) => [formatMoney(v), name === "value" ? t("calc.portfolioValue") : t("calc.totalInvested")]} />
            <Area type="monotone" dataKey="invested" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeWidth={2} fillOpacity={0.3} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth={2} fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Tax-Loss Harvesting Tool — Shows portfolio positions with unrealized losses */
function TaxLossHarvesting() {
  const t = useT();
  const { lang } = useLanguage();
  const [positions, setPositions] = useState([
    { symbol: "AAPL", shares: 10, avgCost: 180, currentPrice: 172 },
    { symbol: "TSLA", shares: 5, avgCost: 260, currentPrice: 245 },
    { symbol: "MSFT", shares: 15, avgCost: 380, currentPrice: 410 },
    { symbol: "NVDA", shares: 8, avgCost: 480, currentPrice: 520 },
  ]);
  const [taxRate, setTaxRate] = useState(26.375); // DE: 25% + Soli

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
        <ResultCard label={lang === "de" ? "Realisierbare Verluste" : "Harvestable Losses"} value={formatMoney(totalLosses)} color="text-destructive" />
        <ResultCard label={lang === "de" ? "Geschätzte Steuerersparnis" : "Est. Tax Savings"} value={formatMoney(totalSaving)} color="text-gain" />
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1"><Label className="text-xs text-muted-foreground">{lang === "de" ? "Steuersatz (%)" : "Tax Rate (%)"}</Label><Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_4rem_5rem_5rem_5rem] gap-2 px-4 py-2 bg-muted/40 text-[10px] uppercase font-mono text-muted-foreground">
          <span>Symbol</span><span className="text-right">{lang === "de" ? "Stk." : "Qty"}</span><span className="text-right">{lang === "de" ? "Ø Kauf" : "Avg Cost"}</span><span className="text-right">{lang === "de" ? "Aktuell" : "Current"}</span><span className="text-right">P&L</span>
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
      <p className="text-xs text-muted-foreground">{lang === "de" ? "Bearbeite die Positionen oben, um deine individuelle Situation zu simulieren. Die Steuerersparnis ist eine Schätzung." : "Edit positions above to simulate your individual situation. Tax savings are estimates."}</p>
    </div>
  );
}

/** Dividend Income Projector — Projects annual dividend income from portfolio */
function DividendProjector() {
  const { lang } = useLanguage();
  const [holdings, setHoldings] = useState([
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
        <ResultCard label={lang === "de" ? "Aktuelle jährl. Dividende" : "Current Annual Dividends"} value={formatMoney(currentIncome)} />
        <ResultCard label={`${lang === "de" ? "Dividende in Jahr" : "Dividends Year"} ${years}`} value={formatMoney(finalIncome)} color="text-primary" />
        <ResultCard label={lang === "de" ? "Kumuliert über Zeitraum" : "Cumulative Total"} value={formatMoney(totalCum)} color="text-gain" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs text-muted-foreground">{lang === "de" ? "Dividendenwachstum (%/Jahr)" : "Div. Growth (%/yr)"}</Label><Input type="number" value={growthRate} onChange={(e) => setGrowthRate(Number(e.target.value))} className="mt-1" step="0.5" /></div>
        <div><Label className="text-xs text-muted-foreground">{lang === "de" ? "Projektionszeitraum (Jahre)" : "Projection (years)"}</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1" /></div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(y) => `${y}y`} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12, color: "hsl(var(--foreground))" }} formatter={(v: number) => [formatMoney(v)]} />
            <Bar dataKey="income" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name={lang === "de" ? "Jahres-Dividende" : "Annual Dividends"} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_4rem_5rem] gap-2 px-4 py-2 bg-muted/40 text-[10px] uppercase font-mono text-muted-foreground">
          <span>Symbol</span><span className="text-right">{lang === "de" ? "Stk." : "Qty"}</span><span className="text-right">{lang === "de" ? "Div./Aktie" : "Div./Share"}</span>
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
            <TabsTrigger value="options" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Crosshair className="h-3.5 w-3.5" />{t("calc.optionsCalc") || "Options"}</TabsTrigger>
            <TabsTrigger value="dca" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Target className="h-3.5 w-3.5" />{t("calc.dcaSimulator") || "DCA"}</TabsTrigger>
            <TabsTrigger value="loan" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Landmark className="h-3.5 w-3.5" />{t("calc.loanCalc")}</TabsTrigger>
            <TabsTrigger value="riskreward" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Scale className="h-3.5 w-3.5" />{t("calc.riskReward")}</TabsTrigger>
            <TabsTrigger value="currency" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><ArrowLeftRight className="h-3.5 w-3.5" />{t("calc.currencyConverter") || "Currency"}</TabsTrigger>
            <TabsTrigger value="taxloss" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Scissors className="h-3.5 w-3.5" />Tax-Loss</TabsTrigger>
            <TabsTrigger value="divproject" className="rounded-lg gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Coins className="h-3.5 w-3.5" />{lang === "de" ? "Dividenden-Projektion" : "Div. Projector"}</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio"><PortfolioGrowth /></TabsContent>
          <TabsContent value="compound"><CompoundInterest /></TabsContent>
          <TabsContent value="dividend"><DividendCalc /></TabsContent>
          <TabsContent value="fire"><FireCalc /></TabsContent>
          <TabsContent value="position"><PositionSize /></TabsContent>
          <TabsContent value="options"><OptionsCalc /></TabsContent>
          <TabsContent value="dca"><DCASimulator /></TabsContent>
          <TabsContent value="loan"><LoanCalc /></TabsContent>
          <TabsContent value="riskreward"><RiskRewardCalc /></TabsContent>
          <TabsContent value="currency"><CurrencyConverter /></TabsContent>
          <TabsContent value="taxloss"><TaxLossHarvesting /></TabsContent>
          <TabsContent value="divproject"><DividendProjector /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CalculatorPage;
