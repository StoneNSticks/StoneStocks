/** Result list with letter groups and incremental rendering. */
import { useEffect, useMemo, useRef, useState } from "react";
import { FilterX } from "lucide-react";
import type { ScoredTerm } from "@/lib/glossarySearch";
import type { GlossaryTerm } from "@/data/glossaryTypes";
import { GlossaryTermCard } from "./GlossaryTermCard";

const PAGE_SIZE = 60;

interface Props {
  results: ScoredTerm[];
  query: string;
  lang: string;
  grouped: boolean;
  activeSlug: string | null;
  suggestions: GlossaryTerm[];
  onSuggestion: (term: GlossaryTerm) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export function GlossaryResults({
  results,
  query,
  lang,
  grouped,
  activeSlug,
  suggestions,
  onSuggestion,
  onClear,
  hasFilters,
}: Props) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setVisible(PAGE_SIZE), [results]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + PAGE_SIZE, results.length));
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [results.length]);

  // Make sure a deep-linked term is rendered even if it sits far down the list.
  useEffect(() => {
    if (!activeSlug) return;
    const idx = results.findIndex((r) => r.entry.slug === activeSlug);
    if (idx >= 0) setVisible((v) => Math.max(v, idx + 1));
  }, [activeSlug, results]);

  const shown = useMemo(() => results.slice(0, visible), [results, visible]);

  const groups = useMemo(() => {
    if (!grouped) return null;
    const map = new Map<string, ScoredTerm[]>();
    for (const r of shown) {
      const l = r.entry.letter;
      const list = map.get(l);
      if (list) list.push(r);
      else map.set(l, [r]);
    }
    return [...map.entries()];
  }, [shown, grouped]);

  if (results.length === 0) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          {lang === "de" ? "Keine Begriffe gefunden." : "No terms found."}
        </p>
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground/70">
              {lang === "de" ? "Meintest du:" : "Did you mean:"}
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.term}
                  type="button"
                  onClick={() => onSuggestion(s)}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  {s.term}
                </button>
              ))}
            </div>
          </div>
        )}
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            <FilterX className="h-3.5 w-3.5" />
            {lang === "de" ? "Filter zurücksetzen" : "Clear filters"}
          </button>
        )}
      </div>
    );
  }

  const card = (r: ScoredTerm) => (
    <GlossaryTermCard
      key={r.entry.slug}
      term={r.entry.term}
      slug={r.entry.slug}
      query={query}
      lang={lang}
      highlighted={activeSlug === r.entry.slug}
    />
  );

  return (
    <div>
      {groups ? (
        <div className="space-y-6">
          {groups.map(([letter, items]) => (
            <section key={letter}>
              <h2 className="sticky top-14 z-10 mb-2 -mx-1 bg-background/90 px-1 py-1 font-display text-sm font-bold text-primary backdrop-blur">
                {letter}
              </h2>
              <div className="grid gap-3 md:grid-cols-2">{items.map(card)}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">{shown.map(card)}</div>
      )}
      <div ref={sentinelRef} aria-hidden className="h-8" />
    </div>
  );
}
