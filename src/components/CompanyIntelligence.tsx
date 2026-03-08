/**
 * CompanyIntelligence — Deep company info: products, geography, supply chain,
 * market position, risk score. Uses existing API data.
 */
import { useMemo } from "react";
import { Building2, Globe, Package, Link as LinkIcon, Shield, MapPin, Users, TrendingUp } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Props {
  profile: Record<string, unknown> | null;
  overview: Record<string, string> | null;
  massiveTicker: Record<string, unknown> | null;
  peers: string[] | null;
  massiveRelated: any[] | null;
  currentSymbol: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸", DE: "🇩🇪", JP: "🇯🇵", CN: "🇨🇳", GB: "🇬🇧", TW: "🇹🇼",
  KR: "🇰🇷", FR: "🇫🇷", CA: "🇨🇦", NL: "🇳🇱", CH: "🇨🇭", IE: "🇮🇪",
  IN: "🇮🇳", BR: "🇧🇷", AU: "🇦🇺", SE: "🇸🇪", IL: "🇮🇱", SG: "🇸🇬",
};

function extractProducts(description: string): string[] {
  if (!description) return [];
  // Extract key product/service terms from description
  const keywords = [
    "iPhone", "iPad", "Mac", "Apple Watch", "Apple TV", "iCloud", "App Store",
    "Windows", "Office", "Azure", "LinkedIn", "Xbox", "Teams", "GitHub",
    "Google Search", "YouTube", "Android", "Chrome", "Google Cloud", "Gmail", "Pixel",
    "AWS", "Prime", "Alexa", "Kindle", "Ring",
    "Facebook", "Instagram", "WhatsApp", "Messenger", "Oculus", "Reality Labs",
    "Tesla", "Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Powerwall",
    "GPU", "GeForce", "CUDA", "Data Center", "AI", "Autonomous",
    "Visa", "Mastercard", "PayPal", "Venmo",
    "semiconductor", "chips", "processors", "software", "hardware", "cloud",
    "streaming", "e-commerce", "advertising", "payments", "insurance",
    "pharmaceuticals", "biotech", "medical devices", "diagnostics",
    "electric vehicles", "renewable energy", "solar", "batteries",
  ];
  
  const found: string[] = [];
  const descLower = description.toLowerCase();
  keywords.forEach(kw => {
    if (descLower.includes(kw.toLowerCase()) && !found.includes(kw)) {
      found.push(kw);
    }
  });
  return found.slice(0, 8);
}

function getRiskScore(overview: Record<string, string> | null, quote: any): { score: number; label: string; color: string } {
  if (!overview) return { score: 0, label: "N/A", color: "hsl(var(--muted-foreground))" };
  
  let risk = 50;
  const beta = parseFloat(overview.Beta || "1");
  if (beta > 1.5) risk += 15;
  else if (beta > 1.2) risk += 8;
  else if (beta < 0.8) risk -= 10;

  const debtEquity = parseFloat(overview.DebtToEquityRatio || overview.DebtEquityRatio || "0");
  if (debtEquity > 2) risk += 15;
  else if (debtEquity > 1) risk += 5;
  else if (debtEquity < 0.5) risk -= 5;

  const pe = parseFloat(overview.PERatio || "0");
  if (pe > 50) risk += 10;
  else if (pe < 0) risk += 20;

  risk = Math.max(10, Math.min(95, risk));

  if (risk <= 35) return { score: risk, label: "Low", color: "hsl(145, 63%, 42%)" };
  if (risk <= 60) return { score: risk, label: "Medium", color: "hsl(38, 92%, 50%)" };
  if (risk <= 80) return { score: risk, label: "High", color: "hsl(0, 60%, 55%)" };
  return { score: risk, label: "Very High", color: "hsl(0, 72%, 41%)" };
}

