import { describe, it, expect } from "vitest";
import { buildIndex, searchGlossary, normalize, levenshtein, slugify } from "./glossarySearch";
import type { GlossaryTerm } from "@/data/glossaryTypes";

const data: GlossaryTerm[] = [
  { term: "Volatilität", def: "Schwankungsbreite eines Kurses.", category: "trading" },
  { term: "KGV", def: "Kurs-Gewinn-Verhältnis einer Aktie.", category: "analysis" },
  { term: "Dividende", def: "Gewinnausschüttung an Aktionäre.", category: "products" },
  { term: "Anleihe", def: "Verzinsliches Wertpapier.", category: "products" },
];
const index = buildIndex(data);
const top = (q: string) => searchGlossary(index, q, { lang: "de" })[0]?.entry.term.term;

describe("normalize", () => {
  it("folds umlauts and case", () => {
    expect(normalize("Volatilität")).toBe("volatilitaet");
    expect(normalize("Übernahme")).toBe("uebernahme");
  });
});

describe("levenshtein", () => {
  it("computes distance and respects the bound", () => {
    expect(levenshtein("kater", "kader")).toBe(1);
    expect(levenshtein("abc", "abcdefghi", 2)).toBe(3);
  });
});

describe("slugify", () => {
  it("creates url safe anchors", () => {
    expect(slugify("Kurs-Gewinn-Verhältnis (KGV)")).toBe("kurs-gewinn-verhaeltnis-kgv");
  });
});

describe("searchGlossary", () => {
  it("matches exactly", () => expect(top("KGV")).toBe("KGV"));
  it("matches prefixes", () => expect(top("divid")).toBe("Dividende"));
  it("tolerates typos", () => expect(top("dividnde")).toBe("Dividende"));
  it("folds umlauts in the query", () => expect(top("volatilitaet")).toBe("Volatilität"));
  it("resolves synonyms", () => expect(top("p/e")).toBe("KGV"));
  it("searches definitions", () => expect(top("wertpapier")).toBe("Anleihe"));
  it("returns nothing for gibberish", () => {
    expect(searchGlossary(index, "qqqqzzzz", { lang: "de" })).toHaveLength(0);
  });
  it("returns everything when the query is empty", () => {
    expect(searchGlossary(index, "", { lang: "de" })).toHaveLength(4);
  });
  it("filters by letter and category", () => {
    expect(searchGlossary(index, "", { lang: "de", letter: "A" })).toHaveLength(1);
    expect(searchGlossary(index, "", { lang: "de", category: "products" })).toHaveLength(2);
  });
  it("combines search and category filter", () => {
    const r = searchGlossary(index, "anleihe", { lang: "de", category: "analysis" });
    expect(r).toHaveLength(0);
  });

});
