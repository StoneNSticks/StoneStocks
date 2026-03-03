import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuote, getProfile } from "@/lib/stockApi";
import { formatPercent, priceChangeColor, useFormattedCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

interface PeerData { symbol: string; name: string; price: number; changePercent: number; logo: string; }

export function PeersList({ peers, currentSymbol }: { peers: string[]; currentSymbol: string }) {
  const fc = useFormattedCurrency();
  const [peerData, setPeerData] = useState<PeerData[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  const filtered = (peers || []).filter((p: string) => p !== currentSymbol).slice(0, 8);

  useEffect(() => {
    if (filtered.length === 0) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        filtered.map(async (sym) => {
          try {
            const [q, prof] = await Promise.all([getQuote(sym).catch(() => null), getProfile(sym).catch(() => null)]);
            return { symbol: sym, name: prof?.name || sym, price: q?.c || 0, changePercent: q?.dp || 0, logo: prof?.logo || "" };
          } catch { return { symbol: sym, name: sym, price: 0, changePercent: 0, logo: "" }; }
        })
      );
      if (!cancelled) { setPeerData(results); setLoading(false); }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSymbol, peers?.length]);

  if (filtered.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-muted-foreground">{t("peers.title")}</h3>
      </div>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-1">
          {peerData.map((peer) => (
            <Link key={peer.symbol} to={`/stock/${peer.symbol}`} className="flex items-center gap-3 rounded-lg p-2.5 -mx-1 transition-colors hover:bg-muted group">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {peer.logo ? (
                  <img src={peer.logo} alt={peer.name} className="w-8 h-8 rounded-lg object-contain bg-background border border-border/40" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{peer.symbol.slice(0, 2)}</div>
                )}
                <div className="min-w-0">
                  <div className="font-display font-semibold text-sm group-hover:text-primary transition-colors truncate">{peer.name}</div>
                  <div className="text-[11px] text-muted-foreground">{peer.symbol}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium tabular-nums">{fc(peer.price)}</div>
                <div className={`text-[11px] font-medium tabular-nums ${priceChangeColor(peer.changePercent)}`}>{formatPercent(peer.changePercent)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
