/**
 * AIRecommendations — Personalized stock recommendations based on portfolio & watchlist.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export function AIRecommendations({ portfolio, watchlist }: { portfolio: any[]; watchlist: any[] }) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ai-recommendations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("ai-recommendations", {
        body: { portfolio, watchlist },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user && enabled,
    staleTime: 1000 * 60 * 30,
  });

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/60 bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold text-sm">
            {lang === "de" ? "KI-Empfehlungen" : "AI Recommendations"}
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => { setEnabled(true); if (enabled) refetch(); }}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {enabled ? (lang === "de" ? "Neu generieren" : "Regenerate") : (lang === "de" ? "Empfehlungen anzeigen" : "Get Recommendations")}
        </Button>
      </div>

      {!enabled && (
        <p className="text-sm text-muted-foreground">
          {lang === "de"
            ? "Klicke auf den Button, um personalisierte Aktienempfehlungen basierend auf deinem Portfolio und deiner Watchlist zu erhalten."
            : "Click the button to get personalized stock recommendations based on your portfolio and watchlist."}
        </p>
      )}

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {lang === "de" ? "Fehler beim Laden der Empfehlungen." : "Failed to load recommendations."}
        </p>
      )}

      {data?.recommendations && (
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground text-sm leading-relaxed">
          <div dangerouslySetInnerHTML={{
            __html: data.recommendations
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br />')
          }} />
        </div>
      )}
    </motion.div>
  );
}
