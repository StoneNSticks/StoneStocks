/**
 * Phase 50: AI Earnings Preview — Pre-earnings AI analysis
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props { symbol: string }

export function AIEarningsPreview({ symbol }: Props) {
  const { lang } = useLanguage();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `Provide a brief earnings preview for ${symbol}. Cover: expected EPS and revenue consensus, key metrics to watch, potential catalysts or risks, and historical beat/miss rate. Keep concise: 4-5 bullet points.`
        },
      });
      if (error) throw error;
      setAnalysis(data?.summary || data?.text || "No analysis available.");
    } catch (e: any) {
      toast.error(e.message || "Earnings preview failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI Earnings-Vorschau" : "AI Earnings Preview"}</h3>
        </div>
        {!analysis && (
          <Button variant="outline" size="sm" onClick={analyze} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CalendarDays className="h-3.5 w-3.5" />}
            {lang === "de" ? "Vorschau" : "Preview"}
          </Button>
        )}
      </div>
      {analysis ? (
        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{analysis}</div>
      ) : (
        <p className="text-xs text-muted-foreground">{lang === "de" ? "KI-Zusammenfassung vor den nächsten Quartalszahlen." : "AI summary ahead of next quarterly earnings."}</p>
      )}
    </div>
  );
}
