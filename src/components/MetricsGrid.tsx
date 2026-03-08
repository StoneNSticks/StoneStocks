import { memo } from "react";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/formatters";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useT } from "@/contexts/LanguageContext";

interface MetricCardProps { items: Array<{ label: string; value: string; color?: string }>; }

function MetricCard({ items }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{item.label}</span>
          <span className={`font-display font-semibold text-sm ${item.color || ""}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function safeNum(val: unknown): number { const n = Number(val); return isNaN(n) ? 0 : n; }

export const MetricsGrid = memo(function MetricsGrid({ overview, quote, derived, profile, massiveTicker }: {
  overview: Record<string, string> | null;
  quote: Record<string, number> | null;
  derived: Record<string, number | null> | null;
  profile: Record<string, unknown> | null;
  massiveTicker: Record<string, unknown> | null;
}) {
  const { convert, symbol: currSymbol } = useCurrency();
  const t = useT();
  const fmtCur = (v: number | null | undefined) => formatCurrency(convert(v), currSymbol);
  const price = quote?.c;
  const change = quote?.d;
  const changePercent = quote?.dp;
  const changeColor = change && change > 0 ? "text-gain" : change && change < 0 ? "text-loss" : "";

  const MAX_REASONABLE_MCAP = 8e12;
  const rawMassiveMcap = safeNum(massiveTicker?.market_cap);
  const safeMassiveMcap = rawMassiveMcap > 0 && rawMassiveMcap < MAX_REASONABLE_MCAP ? rawMassiveMcap : 0;
  const marketCap = safeNum(derived?.marketCap) || safeMassiveMcap || safeNum(overview?.MarketCapitalization);
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

  const fmtV = (v: number, isCurrency = false) => v ? (isCurrency ? fmtCur(v) : formatNumber(v)) : "—";
  const fmtP = (v: number) => v ? formatPercent(v) : "—";
  const pctColor = (v: number) => v > 0 ? "text-gain" : v < 0 ? "text-loss" : "";

  const capLabel = marketCap >= 1e12 ? t("m.megaCap") : marketCap >= 1e11 ? t("m.largeCap") : marketCap >= 1e10 ? t("m.midCap") : t("m.smallCap");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard items={[
        { label: t("m.price"), value: `${changePercent ? formatPercent(changePercent) : ""} ${fmtCur(price)}`, color: changeColor },
        { label: capLabel, value: fmtCur(marketCap) },
        ...(employees > 0 ? [{ label: t("m.employees"), value: formatNumber(employees) }] : []),
        ...(eps ? [{ label: t("m.eps"), value: fmtCur(eps) }] : []),
        ...(beta ? [{ label: t("m.beta"), value: formatNumber(beta) }] : []),
      ]} />
      <MetricCard items={[
        { label: t("m.pe"), value: fmtV(pe) },
        { label: t("m.pb"), value: fmtV(pb) },
        { label: t("m.ps"), value: fmtV(ps) },
        { label: t("m.pfcf"), value: pfcf > 0 ? formatNumber(pfcf) : "—" },
        { label: t("m.evEbitda"), value: fmtV(evEbitda) },
      ]} />
      <MetricCard items={[
        { label: t("m.earningsYield"), value: fmtP(peYield) },
        { label: t("m.dividendYield"), value: fmtP(dividendYield) },
        { label: t("m.payoutRatio"), value: fmtP(payoutRatio) },
        { label: t("m.fcfYield"), value: fmtP(fcfYield) },
        ...(freeCashflow ? [{ label: t("m.freeCashFlow"), value: fmtCur(freeCashflow), color: pctColor(freeCashflow) }] : []),
      ]} />
      <MetricCard items={[
        { label: t("m.revGrowth"), value: fmtP(revGrowth), color: pctColor(revGrowth) },
        { label: t("m.operatingMargin"), value: fmtP(operatingMargin) },
        { label: t("m.profitMargin"), value: fmtP(profitMargin) },
        { label: t("m.roe"), value: fmtP(roe), color: pctColor(roe) },
        { label: t("m.roa"), value: fmtP(roa), color: pctColor(roa) },
        ...(revenueTTM ? [{ label: t("m.revenueTTM"), value: fmtCur(revenueTTM) }] : []),
      ]} />
    </div>
  );
}
