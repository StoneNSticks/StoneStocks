/**
 * SectorPerformance — Horizontal bar chart showing daily performance by sector.
 * Aggregates data from top companies, gainers/losers, and most active for broader coverage.
 */
import { useMemo, useState } from "react";
import { useTopCompanies, useGainersLosers, useMostActive } from "@/hooks/useStockData";
import { useT } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Layers, List } from "lucide-react";

const INDUSTRY_TO_SECTOR: Record<string, string> = {
  // Technology
  "semiconductors": "Technology",
  "software": "Technology",
  "software—infrastructure": "Technology",
  "software—application": "Technology",
  "consumer electronics": "Technology",
  "electronic components": "Technology",
  "information technology services": "Technology",
  "semiconductor equipment & materials": "Technology",
  "scientific & technical instruments": "Technology",
  "computer hardware": "Technology",
  "electronic gaming & multimedia": "Technology",
  "data processing & outsourced services": "Technology",
  // Communication Services
  "internet content & information": "Communication Services",
  "telecom services": "Communication Services",
  "entertainment": "Communication Services",
  "advertising agencies": "Communication Services",
  "broadcasting": "Communication Services",
  "electronic media": "Communication Services",
  "publishing": "Communication Services",
  // Consumer Cyclical / Discretionary
  "internet retail": "Consumer Discretionary",
  "specialty retail": "Consumer Discretionary",
  "auto manufacturers": "Consumer Discretionary",
  "restaurants": "Consumer Discretionary",
  "apparel retail": "Consumer Discretionary",
  "home improvement retail": "Consumer Discretionary",
  "travel services": "Consumer Discretionary",
  "resorts & casinos": "Consumer Discretionary",
  "leisure": "Consumer Discretionary",
  "lodging": "Consumer Discretionary",
  "footwear & accessories": "Consumer Discretionary",
  "apparel manufacturing": "Consumer Discretionary",
  "auto parts": "Consumer Discretionary",
  "residential construction": "Consumer Discretionary",
  "furnishings, fixtures & appliances": "Consumer Discretionary",
  "luxury goods": "Consumer Discretionary",
  "textiles, apparel & luxury goods": "Consumer Discretionary",
  "retail": "Consumer Discretionary",
  "automobiles": "Consumer Discretionary",
  // Healthcare
  "drug manufacturers—general": "Healthcare",
  "drug manufacturers": "Healthcare",
  "medical devices": "Healthcare",
  "health care plans": "Healthcare",
  "biotechnology": "Healthcare",
  "diagnostics & research": "Healthcare",
  "medical instruments & supplies": "Healthcare",
  "health care equipment & services": "Healthcare",
  "pharmaceutical retailers": "Healthcare",
  "medical distribution": "Healthcare",
  "health information services": "Healthcare",
  "medical care facilities": "Healthcare",
  // Financials
  "banks—diversified": "Financials",
  "banks—regional": "Financials",
  "financial data & stock exchanges": "Financials",
  "credit services": "Financials",
  "insurance—diversified": "Financials",
  "insurance—property & casualty": "Financials",
  "insurance—life": "Financials",
  "insurance brokers": "Financials",
  "asset management": "Financials",
  "capital markets": "Financials",
  "financial conglomerates": "Financials",
  "mortgage finance": "Financials",
  "specialty finance": "Financials",
  "insurance": "Financials",
  // Energy
  "oil & gas integrated": "Energy",
  "oil & gas e&p": "Energy",
  "oil & gas midstream": "Energy",
  "oil & gas refining & marketing": "Energy",
  "oil & gas equipment & services": "Energy",
  "solar": "Energy",
  "uranium": "Energy",
  "thermal coal": "Energy",
  // Utilities
  "utilities—regulated electric": "Utilities",
  "utilities—diversified": "Utilities",
  "utilities—renewable": "Utilities",
  "utilities—regulated gas": "Utilities",
  "utilities—regulated water": "Utilities",
  "independent power producers": "Utilities",
  // Industrials
  "aerospace & defense": "Industrials",
  "industrial conglomerates": "Industrials",
  "railroads": "Industrials",
  "farm & heavy construction machinery": "Industrials",
  "waste management": "Industrials",
  "trucking": "Industrials",
  "marine shipping": "Industrials",
  "airlines": "Industrials",
  "specialty industrial machinery": "Industrials",
  "integrated freight & logistics": "Industrials",
  "building products & equipment": "Industrials",
  "engineering & construction": "Industrials",
  "electrical equipment & parts": "Industrials",
  "staffing & employment services": "Industrials",
  "rental & leasing services": "Industrials",
  "security & protection services": "Industrials",
  "conglomerates": "Industrials",
  // Consumer Staples / Defensive
  "household & personal products": "Consumer Staples",
  "beverages—non-alcoholic": "Consumer Staples",
  "beverages—brewers": "Consumer Staples",
  "beverages—wineries & distilleries": "Consumer Staples",
  "discount stores": "Consumer Staples",
  "packaged foods": "Consumer Staples",
  "tobacco": "Consumer Staples",
  "farm products": "Consumer Staples",
  "food distribution": "Consumer Staples",
  "grocery stores": "Consumer Staples",
  "confectioners": "Consumer Staples",
  "education & training services": "Consumer Staples",
  // Real Estate
  "reit—industrial": "Real Estate",
  "reit—residential": "Real Estate",
  "reit—retail": "Real Estate",
  "reit—office": "Real Estate",
  "reit—healthcare facilities": "Real Estate",
  "reit—diversified": "Real Estate",
  "reit—specialty": "Real Estate",
  "reit—mortgage": "Real Estate",
  "real estate services": "Real Estate",
  "real estate—development": "Real Estate",
  "real estate—diversified": "Real Estate",
  // Materials
  "gold": "Materials",
  "silver": "Materials",
  "steel": "Materials",
  "specialty chemicals": "Materials",
  "chemicals": "Materials",
  "building materials": "Materials",
  "aluminum": "Materials",
  "copper": "Materials",
  "paper & paper products": "Materials",
  "lumber & wood production": "Materials",
  "other industrial metals & mining": "Materials",
  "agricultural inputs": "Materials",
  "coking coal": "Materials",
  // Media (map to Communication Services)
  "media": "Communication Services",
};

