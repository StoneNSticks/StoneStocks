/**
 * GlossaryPage: fuzzy search, category + letter filters, deep links.
 * Search logic lives in src/lib/glossarySearch.ts, UI parts in src/components/glossary/.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getGlossaryDE } from "@/data/glossaryDE";
import { getGlossaryEN } from "@/data/glossaryEN";
import type { GlossaryCategory, GlossaryTerm } from "@/data/glossaryTypes";
import { buildIndex, searchGlossary, slugify, suggestTerms } from "@/lib/glossarySearch";
import { GlossarySearchBar } from "@/components/glossary/GlossarySearchBar";
import { GlossaryFilters } from "@/components/glossary/GlossaryFilters";
import { GlossaryResults } from "@/components/glossary/GlossaryResults";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  const { lang } = useLanguage();
  const isDE = lang === "de";

  const glossary = useMemo(() => (isDE ? getGlossaryDE() : getGlossaryEN()), [isDE]);
  const index = useMemo(() => buildIndex(glossary), [glossary]);

  usePageTitle(
    isDE ? "Finanzglossar" : "Financial Glossary",
    isDE
      ? `${glossary.length} Finanzbegriffe verständlich erklärt - von Aktie bis Zinsstruktur.`
      : `${glossary.length} financial terms explained in plain language, from alpha to yield curve.`,
  );

  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [category, setCategory] = useState<GlossaryCategory | null>(null);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(rawSearch), 180);
    return () => clearTimeout(timer);
  }, [rawSearch]);

  // Deep link support: /glossary#term-slug
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash) setActiveSlug(hash);
  }, []);

  useEffect(() => {
    if (!activeSlug) return;
    const timer = setTimeout(() => {
      document.getElementById(activeSlug)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => clearTimeout(timer);
  }, [activeSlug]);

  const availableLetters = useMemo(
    () => new Set(index.map((e) => e.letter)),
    [index],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of index) {
      const c = e.term.category;
      if (c) counts[c] = (counts[c] || 0) + 1;
    }
    return counts;
  }, [index]);

  const results = useMemo(
    () => searchGlossary(index, search, { lang, letter, category }),
    [index, search, lang, letter, category],
  );

  const suggestions = useMemo(
    () => (rawSearch.length > 0 ? suggestTerms(index, rawSearch, lang) : []),
    [index, rawSearch, lang],
  );

  const jumpTo = useCallback((term: GlossaryTerm) => {
    setOpenSuggestions(false);
    setLetter(null);
    setCategory(null);
    setRawSearch(term.term);
    setSearch(term.term);
    setActiveSlug(slugify(term.term));
  }, []);

  const clearAll = useCallback(() => {
    setRawSearch("");
    setSearch("");
    setLetter(null);
    setCategory(null);
    setActiveSlug(null);
    setOpenSuggestions(false);
  }, []);

  const isSearching = search.trim().length > 0;
  const hasFilters = isSearching || letter !== null || category !== null;

  const jsonLd = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: isDE ? "StoneStocks Finanzglossar" : "StoneStocks Financial Glossary",
        inLanguage: isDE ? "de" : "en",
        hasDefinedTerm: results.slice(0, 30).map((r) => ({
          "@type": "DefinedTerm",
          name: r.entry.term.term,
          description: r.entry.term.def,
        })),
      }),
    [results, isDE],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <main className="container max-w-5xl px-3 py-6 sm:px-4 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-accent p-2.5 shadow-lg shadow-primary/5">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">
                {isDE ? "Finanz-Glossar" : "Financial Glossary"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isDE
                  ? `${glossary.length} Begriffe von A bis Z`
                  : `${glossary.length} terms from A to Z`}
              </p>
            </div>
          </div>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            {isDE ? "Finanzwissen" : "Learn"}
          </Link>
        </div>

        <div className="sticky top-0 z-20 -mx-3 space-y-3 bg-background/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4">
          <GlossarySearchBar
            value={rawSearch}
            onChange={setRawSearch}
            onClear={clearAll}
            suggestions={suggestions}
            open={openSuggestions}
            setOpen={setOpenSuggestions}
            activeIndex={activeSuggestion}
            setActiveIndex={setActiveSuggestion}
            onSelect={jumpTo}
            label={isDE ? "Glossar durchsuchen" : "Search the glossary"}
            placeholder={
              isDE
                ? "Begriffe, Abkürzungen oder Synonyme suchen..."
                : "Search terms, abbreviations or synonyms..."
            }
          />

          <GlossaryFilters
            lang={lang}
            letters={ALPHABET}
            availableLetters={availableLetters}
            letter={letter}
            onLetter={setLetter}
            categoryCounts={categoryCounts}
            category={category}
            onCategory={setCategory}
          />

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {isDE ? `${results.length} Ergebnisse` : `${results.length} results`}
            {isSearching && results.length > 0 && (
              <span className="ml-1 text-muted-foreground/60">
                ({isDE ? "sortiert nach Relevanz, tippfehlertolerant" : "sorted by relevance, typo tolerant"})
              </span>
            )}
          </p>
        </div>

        <div className="mt-4">
          <GlossaryResults
            results={results}
            query={isSearching ? search : ""}
            lang={lang}
            grouped={!isSearching}
            activeSlug={activeSlug}
            suggestions={suggestions}
            onSuggestion={jumpTo}
            onClear={clearAll}
            hasFilters={hasFilters}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
