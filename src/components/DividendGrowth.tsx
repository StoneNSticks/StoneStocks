/**
 * DividendGrowth — Annual dividend bar chart with CAGR calculation and growth forecast.
 * 
 * HOW IT WORKS:
 * - Takes raw dividend payment data from Polygon API and groups it by year
 * - Calculates CAGR (Compound Annual Growth Rate) across all years
 * - Shows a bar chart with annual dividends per share
 * - Forecasts future dividend based on current growth rate
 * 
 * CONNECTED TO:
 * - StockDetail page → renders when dividend data is available
 * - CurrencyContext → converts all dollar amounts to selected currency (USD/EUR)
 * - LanguageContext → translates labels (German/English)
 * 
 * DATA SOURCE: Polygon.io dividends endpoint via stock-data edge function
 */
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Wallet } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";

interface DividendGrowthProps {
  dividends: any[];
  dividendYield: number;
}

export function DividendGrowth({ dividends, dividendYield }: DividendGrowthProps) {
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();

  // ── Group dividends by year and sum them up ──
  // Each dividend payment has a pay_date and cash_amount
  // We combine all payments in the same year to get annual totals
  const annualData = useMemo(() => {
    if (!dividends || !Array.isArray(dividends) || dividends.length === 0) return [];

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

  // ── Calculate CAGR (Compound Annual Growth Rate) ──
  // Formula: (EndValue/StartValue)^(1/Years) - 1
  // Shows how fast the dividend has grown on average per year
  const cagr = useMemo(() => {
    if (annualData.length < 2) return 0;
    const first = annualData[0].total;
    const last = annualData[annualData.length - 1].total;
    const years = annualData.length - 1;
    if (first <= 0 || last <= 0) return 0;
    return (Math.pow(last / first, 1 / years) - 1) * 100;
  }, [annualData]);

  // Don't render if less than 2 years of data (can't show growth)
  if (annualData.length < 2) return null;

  // ── Currency formatting helper ──
  // Converts USD values to selected currency and adds symbol
  const fmtDiv = (v: number) => `${cSym}${(convert(v) ?? v).toFixed(2)}`;

  // ── Forecast: project dividend 5 years into the future ──
  const lastDiv = annualData[annualData.length - 1].total;
  const lastYear = parseInt(annualData[annualData.length - 1].year);
  const forecastVal = lastDiv * Math.pow(1 + cagr / 100, 5);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      {/* ── Header: Title + yield/CAGR badges ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-muted-foreground">{t("div.title")}</h3>
        </div>
        <div className="flex gap-2">
          {dividendYield > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
              {dividendYield.toFixed(2)}% {t("div.yield")}
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

      {/* ── Bar chart: shows annual dividend per share ── */}
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={annualData}>
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
            formatter={(v: number) => [fmtDiv(v) + "/share", t("div.annualDividend")]}
          />
          <Bar dataKey="total" fill="hsl(145, 63%, 42%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* ── Forecast text: what dividend could be in 5 years ── */}
      {cagr > 0 && (
        <div className="mt-2 text-[11px] text-muted-foreground text-center">
          {t("div.growthForecast")
            .replace("{rate}", cagr.toFixed(1))
            .replace("{amount}", fmtDiv(forecastVal))
            .replace("{year}", String(lastYear + 5))}
        </div>
      )}
    </div>
  );
}
