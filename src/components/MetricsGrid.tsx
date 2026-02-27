import { formatNumber, formatCurrency, formatPercent } from "@/lib/formatters";

interface MetricCardProps {
  items: Array<{ label: string; value: string; color?: string }>;
}

function MetricCard({ items }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{item.label}</span>
          <span className={`font-display font-semibold text-sm ${item.color || ""}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MetricsGrid({
  overview,
  quote,
  derived,
  profile,
  massiveTicker,
}: {
  overview: Record<string, string> | null;
  quote: Record<string, number> | null;
  derived: Record<string, number | null> | null;
  profile: Record<string, unknown> | null;
  massiveTicker: Record<string, unknown> | null;
}) {
  const price = quote?.c;
  const change = quote?.d;
  const changePercent = quote?.dp;
  const changeColor = change && change > 0 ? "text-gain" : change && change < 0 ? "text-loss" : "";

  const marketCap = derived?.marketCap || (massiveTicker?.market_cap as number) || parseFloat(overview?.MarketCapitalization || "0");
  const employees = (massiveTicker?.total_employees as number) || 0;

  const pe = derived?.calculatedPE || parseFloat(overview?.PERatio || "0");
  const peYield = pe > 0 ? (1 / pe) * 100 : 0;
  
  const fcfYield = derived?.fcfYield || 0;
  const pfcf = fcfYield && fcfYield > 0 ? 100 / fcfYield : 0;

  const dividendYield = derived?.dividendYield || (overview?.DividendYield ? parseFloat(overview.DividendYield) * 100 : 0);
  const payoutRatio = overview?.PayoutRatio ? (parseFloat(overview.PayoutRatio) * 100) : 0;

  const operatingMargin = overview?.OperatingMarginTTM ? parseFloat(overview.OperatingMarginTTM) * 100 : 0;
  const profitMargin = overview?.ProfitMargin ? parseFloat(overview.ProfitMargin) * 100 : 0;

  const revGrowth = overview?.QuarterlyRevenueGrowthYOY ? parseFloat(overview.QuarterlyRevenueGrowthYOY) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Card 1: Price & Market Cap */}
      <MetricCard
        items={[
          { label: "Price", value: `${changePercent ? formatPercent(changePercent) : ""} ${formatCurrency(price)}`, color: changeColor },
          { label: marketCap >= 1e12 ? "Mega Cap" : marketCap >= 1e11 ? "Large Cap" : marketCap >= 1e10 ? "Mid Cap" : "Small Cap", value: formatCurrency(marketCap) },
          ...(employees > 0 ? [{ label: "Employees", value: formatNumber(employees) }] : []),
        ]}
      />

      {/* Card 2: Valuation Ratios */}
      <MetricCard
        items={[
          { label: "P/E", value: `${formatNumber(pe)}` },
          { label: "P/B", value: formatNumber(derived?.calculatedPB || parseFloat(overview?.PriceToBookRatio || "0")) },
          { label: "P/FCF", value: pfcf > 0 ? formatNumber(pfcf) : "—" },
          { label: "EV/EBITDA", value: formatNumber(derived?.evToEbitda || parseFloat(overview?.EVToEBITDA || "0")) },
        ]}
      />

      {/* Card 3: Yields & Dividends */}
      <MetricCard
        items={[
          { label: "Earnings Yield", value: peYield > 0 ? formatPercent(peYield) : "—" },
          { label: "Dividend Yield", value: dividendYield > 0 ? formatPercent(dividendYield) : "—" },
          { label: "Payout Ratio", value: payoutRatio > 0 ? formatPercent(payoutRatio) : "—" },
          { label: "FCF Yield", value: fcfYield ? formatPercent(fcfYield) : "—" },
        ]}
      />

      {/* Card 4: Growth & Margins */}
      <MetricCard
        items={[
          { label: "Rev Growth YoY", value: revGrowth ? formatPercent(revGrowth) : "—", color: revGrowth > 0 ? "text-gain" : revGrowth < 0 ? "text-loss" : "" },
          { label: "Operating Margin", value: operatingMargin ? formatPercent(operatingMargin) : "—" },
          { label: "Profit Margin", value: profitMargin ? formatPercent(profitMargin) : "—" },
        ]}
      />
    </div>
  );
}
