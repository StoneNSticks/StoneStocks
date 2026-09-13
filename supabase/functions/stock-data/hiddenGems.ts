// Hidden Gems: candidate universe + scoring model.
// Pure logic only (no network), so it stays testable.

export interface GemInput {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  logo?: string;
  // valuation
  pe: number | null;
  ps: number | null;
  evEbitda: number | null;
  fcfYield: number | null; // percent
  // growth
  revenueGrowth: number | null; // percent YoY
  epsGrowth: number | null; // percent YoY
  netMargin: number | null; // percent
  // analysts
  targetMean: number | null;
  analystCount: number;
  buyRatio: number; // 0..1
  // quality
  debtToEquity: number | null;
  roe: number | null; // percent
  // momentum
  return13w: number | null; // percent
  return26w: number | null; // percent
  high52w: number | null;
}

export interface GemScored extends GemInput {
  score: number;
  upside: number | null; // percent to analyst target
  breakdown: {
    valuation: number;
    growth: number;
    analysts: number;
    quality: number;
    momentum: number;
  };
  reasonKeys: string[];
  reasonValues: Record<string, number>;
}

export const GEM_WEIGHTS = {
  valuation: 0.3,
  growth: 0.3,
  analysts: 0.2,
  quality: 0.1,
  momentum: 0.1,
} as const;

export const MAX_GEM_MCAP = 200e9;
export const MIN_GEM_MCAP = 1e9;

/** Maps a value onto 0..100, clamped. Set `invert` when lower is better. */
export function normalize(value: number | null | undefined, low: number, high: number, invert = false): number | null {
  if (value == null || !isFinite(value)) return null;
  const raw = ((value - low) / (high - low)) * 100;
  const clamped = Math.max(0, Math.min(100, raw));
  return invert ? 100 - clamped : clamped;
}

/** Average of the sub-scores that are available; null when none are. */
function avg(parts: (number | null)[]): number | null {
  const valid = parts.filter((p): p is number => p != null);
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

export function valuationScore(g: GemInput): number | null {
  return avg([
    g.pe != null && g.pe > 0 ? normalize(g.pe, 5, 45, true) : null,
    g.ps != null && g.ps > 0 ? normalize(g.ps, 0.5, 12, true) : null,
    g.evEbitda != null && g.evEbitda > 0 ? normalize(g.evEbitda, 4, 30, true) : null,
    g.fcfYield != null ? normalize(g.fcfYield, -2, 12) : null,
  ]);
}

export function growthScore(g: GemInput): number | null {
  return avg([
    normalize(g.revenueGrowth, -5, 40),
    normalize(g.epsGrowth, -10, 50),
    normalize(g.netMargin, -5, 25),
  ]);
}

export function analystScore(g: GemInput): number | null {
  const upside = computeUpside(g);
  return avg([
    normalize(upside, -5, 60),
    g.analystCount > 0 ? g.buyRatio * 100 : null,
  ]);
}

export function qualityScore(g: GemInput): number | null {
  return avg([
    normalize(g.debtToEquity, 0, 200, true),
    normalize(g.roe, -5, 30),
  ]);
}

export function momentumScore(g: GemInput): number | null {
  const offHigh = g.high52w && g.price > 0 ? ((g.high52w - g.price) / g.high52w) * 100 : null;
  return avg([
    normalize(g.return13w, -25, 25),
    normalize(g.return26w, -35, 35),
    // A moderate gap to the 52-week high is what we want: not broken, not overheated.
    offHigh != null ? normalize(Math.abs(offHigh - 15), 0, 45, true) : null,
  ]);
}

export function computeUpside(g: GemInput): number | null {
  if (!g.targetMean || !g.price || g.price <= 0) return null;
  return ((g.targetMean - g.price) / g.price) * 100;
}

/** Hard filters: things that disqualify a stock regardless of score. */
export function passesFilters(g: GemInput): boolean {
  if (!g.price || g.price < 3) return false;
  if (!g.marketCap || g.marketCap < MIN_GEM_MCAP || g.marketCap > MAX_GEM_MCAP) return false;
  if (g.analystCount < 3) return false;
  // Heavily indebted and burning cash
  if (g.fcfYield != null && g.fcfYield < 0 && g.debtToEquity != null && g.debtToEquity > 150) return false;
  // Collapsed without any growth to justify a turnaround
  if (g.return26w != null && g.return26w < -50 && (g.revenueGrowth == null || g.revenueGrowth <= 0)) return false;
  return true;
}

export function scoreGem(g: GemInput): GemScored {
  const parts = {
    valuation: valuationScore(g),
    growth: growthScore(g),
    analysts: analystScore(g),
    quality: qualityScore(g),
    momentum: momentumScore(g),
  };

  // Re-weight across the buckets we actually have data for.
  let weighted = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(GEM_WEIGHTS) as [keyof typeof GEM_WEIGHTS, number][]) {
    const value = parts[key];
    if (value != null) {
      weighted += value * weight;
      weightSum += weight;
    }
  }
  const score = weightSum > 0 ? Math.round(weighted / weightSum) : 0;
  const upside = computeUpside(g);

  const reasonKeys: string[] = [];
  const reasonValues: Record<string, number> = {};
  if (g.pe != null && g.pe > 0 && g.pe < 18) { reasonKeys.push("cheapPE"); reasonValues.pe = g.pe; }
  if (g.revenueGrowth != null && g.revenueGrowth > 12) { reasonKeys.push("growth"); reasonValues.revenueGrowth = g.revenueGrowth; }
  if (upside != null && upside > 20) { reasonKeys.push("upside"); reasonValues.upside = upside; }
  if (g.fcfYield != null && g.fcfYield > 5) { reasonKeys.push("cashflow"); reasonValues.fcfYield = g.fcfYield; }
  if (g.roe != null && g.roe > 15) { reasonKeys.push("profitability"); reasonValues.roe = g.roe; }
  if (reasonKeys.length === 0) reasonKeys.push("balanced");

  return {
    ...g,
    score,
    upside,
    breakdown: {
      valuation: Math.round(parts.valuation ?? 0),
      growth: Math.round(parts.growth ?? 0),
      analysts: Math.round(parts.analysts ?? 0),
      quality: Math.round(parts.quality ?? 0),
      momentum: Math.round(parts.momentum ?? 0),
    },
    reasonKeys: reasonKeys.slice(0, 2),
    reasonValues,
  };
}

