/**
 * Phase 54: Natural Language Screener — Find stocks via natural language
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function NLPScreener() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-stock-summary", {
        body: {
          prompt: `You are a stock screener assistant. The user wants to find stocks matching: "${query}". Suggest 5-10 specific stock tickers that match this criteria with a brief reason why each matches. Format each as: **TICKER** - Company Name: reason. ${lang === "de" ? "Answer in German." : ""}`
        },
      });
      if (error) throw error;
      setResults(data?.summary || data?.text || "No results found.");
    } catch (e: any) {
      toast.error(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">{lang === "de" ? "KI-Aktiensuche" : "AI Stock Finder"}</h3>
      </div>
      <div className="flex gap-2 mb-3">
        <Input
          placeholder={lang === "de" ? "z.B. Tech-Aktien mit P/E unter 20 und Dividende..." : "e.g. Tech stocks with P/E under 20 and dividend..."}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          className="flex-1"
        />
        <Button onClick={search} disabled={loading || !query.trim()} className="gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {lang === "de" ? "Suchen" : "Search"}
        </Button>
      </div>
      {results && (
        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{results}</div>
      )}
      {!results && (
        <div className="flex flex-wrap gap-1.5">
          {(lang === "de" ? ["Dividendenstarke Blue Chips", "Unterbewertete Tech-Aktien", "Wachstumsaktien mit niedrigem Debt"] : ["High dividend blue chips", "Undervalued tech stocks", "Growth stocks with low debt"]).map(ex => (
            <button key={ex} onClick={() => { setQuery(ex); }} className="px-2.5 py-1 rounded-lg text-xs bg-muted text-muted-foreground hover:text-foreground transition-colors">{ex}</button>
          ))}
        </div>
      )}
    </div>
  );
}
