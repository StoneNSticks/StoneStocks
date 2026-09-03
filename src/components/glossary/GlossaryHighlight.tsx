/** Highlights the matched query (umlaut-tolerant) inside a text. */
import { useMemo } from "react";
import { normalize } from "@/lib/glossarySearch";

export function GlossaryHighlight({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => {
    const q = normalize(query);
    if (!q || q.length < 2) return null;
    const nText = normalize(text);
    // Normalization can change length (ä -> ae), so only highlight when lengths align.
    if (nText.length !== text.length) return null;
    const ranges: [number, number][] = [];
    let from = 0;
    while (ranges.length < 50) {
      const i = nText.indexOf(q, from);
      if (i === -1) break;
      ranges.push([i, i + q.length]);
      from = i + q.length;
    }
    if (!ranges.length) return null;
    const out: { value: string; hit: boolean }[] = [];
    let cursor = 0;
    for (const [start, end] of ranges) {
      if (start > cursor) out.push({ value: text.slice(cursor, start), hit: false });
      out.push({ value: text.slice(start, end), hit: true });
      cursor = end;
    }
    if (cursor < text.length) out.push({ value: text.slice(cursor), hit: false });
    return out;
  }, [text, query]);

  if (!parts) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="rounded-sm bg-primary/20 px-0.5 text-foreground">
            {p.value}
          </mark>
        ) : (
          <span key={i}>{p.value}</span>
        ),
      )}
    </>
  );
}
