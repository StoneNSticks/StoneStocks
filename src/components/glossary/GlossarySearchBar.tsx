/** Search input with fuzzy autocomplete for the glossary. */
import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import type { GlossaryTerm } from "@/data/glossaryTypes";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  suggestions: GlossaryTerm[];
  open: boolean;
  setOpen: (open: boolean) => void;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onSelect: (term: GlossaryTerm) => void;
  placeholder: string;
  label: string;
}

export function GlossarySearchBar({
  value,
  onChange,
  onClear,
  suggestions,
  open,
  setOpen,
  activeIndex,
  setActiveIndex,
  onSelect,
  placeholder,
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !listRef.current?.contains(target) &&
        !inputRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [setOpen]);

  const showList = open && suggestions.length > 0;

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls="glossary-suggestions"
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `glossary-suggestion-${activeIndex}` : undefined
        }
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => value.length > 0 && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") return setOpen(false);
          if (!showList) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(Math.min(activeIndex + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(Math.max(activeIndex - 1, -1));
          } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            onSelect(suggestions[activeIndex]);
          }
        }}
        className="h-11 w-full rounded-xl border border-input bg-card pl-9 pr-10 text-base shadow-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-12 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showList && (
        <div
          ref={listRef}
          id="glossary-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.term}
              id={`glossary-suggestion-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              type="button"
              onClick={() => onSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                i === activeIndex ? "bg-accent text-accent-foreground" : "text-foreground"
              }`}
            >
              <Search className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">{s.term}</span>
                <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
                  {s.def.slice(0, 90)}
                  {s.def.length > 90 ? "..." : ""}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
