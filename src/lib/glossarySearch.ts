/**
 * Glossary search engine: normalization, synonyms, fuzzy (Levenshtein) matching
 * and relevance scoring. Framework-agnostic so it can be unit tested.
 */
import type { GlossaryTerm } from "@/data/glossaryTypes";

// ── Synonym maps (bidirectional lookup) ──
export const SYNONYMS_DE: Record<string, string[]> = {
  kgv: ["p/e", "kurs-gewinn-verhaeltnis", "price-earnings"],
  "p/e": ["kgv", "kurs-gewinn-verhaeltnis"],
  eps: ["gewinn pro aktie", "earnings per share"],
  roe: ["eigenkapitalrendite", "return on equity"],
  roa: ["gesamtkapitalrendite", "return on assets"],
  etf: ["exchange traded fund", "indexfonds"],
  ipo: ["boersengang", "initial public offering"],
  dca: ["dollar-cost averaging", "sparplan", "durchschnittskosteneffekt"],
  reit: ["immobilienfonds", "real estate investment trust"],
  ter: ["total expense ratio", "gesamtkostenquote"],
  macd: ["moving average convergence divergence"],
  rsi: ["relative strength index", "relative-staerke-index"],
  nav: ["nettoinventarwert", "net asset value"],
  bip: ["bruttoinlandsprodukt", "gdp"],
  gdp: ["bip", "bruttoinlandsprodukt", "gross domestic product"],
  dividende: ["ausschuettung", "dividend"],
  aktie: ["stock", "share", "wertpapier", "anteilsschein"],
  anleihe: ["bond", "festverzinslich", "schuldverschreibung"],
  volatilitaet: ["schwankung", "volatility", "vola"],
  liquiditaet: ["liquidity", "handelbarkeit"],
  bulle: ["bullisch", "bull", "aufwaertstrend"],
  baer: ["baerisch", "bear", "abwaertstrend"],
  spread: ["geld-brief-spanne", "bid-ask"],
  beta: ["marktrisiko", "systematisches risiko"],
  alpha: ["ueberrendite", "outperformance", "excess return"],
  hedge: ["absicherung", "hedging"],
  margin: ["sicherheitsleistung", "einschuss"],
  short: ["leerverkauf", "short selling"],
  long: ["kaufposition", "long position"],
  "stop-loss": ["verlustbegrenzung", "stop loss"],
  portfolio: ["depot", "wertpapierdepot"],
  diversifikation: ["streuung", "diversification", "risikostreuung"],
  inflation: ["geldentwertung", "preissteigerung", "teuerung"],
  rezession: ["wirtschaftsabschwung", "recession"],
  rendite: ["return", "ertrag", "yield"],
  kurs: ["preis", "price", "notierung"],
  fonds: ["fund", "investmentfonds"],
  derivat: ["derivative", "finanzderivat"],
  future: ["terminkontrakt", "termingeschaeft"],
  zins: ["interest", "zinssatz", "rate"],
  bilanz: ["balance sheet", "jahresabschluss"],
  umsatz: ["revenue", "erloes"],
  gewinn: ["profit", "earnings", "ertrag"],
  cashflow: ["kapitalfluss", "geldstrom", "cash flow"],
  ebitda: ["gewinn vor zinsen steuern abschreibungen", "operating earnings"],
  "enterprise value": ["ev", "unternehmenswert"],
  spac: ["special purpose acquisition company", "mantelgesellschaft"],
  rebalancing: ["umschichtung", "neugewichtung"],
  fomo: ["fear of missing out", "angst etwas zu verpassen"],
};

export const SYNONYMS_EN: Record<string, string[]> = {
  "p/e": ["price-earnings", "price to earnings", "pe ratio"],
  eps: ["earnings per share"],
  roe: ["return on equity"],
  etf: ["exchange traded fund"],
  ipo: ["initial public offering"],
  dca: ["dollar cost averaging"],
  reit: ["real estate investment trust"],
  macd: ["moving average convergence divergence"],
  rsi: ["relative strength index"],
  nav: ["net asset value"],
  gdp: ["gross domestic product"],
  stock: ["share", "equity"],
  bond: ["fixed income", "debt security"],
  volatility: ["fluctuation", "vol"],
  dividend: ["payout", "distribution"],
  hedge: ["hedging", "protection"],
  short: ["short selling", "short sale"],
  spread: ["bid-ask spread"],
  portfolio: ["holdings"],
  diversification: ["spreading risk"],
  yield: ["return", "interest"],
  bull: ["bullish", "uptrend"],
  bear: ["bearish", "downtrend"],
  derivative: ["financial derivative"],
  revenue: ["sales", "turnover"],
  profit: ["earnings", "income"],
  ebitda: ["earnings before interest taxes depreciation amortization"],
  "enterprise value": ["ev", "firm value"],
  spac: ["special purpose acquisition company", "blank check company"],
  fomo: ["fear of missing out"],
  drip: ["dividend reinvestment plan"],
  ira: ["individual retirement account"],
};

