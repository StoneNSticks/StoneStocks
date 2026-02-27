import { Link } from "react-router-dom";
import { useTopCompanies } from "@/hooks/useStockData";
import { formatNumber, formatPercent, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

export function TopCompanies() {
  const { data: companies, isLoading } = useTopCompanies();
  const fc = useFormattedCurrency();
  const { convert, symbol: cs } = useCurrency();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Top Companies</h2>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!companies || companies.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Top Companies</h2>
        </div>
        <span className="text-xs text-muted-foreground">by market cap</span>
      </div>
      <div className="space-y-1">
        {companies.map((c: any, i: number) => (
          <Link
            key={c.symbol}
            to={`/stock/${c.symbol}`}
            className="flex items-center gap-3 rounded-lg p-2.5 -mx-1 transition-colors hover:bg-muted group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {c.logo ? (
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-8 h-8 rounded-lg object-contain bg-background border border-border/40"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {c.symbol.slice(0, 2)}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-display font-semibold text-sm group-hover:text-primary transition-colors">
                  {c.name}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {i + 1}. {c.symbol}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium">{fc(c.price)}</div>
              <div className={`text-[11px] font-medium ${priceChangeColor(c.changePercent)}`}>
                {formatPercent(c.changePercent)}
              </div>
            </div>
            <div className="text-right flex-shrink-0 hidden sm:block w-20">
              <div className="text-xs text-muted-foreground">
                {cs}{formatNumber(convert(c.marketCap))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
