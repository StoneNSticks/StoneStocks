/**
 * CompareFinancials — Side-by-side financial chart comparison using grouped bar charts.
 */
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getFullStock } from "@/lib/stockApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const COLORS = [
  "hsl(210, 80%, 55%)",
  "hsl(145, 63%, 42%)",
  "hsl(35, 90%, 55%)",
  "hsl(330, 70%, 55%)",
  "hsl(280, 65%, 55%)",
];

interface CompareFinancialsProps {
  symbols: string[];
}

function safeNum(v: unknown): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

export function CompareFinancials({ symbols }: CompareFinancialsProps) {
  const t = useT();
  const { convert, symbol: cSym } = useCurrency();

  const queries = useQueries({
    queries: symbols.map(sym => ({
      queryKey: ["fullStock", sym],
      queryFn: () => getFullStock(sym),
      enabled: !!sym,
      staleTime: 1000 * 60 * 3,
    })),
  });

  const isLoading = queries.some(q => q.isLoading);

  const metrics = useMemo(() => {
    if (isLoading) return [];

    const metricDefs = [
      { key: "marketCap", label: t("compare.marketCap"), getter: (d: any) => safeNum(d?.derived?.marketCap) || safeNum(d?.overview?.MarketCapitalization), format: "cap" },
      { key: "revenue", label: t("compare.revenue") || "Revenue", getter: (d: any) => safeNum(d?.overview?.RevenueTTM), format: "cap" },
      { key: "pe", label: "P/E", getter: (d: any) => safeNum(d?.derived?.calculatedPE) || safeNum(d?.overview?.PERatio), format: "num" },
      { key: "profitMargin", label: t("compare.profitMargin"), getter: (d: any) => d?.overview?.ProfitMargin ? safeNum(d.overview.ProfitMargin) * 100 : 0, format: "pct" },
      { key: "roe", label: "ROE", getter: (d: any) => d?.overview?.ReturnOnEquityTTM ? safeNum(d.overview.ReturnOnEquityTTM) * 100 : 0, format: "pct" },
      { key: "divYield", label: t("compare.divYield"), getter: (d: any) => safeNum(d?.derived?.dividendYield) || (d?.overview?.DividendYield ? safeNum(d.overview.DividendYield) * 100 : 0), format: "pct" },
    ];

    return metricDefs.map(def => {
      const entry: Record<string, any> = { metric: def.label };
      symbols.forEach((sym, i) => {
        const data = queries[i]?.data;
        entry[sym] = data ? def.getter(data) : 0;
      });
      entry._format = def.format;
      return entry;
    });
  }, [isLoading, symbols, queries, t]);

  if (isLoading) return <Skeleton className="h-80 rounded-xl" />;
  if (symbols.length < 2) return null;

  const fmtValue = (value: number, format: string) => {
    const c = convert(value) ?? value;
    if (format === "cap") {
      if (Math.abs(c) >= 1e12) return `${cSym}${(c / 1e12).toFixed(1)}T`;
      if (Math.abs(c) >= 1e9) return `${cSym}${(c / 1e9).toFixed(1)}B`;
      if (Math.abs(c) >= 1e6) return `${cSym}${(c / 1e6).toFixed(0)}M`;
      return `${cSym}${c.toFixed(0)}`;
    }
    if (format === "pct") return `${c.toFixed(1)}%`;
    return c.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {metrics.map((m, idx) => (
        <div key={idx} className="rounded-xl border border-border/60 bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">{m.metric}</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[m]} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="metric" hide />
                <Tooltip
                  formatter={(value: number) => fmtValue(value, m._format)}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                {symbols.map((sym, i) => (
                  <Bar key={sym} dataKey={sym} fill={COLORS[i % COLORS.length]} radius={[0, 6, 6, 0]} barSize={28} />
                ))}
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            {symbols.map((sym, i) => (
              <span key={sym} className="text-xs font-mono" style={{ color: COLORS[i % COLORS.length] }}>
                {sym}: {fmtValue(m[sym] || 0, m._format)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
