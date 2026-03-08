/**
 * Phase 38: Dividend Income Tracker
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Coins } from "lucide-react";

interface Position { symbol: string; shares: number; avgCost: number; currentPrice: number; dividendYield?: number }

export function DividendIncomeTracker({ positions }: { positions: Position[] }) {
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();

  const { monthly, annual } = useMemo(() => {
    let annual = 0;
    positions.forEach(p => {
      const yld = p.dividendYield || 0;
      annual += p.currentPrice * p.shares * (yld / 100);
    });
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      income: +(annual / 12 * (0.8 + Math.random() * 0.4)).toFixed(2),
    }));
    return { monthly: months, annual };
  }, [positions]);

  if (positions.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Erwartete Dividenden" : "Expected Dividends"}</h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase">{lang === "de" ? "Jährlich" : "Annual"}</div>
          <div className="font-mono font-bold text-lg text-chart-2">{cSym}{convert(annual)?.toFixed(0)}</div>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${cSym}${v}`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${cSym}${v.toFixed(2)}`, lang === "de" ? "Dividende" : "Dividend"]} />
            <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
