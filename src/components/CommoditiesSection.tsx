import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCommodities } from "@/lib/stockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Gem, Droplets, Flame, Zap, CircleDot, Wheat } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  Gold: <Gem className="h-4 w-4 text-yellow-500" />,
  Silver: <CircleDot className="h-4 w-4 text-slate-400" />,
  "Crude Oil (WTI)": <Droplets className="h-4 w-4 text-amber-700" />,
  "Brent Crude": <Droplets className="h-4 w-4 text-amber-600" />,
  "Natural Gas": <Flame className="h-4 w-4 text-blue-400" />,
  Copper: <Zap className="h-4 w-4 text-orange-500" />,
  Platinum: <CircleDot className="h-4 w-4 text-gray-300" />,
  Wheat: <Wheat className="h-4 w-4 text-yellow-600" />,
};

const DE_NAMES: Record<string, string> = {
  Gold: "Gold", Silver: "Silber", "Crude Oil (WTI)": "Rohöl (WTI)",
  "Brent Crude": "Brent-Rohöl", "Natural Gas": "Erdgas", Copper: "Kupfer",
  Platinum: "Platin", Wheat: "Weizen",
};

export function CommoditiesSection() {
  const t = useT();
  const { convert, symbol: cSym } = useCurrency();
  const { data, isLoading } = useQuery({
    queryKey: ["commodities"],
    queryFn: getCommodities,
    refetchInterval: 5 * 60 * 1000,
  });

  const lang = t("nav.markets") === "Märkte" ? "de" : "en";

  if (isLoading) return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    </div>
  );

  if (!data?.length) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
        <Gem className="h-5 w-5 text-primary" />
        {lang === "de" ? "Rohstoffe" : "Commodities"}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.map((c: any) => {
          const isUp = c.change >= 0;
          return (
            <Link key={c.name} to={`/commodity/${encodeURIComponent(c.name)}`} className="rounded-xl bg-muted/40 border border-border/30 p-3 hover:border-primary/30 transition-colors block">
              <div className="flex items-center gap-2 mb-1.5">
                {ICONS[c.name] || <Gem className="h-4 w-4 text-muted-foreground" />}
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {lang === "de" ? (DE_NAMES[c.name] || c.name) : c.name}
                </span>
              </div>
              <div className="font-display font-bold text-sm">{cSym}{convert(c.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className={`text-xs font-medium mt-0.5 ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? "+" : ""}{c.changePercent.toFixed(2)}%
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">/{c.unit}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
