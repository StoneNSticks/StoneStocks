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

export function FireCalc() {
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

export function LoanCalc() {
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

export function RetirementWithdrawal() {
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

export function SavingsGoalCalc() {
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

export function NetWorthCalc() {
  const t = useT();
  const [assets, setAssets] = useState([
    { label: "Cash & Bank", value: 20000 },
    { label: "Stocks", value: 85000 },
    { label: "Real Estate", value: 350000 },
    { label: "Retirement", value: 60000 },
  ]);
  const [liabilities, setLiabilities] = useState([
    { label: "Mortgage", value: 220000 },
    { label: "Car Loan", value: 15000 },
    { label: "Credit Card", value: 3500 },
  ]);

  const totalAssets = assets.reduce((s, a) => s + a.value, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const pieData = assets.map(a => ({ name: a.label, value: a.value }));
  const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  const updateAsset = (i: number, val: number) => {
    setAssets(prev => prev.map((a, idx) => idx === i ? { ...a, value: val } : a));
  };
  const updateLiability = (i: number, val: number) => {
    setLiabilities(prev => prev.map((l, idx) => idx === i ? { ...l, value: val } : l));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label="Gesamtvermögen" value={formatMoney(totalAssets)} color="text-gain" />
        <ResultCard label="Gesamtschulden" value={formatMoney(totalLiabilities)} color="text-destructive" />
        <ResultCard label="Nettovermögen" value={formatMoney(netWorth)} color={netWorth >= 0 ? "text-primary" : "text-destructive"} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vermögenswerte</div>
          {assets.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-muted-foreground flex-1 truncate">{a.label}</span>
              <Input type="number" value={a.value} onChange={(e) => updateAsset(i, Number(e.target.value))} className="h-7 w-28 text-xs text-right" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verbindlichkeiten</div>
          {liabilities.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full flex-shrink-0 bg-destructive/70" />
              <span className="text-xs text-muted-foreground flex-1 truncate">{l.label}</span>
              <Input type="number" value={l.value} onChange={(e) => updateLiability(i, Number(e.target.value))} className="h-7 w-28 text-xs text-right" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4 flex justify-center">
        <PieChart width={220} height={180}>
          <Pie data={pieData} cx={110} cy={90} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={chartStyle} formatter={(v: number) => [formatMoney(v)]} />
        </PieChart>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SPECIAL CATEGORY
// ═══════════════════════════════════════════════════

