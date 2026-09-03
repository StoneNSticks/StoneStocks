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

export function PositionSize() {
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

export function RiskRewardCalc() {
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

export function OptionsCalc() {
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

export function MarginCalc() {
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

export function BreakEvenCalc() {
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

