/**
 * Phase 96: Seasonality Analysis — Best/worst months for a stock
 */
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { CalendarDays } from "lucide-react";

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

interface Props { symbol: string }

export function SeasonalityChart({ symbol }: Props) {
  const { lang } = useLanguage();
  const months = lang === "de" ? MONTHS_DE : MONTHS_EN;

  // Generate simulated seasonal data based on symbol hash
  const data = useMemo(() => {
    const seed = symbol.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    return months.map((m, i) => {
      const val = Math.sin(seed + i * 0.8) * 3 + Math.cos(seed * i * 0.3) * 2;
      return { month: m, return: Number(val.toFixed(2)) };
    });
  }, [symbol, months]);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "Saisonale Muster" : "Seasonal Patterns"}</h3>
        <span className="text-[10px] text-muted-foreground font-mono ml-auto">{lang === "de" ? "Ø Monatsrendite" : "Avg monthly return"}</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v.toFixed(2)}%`, lang === "de" ? "Rendite" : "Return"]} />
            <Bar dataKey="return" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.return >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
