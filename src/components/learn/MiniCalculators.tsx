/**
 * MiniCalculators: Interactive calculation widgets for learn sections.
 * Each calculator is a self-contained component with inputs and live results.
 */
import { useState, useMemo } from "react";
import { Calculator, TrendingUp, PieChart, DollarSign, BarChart3, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "./LearnComponents";

function CalcWrapper({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeIn} className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/[0.02] p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h4 className="font-display font-semibold text-foreground text-sm">{title}</h4>
        <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">Interaktiv</span>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function NumInput({ label, value, onChange, min, max, step, suffix }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground w-32 shrink-0">{label}</label>
      <input
        type="range"
        min={min ?? 0} max={max ?? 100} step={step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
      />
      <span className="text-xs font-mono font-bold text-foreground w-20 text-right">{value.toLocaleString()}{suffix}</span>
    </div>
  );
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-primary/5 border border-primary/15 px-3 py-2 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-mono font-bold text-primary">{value}</span>
    </div>
  );
}

/** Compound Interest Calculator */
export function CompoundInterestCalc({ lang }: { lang: string }) {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    let total = initial;
    const r = rate / 100 / 12;
    for (let i = 0; i < years * 12; i++) {
      total = total * (1 + r) + monthly;
    }
    const invested = initial + monthly * years * 12;
    return { total, invested, gains: total - invested };
  }, [initial, monthly, rate, years]);

  return (
    <CalcWrapper title={lang === "de" ? "🧮 Zinseszins-Rechner" : "🧮 Compound Interest Calculator"} icon={<TrendingUp className="h-4 w-4" />}>
      <NumInput label={lang === "de" ? "Startkapital" : "Initial"} value={initial} onChange={setInitial} min={0} max={100000} step={1000} suffix="€" />
      <NumInput label={lang === "de" ? "Monatlich" : "Monthly"} value={monthly} onChange={setMonthly} min={0} max={5000} step={50} suffix="€" />
      <NumInput label={lang === "de" ? "Rendite p.a." : "Annual Return"} value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" />
      <NumInput label={lang === "de" ? "Jahre" : "Years"} value={years} onChange={setYears} min={1} max={50} suffix="" />
      <div className="grid sm:grid-cols-3 gap-2 pt-1">
        <ResultBox label={lang === "de" ? "Eingezahlt" : "Invested"} value={`€${Math.round(result.invested).toLocaleString()}`} />
        <ResultBox label={lang === "de" ? "Zinsen" : "Interest"} value={`€${Math.round(result.gains).toLocaleString()}`} />
        <ResultBox label={lang === "de" ? "Gesamt" : "Total"} value={`€${Math.round(result.total).toLocaleString()}`} />
      </div>
    </CalcWrapper>
  );
}

/** DuPont Analysis Calculator */
export function DuPontCalc({ lang }: { lang: string }) {
  const [netMargin, setNetMargin] = useState(12);
  const [assetTurnover, setAssetTurnover] = useState(1.2);
  const [leverage, setLeverage] = useState(2);

  const roe = netMargin * assetTurnover * leverage / 100;

  return (
    <CalcWrapper title={lang === "de" ? "🧮 DuPont-Analyse" : "🧮 DuPont Analysis"} icon={<PieChart className="h-4 w-4" />}>
      <NumInput label={lang === "de" ? "Nettomarge" : "Net Margin"} value={netMargin} onChange={setNetMargin} min={1} max={50} step={0.5} suffix="%" />
      <NumInput label="Asset Turnover" value={assetTurnover} onChange={setAssetTurnover} min={0.1} max={5} step={0.1} suffix="x" />
      <NumInput label={lang === "de" ? "Leverage" : "Leverage"} value={leverage} onChange={setLeverage} min={1} max={10} step={0.1} suffix="x" />
      <ResultBox label="ROE" value={`${roe.toFixed(1)}%`} />
    </CalcWrapper>
  );
}

