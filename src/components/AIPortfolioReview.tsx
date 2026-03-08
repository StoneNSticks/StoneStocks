/**
 * Phase 49: AI Portfolio Review — AI-based portfolio analysis
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Props { positions: { symbol: string; shares: number; avg_cost: number; currentPrice?: number }[] }

export function AIPortfolioReview({ positions }: Props) {
  const { lang } = useLanguage();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const posStr = positions.map(p => `${p.symbol}: ${p.shares} shares @ $${p.avg_cost}`).join(", ");
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `Review this portfolio: ${posStr}. Analyze: 1) Diversification (sector exposure, concentration risk), 2) Risk profile, 3) Suggestions for improvement, 4) Overall rating. Be specific and actionable. Use bullet points.`
        },
      });
      if (error) throw error;
      setAnalysis(data?.summary || data?.text || "No analysis available.");
    } catch (e: any) {
      toast.error(e.message || "Portfolio review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI Portfolio-Review" : "AI Portfolio Review"}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={analyze} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? "..." : (lang === "de" ? "Analysieren" : "Analyze")}
        </Button>
      </div>
      {analysis ? (
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{lang === "de" ? "Lass dein Portfolio von KI analysieren und Verbesserungsvorschläge erhalten." : "Get AI-powered portfolio analysis with improvement suggestions."}</p>
      )}
    </div>
  );
}
