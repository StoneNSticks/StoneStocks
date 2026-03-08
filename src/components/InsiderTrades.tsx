/**
 * InsiderTrades — Shows recent insider buy/sell transactions from Finnhub.
 */
import { useInsiderTransactions } from "@/hooks/useStockData";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

export function InsiderTrades({ symbol }: { symbol: string }) {
  const { data: txs, isLoading } = useInsiderTransactions(symbol);
  const { lang } = useLanguage();
  const { convert, symbol: cSym } = useCurrency();
  const t = useT();

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;
  if (!txs || !Array.isArray(txs) || txs.length === 0) return null;

  const recent = txs.slice(0, 15);

  const getTypeInfo = (change: number) => {
    if (change > 0) return { label: lang === "de" ? "Kauf" : "Buy", icon: <TrendingUp className="h-3.5 w-3.5" />, color: "text-chart-2", bg: "bg-chart-2/10" };
    if (change < 0) return { label: lang === "de" ? "Verkauf" : "Sell", icon: <TrendingDown className="h-3.5 w-3.5" />, color: "text-destructive", bg: "bg-destructive/10" };
    return { label: lang === "de" ? "Sonstig" : "Other", icon: <Minus className="h-3.5 w-3.5" />, color: "text-muted-foreground", bg: "bg-muted" };
  };

  const fmtShares = (n: number) => Math.abs(n).toLocaleString();
  const fmtValue = (shares: number, price: number) => {
    const val = Math.abs(shares) * price;
    if (val === 0) return "—";
    const converted = convert(val) || 0;
    if (converted >= 1e6) return `${cSym}${(converted / 1e6).toFixed(1)}M`;
    if (converted >= 1e3) return `${cSym}${(converted / 1e3).toFixed(0)}K`;
    return `${cSym}${converted.toFixed(0)}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2 p-4 pb-3 border-b border-border/40">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">
          {lang === "de" ? "Insider-Transaktionen" : "Insider Trades"}
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground ml-auto">{recent.length} {lang === "de" ? "letzte" : "recent"}</span>
      </div>
      <div className="divide-y divide-border/20">
        {recent.map((tx: any, i: number) => {
          const info = getTypeInfo(tx.change || 0);
          return (
            <div key={`${tx.name}-${tx.transactionDate}-${i}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
              <div className={`flex items-center justify-center h-7 w-7 rounded-lg ${info.bg} ${info.color} shrink-0`}>
                {info.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{tx.name || "Unknown"}</div>
                <div className="text-[10px] text-muted-foreground">
                  {tx.transactionDate || "—"} · {info.label}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-xs font-mono font-semibold ${info.color}`}>
                  {fmtShares(tx.change || 0)} {lang === "de" ? "Aktien" : "shares"}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {fmtValue(tx.change || 0, tx.transactionPrice || 0)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
