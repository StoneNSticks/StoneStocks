/**
 * ErrorState: Reusable error display with retry button.
 * Used in data-loading components when API calls fail.
 */
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/contexts/LanguageContext";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({ message, onRetry, compact = false }: ErrorStateProps) {
  const t = useT();
  
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-3 px-4 rounded-lg bg-destructive/5 border border-destructive/20">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
        <span className="flex-1 truncate">{message || t("error.loadFailed")}</span>
        {onRetry && (
          <button onClick={onRetry} className="text-primary hover:text-primary/80 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl border border-destructive/20 bg-destructive/5">
      <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
      <p className="text-sm font-medium text-foreground mb-1">{t("error.somethingWrong")}</p>
      <p className="text-xs text-muted-foreground mb-4">{message || t("error.tryAgain")}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          {t("error.retry")}
        </Button>
      )}
    </div>
  );
}
