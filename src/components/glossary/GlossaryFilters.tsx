/** Letter and category filter chips for the glossary. */
import { CATEGORY_LABELS, GLOSSARY_CATEGORIES } from "@/data/glossaryTypes";
import type { GlossaryCategory } from "@/data/glossaryTypes";

interface Props {
  lang: string;
  letters: string[];
  availableLetters: Set<string>;
  letter: string | null;
  onLetter: (letter: string | null) => void;
  categoryCounts: Record<string, number>;
  category: GlossaryCategory | null;
  onCategory: (category: GlossaryCategory | null) => void;
}

const chip =
  "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function GlossaryFilters({
  lang,
  letters,
  availableLetters,
  letter,
  onLetter,
  categoryCounts,
  category,
  onCategory,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={lang === "de" ? "Kategorien" : "Categories"}>
        <button
          type="button"
          onClick={() => onCategory(null)}
          className={`${chip} ${!category ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
        >
          {lang === "de" ? "Alle Kategorien" : "All categories"}
        </button>
        {GLOSSARY_CATEGORIES.filter((c) => categoryCounts[c] > 0).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategory(category === c ? null : c)}
            className={`${chip} ${category === c ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}
          >
            {CATEGORY_LABELS[c][lang === "de" ? "de" : "en"]}
            <span className="ml-1.5 opacity-60">{categoryCounts[c]}</span>
          </button>
        ))}
      </div>

      <div
        className="scrollbar-hide flex gap-1 overflow-x-auto pb-1 md:flex-wrap md:overflow-x-visible md:pb-0"
        role="group"
        aria-label={lang === "de" ? "Buchstaben" : "Letters"}
      >
        <button
          type="button"
          onClick={() => onLetter(null)}
          className={`${chip} shrink-0 ${!letter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
        >
          {lang === "de" ? "A-Z" : "A-Z"}
        </button>
        {letters.map((l) => {
          const enabled = availableLetters.has(l);
          return (
            <button
              key={l}
              type="button"
              disabled={!enabled}
              onClick={() => onLetter(letter === l ? null : l)}
              className={`${chip} w-8 shrink-0 ${
                letter === l
                  ? "bg-primary text-primary-foreground"
                  : enabled
                    ? "text-muted-foreground hover:bg-muted"
                    : "cursor-default text-muted-foreground/25"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}