/** Bond Price Calculator */
export function BondPriceCalc({ lang }: { lang: string }) {
  const [faceValue, setFaceValue] = useState(1000);
  const [couponRate, setCouponRate] = useState(5);
  const [marketRate, setMarketRate] = useState(4);
  const [years, setYears] = useState(10);

  const price = useMemo(() => {
    const c = faceValue * couponRate / 100;
    const r = marketRate / 100;
    let pv = 0;
    for (let t = 1; t <= years; t++) {
      pv += c / Math.pow(1 + r, t);
    }
    pv += faceValue / Math.pow(1 + r, years);
    return pv;
  }, [faceValue, couponRate, marketRate, years]);

  const ytm = couponRate;
  const premium = price > faceValue ? (lang === "de" ? "Premium" : "Premium") : price < faceValue ? "Discount" : "Par";

  return (
    <CalcWrapper title={lang === "de" ? "🧮 Anleihen-Rechner" : "🧮 Bond Price Calculator"} icon={<BarChart3 className="h-4 w-4" />}>
      <NumInput label={lang === "de" ? "Nennwert" : "Face Value"} value={faceValue} onChange={setFaceValue} min={100} max={10000} step={100} suffix="€" />
      <NumInput label={lang === "de" ? "Kuponrate" : "Coupon Rate"} value={couponRate} onChange={setCouponRate} min={0} max={15} step={0.25} suffix="%" />
      <NumInput label={lang === "de" ? "Marktzins" : "Market Rate"} value={marketRate} onChange={setMarketRate} min={0} max={15} step={0.25} suffix="%" />
      <NumInput label={lang === "de" ? "Restlaufzeit" : "Years to Maturity"} value={years} onChange={setYears} min={1} max={30} suffix="" />
      <div className="grid sm:grid-cols-2 gap-2 pt-1">
        <ResultBox label={lang === "de" ? "Anleihepreis" : "Bond Price"} value={`€${price.toFixed(2)}`} />
        <ResultBox label="Status" value={premium} />
      </div>
    </CalcWrapper>
  );
}

/** FIRE / 4% Rule Calculator */
export function FireCalc({ lang }: { lang: string }) {
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlySavings, setMonthlySavings] = useState(2000);
  const [returnRate, setReturnRate] = useState(7);

  const target = annualExpenses / (withdrawalRate / 100);
  const gap = Math.max(0, target - currentSavings);

  // Years to FIRE
  const yearsToFire = useMemo(() => {
    if (gap <= 0) return 0;
    const r = returnRate / 100 / 12;
    let savings = currentSavings;
    let months = 0;
    while (savings < target && months < 600) {
      savings = savings * (1 + r) + monthlySavings;
      months++;
    }
    return Math.round(months / 12 * 10) / 10;
  }, [currentSavings, monthlySavings, returnRate, target, gap]);

  return (
    <CalcWrapper title={lang === "de" ? "🧮 FIRE-Rechner (4%-Regel)" : "🧮 FIRE Calculator (4% Rule)"} icon={<DollarSign className="h-4 w-4" />}>
      <NumInput label={lang === "de" ? "Jahresausgaben" : "Annual Expenses"} value={annualExpenses} onChange={setAnnualExpenses} min={10000} max={200000} step={5000} suffix="€" />
      <NumInput label={lang === "de" ? "Entnahmerate" : "Withdrawal Rate"} value={withdrawalRate} onChange={setWithdrawalRate} min={2} max={6} step={0.5} suffix="%" />
      <NumInput label={lang === "de" ? "Aktuelles Vermögen" : "Current Savings"} value={currentSavings} onChange={setCurrentSavings} min={0} max={2000000} step={10000} suffix="€" />
      <NumInput label={lang === "de" ? "Monatl. Sparrate" : "Monthly Savings"} value={monthlySavings} onChange={setMonthlySavings} min={0} max={10000} step={100} suffix="€" />
      <NumInput label={lang === "de" ? "Rendite p.a." : "Annual Return"} value={returnRate} onChange={setReturnRate} min={1} max={15} step={0.5} suffix="%" />
      <div className="grid sm:grid-cols-3 gap-2 pt-1">
        <ResultBox label={lang === "de" ? "Zielkapital" : "Target"} value={`€${Math.round(target).toLocaleString()}`} />
        <ResultBox label={lang === "de" ? "Fehlt noch" : "Gap"} value={`€${Math.round(gap).toLocaleString()}`} />
        <ResultBox label={lang === "de" ? "Jahre bis FIRE" : "Years to FIRE"} value={gap <= 0 ? "✅" : `~${yearsToFire}`} />
      </div>
    </CalcWrapper>
  );
}

