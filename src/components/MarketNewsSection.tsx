import { useMarketNews } from "@/hooks/useStockData";
import { formatDate } from "@/lib/formatters";
import { ExternalLink, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ErrorState";
import { Link } from "react-router-dom";
import { useT } from "@/contexts/LanguageContext";

export function MarketNewsSection({ limit = 8 }: { limit?: number }) {
  const { data: news, isLoading, error, refetch } = useMarketNews();
  const t = useT();

  if (error && !news) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold mb-4">{t("news.title")}</h2>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold mb-4">{t("news.title")}</h2>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-24 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">{t("news.title")}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
          {limit < 25 && (
            <Link to="/news" className="text-xs text-primary hover:underline font-medium">
              {t("news.viewAll")}
            </Link>
          )}
        </div>
      </div>
      <div className="space-y-0.5">
        {news.slice(0, limit).map((item: any, i: number) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-lg p-2.5 -mx-1 transition-colors hover:bg-muted group">
            {item.image && (
              <img src={item.image} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {item.related && (
                  <Link to={`/stock/${item.related}`} onClick={(e) => e.stopPropagation()} className="text-[11px] font-bold text-primary hover:underline">{item.related}</Link>
                )}
                <span className="text-[11px] text-muted-foreground">{item.source}</span>
                <span className="text-[11px] text-muted-foreground">{item.datetime ? formatDate(new Date(item.datetime * 1000).toISOString()) : ""}</span>
              </div>
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{item.headline}</h4>
            </div>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
          </a>
        ))}
      </div>
    </div>
  );
}
