/**
 * Phase 55: AI Technical Analysis — Chart pattern recognition
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props { symbol: string }

export function AITechnicalAnalysis({ symbol }: Props) {
  const { lang } = useLanguage();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `Provide a technical analysis summary for ${symbol}. Identify potential chart patterns (Head & Shoulders, Double Bottom, Flags, etc.), key support/resistance levels, and momentum signals. Keep it concise: 3-4 bullet points with actionable insights.`
        },
      });
      if (error) throw error;
      setAnalysis(data?.summary || data?.text || "No analysis available.");
    } catch (e: any) {
      toast.error(e.message || "Technical analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI Technische Analyse" : "AI Technical Analysis"}</h3>
        </div>
        {!analysis && (
          <Button variant="outline" size="sm" onClick={analyze} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
            {lang === "de" ? "Analysieren" : "Analyze"}
          </Button>
        )}
      </div>
      {analysis ? (
        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{analysis}</div>
      ) : (
        <p className="text-xs text-muted-foreground">{lang === "de" ? "Chartmuster und technische Signale per KI erkennen." : "Detect chart patterns and technical signals via AI."}</p>
      )}
    </div>
  );
}
