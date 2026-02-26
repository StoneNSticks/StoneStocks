import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold text-lg">
            S
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Stone<span className="text-primary">Stocks</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
          >
            <TrendingUp className="h-4 w-4" />
            Markets
          </Link>
        </nav>
      </div>
    </header>
  );
}
