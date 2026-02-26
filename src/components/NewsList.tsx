import { formatDate } from "@/lib/formatters";
import { ExternalLink } from "lucide-react";

export function NewsList({ news }: { news: any[] }) {
  if (!news || news.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">News</h3>
        <p className="text-sm text-muted-foreground">No recent news available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Latest News</h3>
      <div className="space-y-3">
        {news.slice(0, 8).map((item: any, i: number) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-muted group"
          >
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="w-16 h-12 rounded-md object-cover flex-shrink-0"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {item.headline}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-muted-foreground">{item.source}</span>
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(new Date(item.datetime * 1000).toISOString())}
                </span>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
