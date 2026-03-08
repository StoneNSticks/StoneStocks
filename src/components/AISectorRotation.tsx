/**
 * Phase 53: AI Sector Rotation — AI-driven sector recommendations
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Repeat, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export function AISectorRotation() {
  const { lang } = useLanguage();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `Provide a sector rotation analysis for the current market environment. Which sectors should investors overweight and underweight? Consider: interest rates, economic cycle, inflation, and recent sector performance. Rank top 3 sectors to buy and top 3 to avoid with brief reasoning. ${lang === "de" ? "Answer in German." : ""}`
        },
      });
      if (error) throw error;
      setAnalysis(data?.summary || data?.text || "No analysis available.");
    } catch (e: any) {
      toast.error(e.message || "Sector rotation analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI Sektorrotation" : "AI Sector Rotation"}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={analyze} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Repeat className="h-3.5 w-3.5" />}
          {loading ? "..." : (lang === "de" ? "Analysieren" : "Analyze")}
        </Button>
      </div>
      {analysis ? (
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{lang === "de" ? "KI-Empfehlungen für Sektorrotation." : "AI-driven sector rotation recommendations."}</p>
      )}
    </div>
  );
}
