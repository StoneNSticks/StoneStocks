/**
 * Phase 51: AI News Digest — Daily AI summary of top market news
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Props { headlines?: string[] }

export function AINewsDigest({ headlines }: Props) {
  const { lang } = useLanguage();
  const [digest, setDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const headlineStr = headlines?.slice(0, 15).join("; ") || "latest market news";
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `Create a brief daily market news digest based on these headlines: ${headlineStr}. Summarize the key themes, market movers, and what investors should watch. Use 4-5 bullet points. ${lang === "de" ? "Answer in German." : ""}`
        },
      });
      if (error) throw error;
      setDigest(data?.summary || data?.text || "No digest available.");
    } catch (e: any) {
      toast.error(e.message || "News digest failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI News-Zusammenfassung" : "AI News Digest"}</h3>
        </div>
        <Button variant="outline" size="sm" onClick={generate} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Newspaper className="h-3.5 w-3.5" />}
          {loading ? "..." : (lang === "de" ? "Zusammenfassen" : "Summarize")}
        </Button>
      </div>
      {digest ? (
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
          <ReactMarkdown>{digest}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{lang === "de" ? "KI-Zusammenfassung der wichtigsten Marktnachrichten." : "AI summary of the most important market news."}</p>
      )}
    </div>
  );
}
