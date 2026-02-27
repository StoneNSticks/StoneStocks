import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock } from "lucide-react";
import { useSearchStocks } from "@/hooks/useStockData";
import { Input } from "@/components/ui/input";

const RECENT_KEY = "recent_searches";
const MAX_RECENT = 6;

function getRecentSearches(): { symbol: string; name: string }[] {
  try {
    return JSON.parse(sessionStorage.getItem(RECENT_KEY) || "[]");
  } catch { return []; }
}

function addRecentSearch(symbol: string, name: string) {
  const recent = getRecentSearches().filter(r => r.symbol !== symbol);
  recent.unshift({ symbol, name });
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { data: results, isLoading } = useSearchStocks(query);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(symbol: string, name?: string) {
    addRecentSearch(symbol, name || symbol);
    setRecentSearches(getRecentSearches());
    setQuery("");
    setOpen(false);
    navigate(`/stock/${symbol}`);
  }

  function clearRecent() {
    sessionStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  }

  const showRecent = open && query.length === 0 && recentSearches.length > 0;
  const showResults = open && query.length >= 1;

  return (
    <div ref={ref} className={`relative ${compact ? "w-full" : "w-full max-w-xl mx-auto"}`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); setRecentSearches(getRecentSearches()); }}
          placeholder={compact ? "Search stocks..." : "Search stocks, ETFs, indices..."}
          className={`${compact ? "pl-8 pr-8 h-9 text-sm rounded-lg" : "pl-10 pr-10 h-12 rounded-xl text-base"} bg-card border-border/60 placeholder:text-muted-foreground/70 focus-visible:ring-primary/30`}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${compact ? "right-2.5" : "right-3"}`}
          >
            <X className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </button>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showRecent && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Recent searches</span>
            <button onClick={clearRecent} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Clear
            </button>
          </div>
          <ul>
            {recentSearches.map((r) => (
              <li key={r.symbol}>
                <button
                  onClick={() => handleSelect(r.symbol, r.name)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors"
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="font-display font-semibold text-sm">{r.symbol}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{r.name}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-3 text-sm text-muted-foreground text-center">Searching...</div>
          ) : results && results.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((r: any) => (
                <li key={r.symbol}>
                  <button
                    onClick={() => handleSelect(r.symbol, r.description)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-muted transition-colors"
                  >
                    <div>
                      <span className="font-display font-semibold text-sm">{r.symbol}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{r.description}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground uppercase">{r.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-muted-foreground text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
