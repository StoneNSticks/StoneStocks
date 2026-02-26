import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useSearchStocks } from "@/hooks/useStockData";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { data: results, isLoading } = useSearchStocks(query);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(symbol: string) {
    setQuery("");
    setOpen(false);
    navigate(`/stock/${symbol}`);
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          placeholder="Search stocks, ETFs, indices..."
          className="pl-10 pr-10 h-12 rounded-xl bg-card border-border/60 text-base placeholder:text-muted-foreground/70 focus-visible:ring-primary/30"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && query.length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground text-center">Searching...</div>
          ) : results && results.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((r: any) => (
                <li key={r.symbol}>
                  <button
                    onClick={() => handleSelect(r.symbol)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors"
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
            <div className="p-4 text-sm text-muted-foreground text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
