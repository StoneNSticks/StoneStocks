/**
 * NewsPage — Market news with category filters, search, and load-more.
 * Fetches news from the edge function via useMarketNews hook.
 * Features: category tabs, search within headlines, thumbnail images, load more.
 */
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarketOverview } from "@/components/MarketOverview";
import { useMarketNews } from "@/hooks/useStockData";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Search, ExternalLink, Clock } from "lucide-react";

const CATEGORIES = ["All", "Technology", "Finance", "Energy", "Healthcare", "Crypto"];

const NewsPage = () => {
  const { data: news, isLoading } = useMarketNews();
  const t = useT();
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [limit, setLimit] = useState(20);

  const filtered = useMemo(() => {
    if (!news) return [];
    let items = news as any[];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((n: any) => n.headline?.toLowerCase().includes(q) || n.summary?.toLowerCase().includes(q));
    }
    if (category !== "All") {
      const cat = category.toLowerCase();
      items = items.filter((n: any) => {
        const text = ((n.headline || "") + " " + (n.summary || "") + " " + (n.category || "")).toLowerCase();
        return text.includes(cat);
      });
    }
    return items;
  }, [news, search, category]);

  const shown = filtered.slice(0, limit);
  const hasMore = filtered.length > limit;

  const formatTime = (ts: number | string) => {
    const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffH < 1) return lang === "de" ? "Gerade eben" : "Just now";
    if (diffH < 24) return `${diffH}h`;
    return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
        <section className="mb-4 sm:mb-6">
          <MarketOverview />
        </section>

        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{t("news.title")}</h1>
              <p className="text-sm text-muted-foreground">{lang === "de" ? "Aktuelle Finanznachrichten" : "Latest financial news"}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={lang === "de" ? "Nachrichten durchsuchen..." : "Search news..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1.5 scroll-x-touch pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => { setCategory(cat); setLimit(20); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {cat === "All" ? (lang === "de" ? "Alle" : "All") : cat}
                </button>
              ))}
            </div>
          </div>

          {/* News list */}
          {isLoading ? (
            <div className="space-y-3">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
          ) : shown.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">{lang === "de" ? "Keine Nachrichten gefunden." : "No news found."}</div>
          ) : (
            <>
              <div className="space-y-3">
                {shown.map((article: any, i: number) => (
                  <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" className="flex gap-4 rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all group">
                     <img
                       src={article.image || "/placeholder.svg"}
                       alt=""
                       className="h-20 w-28 rounded-lg object-cover shrink-0 hidden sm:block bg-muted"
                       loading="lazy"
                       onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                     />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{article.headline}</h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                      </div>
                      {article.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.summary}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(article.datetime)}</span>
                        {article.source && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{article.source}</Badge>}
                        {article.category && article.category !== "top news" && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{article.category}</Badge>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={() => setLimit(l => l + 20)}>
                    {lang === "de" ? "Mehr laden" : "Load more"} ({filtered.length - limit} {lang === "de" ? "verbleibend" : "remaining"})
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <footer className="border-t border-border/50 py-6">
        <div className="container text-center text-xs text-muted-foreground">© {new Date().getFullYear()} StoneStocks</div>
      </footer>
    </div>
  );
};

export default NewsPage;
