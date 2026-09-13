import { useState } from "react";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Link } from "react-router-dom";
import { useHiddenGems } from "@/hooks/useStockData";
import { formatPercent, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ChevronDown } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

const WEIGHTS: { key: string; label: string; weight: number }[] = [
  { key: "valuation", label: "gems.valuation", weight: 30 },
  { key: "growth", label: "gems.growth", weight: 30 },
  { key: "analysts", label: "gems.analysts", weight: 20 },
  { key: "quality", label: "gems.quality", weight: 10 },
  { key: "momentum", label: "gems.momentum", weight: 10 },
];

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground truncate">{label}</div>
      <div className="text-[11px] font-medium tabular-nums">{value}</div>
    </div>
  );
}

export function HiddenGems() {
  const { data: stocks, isLoading } = useHiddenGems();
  const fc = useFormattedCurrency();
  const t = useT();
  const [openExplain, setOpenExplain] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">{t("gems.title")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) return null;

  const fmt = (v: number | null | undefined, suffix = "", digits = 1) =>
    v == null || !isFinite(v) ? "–" : `${v.toFixed(digits)}${suffix}`;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">{t("gems.title")}</h2>
        </div>
        <span className="text-xs text-muted-foreground text-right">{t("gems.subtitle")}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {stocks.slice(0, 12).map((s: any) => (
          <Link
            key={s.symbol}
            to={`/stock/${s.symbol}`}
            className="rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted group"
          >
            <div className="flex items-center gap-3">
              <CompanyLogo src={s.logo} symbol={s.symbol} name={s.name} size={36} />
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {s.name || s.symbol}
                </div>
                <div className="text-[11px] text-muted-foreground">{s.symbol}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium tabular-nums">{fc(s.price)}</div>
                <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(s.changePercent)}`}>
                  {formatPercent(s.changePercent)}
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary tabular-nums">
                {t("gems.score")} {s.score}/100
              </span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums">
                {t("gems.upside")}{" "}
                {s.upside == null ? t("gems.noTarget") : `${s.upside > 0 ? "+" : ""}${s.upside.toFixed(0)}%`}
              </span>
            </div>

            <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2">
              {(s.reasonKeys || []).map((k: string) => t(`gems.reason.${k}`)).join(" · ")}
            </p>

            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border/50 pt-2">
              <Metric label={t("gems.pe")} value={fmt(s.pe)} />
              <Metric label={t("gems.revGrowth")} value={fmt(s.revenueGrowth, "%", 0)} />
              <Metric label={t("gems.fcfYield")} value={fmt(s.fcfYield, "%")} />
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpenExplain((o) => !o)}
        className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={openExplain}
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openExplain ? "rotate-180" : ""}`} />
        {t("gems.explain")}
      </button>

      {openExplain && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {WEIGHTS.map((w) => (
            <div key={w.key} className="rounded-lg bg-muted/50 p-2">
              <div className="text-[11px] font-medium">{t(w.label)}</div>
              <div className="text-[11px] text-muted-foreground tabular-nums">{w.weight}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
