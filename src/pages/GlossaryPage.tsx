/**
 * GlossaryPage: A-Z filterable financial terms dictionary.
 * 1000+ terms with definitions, search, letter filter, and highlighting.
 */
import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { BookOpen, Search, GraduationCap, X, FilterX } from "lucide-react";
import { Link } from "react-router-dom";
import { getGlossaryDE } from "@/data/glossaryDE";
import { getGlossaryEN } from "@/data/glossaryEN";
import type { GlossaryTerm } from "@/data/glossaryDE";

function getGlossary(lang: string): GlossaryTerm[] {
  return lang === "de" ? getGlossaryDE() : getGlossaryEN();
}

/** Highlight matching text portions */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
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

export default function GlossaryPage() {
  const t = useT();
  const { lang } = useLanguage();
  usePageTitle(
    lang === "de" ? "Finanzglossar" : "Financial Glossary",
    lang === "de" ? "500+ Finanzbegriffe einfach erklärt" : "500+ financial terms explained simply"
  );
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const glossary = useMemo(() => getGlossary(lang), [lang]);
  const letters = useMemo(() => [...new Set(glossary.map(g => g.term[0].toUpperCase()))].sort(), [glossary]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // Auto-clear letter filter when user types
    if (e.target.value) setLetter(null);
  }, []);

  const handleLetterClick = useCallback((l: string) => {
    setLetter(prev => prev === l ? null : l);
    // Clear search when clicking a letter
    setSearch("");
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setLetter(null);
  }, []);

  const filtered = useMemo(() => {
    let items = glossary;
    if (letter) items = items.filter(g => g.term[0].toUpperCase() === letter);
    if (search && search.length >= 1) {
      const q = search.toLowerCase();
      items = items.filter(g =>
        g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q)
      );
      // Sort: term matches first, then definition-only matches
      items.sort((a, b) => {
        const aTermMatch = a.term.toLowerCase().includes(q) ? 0 : 1;
        const bTermMatch = b.term.toLowerCase().includes(q) ? 0 : 1;
        return aTermMatch - bTermMatch;
      });
    }
    return items;
  }, [glossary, letter, search]);

  const hasActiveFilters = !!search || !!letter;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent shadow-lg shadow-primary/5">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{lang === "de" ? "Finanz-Glossar" : "Financial Glossary"}</h1>
              <p className="text-sm text-muted-foreground">{lang === "de" ? `${glossary.length} Begriffe von A bis Z` : `${glossary.length} terms from A to Z`}</p>
            </div>
          </div>
          <Link to="/learn" className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
            <GraduationCap className="h-3.5 w-3.5" />
            {lang === "de" ? "Finanzwissen" : "Learn"}
          </Link>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={lang === "de" ? "Begriffe oder Abkürzungen suchen..." : "Search terms or abbreviations..."}
            value={search}
            onChange={handleSearchChange}
            className="pl-9 pr-9"
          />
          {search && (
            <button onClick={() => { setSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          <button onClick={() => { setLetter(null); setSearch(""); }} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${!letter && !search ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            {lang === "de" ? "Alle" : "All"}
          </button>
          {letters.map(l => (
            <button key={l} onClick={() => handleLetterClick(l)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${letter === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              {l}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          {lang === "de" ? `${filtered.length} Ergebnisse` : `${filtered.length} results`}
        </p>

        <div className="space-y-2">
          {filtered.map(g => (
            <div key={g.term} className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 transition-colors">
              <div className="font-display font-semibold text-sm text-foreground">
                <Highlight text={g.term} query={search} />
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                <Highlight text={g.def} query={search} />
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
