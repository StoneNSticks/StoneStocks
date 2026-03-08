import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowRight } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";

interface FinancialChartProps {
  title: string;
  data: Array<Record<string, unknown>>;
  dataKey: string;
  secondaryKey?: string;
  secondaryLabel?: string;
  color?: string;
  secondaryColor?: string;
  type?: "bar" | "area";
  formatValue?: (v: number) => string;
  badge?: string;
  badgeColor?: string;
}

function formatLargeNumber(num: number, sym = "$"): string {
  if (Math.abs(num) >= 1e12) return `${sym}${(num / 1e12).toFixed(0)}T`;
  if (Math.abs(num) >= 1e9) return `${sym}${(num / 1e9).toFixed(0)}B`;
  if (Math.abs(num) >= 1e6) return `${sym}${(num / 1e6).toFixed(0)}M`;
  if (Math.abs(num) >= 1e3) return `${sym}${(num / 1e3).toFixed(0)}K`;
  return `${sym}${num.toFixed(0)}`;
}

export function FinancialChart({
  title, data, dataKey, secondaryKey, secondaryLabel,
  color = "hsl(210, 80%, 55%)", secondaryColor = "hsl(145, 63%, 42%)",
  type = "bar", formatValue = formatLargeNumber, badge, badgeColor = "hsl(210, 80%, 55%)",
}: FinancialChartProps) {
  const { convert, symbol: currSymbol } = useCurrency();
  const t = useT();
  const effectiveFormat = (v: number) => {
    if (v == null || isNaN(v)) return "—";
    const converted = convert(v) ?? v;
    if (formatValue !== formatLargeNumber) return `${currSymbol}${converted.toFixed(2)}`;
    return formatLargeNumber(converted, currSymbol);
  };

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col h-[280px]">
        <div className="flex items-center justify-between mb-2"><h3 className="font-display font-semibold text-sm">{title}</h3></div>
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">{t("fc.noData")}</div>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.abs(Number(d[dataKey]) || 0)));
  const minVal = Math.min(...data.map((d) => Number(d[dataKey]) || 0));

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col h-[280px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="font-display font-semibold text-sm">{title}</h3>
          {secondaryKey && secondaryLabel && (
            <>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <span className="text-xs text-muted-foreground">{secondaryLabel}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {badge && <span className="text-xs font-semibold" style={{ color: badgeColor }}>{badge}</span>}
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs><linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.15} /><stop offset="95%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} minTickGap={30} />
              <YAxis domain={[minVal < 0 ? "auto" : 0, "auto"]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} tickFormatter={effectiveFormat} width={50} />
              <Tooltip contentStyle={{ background: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: "8px", fontSize: 11, color: "hsl(210, 20%, 92%)" }} formatter={(v: number) => [effectiveFormat(v), title]} />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} minTickGap={20} />
              <YAxis domain={[minVal < 0 ? "auto" : 0, "auto"]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220,10%,50%)" }} tickFormatter={effectiveFormat} width={50} />
              <Tooltip contentStyle={{ background: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: "8px", fontSize: 11, color: "hsl(210, 20%, 92%)" }} formatter={(v: number, name: string) => [effectiveFormat(v), name === dataKey ? title : secondaryLabel || name]} />
              <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
              {secondaryKey && <Bar dataKey={secondaryKey} fill={secondaryColor} radius={[2, 2, 0, 0]} />}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function extractFinancialSeries(financials: Array<Record<string, unknown>>, metric: string, statement: string = "income_statement"): Array<{ label: string; value: number }> {
  if (!financials || !Array.isArray(financials)) return [];
  return financials.filter((f: Record<string, unknown>) => { const statements = f.financials as Record<string, Record<string, Record<string, unknown>>> | undefined; return statements?.[statement]?.[metric]?.value != null; }).map((f: Record<string, unknown>) => { const statements = f.financials as Record<string, Record<string, Record<string, unknown>>>; const val = Number(statements[statement][metric].value); const endDate = f.end_date as string; const period = f.fiscal_period as string; const year = f.fiscal_year as string; return { label: period ? `${period} ${year?.slice(-2)}` : endDate?.slice(0, 7) || "", value: val }; }).reverse();
}