/** Score, filter, sort and cap at two picks per sector. */
export function selectGems(inputs: GemInput[], limit = 12, perSector = 2): GemScored[] {
  const scored = inputs.filter(passesFilters).map(scoreGem).sort((a, b) => b.score - a.score);
  const bySector = new Map<string, number>();
  const out: GemScored[] = [];
  for (const g of scored) {
    const sector = g.sector || "Other";
    const used = bySector.get(sector) || 0;
    if (used >= perSector) continue;
    bySector.set(sector, used + 1);
    out.push(g);
    if (out.length >= limit) break;
  }
  return out;
}

/** Broad universe of small/mid/large caps below mega-cap size, all sectors, US + EU listings. */
export const HIDDEN_GEM_CANDIDATES: { symbol: string; name: string; sector: string }[] = [
  // Technology & Software
  { symbol: "NET", name: "Cloudflare", sector: "Technology" },
  { symbol: "DDOG", name: "Datadog", sector: "Technology" },
  { symbol: "MDB", name: "MongoDB", sector: "Technology" },
  { symbol: "ZS", name: "Zscaler", sector: "Technology" },
  { symbol: "OKTA", name: "Okta", sector: "Technology" },
  { symbol: "TWLO", name: "Twilio", sector: "Technology" },
  { symbol: "DOCN", name: "DigitalOcean", sector: "Technology" },
  { symbol: "PATH", name: "UiPath", sector: "Technology" },
  { symbol: "S", name: "SentinelOne", sector: "Technology" },
  { symbol: "ESTC", name: "Elastic", sector: "Technology" },
  { symbol: "GTLB", name: "GitLab", sector: "Technology" },
  { symbol: "CFLT", name: "Confluent", sector: "Technology" },
  { symbol: "HCP", name: "HashiCorp", sector: "Technology" },
  { symbol: "TEAM", name: "Atlassian", sector: "Technology" },
  { symbol: "HUBS", name: "HubSpot", sector: "Technology" },
  { symbol: "ZM", name: "Zoom", sector: "Technology" },
  { symbol: "DBX", name: "Dropbox", sector: "Technology" },
  { symbol: "WIX", name: "Wix.com", sector: "Technology" },
  { symbol: "APPF", name: "AppFolio", sector: "Technology" },
  { symbol: "DT", name: "Dynatrace", sector: "Technology" },
  { symbol: "PEGA", name: "Pegasystems", sector: "Technology" },
  { symbol: "MANH", name: "Manhattan Associates", sector: "Technology" },
  { symbol: "TYL", name: "Tyler Technologies", sector: "Technology" },
  { symbol: "NTAP", name: "NetApp", sector: "Technology" },
  { symbol: "PSTG", name: "Pure Storage", sector: "Technology" },
  { symbol: "STX", name: "Seagate", sector: "Technology" },
  { symbol: "WDC", name: "Western Digital", sector: "Technology" },
  { symbol: "HPQ", name: "HP Inc.", sector: "Technology" },
  { symbol: "LOGI", name: "Logitech", sector: "Technology" },

  // Semiconductors
  { symbol: "ON", name: "ON Semiconductor", sector: "Semiconductors" },
  { symbol: "MCHP", name: "Microchip Technology", sector: "Semiconductors" },
  { symbol: "SWKS", name: "Skyworks Solutions", sector: "Semiconductors" },
  { symbol: "QRVO", name: "Qorvo", sector: "Semiconductors" },
  { symbol: "LSCC", name: "Lattice Semiconductor", sector: "Semiconductors" },
  { symbol: "MPWR", name: "Monolithic Power", sector: "Semiconductors" },
  { symbol: "ALGM", name: "Allegro MicroSystems", sector: "Semiconductors" },
  { symbol: "AMKR", name: "Amkor Technology", sector: "Semiconductors" },
  { symbol: "ONTO", name: "Onto Innovation", sector: "Semiconductors" },
  { symbol: "FORM", name: "FormFactor", sector: "Semiconductors" },
  { symbol: "COHU", name: "Cohu", sector: "Semiconductors" },
  { symbol: "STM", name: "STMicroelectronics", sector: "Semiconductors" },
  { symbol: "NXPI", name: "NXP Semiconductors", sector: "Semiconductors" },

  // Financials
  { symbol: "SOFI", name: "SoFi Technologies", sector: "Financials" },
  { symbol: "ALLY", name: "Ally Financial", sector: "Financials" },
  { symbol: "SYF", name: "Synchrony Financial", sector: "Financials" },
  { symbol: "DFS", name: "Discover Financial", sector: "Financials" },
  { symbol: "RF", name: "Regions Financial", sector: "Financials" },
  { symbol: "CFG", name: "Citizens Financial", sector: "Financials" },
  { symbol: "KEY", name: "KeyCorp", sector: "Financials" },
  { symbol: "FITB", name: "Fifth Third Bancorp", sector: "Financials" },
  { symbol: "HBAN", name: "Huntington Bancshares", sector: "Financials" },
  { symbol: "ZION", name: "Zions Bancorporation", sector: "Financials" },
  { symbol: "EWBC", name: "East West Bancorp", sector: "Financials" },
  { symbol: "WBS", name: "Webster Financial", sector: "Financials" },
  { symbol: "JXN", name: "Jackson Financial", sector: "Financials" },
  { symbol: "UNM", name: "Unum Group", sector: "Financials" },
  { symbol: "LNC", name: "Lincoln National", sector: "Financials" },
  { symbol: "NAVI", name: "Navient", sector: "Financials" },
  { symbol: "OMF", name: "OneMain Holdings", sector: "Financials" },
  { symbol: "BAP", name: "Credicorp", sector: "Financials" },
  { symbol: "NU", name: "Nu Holdings", sector: "Financials" },
  { symbol: "STNE", name: "StoneCo", sector: "Financials" },
  { symbol: "PAGS", name: "PagSeguro", sector: "Financials" },

  // Healthcare & Biotech
  { symbol: "INCY", name: "Incyte", sector: "Healthcare" },
  { symbol: "EXEL", name: "Exelixis", sector: "Healthcare" },
  { symbol: "HALO", name: "Halozyme", sector: "Healthcare" },
  { symbol: "NBIX", name: "Neurocrine Biosciences", sector: "Healthcare" },
  { symbol: "UTHR", name: "United Therapeutics", sector: "Healthcare" },
  { symbol: "JAZZ", name: "Jazz Pharmaceuticals", sector: "Healthcare" },
  { symbol: "ALKS", name: "Alkermes", sector: "Healthcare" },
  { symbol: "OGN", name: "Organon", sector: "Healthcare" },
  { symbol: "VTRS", name: "Viatris", sector: "Healthcare" },
  { symbol: "PRGO", name: "Perrigo", sector: "Healthcare" },
  { symbol: "MOH", name: "Molina Healthcare", sector: "Healthcare" },
  { symbol: "CNC", name: "Centene", sector: "Healthcare" },
  { symbol: "EHC", name: "Encompass Health", sector: "Healthcare" },
  { symbol: "CHE", name: "Chemed", sector: "Healthcare" },
  { symbol: "LNTH", name: "Lantheus Holdings", sector: "Healthcare" },
  { symbol: "MEDP", name: "Medpace Holdings", sector: "Healthcare" },
  { symbol: "ICLR", name: "ICON plc", sector: "Healthcare" },
  { symbol: "QGEN", name: "Qiagen", sector: "Healthcare" },
  { symbol: "GMED", name: "Globus Medical", sector: "Healthcare" },

  // Industrials
  { symbol: "AGCO", name: "AGCO Corporation", sector: "Industrials" },
  { symbol: "TEX", name: "Terex", sector: "Industrials" },
  { symbol: "OSK", name: "Oshkosh", sector: "Industrials" },
  { symbol: "BLDR", name: "Builders FirstSource", sector: "Industrials" },
  { symbol: "MLI", name: "Mueller Industries", sector: "Industrials" },
  { symbol: "ATKR", name: "Atkore", sector: "Industrials" },
  { symbol: "EME", name: "EMCOR Group", sector: "Industrials" },
  { symbol: "PWR", name: "Quanta Services", sector: "Industrials" },
  { symbol: "STRL", name: "Sterling Infrastructure", sector: "Industrials" },
  { symbol: "AAON", name: "AAON", sector: "Industrials" },
  { symbol: "WCC", name: "WESCO International", sector: "Industrials" },
  { symbol: "GTES", name: "Gates Industrial", sector: "Industrials" },
  { symbol: "ALSN", name: "Allison Transmission", sector: "Industrials" },
  { symbol: "TKR", name: "Timken", sector: "Industrials" },
  { symbol: "R", name: "Ryder System", sector: "Industrials" },
  { symbol: "SAIA", name: "Saia", sector: "Industrials" },
  { symbol: "MATX", name: "Matson", sector: "Industrials" },
  { symbol: "HRI", name: "Herc Holdings", sector: "Industrials" },

  // Energy
  { symbol: "DVN", name: "Devon Energy", sector: "Energy" },
  { symbol: "FANG", name: "Diamondback Energy", sector: "Energy" },
  { symbol: "CTRA", name: "Coterra Energy", sector: "Energy" },
  { symbol: "APA", name: "APA Corporation", sector: "Energy" },
  { symbol: "OVV", name: "Ovintiv", sector: "Energy" },
  { symbol: "MUR", name: "Murphy Oil", sector: "Energy" },
  { symbol: "MTDR", name: "Matador Resources", sector: "Energy" },
  { symbol: "CIVI", name: "Civitas Resources", sector: "Energy" },
  { symbol: "CHRD", name: "Chord Energy", sector: "Energy" },
  { symbol: "PR", name: "Permian Resources", sector: "Energy" },
  { symbol: "VAL", name: "Valaris", sector: "Energy" },
  { symbol: "WHD", name: "Cactus", sector: "Energy" },
  { symbol: "DINO", name: "HF Sinclair", sector: "Energy" },
  { symbol: "PARR", name: "Par Pacific", sector: "Energy" },

  // Consumer Cyclical
  { symbol: "RL", name: "Ralph Lauren", sector: "Consumer Cyclical" },
  { symbol: "DECK", name: "Deckers Outdoor", sector: "Consumer Cyclical" },
  { symbol: "CROX", name: "Crocs", sector: "Consumer Cyclical" },
  { symbol: "SKX", name: "Skechers", sector: "Consumer Cyclical" },
  { symbol: "FL", name: "Foot Locker", sector: "Consumer Cyclical" },
  { symbol: "BURL", name: "Burlington Stores", sector: "Consumer Cyclical" },
  { symbol: "DKS", name: "Dick's Sporting Goods", sector: "Consumer Cyclical" },
  { symbol: "WSM", name: "Williams-Sonoma", sector: "Consumer Cyclical" },
  { symbol: "TPR", name: "Tapestry", sector: "Consumer Cyclical" },
  { symbol: "PVH", name: "PVH Corp", sector: "Consumer Cyclical" },
  { symbol: "TXRH", name: "Texas Roadhouse", sector: "Consumer Cyclical" },
  { symbol: "WING", name: "Wingstop", sector: "Consumer Cyclical" },
  { symbol: "EAT", name: "Brinker International", sector: "Consumer Cyclical" },
  { symbol: "LAD", name: "Lithia Motors", sector: "Consumer Cyclical" },
  { symbol: "PHM", name: "PulteGroup", sector: "Consumer Cyclical" },
  { symbol: "TOL", name: "Toll Brothers", sector: "Consumer Cyclical" },
  { symbol: "TMHC", name: "Taylor Morrison", sector: "Consumer Cyclical" },

  // Consumer Defensive
  { symbol: "POST", name: "Post Holdings", sector: "Consumer Defensive" },
  { symbol: "INGR", name: "Ingredion", sector: "Consumer Defensive" },
  { symbol: "FLO", name: "Flowers Foods", sector: "Consumer Defensive" },
  { symbol: "CALM", name: "Cal-Maine Foods", sector: "Consumer Defensive" },
  { symbol: "USFD", name: "US Foods", sector: "Consumer Defensive" },
  { symbol: "PFGC", name: "Performance Food Group", sector: "Consumer Defensive" },
  { symbol: "CASY", name: "Casey's General Stores", sector: "Consumer Defensive" },
  { symbol: "BJ", name: "BJ's Wholesale Club", sector: "Consumer Defensive" },

  // Materials
  { symbol: "STLD", name: "Steel Dynamics", sector: "Materials" },
  { symbol: "RS", name: "Reliance Inc.", sector: "Materials" },
  { symbol: "CLF", name: "Cleveland-Cliffs", sector: "Materials" },
  { symbol: "ATI", name: "ATI Inc.", sector: "Materials" },
  { symbol: "CRS", name: "Carpenter Technology", sector: "Materials" },
  { symbol: "AA", name: "Alcoa", sector: "Materials" },
  { symbol: "EXP", name: "Eagle Materials", sector: "Materials" },
  { symbol: "SMG", name: "Scotts Miracle-Gro", sector: "Materials" },
  { symbol: "HUN", name: "Huntsman", sector: "Materials" },
  { symbol: "CE", name: "Celanese", sector: "Materials" },
  { symbol: "MOS", name: "Mosaic", sector: "Materials" },
  { symbol: "CF", name: "CF Industries", sector: "Materials" },

  // Utilities & Real Estate
  { symbol: "NRG", name: "NRG Energy", sector: "Utilities" },
  { symbol: "VST", name: "Vistra", sector: "Utilities" },
  { symbol: "PNW", name: "Pinnacle West", sector: "Utilities" },
  { symbol: "OGE", name: "OGE Energy", sector: "Utilities" },
  { symbol: "IDA", name: "IDACORP", sector: "Utilities" },
  { symbol: "UGI", name: "UGI Corporation", sector: "Utilities" },
  { symbol: "EPR", name: "EPR Properties", sector: "Real Estate" },
  { symbol: "STAG", name: "STAG Industrial", sector: "Real Estate" },
  { symbol: "CUBE", name: "CubeSmart", sector: "Real Estate" },
  { symbol: "KRG", name: "Kite Realty Group", sector: "Real Estate" },
  { symbol: "BXP", name: "BXP Inc.", sector: "Real Estate" },
  { symbol: "HIW", name: "Highwoods Properties", sector: "Real Estate" },

  // Communication & Media
  { symbol: "PINS", name: "Pinterest", sector: "Communication" },
  { symbol: "MTCH", name: "Match Group", sector: "Communication" },
  { symbol: "YELP", name: "Yelp", sector: "Communication" },
  { symbol: "ZD", name: "Ziff Davis", sector: "Communication" },
  { symbol: "TTD", name: "The Trade Desk", sector: "Communication" },
  { symbol: "CRTO", name: "Criteo", sector: "Communication" },
  { symbol: "IPG", name: "Interpublic Group", sector: "Communication" },
  { symbol: "OMC", name: "Omnicom Group", sector: "Communication" },
  { symbol: "NYT", name: "New York Times", sector: "Communication" },
  { symbol: "TKO", name: "TKO Group", sector: "Communication" },

  // Travel & Transport
  { symbol: "ALK", name: "Alaska Air Group", sector: "Travel" },
  { symbol: "UAL", name: "United Airlines", sector: "Travel" },
  { symbol: "CPA", name: "Copa Holdings", sector: "Travel" },
  { symbol: "HLT", name: "Hilton Worldwide", sector: "Travel" },
  { symbol: "CHH", name: "Choice Hotels", sector: "Travel" },
  { symbol: "TNL", name: "Travel + Leisure", sector: "Travel" },
  { symbol: "NCLH", name: "Norwegian Cruise Line", sector: "Travel" },

  // Fintech & Payments
  { symbol: "FOUR", name: "Shift4 Payments", sector: "Fintech" },
  { symbol: "WEX", name: "WEX Inc.", sector: "Fintech" },
  { symbol: "JKHY", name: "Jack Henry & Associates", sector: "Fintech" },
  { symbol: "AFRM", name: "Affirm", sector: "Fintech" },
  { symbol: "TOST", name: "Toast", sector: "Fintech" },
  { symbol: "FLYW", name: "Flywire", sector: "Fintech" },
  { symbol: "PYPL", name: "PayPal", sector: "Fintech" },
];
