/**
 * SecFilings — Displays SEC EDGAR filings (10-K, 10-Q, 8-K etc.) for a stock.
 * Shows filing type, date, description and link to the SEC document.
 */
import { useSecFilings } from "@/hooks/useStockData";
import { useT } from "@/contexts/LanguageContext";
import { FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const FORM_COLORS: Record<string, string> = {
  "10-K": "bg-primary/15 text-primary",
  "10-Q": "bg-chart-2/15 text-chart-2",
  "8-K": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "S-1": "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  "DEF 14A": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  "4": "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

const FORM_LABELS: Record<string, { de: string; en: string }> = {
  "10-K": { de: "Jahresbericht", en: "Annual Report" },
  "10-Q": { de: "Quartalsbericht", en: "Quarterly Report" },
  "8-K": { de: "Aktuelle Meldung", en: "Current Report" },
  "S-1": { de: "Börsengang", en: "IPO Registration" },
  "DEF 14A": { de: "Proxy Statement", en: "Proxy Statement" },
  "4": { de: "Insider-Meldung", en: "Insider Filing" },
  "SC 13G": { de: "Beteiligungsmeldung", en: "Ownership Report" },
  "SC 13D": { de: "Aktivist-Meldung", en: "Activist Filing" },
  "13F-HR": { de: "Fondsbestand", en: "Fund Holdings" },
};

export function SecFilings({ symbol }: { symbol: string }) {
  const { data, isLoading } = useSecFilings(symbol);
  const t = useT();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      </div>
    );
  }

  const filings = (data as any)?.filings || [];
  if (filings.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="font-display font-bold text-sm">{t("sec.title")}</h3>
        <Badge variant="secondary" className="text-[10px] ml-auto">{(data as any)?.companyName}</Badge>
      </div>
      <div className="divide-y divide-border/20 max-h-[400px] overflow-y-auto">
        {filings.slice(0, 20).map((f: any, i: number) => (
          <div key={`${f.form}-${f.filingDate}-${i}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
            <Badge className={`text-[10px] font-mono shrink-0 ${FORM_COLORS[f.form] || "bg-muted text-muted-foreground"}`}>
              {f.form}
            </Badge>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">
                {FORM_LABELS[f.form]?.[t("sec.title") === "SEC Filings" ? "en" : "de"] || f.description || f.form}
              </div>
              <div className="text-[10px] text-muted-foreground">{f.filingDate}</div>
            </div>
            {f.url && (
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
