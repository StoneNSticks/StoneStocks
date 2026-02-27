import { formatNumber, formatCurrency, formatPercent, useFormattedCurrency } from "@/lib/formatters";

interface KeyMetric {
  label: string;
  value: string;
}

function buildMetrics(overview: any, quote: any, derived: any, fmtCur: (v: number | null | undefined) => string): KeyMetric[] {
  const metrics: KeyMetric[] = [];
  const add = (label: string, value: string) => metrics.push({ label, value });

  add("Market Cap", fmtCur(derived?.marketCap || parseFloat(overview?.MarketCapitalization || "0")));
  add("P/E Ratio", formatNumber(derived?.calculatedPE || parseFloat(overview?.PERatio || "0")));
  add("P/B Ratio", formatNumber(derived?.calculatedPB || parseFloat(overview?.PriceToBookRatio || "0")));
  add("P/S Ratio", formatNumber(derived?.calculatedPS || parseFloat(overview?.PriceToSalesRatioTTM || "0")));
  add("EV/EBITDA", formatNumber(derived?.evToEbitda || parseFloat(overview?.EVToEBITDA || "0")));
  add("EPS", fmtCur(parseFloat(overview?.EPS || "0")));
  add("Dividend Yield", derived?.dividendYield ? formatPercent(derived.dividendYield) : overview?.DividendYield ? formatPercent(parseFloat(overview.DividendYield) * 100) : "—");
  add("FCF Yield", derived?.fcfYield ? formatPercent(derived.fcfYield) : "—");
  add("Beta", formatNumber(parseFloat(overview?.Beta || "0")));
  add("52W High", fmtCur(parseFloat(overview?.["52WeekHigh"] || "0")));
  add("52W Low", fmtCur(parseFloat(overview?.["52WeekLow"] || "0")));
  add("Profit Margin", overview?.ProfitMargin ? formatPercent(parseFloat(overview.ProfitMargin) * 100) : "—");
  add("Revenue TTM", fmtCur(parseFloat(overview?.RevenueTTM || "0")));
  add("Gross Profit TTM", fmtCur(parseFloat(overview?.GrossProfitTTM || "0")));
  add("ROE", overview?.ReturnOnEquityTTM ? formatPercent(parseFloat(overview.ReturnOnEquityTTM) * 100) : "—");
  add("ROA", overview?.ReturnOnAssetsTTM ? formatPercent(parseFloat(overview.ReturnOnAssetsTTM) * 100) : "—");

  return metrics;
}

export function KeyMetrics({
  overview,
  quote,
  derived,
}: {
  overview: any;
  quote: any;
  derived: any;
}) {
  const fmtCur = useFormattedCurrency();
  const metrics = buildMetrics(overview, quote, derived, fmtCur);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Key Metrics</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col">
            <span className="text-[11px] text-muted-foreground">{m.label}</span>
            <span className="font-display font-semibold text-sm">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
