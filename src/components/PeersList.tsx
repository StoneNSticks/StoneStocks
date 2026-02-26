import { useNavigate } from "react-router-dom";

export function PeersList({ peers, currentSymbol }: { peers: string[]; currentSymbol: string }) {
  const navigate = useNavigate();

  const filtered = (peers || []).filter((p: string) => p !== currentSymbol).slice(0, 8);

  if (filtered.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">Similar Stocks</h3>
      <div className="flex flex-wrap gap-2">
        {filtered.map((peer: string) => (
          <button
            key={peer}
            onClick={() => navigate(`/stock/${peer}`)}
            className="px-3 py-1.5 rounded-lg bg-muted text-xs font-display font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {peer}
          </button>
        ))}
      </div>
    </div>
  );
}
