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

function safeNum(val: unknown): number {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
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

  const marketCap = safeNum(derived?.marketCap) || safeNum(massiveTicker?.market_cap) || safeNum(overview?.MarketCapitalization);
  const employees = safeNum(massiveTicker?.total_employees) || safeNum(overview?.FullTimeEmployees);

  const pe = safeNum(derived?.calculatedPE) || safeNum(overview?.PERatio);
  const pb = safeNum(derived?.calculatedPB) || safeNum(overview?.PriceToBookRatio);
  const ps = safeNum(derived?.calculatedPS) || safeNum(overview?.PriceToSalesRatioTTM);
  const peYield = pe > 0 ? (1 / pe) * 100 : 0;
  
  const fcfYield = safeNum(derived?.fcfYield);
  const pfcf = fcfYield && fcfYield > 0 ? 100 / fcfYield : 0;
  const evEbitda = safeNum(derived?.evToEbitda) || safeNum(overview?.EVToEBITDA);

  const dividendYield = safeNum(derived?.dividendYield) || (overview?.DividendYield ? safeNum(overview.DividendYield) * 100 : 0);
  const payoutRatio = overview?.PayoutRatio ? safeNum(overview.PayoutRatio) * 100 : 0;

  const operatingMargin = overview?.OperatingMarginTTM ? safeNum(overview.OperatingMarginTTM) * 100 : 0;
  const profitMargin = overview?.ProfitMargin ? safeNum(overview.ProfitMargin) * 100 : 0;
  const roe = overview?.ReturnOnEquityTTM ? safeNum(overview.ReturnOnEquityTTM) * 100 : 0;
  const roa = overview?.ReturnOnAssetsTTM ? safeNum(overview.ReturnOnAssetsTTM) * 100 : 0;

  const revGrowth = overview?.QuarterlyRevenueGrowthYOY ? safeNum(overview.QuarterlyRevenueGrowthYOY) * 100 : 0;
  const eps = safeNum(overview?.EPS);
  const beta = safeNum(overview?.Beta);
  const revenueTTM = safeNum(overview?.RevenueTTM);
  const freeCashflow = safeNum(derived?.freeCashflow);

  const fmtV = (v: number, isCurrency = false) => v ? (isCurrency ? formatCurrency(v) : formatNumber(v)) : "—";
  const fmtP = (v: number) => v ? formatPercent(v) : "—";
  const pctColor = (v: number) => v > 0 ? "text-gain" : v < 0 ? "text-loss" : "";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Card 1: Price & Market Cap */}
      <MetricCard
        items={[
          { label: "Price", value: `${changePercent ? formatPercent(changePercent) : ""} ${formatCurrency(price)}`, color: changeColor },
          { label: marketCap >= 1e12 ? "Mega Cap" : marketCap >= 1e11 ? "Large Cap" : marketCap >= 1e10 ? "Mid Cap" : "Small Cap", value: formatCurrency(marketCap) },
          ...(employees > 0 ? [{ label: "Employees", value: formatNumber(employees) }] : []),
          ...(eps ? [{ label: "EPS", value: formatCurrency(eps) }] : []),
          ...(beta ? [{ label: "Beta", value: formatNumber(beta) }] : []),
        ]}
      />

      {/* Card 2: Valuation Ratios */}
      <MetricCard
        items={[
          { label: "P/E", value: fmtV(pe) },
          { label: "P/B", value: fmtV(pb) },
          { label: "P/S", value: fmtV(ps) },
          { label: "P/FCF", value: pfcf > 0 ? formatNumber(pfcf) : "—" },
          { label: "EV/EBITDA", value: fmtV(evEbitda) },
        ]}
      />

      {/* Card 3: Yields & Dividends */}
      <MetricCard
        items={[
          { label: "Earnings Yield", value: fmtP(peYield) },
          { label: "Dividend Yield", value: fmtP(dividendYield) },
          { label: "Payout Ratio", value: fmtP(payoutRatio) },
          { label: "FCF Yield", value: fmtP(fcfYield) },
          ...(freeCashflow ? [{ label: "Free Cash Flow", value: formatCurrency(freeCashflow), color: pctColor(freeCashflow) }] : []),
        ]}
      />

      {/* Card 4: Growth & Margins & Returns */}
      <MetricCard
        items={[
          { label: "Rev Growth YoY", value: fmtP(revGrowth), color: pctColor(revGrowth) },
          { label: "Operating Margin", value: fmtP(operatingMargin) },
          { label: "Profit Margin", value: fmtP(profitMargin) },
          { label: "ROE", value: fmtP(roe), color: pctColor(roe) },
          { label: "ROA", value: fmtP(roa), color: pctColor(roa) },
          ...(revenueTTM ? [{ label: "Revenue TTM", value: formatCurrency(revenueTTM) }] : []),
        ]}
      />
    </div>
  );
}
