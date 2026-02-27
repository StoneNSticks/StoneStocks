import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsInWatchlist, useToggleWatchlist } from "@/hooks/useWatchlist";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function WatchlistStar({ symbol }: { symbol: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isInList = useIsInWatchlist(symbol);
  const { toggle, cooldown, isLoading } = useToggleWatchlist();

  const handleClick = () => {
    if (!user) { navigate("/auth"); return; }
    toggle(symbol, isInList);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          disabled={cooldown || isLoading}
          className="p-1.5 rounded-lg transition-colors hover:bg-muted disabled:opacity-50"
          aria-label={isInList ? "Aus Watchlist entfernen" : "Zur Watchlist hinzufügen"}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              isInList ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {!user ? "Einloggen für Watchlist" : isInList ? "Aus Watchlist entfernen" : "Zur Watchlist hinzufügen"}
      </TooltipContent>
    </Tooltip>
  );
}