/** DCF Mini Calculator */
export function DcfCalc({ lang }: { lang: string }) {
  const [fcf, setFcf] = useState(500);
  const [growthRate, setGrowthRate] = useState(8);
  const [terminalGrowth, setTerminalGrowth] = useState(2.5);
  const [wacc, setWacc] = useState(10);
  const [shares, setShares] = useState(100);

  const fairValue = useMemo(() => {
    let pv = 0;
    let currentFcf = fcf;
    const r = wacc / 100;
    const g = growthRate / 100;
    const tg = terminalGrowth / 100;
    for (let t = 1; t <= 10; t++) {
      currentFcf *= (1 + g);
      pv += currentFcf / Math.pow(1 + r, t);
    }
    const tv = currentFcf * (1 + tg) / (r - tg);
    pv += tv / Math.pow(1 + r, 10);
    return pv / shares;
  }, [fcf, growthRate, terminalGrowth, wacc, shares]);

  return (
    <CalcWrapper title={lang === "de" ? "🧮 DCF-Schnellrechner" : "🧮 DCF Quick Calculator"} icon={<Layers className="h-4 w-4" />}>
      <NumInput label={lang === "de" ? "Aktueller FCF (Mio)" : "Current FCF (M)"} value={fcf} onChange={setFcf} min={10} max={5000} step={10} suffix="M" />
      <NumInput label={lang === "de" ? "Wachstum 10J" : "Growth 10Y"} value={growthRate} onChange={setGrowthRate} min={0} max={30} step={1} suffix="%" />
      <NumInput label={lang === "de" ? "Terminales Wachstum" : "Terminal Growth"} value={terminalGrowth} onChange={setTerminalGrowth} min={0} max={5} step={0.5} suffix="%" />
      <NumInput label="WACC" value={wacc} onChange={setWacc} min={5} max={20} step={0.5} suffix="%" />
      <NumInput label={lang === "de" ? "Aktien (Mio)" : "Shares (M)"} value={shares} onChange={setShares} min={1} max={5000} step={10} suffix="M" />
      <ResultBox label={lang === "de" ? "Fair Value / Aktie" : "Fair Value / Share"} value={`€${fairValue.toFixed(2)}`} />
    </CalcWrapper>
  );
}

/** Leverage Effect Calculator */
export function LeverageCalc({ lang }: { lang: string }) {
  const [equity, setEquity] = useState(100000);
  const [debtRatio, setDebtRatio] = useState(50);
  const [roaPercent, setRoaPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(5);

  const debt = equity * debtRatio / (100 - debtRatio);
  const totalCapital = equity + debt;
  const operatingIncome = totalCapital * roaPercent / 100;
  const interestExpense = debt * interestRate / 100;
  const netIncome = operatingIncome - interestExpense;
  const roe = (netIncome / equity) * 100;

  return (
    <CalcWrapper title={lang === "de" ? "🧮 Leverage-Effekt" : "🧮 Leverage Effect"} icon={<TrendingUp className="h-4 w-4" />}>
      <NumInput label={lang === "de" ? "Eigenkapital" : "Equity"} value={equity} onChange={setEquity} min={10000} max={1000000} step={10000} suffix="€" />
      <NumInput label={lang === "de" ? "Verschuldung" : "Debt Ratio"} value={debtRatio} onChange={setDebtRatio} min={0} max={90} step={5} suffix="%" />
      <NumInput label="ROA" value={roaPercent} onChange={setRoaPercent} min={1} max={30} step={0.5} suffix="%" />
      <NumInput label={lang === "de" ? "Fremdkapitalzins" : "Interest Rate"} value={interestRate} onChange={setInterestRate} min={1} max={15} step={0.5} suffix="%" />
      <div className="grid sm:grid-cols-2 gap-2 pt-1">
        <ResultBox label={lang === "de" ? "Gesamtkapital" : "Total Capital"} value={`€${Math.round(totalCapital).toLocaleString()}`} />
        <ResultBox label="ROE" value={`${roe.toFixed(1)}%`} />
      </div>
    </CalcWrapper>
  );
}
