import { Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistStar } from "@/components/WatchlistStar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: watchlist, isLoading } = useWatchlist();

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-6">Meine Watchlist</h1>

        {isLoading || authLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : !watchlist || watchlist.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Deine Watchlist ist leer.</p>
            <p className="text-sm mt-1">Klicke den Stern auf einer Aktien-Seite, um sie hinzuzufügen.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {watchlist.map((item) => (
              <div key={item.symbol} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 hover:bg-muted/50 transition-colors">
                <WatchlistStar symbol={item.symbol} />
                <Link to={`/stock/${item.symbol}`} className="flex-1 font-medium hover:text-primary transition-colors">
                  {item.symbol}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("de-DE")}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
