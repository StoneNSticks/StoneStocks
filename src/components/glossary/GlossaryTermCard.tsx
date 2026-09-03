/** Single glossary entry card with category badge and copy-link action. */
import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { CATEGORY_LABELS } from "@/data/glossaryTypes";
import type { GlossaryTerm } from "@/data/glossaryTypes";
import { GlossaryHighlight } from "./GlossaryHighlight";

interface Props {
  term: GlossaryTerm;
  slug: string;
  query: string;
  lang: string;
  highlighted: boolean;
}

export function GlossaryTermCard({ term, slug, query, lang, highlighted }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = `${window.location.origin}/glossary#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable, fall back to updating the hash only
    }
    window.history.replaceState(null, "", `#${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      id={slug}
      className={`group scroll-mt-28 rounded-xl border bg-card p-4 transition-colors ${
        highlighted ? "border-primary ring-2 ring-primary/40" : "border-border/60 hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-sm font-semibold text-foreground">
          <GlossaryHighlight text={term.term} query={query} />
        </h3>
        <button
          type="button"
          onClick={copyLink}
          aria-label={lang === "de" ? "Link kopieren" : "Copy link"}
          className="shrink-0 rounded-md p-1 text-muted-foreground/50 opacity-0 transition-opacity hover:text-primary focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Link2 className="h-3.5 w-3.5" />}
        </button>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        <GlossaryHighlight text={term.def} query={query} />
      </p>
      {term.category && (
        <span className="mt-2 inline-block rounded-full bg-muted/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {CATEGORY_LABELS[term.category][lang === "de" ? "de" : "en"]}
        </span>
      )}
    </div>
  );
}
