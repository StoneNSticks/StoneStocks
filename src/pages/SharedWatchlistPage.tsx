/**
 * SharedWatchlistPage — Read-only view of a shared watchlist via URL params.
 * URL: /shared-watchlist?symbols=AAPL,MSFT,GOOG
 */
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getQuote, getProfile } from "@/lib/stockApi";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { motion } from "framer-motion";

function SharedQuoteRow({ symbol }: { symbol: string }) {
  const { convert, symbol: cSym } = useCurrency();
  const { lang } = useLanguage();
  const { data: quote, isLoading: qLoading } = useQuery({
    queryKey: ["shared-quote", symbol], queryFn: () => getQuote(symbol), staleTime: 60_000,
  });
  const { data: profile, isLoading: pLoading } = useQuery({
    queryKey: ["shared-profile", symbol], queryFn: () => getProfile(symbol), staleTime: 5 * 60_000,
  });

  if (qLoading || pLoading) return <Skeleton className="h-16 rounded-xl" />;

  const name = profile?.name || symbol;
  const logo = profile?.logo;
  const price = quote?.c;
  const change = quote?.dp || 0;
  const isUp = change >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Link to={`/stock/${symbol}`} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/40 hover:shadow-lg transition-all">
        {logo ? (
          <img src={logo} alt={name} className="h-10 w-10 rounded-xl object-contain bg-background border border-border/40 p-1 shrink-0" />
        ) : (
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="font-mono font-bold text-primary text-xs">{symbol.slice(0, 2)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-mono font-bold text-sm">{symbol}</div>
          <div className="text-xs text-muted-foreground truncate">{name}</div>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold text-sm">
            {price ? `${cSym}${(convert(price) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
          </div>
          <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isUp ? "text-chart-2" : "text-destructive"}`}>
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isUp ? "+" : ""}{change.toFixed(2)}%
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function SharedWatchlistPage() {
  const [searchParams] = useSearchParams();
  const { lang } = useLanguage();
  const symbolsStr = searchParams.get("symbols") || "";
  const symbols = useMemo(() => symbolsStr.split(",").map(s => s.trim().toUpperCase()).filter(Boolean), [symbolsStr]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10 max-w-3xl px-3 sm:px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              {lang === "de" ? "Geteilte" : "Shared"} <span className="text-primary">Watchlist</span>
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            {symbols.length} {lang === "de" ? "Positionen" : "positions"} · {lang === "de" ? "Nur Ansicht" : "View only"}
          </p>
        </motion.div>

        {symbols.length === 0 ? (
          <div className="text-center py-20">
            <Share2 className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              {lang === "de" ? "Keine Aktien im geteilten Link gefunden" : "No stocks found in shared link"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {symbols.map(s => <SharedQuoteRow key={s} symbol={s} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
