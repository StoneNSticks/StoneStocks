import { formatNumber, formatCurrency, formatPercent, useFormattedCurrency } from "@/lib/formatters";
import { useT } from "@/contexts/LanguageContext";

interface KeyMetric {
  label: string;
  value: string;
}

function buildMetrics(overview: any, quote: any, derived: any, fmtCur: (v: number | null | undefined) => string, t: (k: string) => string): KeyMetric[] {
  const metrics: KeyMetric[] = [];
  const add = (label: string, value: string) => metrics.push({ label, value });

  add(t("km.marketCap"), fmtCur(derived?.marketCap || parseFloat(overview?.MarketCapitalization || "0")));
  add(t("km.peRatio"), formatNumber(derived?.calculatedPE || parseFloat(overview?.PERatio || "0")));
  add(t("km.pbRatio"), formatNumber(derived?.calculatedPB || parseFloat(overview?.PriceToBookRatio || "0")));
  add(t("km.psRatio"), formatNumber(derived?.calculatedPS || parseFloat(overview?.PriceToSalesRatioTTM || "0")));
  add(t("km.evEbitda"), formatNumber(derived?.evToEbitda || parseFloat(overview?.EVToEBITDA || "0")));
  add(t("km.eps"), fmtCur(parseFloat(overview?.EPS || "0")));
  add(t("km.dividendYield"), derived?.dividendYield ? formatPercent(derived.dividendYield) : overview?.DividendYield ? formatPercent(parseFloat(overview.DividendYield) * 100) : "—");
  add(t("km.fcfYield"), derived?.fcfYield ? formatPercent(derived.fcfYield) : "—");
  add(t("km.beta"), formatNumber(parseFloat(overview?.Beta || "0")));
  add(t("km.52wHigh"), fmtCur(parseFloat(overview?.["52WeekHigh"] || "0")));
  add(t("km.52wLow"), fmtCur(parseFloat(overview?.["52WeekLow"] || "0")));
  add(t("km.profitMargin"), overview?.ProfitMargin ? formatPercent(parseFloat(overview.ProfitMargin) * 100) : "—");
  add(t("km.revenueTTM"), fmtCur(parseFloat(overview?.RevenueTTM || "0")));
  add(t("km.grossProfitTTM"), fmtCur(parseFloat(overview?.GrossProfitTTM || "0")));
  add(t("km.roe"), overview?.ReturnOnEquityTTM ? formatPercent(parseFloat(overview.ReturnOnEquityTTM) * 100) : "—");
  add(t("km.roa"), overview?.ReturnOnAssetsTTM ? formatPercent(parseFloat(overview.ReturnOnAssetsTTM) * 100) : "—");

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
  const t = useT();
  const metrics = buildMetrics(overview, quote, derived, fmtCur, t);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">{t("km.title")}</h3>
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