export function CompanyIntelligence({ profile, overview, massiveTicker, peers, massiveRelated, currentSymbol }: Props) {
  const t = useT();
  const { lang } = useLanguage();

  const description = (overview as any)?.Description || overview?.description || "";
  const products = useMemo(() => extractProducts(description), [description]);
  const country = (profile?.country as string) || overview?.Country || "";
  const sector = overview?.Sector || "";
  const industry = (profile?.finnhubIndustry as string) || overview?.Industry || "";
  const exchange = (profile?.exchange as string) || overview?.Exchange || "";
  const employees = (massiveTicker?.total_employees as number) || (overview?.FullTimeEmployees ? parseInt(overview.FullTimeEmployees) : 0);
  
  const riskScore = useMemo(() => getRiskScore(overview, null), [overview]);

  // Institutional ownership
  const institutionPct = overview?.InstitutionalOwnership || overview?.PercentInstitutions || "";
  const insiderPct = overview?.PercentInsiders || "";

  // Related companies from massive_related
  const relatedCompanies = useMemo(() => {
    if (massiveRelated?.length) return massiveRelated.slice(0, 6).map((r: any) => r.ticker || r.symbol || r).filter(Boolean);
    if (peers?.length) return peers.filter(p => p !== currentSymbol).slice(0, 6);
    return [];
  }, [massiveRelated, peers, currentSymbol]);

  // Short interest
  const shortRatio = overview?.ShortRatio || "";
  const shortPct = overview?.ShortPercentFloat || overview?.ShortPercentOfFloat || "";

  if (!description && !sector && products.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-sm text-muted-foreground">
          {lang === "de" ? "Unternehmens-Intelligence" : "Company Intelligence"}
        </h3>
        {/* Risk badge */}
        <div className="ml-auto flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" style={{ color: riskScore.color }} />
          <span className="text-xs font-bold" style={{ color: riskScore.color }}>
            {lang === "de" ? "Risiko" : "Risk"}: {riskScore.label}
          </span>
          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${riskScore.score}%`, backgroundColor: riskScore.color }} />
          </div>
        </div>
      </div>

      {/* Products & Services */}
      {products.length > 0 && (
        <div>
          <span className="text-[11px] text-primary font-medium uppercase tracking-wider flex items-center gap-1">
            <Package className="h-3 w-3" /> {lang === "de" ? "Produkte & Services" : "Products & Services"}
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {products.map((p) => (
              <Badge key={p} variant="secondary" className="text-[10px] px-2 py-0.5">{p}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Geographic & Market Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {country && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" /> {lang === "de" ? "Hauptsitz" : "HQ"}
            </span>
            <span className="text-sm font-medium">{COUNTRY_FLAGS[country] || "🌍"} {country}</span>
          </div>
        )}
        {exchange && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Globe className="h-2.5 w-2.5" /> {lang === "de" ? "Börse" : "Exchange"}
            </span>
            <span className="text-sm font-medium">{exchange}</span>
          </div>
        )}
        {employees > 0 && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Users className="h-2.5 w-2.5" /> {lang === "de" ? "Mitarbeiter" : "Employees"}
            </span>
            <span className="text-sm font-medium">{employees.toLocaleString()}</span>
          </div>
        )}
        {institutionPct && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {lang === "de" ? "Institutionell" : "Institutional"}
            </span>
            <span className="text-sm font-medium">{parseFloat(institutionPct) > 1 ? `${parseFloat(institutionPct).toFixed(1)}%` : `${(parseFloat(institutionPct) * 100).toFixed(1)}%`}</span>
          </div>
        )}
      </div>

      {/* Additional data row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {insiderPct && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === "de" ? "Insider-Anteil" : "Insider Own."}</span>
            <span className="text-sm font-medium">{parseFloat(insiderPct) > 1 ? `${parseFloat(insiderPct).toFixed(1)}%` : `${(parseFloat(insiderPct) * 100).toFixed(1)}%`}</span>
          </div>
        )}
        {shortRatio && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === "de" ? "Short Ratio" : "Short Ratio"}</span>
            <span className="text-sm font-medium">{parseFloat(shortRatio).toFixed(1)}</span>
          </div>
        )}
        {shortPct && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === "de" ? "Short % Float" : "Short % Float"}</span>
            <span className="text-sm font-medium">{parseFloat(shortPct) > 1 ? `${parseFloat(shortPct).toFixed(1)}%` : `${(parseFloat(shortPct) * 100).toFixed(1)}%`}</span>
          </div>
        )}
        {sector && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang === "de" ? "Sektor" : "Sector"}</span>
            <span className="text-sm font-medium">{sector}</span>
          </div>
        )}
      </div>

      {/* Key Relationships */}
      {relatedCompanies.length > 0 && (
        <div>
          <span className="text-[11px] text-primary font-medium uppercase tracking-wider flex items-center gap-1">
            <LinkIcon className="h-3 w-3" /> {lang === "de" ? "Verwandte Unternehmen" : "Related Companies"}
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {relatedCompanies.map((sym: string) => (
              <Link
                key={sym}
                to={`/stock/${sym}`}
                className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {sym}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <div>
          <span className="text-[11px] text-primary font-medium uppercase tracking-wider">{t("info.description")}</span>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-4">{description}</p>
        </div>
      )}
    </div>
  );
}
