/**
 * Phase 97: Fair Value Calculator Pro — Monte Carlo simulation
 */
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { FlaskConical, RefreshCw } from "lucide-react";

interface Props { symbol: string; currentPrice?: number; fcf?: number; sharesOut?: number }

export function MonteCarloFairValue({ symbol, currentPrice = 180, fcf = 5e9, sharesOut = 2e9 }: Props) {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();
  const [iterations] = useState(1000);
  const [key, setKey] = useState(0);

  const results = useMemo(() => {
    const values: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const growthRate = 0.05 + (Math.random() - 0.5) * 0.15;
      const discountRate = 0.08 + Math.random() * 0.06;
      const terminalGrowth = 0.02 + Math.random() * 0.02;
      let totalPV = 0;
      let cashFlow = fcf / sharesOut;
      for (let y = 1; y <= 10; y++) {
        cashFlow *= (1 + growthRate);
        totalPV += cashFlow / Math.pow(1 + discountRate, y);
      }
      const terminalValue = (cashFlow * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
      totalPV += terminalValue / Math.pow(1 + discountRate, 10);
      values.push(Math.max(0, totalPV));
    }
    values.sort((a, b) => a - b);
    const binCount = 20;
    const min = values[0];
    const max = values[values.length - 1];
    const binSize = (max - min) / binCount;
    const bins = Array.from({ length: binCount }, (_, i) => {
      const lo = min + i * binSize;
      const hi = lo + binSize;
      const count = values.filter(v => v >= lo && v < hi).length;
      return { price: +((lo + hi) / 2).toFixed(0), count, lo, hi };
    });
    const median = values[Math.floor(values.length * 0.5)];
    const p10 = values[Math.floor(values.length * 0.1)];
    const p90 = values[Math.floor(values.length * 0.9)];
    return { bins, median: +median.toFixed(2), p10: +p10.toFixed(2), p90: +p90.toFixed(2), mean: +(values.reduce((a, b) => a + b) / values.length).toFixed(2) };
  }, [fcf, sharesOut, iterations, key]);

  const upside = ((results.median - currentPrice) / currentPrice * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Monte-Carlo Fair Value" : "Monte Carlo Fair Value"}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setKey(k => k + 1)} className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" />{lang === "de" ? "Neu berechnen" : "Recalculate"}</Button>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center"><div className="text-[10px] text-muted-foreground">P10</div><div className="font-mono font-bold text-sm">{cSym}{convert(results.p10)?.toFixed(0)}</div></div>
        <div className="text-center"><div className="text-[10px] text-muted-foreground">Median</div><div className="font-mono font-bold text-sm text-primary">{cSym}{convert(results.median)?.toFixed(0)}</div></div>
        <div className="text-center"><div className="text-[10px] text-muted-foreground">{lang === "de" ? "Durchschnitt" : "Mean"}</div><div className="font-mono font-bold text-sm">{cSym}{convert(results.mean)?.toFixed(0)}</div></div>
        <div className="text-center"><div className="text-[10px] text-muted-foreground">P90</div><div className="font-mono font-bold text-sm">{cSym}{convert(results.p90)?.toFixed(0)}</div></div>
      </div>
      <div className="text-center mb-3">
        <span className={`font-mono font-bold ${Number(upside) >= 0 ? "text-chart-2" : "text-destructive"}`}>
          {Number(upside) >= 0 ? "+" : ""}{upside}% {lang === "de" ? "Potenzial" : "upside"}
        </span>
        <span className="text-xs text-muted-foreground ml-2">({iterations} {lang === "de" ? "Simulationen" : "simulations"})</span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={results.bins}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="price" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${v}`} />
            <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v, lang === "de" ? "Häufigkeit" : "Frequency"]} labelFormatter={l => `$${l}`} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {results.bins.map((b, i) => <Cell key={i} fill={b.price > currentPrice ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"} opacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
