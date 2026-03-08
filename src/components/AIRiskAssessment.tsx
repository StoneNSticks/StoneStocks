/**
 * Phase 52: AI Risk Assessment — Risk score card for stocks
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props { symbol: string; overview?: any; derived?: any }

export function AIRiskAssessment({ symbol, overview, derived }: Props) {
  const { lang } = useLanguage();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `Provide a brief risk assessment for ${symbol}. Consider: PE ratio ${overview?.PERatio || "N/A"}, Beta ${overview?.Beta || "N/A"}, Debt/Equity ${overview?.DebtToEquity || "N/A"}, FCF Yield ${derived?.fcfYield?.toFixed(2) || "N/A"}%. Rate risk 1-10 and explain top 3 risks in 2-3 sentences each. Format: Risk Score: X/10 then bullet points.`
        },
      });
      if (error) throw error;
      setAnalysis(data?.summary || data?.text || "No analysis available.");
    } catch (e: any) {
      toast.error(e.message || "Risk analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI-Risikobewertung" : "AI Risk Assessment"}</h3>
        </div>
        {!analysis && (
          <Button variant="outline" size="sm" onClick={analyze} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldAlert className="h-3.5 w-3.5" />}
            {lang === "de" ? "Analysieren" : "Analyze"}
          </Button>
        )}
      </div>
      {analysis ? (
        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{analysis}</div>
      ) : (
        <p className="text-xs text-muted-foreground">{lang === "de" ? "KI-basierte Risikobewertung für diese Aktie generieren." : "Generate AI-powered risk assessment for this stock."}</p>
      )}
    </div>
  );
}