// Canonical sector name mapping (normalize variants)
const SECTOR_ALIASES: Record<string, string> = {
  "consumer cyclical": "Consumer Discretionary",
  "consumer defensive": "Consumer Staples",
  "communication services": "Communication Services",
  "communications": "Communication Services",
  "basic materials": "Materials",
  "financial services": "Financials",
  "media": "Communication Services",
};

function mapToSector(industry: string | undefined, sector: string | undefined): string {
  // Try sector first
  if (sector && sector.length > 1) {
    const lower = sector.toLowerCase();
    if (SECTOR_ALIASES[lower]) return SECTOR_ALIASES[lower];
    if (lower !== "other") return sector;
  }
  if (!industry) return "Other";
  const lower = industry.toLowerCase();
  return INDUSTRY_TO_SECTOR[lower] || (sector && sector !== "Other" ? (SECTOR_ALIASES[sector.toLowerCase()] || sector) : "Other");
}

// Pretty labels for sub-sectors / industries
const INDUSTRY_LABELS: Record<string, string> = {
  "semiconductors": "Semiconductors",
  "software—infrastructure": "Software Infra",
  "software—application": "Software Apps",
  "software": "Software",
  "consumer electronics": "Consumer Electronics",
  "internet content & information": "Internet & Media",
  "internet retail": "Internet Retail",
  "drug manufacturers—general": "Pharma",
  "drug manufacturers": "Pharma",
  "biotechnology": "Biotech",
  "medical devices": "Medical Devices",
  "banks—diversified": "Banks",
  "banks—regional": "Regional Banks",
  "credit services": "Credit Services",
  "insurance—diversified": "Insurance",
  "insurance—property & casualty": "Insurance P&C",
  "asset management": "Asset Management",
  "capital markets": "Capital Markets",
  "oil & gas integrated": "Oil & Gas",
  "oil & gas e&p": "Oil & Gas E&P",
  "solar": "Solar Energy",
  "aerospace & defense": "Aerospace & Defense",
  "auto manufacturers": "Auto Makers",
  "specialty retail": "Specialty Retail",
  "restaurants": "Restaurants",
  "household & personal products": "Household Products",
  "beverages—non-alcoholic": "Beverages",
  "discount stores": "Discount Stores",
  "packaged foods": "Packaged Foods",
  "utilities—regulated electric": "Electric Utilities",
  "reit—industrial": "Industrial REITs",
  "reit—residential": "Residential REITs",
  "gold": "Gold",
  "specialty chemicals": "Specialty Chemicals",
  "steel": "Steel",
  "railroads": "Railroads",
  "airlines": "Airlines",
  "telecom services": "Telecom",
  "entertainment": "Entertainment",
  "advertising agencies": "Advertising",
  "diagnostics & research": "Diagnostics",
  "health care plans": "Health Plans",
  "financial data & stock exchanges": "Exchanges",
  "information technology services": "IT Services",
  "waste management": "Waste Mgmt",
  "farm & heavy construction machinery": "Heavy Machinery",
  "building materials": "Building Materials",
  "real estate services": "Real Estate Services",
};

