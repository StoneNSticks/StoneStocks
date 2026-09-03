/** Shared glossary types. */
export type GlossaryCategory =
  | "basics"
  | "analysis"
  | "trading"
  | "products"
  | "derivatives"
  | "macro"
  | "taxes"
  | "crypto";

export interface GlossaryTerm {
  term: string;
  def: string;
  category?: GlossaryCategory;
  /** Alternative names (e.g. English name for a German term). */
  aliases?: string[];
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  "basics",
  "analysis",
  "trading",
  "products",
  "derivatives",
  "macro",
  "taxes",
  "crypto",
];

export const CATEGORY_LABELS: Record<GlossaryCategory, { de: string; en: string }> = {
  basics: { de: "Grundlagen", en: "Basics" },
  analysis: { de: "Analyse", en: "Analysis" },
  trading: { de: "Trading", en: "Trading" },
  products: { de: "Produkte", en: "Products" },
  derivatives: { de: "Derivate", en: "Derivatives" },
  macro: { de: "Makro", en: "Macro" },
  taxes: { de: "Steuern & Regulierung", en: "Taxes & Regulation" },
  crypto: { de: "Krypto", en: "Crypto" },
};
