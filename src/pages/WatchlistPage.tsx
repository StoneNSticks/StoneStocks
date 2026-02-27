import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistStar } from "@/components/WatchlistStar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, LogIn, ArrowLeft } from "lucide-react";

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: watchlist, isLoading } = useWatchlist();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-6">My Watchlist</h1>

        {authLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : !user ? (
          <div className="text-center py-16">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <h2 className="font-display text-lg font-semibold mb-2">Please sign in</h2>
            <p className="text-muted-foreground text-sm mb-6">
              You need to be logged in to use your personal watchlist.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back to Markets
                </Link>
              </Button>
              <Button asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : !watchlist || watchlist.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Your watchlist is empty.</p>
            <p className="text-sm mt-1">Click the star on a stock page to add it.</p>
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
                  {new Date(item.created_at).toLocaleDateString("en-US")}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
