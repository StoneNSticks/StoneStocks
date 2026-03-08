/**
 * Phase 56: AI Competitor Analysis — Auto peer comparison
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props { symbol: string; peers?: string[] }

export function AICompetitorAnalysis({ symbol, peers }: Props) {
  const { lang } = useLanguage();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const peerList = peers?.slice(0, 5).join(", ") || "top competitors";
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `Compare ${symbol} against its competitors (${peerList}). Analyze: competitive advantages, market position, growth trajectory, and valuation relative to peers. Provide a brief competitive moat assessment. Keep concise: 4-5 bullet points.`
        },
      });
      if (error) throw error;
      setAnalysis(data?.summary || data?.text || "No analysis available.");
    } catch (e: any) {
      toast.error(e.message || "Competitor analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI Wettbewerbsanalyse" : "AI Competitor Analysis"}</h3>
        </div>
        {!analysis && (
          <Button variant="outline" size="sm" onClick={analyze} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Users className="h-3.5 w-3.5" />}
            {lang === "de" ? "Vergleichen" : "Compare"}
          </Button>
        )}
      </div>
      {analysis ? (
        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{analysis}</div>
      ) : (
        <p className="text-xs text-muted-foreground">{lang === "de" ? "KI-basierter Vergleich mit Wettbewerbern." : "AI-powered comparison with competitors."}</p>
      )}
    </div>
  );
}
