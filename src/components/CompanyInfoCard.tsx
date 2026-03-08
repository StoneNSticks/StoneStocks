import { Building2, Globe, Users, Calendar, MapPin, Banknote, BarChart3, ExternalLink } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

interface CompanyInfoCardProps {
  profile: Record<string, unknown> | null;
  overview: Record<string, string> | null;
  massiveTicker: Record<string, unknown> | null;
  symbol: string;
}

export function CompanyInfoCard({ profile, overview, massiveTicker, symbol }: CompanyInfoCardProps) {
  const t = useT();
  const name = profile?.name as string || overview?.Name || (massiveTicker?.name as string) || symbol;
  const logo = profile?.logo as string || (massiveTicker?.branding as Record<string, string>)?.icon_url;
  const website = profile?.weburl as string || overview?.Address || "";
  const country = profile?.country as string || overview?.Country || "";
  const industry = profile?.finnhubIndustry as string || overview?.Industry || "";
  const sector = overview?.Sector || "";
  const employees = (massiveTicker?.total_employees as number) || (overview?.FullTimeEmployees ? parseInt(overview.FullTimeEmployees) : 0);
  const ipo = profile?.ipo as string || overview?.IPODate || "";
  const exchange = profile?.exchange as string || overview?.Exchange || (massiveTicker?.primary_exchange as string) || "";
  const currency = profile?.currency as string || overview?.Currency || "USD";
  const description = overview?.description || (overview as any)?.Description || "";

  let displayWebsite = "";
  try { if (website) displayWebsite = new URL(website).hostname; } catch { displayWebsite = website; }
  const countryFlag = country === "US" ? "🇺🇸" : country === "DE" ? "🇩🇪" : country === "JP" ? "🇯🇵" : country === "CN" ? "🇨🇳" : country === "GB" ? "🇬🇧" : country === "TW" ? "🇹🇼" : country === "KR" ? "🇰🇷" : country === "FR" ? "🇫🇷" : country === "CA" ? "🇨🇦" : country === "NL" ? "🇳🇱" : country === "CH" ? "🇨🇭" : "🌍";

  const countryName = country === "US" ? t("info.us") : country === "DE" ? t("info.de") : country === "JP" ? t("info.jp") : country === "CN" ? t("info.cn") : country === "GB" ? t("info.gb") : country === "TW" ? t("info.tw") : country === "KR" ? t("info.kr") : country === "FR" ? t("info.fr") : country === "CA" ? t("info.ca") : country === "NL" ? t("info.nl") : country === "CH" ? t("info.ch") : country;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <div className="flex items-start gap-4 mb-5">
        {logo && <img src={logo} alt={name} className="h-14 w-14 rounded-xl object-contain bg-background border border-border/60 p-1.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold">{name}</h2>
          <p className="text-sm text-muted-foreground">{symbol} · {exchange}</p>
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-0.5">
              {displayWebsite} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {sector && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-primary font-medium uppercase tracking-wider">{t("info.sector")}</span>
            <span className="text-sm font-medium flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted-foreground" />{sector}</span>
          </div>
        )}
        {industry && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-primary font-medium uppercase tracking-wider">{t("info.industry")}</span>
            <span className="text-sm font-medium">{industry}</span>
          </div>
        )}
        {country && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-primary font-medium uppercase tracking-wider">{t("info.country")}</span>
            <span className="text-sm font-medium flex items-center gap-1.5"><span>{countryFlag}</span>{countryName}</span>
          </div>
        )}
        {employees > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-primary font-medium uppercase tracking-wider">{t("info.employees")}</span>
            <span className="text-sm font-medium flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" />{employees.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {ipo && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-muted-foreground font-medium">{t("info.ipoDate")}</span>
            <span className="text-sm font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{ipo}</span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground font-medium">{t("info.currency")}</span>
          <span className="text-sm font-medium flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5 text-muted-foreground" />{currency}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground font-medium">{t("info.exchange")}</span>
          <span className="text-sm font-medium flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />{exchange}</span>
        </div>
      </div>

      {description && (
        <div>
          <span className="text-[11px] text-primary font-medium uppercase tracking-wider">{t("info.description")}</span>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-4">{description}</p>
        </div>
      )}
    </div>
  );
}
