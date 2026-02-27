import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Wallet } from "lucide-react";

interface DividendGrowthProps {
  dividends: any[];
  dividendYield: number;
}

export function DividendGrowth({ dividends, dividendYield }: DividendGrowthProps) {
  const annualData = useMemo(() => {
    if (!dividends || !Array.isArray(dividends) || dividends.length === 0) return [];

    // Group by year
    const byYear: Record<string, number> = {};
    dividends.forEach((d: any) => {
      const year = (d.pay_date || d.ex_dividend_date || "")?.slice(0, 4);
      if (year) {
        byYear[year] = (byYear[year] || 0) + Number(d.cash_amount || 0);
      }
    });

    return Object.entries(byYear)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, total]) => ({ year, total: Math.round(total * 100) / 100 }));
  }, [dividends]);

  // Calculate CAGR
  const cagr = useMemo(() => {
    if (annualData.length < 2) return 0;
    const first = annualData[0].total;
    const last = annualData[annualData.length - 1].total;
    const years = annualData.length - 1;
    if (first <= 0 || last <= 0) return 0;
    return (Math.pow(last / first, 1 / years) - 1) * 100;
  }, [annualData]);

  if (annualData.length < 2) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-muted-foreground">Dividend Growth</h3>
        </div>
        <div className="flex gap-2">
          {dividendYield > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
              {dividendYield.toFixed(2)}% Yield
            </span>
          )}
          {cagr !== 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
              cagr > 0 ? "bg-[hsl(var(--success)/0.15)] text-gain" : "bg-destructive/15 text-loss"
            }`}>
              {cagr > 0 ? "+" : ""}{cagr.toFixed(1)}% CAGR
            </span>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={annualData}>
          <defs>
            <linearGradient id="divGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(145, 63%, 42%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
              color: "hsl(var(--foreground))",
            }}
            formatter={(v: number) => [`$${v.toFixed(2)}/share`, "Annual Dividend"]}
          />
          <Area type="monotone" dataKey="total" stroke="hsl(145, 63%, 42%)" strokeWidth={2} fill="url(#divGrad)" />
        </AreaChart>
      </ResponsiveContainer>

      {/* Future projection hint */}
      {cagr > 0 && (
        <div className="mt-2 text-[11px] text-muted-foreground text-center">
          At current {cagr.toFixed(1)}% growth rate, dividend could reach ~${(annualData[annualData.length - 1].total * Math.pow(1 + cagr / 100, 5)).toFixed(2)}/share by {parseInt(annualData[annualData.length - 1].year) + 5}
        </div>
      )}
    </div>
  );
}