/** Lowercase + fold umlauts/accents so "volatilitaet" matches "Volatilität". */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function slugify(term: string): string {
  return normalize(term)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Bounded Levenshtein distance; returns maxDist + 1 when it exceeds the bound. */
export function levenshtein(a: string, b: string, maxDist = 3): number {
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  if (Math.abs(la - lb) > maxDist) return maxDist + 1;

  let prev = new Array<number>(lb + 1);
  let cur = new Array<number>(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= lb; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > maxDist) return maxDist + 1;
    const tmp = prev;
    prev = cur;
    cur = tmp;
  }
  return prev[lb];
}

export interface IndexedTerm {
  term: GlossaryTerm;
  slug: string;
  nTerm: string;
  nDef: string;
  words: string[];
  letter: string;
}

/** Build the normalized index once per language. */
export function buildIndex(glossary: GlossaryTerm[]): IndexedTerm[] {
  return glossary.map((term) => {
    const nTerm = normalize(term.term);
    return {
      term,
      slug: slugify(term.term),
      nTerm,
      nDef: normalize(term.def),
      words: nTerm.split(/[\s\-/()]+/).filter((w) => w.length > 1),
      letter: term.term[0].toUpperCase(),
    };
  });
}

export function getSynonyms(query: string, lang: string): string[] {
  const map = lang === "de" ? SYNONYMS_DE : SYNONYMS_EN;
  const q = normalize(query);
  const result: string[] = [];
  for (const [key, syns] of Object.entries(map)) {
    const nKey = normalize(key);
    const nSyns = syns.map(normalize);
    if (nKey === q) result.push(...nSyns);
    else if (nSyns.includes(q)) result.push(nKey, ...nSyns.filter((s) => s !== q));
  }
  return [...new Set(result)];
}

export interface ScoredTerm {
  entry: IndexedTerm;
  score: number;
  /** The query variant that produced the match (used for highlighting). */
  matched: string;
}

function scoreOne(entry: IndexedTerm, q: string): number {
  const { nTerm, nDef, words } = entry;
  if (nTerm === q) return 100;
  if (nTerm.startsWith(q)) return 90;
  if (words.some((w) => w.startsWith(q))) return 82;
  if (nTerm.includes(q)) return 72;
  if (entry.term.aliases?.some((a) => normalize(a).includes(q))) return 68;
  if (nDef.includes(q)) return 50;

  if (q.length >= 3) {
    const maxDist = q.length <= 5 ? 1 : 2;
    const termDist = levenshtein(nTerm, q, maxDist);
    if (termDist <= maxDist) return 42 - termDist * 5;
    for (const w of words) {
      const d = levenshtein(w, q, maxDist);
      if (d <= maxDist) return 36 - d * 5;
    }
  }
  return 0;
}

export interface SearchOptions {
  lang: string;
  letter?: string | null;
  category?: string | null;
  minScore?: number;
}

export function searchGlossary(
  index: IndexedTerm[],
  query: string,
  { lang, letter = null, category = null, minScore = 1 }: SearchOptions,
): ScoredTerm[] {
  const scoped = index.filter(
    (e) =>
      (!letter || e.letter === letter) &&
      (!category || e.term.category === category),
  );

  const q = normalize(query);
  if (!q) {
    return scoped.map((entry) => ({ entry, score: 0, matched: "" }));
  }

  const synonyms = getSynonyms(q, lang);
  const results: ScoredTerm[] = [];

  for (const entry of scoped) {
    let best = 0;
    let matched = "";
    const direct = scoreOne(entry, q);
    if (direct > best) {
      best = direct;
      matched = q;
    }
    for (const syn of synonyms) {
      const s = scoreOne(entry, syn) * 0.7;
      if (s > best) {
        best = s;
        matched = syn;
      }
    }
    if (best >= minScore) results.push({ entry, score: best, matched });
  }

  results.sort(
    (a, b) => b.score - a.score || a.entry.term.term.localeCompare(b.entry.term.term),
  );
  return results;
}

/** Best near-miss suggestions used for the "did you mean" empty state. */
export function suggestTerms(
  index: IndexedTerm[],
  query: string,
  lang: string,
  limit = 6,
): GlossaryTerm[] {
  if (!query.trim()) return [];
  return searchGlossary(index, query, { lang, minScore: 30 })
    .slice(0, limit)
    .map((r) => r.entry.term);
}