function getIndustryLabel(industry: string | undefined): string {
  if (!industry) return "";
  const lower = industry.toLowerCase();
  return INDUSTRY_LABELS[lower] || industry.split("—").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function SectorPerformance() {
  const { data: companies, isLoading: loadingTop } = useTopCompanies();
  const { data: gl, isLoading: loadingGL } = useGainersLosers();
  const { data: active, isLoading: loadingActive } = useMostActive();
  const t = useT();
  const [viewMode, setViewMode] = useState<"sectors" | "industries">("industries");

  const isLoading = loadingTop && !companies;

  const allStocks = useMemo(() => {
    const seen = new Set<string>();
    const all: any[] = [];
    const addStocks = (stocks: any[] | undefined) => {
      if (!stocks) return;
      for (const s of stocks) {
        if (s.symbol && !seen.has(s.symbol) && (s.changePercent || s.changePercent === 0)) {
          seen.add(s.symbol);
          all.push(s);
        }
      }
    };
    addStocks(companies);
    if (gl) { addStocks(gl.gainers); addStocks(gl.losers); }
    addStocks(active);
    return all;
  }, [companies, gl, active]);

  const sectors = useMemo(() => {
    if (allStocks.length === 0) return [];
    const map: Record<string, { sum: number; count: number }> = {};
    allStocks.forEach((c: any) => {
      const sector = mapToSector(c.industry, c.sector);
      if (!map[sector]) map[sector] = { sum: 0, count: 0 };
      map[sector].sum += c.changePercent || 0;
      map[sector].count += 1;
    });
    return Object.entries(map)
      .filter(([name]) => name !== "Other" && name !== "")
      .map(([name, { sum, count }]) => ({ name, avg: sum / count, count }))
      .sort((a, b) => b.avg - a.avg);
  }, [allStocks]);

  const industries = useMemo(() => {
    if (allStocks.length === 0) return [];
    const map: Record<string, { sum: number; count: number; sector: string }> = {};
    allStocks.forEach((c: any) => {
      // Use industry if available; if not, use sector as the key
      const rawIndustry = c.industry ? c.industry.toLowerCase().trim() : "";
      const rawSector = c.sector ? c.sector.trim() : "";
      
      // Create entries for BOTH the broad sector AND the specific industry
      const sectorName = mapToSector(c.industry, c.sector);
      
      // Add to specific industry (if we have one and it's different from sector)
      if (rawIndustry && rawIndustry !== "other" && rawIndustry !== rawSector.toLowerCase()) {
        if (!map[rawIndustry]) map[rawIndustry] = { sum: 0, count: 0, sector: sectorName };
        map[rawIndustry].sum += c.changePercent || 0;
        map[rawIndustry].count += 1;
      } else if (rawSector && rawSector !== "Other") {
        // Stocks with only sector info → use sector as industry entry
        const key = rawSector.toLowerCase();
        if (!map[key]) map[key] = { sum: 0, count: 0, sector: sectorName };
        map[key].sum += c.changePercent || 0;
        map[key].count += 1;
      }
    });
    return Object.entries(map)
      .map(([key, { sum, count, sector }]) => ({
        name: getIndustryLabel(key),
        avg: sum / count,
        count,
        sector,
      }))
      .sort((a, b) => b.avg - a.avg);
  }, [allStocks]);

  const items = viewMode === "sectors" ? sectors : industries;

  if (isLoading) return <Skeleton className="h-48 rounded-xl" />;
  if (items.length === 0) return null;

  const max = Math.max(...items.map(s => Math.abs(s.avg)), 0.5);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          {t("sector.title")}
        </h3>
        <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("sectors")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "sectors" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            title="Sectors"
          >
            <Layers className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode("industries")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "industries" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            title="Industries"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {items.map(s => {
          const isUp = s.avg >= 0;
          const width = Math.min(Math.abs(s.avg) / max * 100, 100);
          return (
            <div key={s.name} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-36 truncate shrink-0" title={s.name}>
                {s.name}
              </span>
              <div className="flex-1 h-5 bg-muted/30 rounded-md overflow-hidden relative">
                <div
                  className={`h-full rounded-md transition-all duration-500 ${isUp ? "bg-chart-2/60" : "bg-destructive/60"}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className={`text-xs font-mono font-semibold w-14 text-right ${isUp ? "text-chart-2" : "text-destructive"}`}>
                {isUp ? "+" : ""}{s.avg.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
