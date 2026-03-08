/**
 * AIStockSummary — AI-powered stock analysis using Lovable AI.
 * Sends key metrics to the backend and displays a markdown analysis.
 */
import { useState } from "react";
import { useT } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AIStockSummaryProps {
  symbol: string;
  profile: any;
  quote: any;
  overview: any;
  derived: any;
  recommendation: any;
}

export function AIStockSummary({ symbol, profile, quote, overview, derived, recommendation }: AIStockSummaryProps) {
  const t = useT();
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-stock-summary", {
        body: { symbol, profile, quote, overview, derived, recommendation },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setSummary(data?.summary || "No analysis available.");
    } catch (e: any) {
      setError(e.message || "Failed to generate analysis");
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown rendering (bold, headers, paragraphs)
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      
      // Headers
      if (line.startsWith("### ")) return <h4 key={i} className="font-bold text-sm mt-3 mb-1">{line.slice(4)}</h4>;
      if (line.startsWith("## ")) return <h3 key={i} className="font-bold text-base mt-3 mb-1">{line.slice(3)}</h3>;
      
      // Bold text within paragraphs
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-xs text-muted-foreground leading-relaxed mb-1">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
        <Brain className="h-4 w-4 text-primary" />
        <h3 className="font-display font-bold text-sm">{t("ai.title")}</h3>
        <Badge className="ml-auto text-[10px] bg-primary/10 text-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          AI
        </Badge>
      </div>

      <div className="p-4">
        {!summary && !isLoading && !error && (
          <div className="text-center py-6">
            <Brain className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground mb-3">{t("ai.description")}</p>
            <Button onClick={generateSummary} size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {t("ai.generate")}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-2 py-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-xs text-destructive mb-2">{error}</p>
            <Button onClick={generateSummary} variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              {t("ai.retry")}
            </Button>
          </div>
        )}

        {summary && !isLoading && (
          <div>
            <div className="prose-sm">{renderMarkdown(summary)}</div>
            <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground">{t("ai.disclaimer")}</span>
              <Button onClick={generateSummary} variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                <RefreshCw className="h-3 w-3" />
                {t("ai.refresh")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
