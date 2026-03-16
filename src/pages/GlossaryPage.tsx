/**
 * GlossaryPage: Complete glossary with fuzzy search, synonyms, autocomplete, and letter filter.
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { BookOpen, Search, GraduationCap, X, FilterX, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getGlossaryDE } from "@/data/glossaryDE";
import { getGlossaryEN } from "@/data/glossaryEN";
import type { GlossaryTerm } from "@/data/glossaryDE";

// ── Synonym map (bidirectional) ──
const SYNONYMS_DE: Record<string, string[]> = {
  "kgv": ["p/e", "kurs-gewinn-verhältnis", "price-earnings"],
  "p/e": ["kgv", "kurs-gewinn-verhältnis"],
  "eps": ["gewinn pro aktie", "earnings per share"],
  "roe": ["eigenkapitalrendite", "return on equity"],
  "roa": ["gesamtkapitalrendite", "return on assets"],
  "etf": ["exchange traded fund", "indexfonds"],
  "ipo": ["börsengang", "initial public offering"],
  "dca": ["dollar-cost averaging", "sparplan", "durchschnittskosteneffekt"],
  "reit": ["immobilienfonds", "real estate investment trust"],
  "ter": ["total expense ratio", "gesamtkostenquote"],
  "macd": ["moving average convergence divergence"],
  "rsi": ["relative strength index", "relative-stärke-index"],
  "nav": ["nettoinventarwert", "net asset value"],
  "bip": ["bruttoinlandsprodukt", "gdp"],
  "gdp": ["bip", "bruttoinlandsprodukt", "gross domestic product"],
  "dividende": ["ausschüttung", "dividend"],
  "aktie": ["stock", "share", "wertpapier", "anteilsschein"],
  "anleihe": ["bond", "festverzinslich", "schuldverschreibung"],
  "volatilität": ["schwankung", "volatility", "vola"],
  "liquidität": ["liquidity", "handelbarkeit"],
  "bulle": ["bullisch", "bull", "aufwärtstrend"],
  "bär": ["bärisch", "bear", "abwärtstrend"],
  "spread": ["geld-brief-spanne", "bid-ask"],
  "beta": ["marktrisiko", "systematisches risiko"],
  "alpha": ["überrendite", "outperformance", "excess return"],
  "hedge": ["absicherung", "hedging"],
  "margin": ["sicherheitsleistung", "einschuss"],
  "short": ["leerverkauf", "short selling"],
  "long": ["kaufposition", "long position"],
  "stop-loss": ["verlustbegrenzung", "stop loss"],
  "limit order": ["limitauftrag", "preislimit"],
  "market order": ["marktorder", "bestens-order"],
  "portfolio": ["depot", "wertpapierdepot"],
  "diversifikation": ["streuung", "diversification", "risikostreuung"],
  "inflation": ["geldentwertung", "preissteigerung", "teuerung"],
  "deflation": ["preisrückgang"],
  "rezession": ["wirtschaftsabschwung", "recession"],
  "rendite": ["return", "ertrag", "yield"],
  "kurs": ["preis", "price", "notierung"],
  "fond": ["fonds", "fund", "investmentfonds"],
  "wertpapier": ["security", "finanzinstrument"],
  "derivat": ["derivative", "finanzderivat"],
  "option": ["optionsschein"],
  "future": ["terminkontrakt", "termingeschäft"],
  "zins": ["interest", "zinssatz", "rate"],
  "kredit": ["loan", "darlehen"],
  "bilanz": ["balance sheet", "jahresabschluss"],
  "umsatz": ["revenue", "erlös"],
  "gewinn": ["profit", "earnings", "ertrag"],
  "verlust": ["loss", "deficit"],
  "cashflow": ["kapitalfluss", "geldstrom", "cash flow"],
};

const SYNONYMS_EN: Record<string, string[]> = {
  "p/e": ["price-earnings", "price to earnings", "pe ratio"],
  "eps": ["earnings per share"],
  "roe": ["return on equity"],
  "etf": ["exchange traded fund"],
  "ipo": ["initial public offering"],
  "dca": ["dollar cost averaging"],
  "reit": ["real estate investment trust"],
  "macd": ["moving average convergence divergence"],
  "rsi": ["relative strength index"],
  "nav": ["net asset value"],
  "gdp": ["gross domestic product"],
  "stock": ["share", "equity"],
  "bond": ["fixed income", "debt security"],
  "volatility": ["fluctuation", "vol"],
  "dividend": ["payout", "distribution"],
  "hedge": ["hedging", "protection"],
  "short": ["short selling", "short sale"],
  "spread": ["bid-ask spread"],
  "margin": ["collateral"],
  "portfolio": ["holdings"],
  "diversification": ["spreading risk"],
  "inflation": ["price increase"],
  "yield": ["return", "interest"],
  "bull": ["bullish", "uptrend"],
  "bear": ["bearish", "downtrend"],
  "derivative": ["financial derivative"],
  "option": ["options contract"],
  "future": ["futures contract"],
  "balance sheet": ["financial statement"],
  "revenue": ["sales", "turnover"],
  "profit": ["earnings", "income"],
  "cash flow": ["cash movement"],
};

// ── Levenshtein distance ──
function levenshtein(a: string, b: string): number {
  const la = a.length, lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  // Optimize: if strings are very different lengths, skip
  if (Math.abs(la - lb) > 3) return Math.max(la, lb);
  
  const matrix: number[][] = [];
  for (let i = 0; i <= la; i++) {
    matrix[i] = [i];
    for (let j = 1; j <= lb; j++) {
      matrix[i][j] = i === 0
        ? j
        : Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
          );
    }
  }
  return matrix[la][lb];
}

// ── Scoring engine ──
interface ScoredTerm {
  term: GlossaryTerm;
  score: number;
}

function getSynonyms(query: string, lang: string): string[] {
  const map = lang === "de" ? SYNONYMS_DE : SYNONYMS_EN;
  const q = query.toLowerCase();
  const result: string[] = [];
  
  // Direct lookup
  if (map[q]) result.push(...map[q]);
  
  // Reverse lookup
  for (const [key, syns] of Object.entries(map)) {
    if (syns.some(s => s === q)) {
      result.push(key);
      result.push(...syns.filter(s => s !== q));
    }
  }
  
  return [...new Set(result)];
}

function scoreTerms(glossary: GlossaryTerm[], query: string, lang: string): ScoredTerm[] {
  const q = query.toLowerCase().trim();
  if (!q) return glossary.map(term => ({ term, score: 0 }));
  
  const synonyms = getSynonyms(q, lang);
  const allQueries = [q, ...synonyms];
  const results: ScoredTerm[] = [];
  
  for (const item of glossary) {
    const termLower = item.term.toLowerCase();
    const defLower = item.def.toLowerCase();
    let bestScore = 0;
    
    for (const searchQ of allQueries) {
      const isSynonym = searchQ !== q;
      const synPenalty = isSynonym ? 0.7 : 1; // Synonym matches score slightly lower
      
      // Exact match on term
      if (termLower === searchQ) {
        bestScore = Math.max(bestScore, 100 * synPenalty);
        continue;
      }
      
      // Term starts with query
      if (termLower.startsWith(searchQ)) {
        bestScore = Math.max(bestScore, 90 * synPenalty);
        continue;
      }
      
      // Term contains query as word boundary
      if (termLower.includes(` ${searchQ}`) || termLower.includes(`(${searchQ}`) || termLower.includes(`/${searchQ}`)) {
        bestScore = Math.max(bestScore, 80 * synPenalty);
        continue;
      }
      
      // Term contains query (substring)
      if (termLower.includes(searchQ)) {
        bestScore = Math.max(bestScore, 70 * synPenalty);
        continue;
      }
      
      // Definition contains query
      if (defLower.includes(searchQ)) {
        bestScore = Math.max(bestScore, 50 * synPenalty);
        continue;
      }
      
      // Fuzzy match on term (Levenshtein ≤ 2 for short queries, ≤ 3 for longer)
      if (searchQ.length >= 3) {
        const maxDist = searchQ.length <= 5 ? 1 : 2;
        
        // Check against the term itself
        const termDist = levenshtein(termLower, searchQ);
        if (termDist <= maxDist) {
          bestScore = Math.max(bestScore, (40 - termDist * 5) * synPenalty);
          continue;
        }
        
        // Check each word of the term
        const termWords = termLower.split(/[\s\-\/\(\)]+/);
        for (const word of termWords) {
          if (word.length < 2) continue;
          const dist = levenshtein(word, searchQ);
          if (dist <= maxDist) {
            bestScore = Math.max(bestScore, (35 - dist * 5) * synPenalty);
            break;
          }
        }
        
        // Check definition words for fuzzy (only for longer queries)
        if (bestScore === 0 && searchQ.length >= 4) {
          const defWords = defLower.split(/[\s\-\/\(\),\.]+/);
          for (const word of defWords) {
            if (word.length < 3) continue;
            const dist = levenshtein(word, searchQ);
            if (dist <= maxDist) {
              bestScore = Math.max(bestScore, (25 - dist * 5) * synPenalty);
              break;
            }
          }
        }
      }
    }
    
    if (bestScore > 0) {
      results.push({ term: item, score: bestScore });
    }
  }
  
  // Sort by score descending, then alphabetically
  results.sort((a, b) => b.score - a.score || a.term.term.localeCompare(b.term.term));
  return results;
}

// ── Highlight component ──
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 1) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ── Main component ──
export default function GlossaryPage() {
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Finanzglossar" : "Financial Glossary",
    lang === "de" ? "500+ Finanzbegriffe einfach erklärt" : "500+ financial terms explained simply"
  );

  const [rawSearch, setRawSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(rawSearch), 200);
    return () => clearTimeout(timer);
  }, [rawSearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const glossary = useMemo(() => {
    const data = lang === "de" ? getGlossaryDE() : getGlossaryEN();
    return data;
  }, [lang]);

  const letters = useMemo(
    () => [...new Set(glossary.map(g => g.term[0].toUpperCase()))].sort(),
    [glossary]
  );

  // Mode: either letter filter OR search, never both
  const isSearchMode = debouncedSearch.length > 0;
  const isLetterMode = letter !== null && !isSearchMode;

  // Scored/filtered results
  const filtered = useMemo(() => {
    if (isSearchMode) {
      return scoreTerms(glossary, debouncedSearch, lang);
    }
    if (isLetterMode) {
      return glossary
        .filter(g => g.term[0].toUpperCase() === letter)
        .map(term => ({ term, score: 0 }));
    }
    return glossary.map(term => ({ term, score: 0 }));
  }, [glossary, debouncedSearch, letter, isSearchMode, isLetterMode, lang]);

  // Suggestions (top 6 matching terms)
  const suggestions = useMemo(() => {
    if (rawSearch.length < 1) return [];
    return scoreTerms(glossary, rawSearch, lang)
      .filter(s => s.score >= 30)
      .slice(0, 6)
      .map(s => s.term);
  }, [glossary, rawSearch, lang]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRawSearch(e.target.value);
    setLetter(null); // Always clear letter when typing
    setShowSuggestions(true);
    setSelectedSuggestion(-1);
  }, []);

  const handleLetterClick = useCallback((l: string) => {
    setLetter(prev => prev === l ? null : l);
    setRawSearch(""); // Always clear search when clicking letter
    setDebouncedSearch("");
    setShowSuggestions(false);
  }, []);

  const clearAll = useCallback(() => {
    setRawSearch("");
    setDebouncedSearch("");
    setLetter(null);
    setShowSuggestions(false);
  }, []);

  const scrollToTerm = useCallback((termName: string) => {
    setShowSuggestions(false);
    requestAnimationFrame(() => {
      const el = resultRefs.current.get(termName);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary/50");
        setTimeout(() => el.classList.remove("ring-2", "ring-primary/50"), 2000);
      }
    });
  }, []);

  const handleSuggestionClick = useCallback((term: GlossaryTerm) => {
    setRawSearch(term.term);
    setDebouncedSearch(term.term);
    setLetter(null);
    scrollToTerm(term.term);
  }, [scrollToTerm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestion]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }, [showSuggestions, suggestions, selectedSuggestion, handleSuggestionClick]);

  const hasActiveFilters = rawSearch.length > 0 || letter !== null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Finanz-Glossar" : "Financial Glossary"}</h1>
              <p className="text-sm text-muted-foreground">
                {lang === "de" ? `${glossary.length} Begriffe von A bis Z` : `${glossary.length} terms from A to Z`}
              </p>
            </div>
          </div>
          <Link to="/learn" className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
            <GraduationCap className="h-3.5 w-3.5" />
            {lang === "de" ? "Finanzwissen" : "Learn"}
          </Link>
        </div>

        {/* Search with autocomplete */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <input
            ref={searchRef}
            type="text"
            placeholder={lang === "de" ? "Begriffe, Abkürzungen oder Synonyme suchen..." : "Search terms, abbreviations or synonyms..."}
            value={rawSearch}
            onChange={handleSearchChange}
            onFocus={() => rawSearch.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
          />
          {rawSearch && (
            <button 
              onClick={clearAll} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg z-50 overflow-hidden"
            >
              {suggestions.map((s, i) => (
                <button
                  key={s.term}
                  onClick={() => handleSuggestionClick(s)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                    i === selectedSuggestion 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{s.term}</span>
                    <span className="text-xs text-muted-foreground ml-2 truncate">
                      {s.def.slice(0, 60)}{s.def.length > 60 ? "..." : ""}
                    </span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fuzzy search hint */}
        {isSearchMode && debouncedSearch.length >= 2 && (
          <p className="text-[11px] text-muted-foreground/70 mb-3 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40" />
            {lang === "de" 
              ? "Unscharfe Suche aktiv — findet auch Tippfehler und Synonyme" 
              : "Fuzzy search active — also finds typos and synonyms"}
          </p>
        )}

        {/* Letter filter */}
        <div className="flex flex-wrap gap-1 mb-6">
          <button
            onClick={clearAll}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              !letter && !rawSearch 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {lang === "de" ? "Alle" : "All"}
          </button>
          {letters.map(l => (
            <button
              key={l}
              onClick={() => handleLetterClick(l)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                letter === l 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-3">
          {lang === "de" ? `${filtered.length} Ergebnisse` : `${filtered.length} results`}
          {isSearchMode && filtered.length > 0 && filtered[0].score > 0 && (
            <span className="ml-1 text-muted-foreground/60">
              ({lang === "de" ? "sortiert nach Relevanz" : "sorted by relevance"})
            </span>
          )}
        </p>

        {/* Results */}
        <div className="space-y-2">
          {filtered.map(({ term: g }) => (
            <div
              key={g.term}
              ref={el => { if (el) resultRefs.current.set(g.term, el); }}
              className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 transition-all duration-300"
            >
              <div className="font-display font-semibold text-sm text-foreground">
                <Highlight text={g.term} query={isSearchMode ? rawSearch : ""} />
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                <Highlight text={g.def} query={isSearchMode ? rawSearch : ""} />
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm text-muted-foreground">
                {lang === "de" ? "Keine Begriffe gefunden." : "No terms found."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <FilterX className="h-3.5 w-3.5" />
                  {lang === "de" ? "Filter zurücksetzen" : "Clear filters"}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
